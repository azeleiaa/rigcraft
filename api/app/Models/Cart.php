<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Cart extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'carts';

    protected $fillable = [
        'userId',
        'items', // [ { productId, quantity, selectedSpecs } ]
    ];

    protected $casts = [
        'items' => 'array',
    ];
}

