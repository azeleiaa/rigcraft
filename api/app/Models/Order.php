<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Order extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'orders';

    protected $fillable = [
        'orderNumber',
        'userId',
        'customerName',
        'customerEmail',
        'totalAmount',
        'status', // 'Menunggu Pembayaran', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan'
        'shippingDetails', // { courier, address }
        'items', // [ { productId, name, priceAtPurchase, quantity, selectedSpecs } ]
        'voucherId',
        'voucherDiscount',
        'paymentMethod',
    ];

    protected $casts = [
        'totalAmount' => 'integer',
        'shippingDetails' => 'array',
        'items' => 'array',
        'voucherDiscount' => 'integer',
    ];
}

