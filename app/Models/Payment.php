<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'order_id',
        'user_id',
        'payment_url',
        'status'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}