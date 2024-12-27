<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShoppingCart extends Model
{
    use HasFactory;

    /**
     * Specify the table associated with the model.
     *
     * @var string
     */
    protected $table = 'shopping_carts';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'nama_menu',
        'jumlah',
        'harga_total',
        'harga_satuan',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}