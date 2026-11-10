<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Review extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'reviews';

    protected $fillable = [
        'userId',
        'userName',
        'productId',
        'rating',
        'comment',
    ];

    protected $casts = [
        'rating' => 'integer',
    ];
}

