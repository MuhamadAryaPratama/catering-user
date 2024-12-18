<?php

namespace App\Http\Controllers;

use App\Models\ShoppingCart;
use Illuminate\Http\Request;

class ShoppingCartController extends Controller
{
    /**
     * Display a listing of the shopping cart items.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $cartItems = ShoppingCart::all();
        return response()->json(['status' => 'success', 'data' => $cartItems], 200);
    }

    /**
     * Store a newly created shopping cart item.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_menu' => 'required|string|max:255',
            'jumlah' => 'required|integer|min:1',
            'harga_satuan' => 'required|numeric|min:0', // Tambahkan harga_satuan
        ]);
        
        $validated['harga_total'] = $validated['jumlah'] * $validated['harga_satuan'];
        
        $cartItem = ShoppingCart::create($validated);        

        return response()->json(['status' => 'success', 'data' => $cartItem], 201);
    }

    /**
     * Update the specified shopping cart item.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $cartItem = ShoppingCart::find($id);

        if (!$cartItem) {
            return response()->json(['status' => 'error', 'message' => 'Cart item not found'], 404);
        }

        $validated = $request->validate([
            'jumlah' => 'sometimes|integer|min:1',
        ]);
        
        if (isset($validated['jumlah'])) {
            $validated['harga_total'] = $cartItem->harga_satuan * $validated['jumlah'];
        }
        
        $cartItem->update($validated);        

        return response()->json(['status' => 'success', 'data' => $cartItem], 200);
    }

    /**
     * Remove the specified shopping cart item.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $cartItem = ShoppingCart::find($id);

        if (!$cartItem) {
            return response()->json(['status' => 'error', 'message' => 'Cart item not found'], 404);
        }

        $cartItem->delete();

        return response()->json(['status' => 'success', 'message' => 'Cart item deleted'], 200);
    }
}