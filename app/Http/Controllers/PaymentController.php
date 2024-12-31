<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class PaymentController extends Controller
{
    private $duitkuMerchantCode = 'DS21316'; // Ganti dengan Merchant Code Duitku Anda
    private $duitkuApiKey = '5084bab78b9f96a4f4eda53e951c022b';
    private $duitkuEndpoint = 'https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry'; // Endpoint Duitku (sandbox/production)

    public function createPayment(Request $request, $orderId)
    {
        try {
            $order = Order::where('user_id', Auth::id())
                ->findOrFail($orderId);

            if ($order->status !== 'pending') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Pesanan tidak valid untuk pembayaran'
                ], 400);
            }

            $paymentData = [
                'merchantCode' => $this->duitkuMerchantCode,
                'paymentAmount' => $order->total_amount,
                'merchantOrderId' => 'ORDER-' . $order->id,
                'productDetails' => 'Pembayaran Pesanan #' . $order->id,
                'email' => Auth::user()->email,
                'callbackUrl' => route('payments.callback'),
                'returnUrl' => route('payments.return', ['orderId' => $order->id]),
            ];

            $signature = hash('sha256', $this->duitkuMerchantCode . $order->total_amount . $this->duitkuApiKey);
            $paymentData['signature'] = $signature;

            $response = Http::post($this->duitkuEndpoint, $paymentData);

            if ($response->successful()) {
                $payment = Payment::create([
                    'order_id' => $order->id,
                    'user_id' => Auth::id(),
                    'payment_url' => $response['paymentUrl'],
                    'status' => 'pending'
                ]);

                return response()->json([
                    'status' => 'success',
                    'message' => 'Link pembayaran berhasil dibuat',
                    'data' => [
                        'payment_url' => $response['paymentUrl']
                    ]
                ], 201);
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Gagal membuat pembayaran: ' . $response['message']
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    public function callback(Request $request)
    {
        try {
            $data = $request->all();

            $signature = hash('sha256', $this->duitkuMerchantCode . $data['amount'] . $this->duitkuApiKey);
            if ($signature !== $data['signature']) {
                return response()->json(['status' => 'error', 'message' => 'Invalid signature'], 400);
            }

            $payment = Payment::where('order_id', $data['merchantOrderId'])
                ->firstOrFail();

            DB::transaction(function () use ($payment, $data) {
                $payment->status = $data['resultCode'] === '00' ? 'completed' : 'failed';
                $payment->save();

                $order = $payment->order;
                if ($data['resultCode'] === '00') {
                    $order->status = 'completed';
                } else {
                    $order->status = 'cancelled';
                }
                $order->save();
            });

            return response()->json(['status' => 'success', 'message' => 'Pembayaran diproses']);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}