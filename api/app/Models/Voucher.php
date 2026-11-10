<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Voucher extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'vouchers';

    protected $fillable = [
        'code',
        'discountAmount',
        'discountPercentage',
        'minPurchase',
        'isActive',
        'expiredAt',
    ];

    protected $casts = [
        'discountAmount' => 'integer',
        'discountPercentage' => 'integer',
        'minPurchase' => 'integer',
        'isActive' => 'boolean',
    ];
}

