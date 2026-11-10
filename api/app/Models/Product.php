<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Product extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'products';

    protected $fillable = [
        'name',
        'type', // 'prebuilt_pc' or 'sparepart'
        'category', // 'CPU', 'GPU', 'RAM', 'Motherboard', 'Storage', 'PSU', 'Case', 'Cooler', 'Gaming PC', etc.
        'brand',
        'price',
        'stock',
        'status', // 'Aktif', 'Draft'
        'image_url',
        'gallery_images',
        'specs', // Embedded Document: processor, motherboard, socket, powerWattage, ramType, etc.
        'gameBenchmarks', // Embedded array: [ { gameName, setting, avgFps } ]
        'upgradeOptions', // Embedded array: [ { title, description, additionalPrice } ]
    ];

    protected $casts = [
        'price' => 'integer',
        'stock' => 'integer',
        'gallery_images' => 'array',
        'specs' => 'array',
        'gameBenchmarks' => 'array',
        'upgradeOptions' => 'array',
    ];
}

