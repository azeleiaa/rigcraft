<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use App\Models\Voucher;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // -------------------------------------------------------------
        // 1. Users
        // -------------------------------------------------------------
        User::truncate();

        $admin = User::create([
            'name' => 'Admin RigCraft',
            'email' => 'admin@rigcraft.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ]);

        $customer = User::create([
            'name' => 'Adelia Devananda',
            'email' => 'adel@example.com',
            'password' => Hash::make('password123'),
            'role' => 'customer',
        ]);

        // -------------------------------------------------------------
        // 2. Vouchers (SRS §3.2)
        // -------------------------------------------------------------
        Voucher::truncate();

        Voucher::create([
            'code' => 'RIGCRAFT2026',
            'discountAmount' => 0,
            'discountPercentage' => 10,
            'minPurchase' => 5000000,
            'isActive' => true,
            'expiredAt' => now()->addYear(),
        ]);

        Voucher::create([
            'code' => 'HEMAT10',
            'discountAmount' => 0,
            'discountPercentage' => 10,
            'minPurchase' => 2000000,
            'isActive' => true,
            'expiredAt' => now()->addYear(),
        ]);

        Voucher::create([
            'code' => 'PCBARU',
            'discountAmount' => 500000,
            'discountPercentage' => 0,
            'minPurchase' => 10000000,
            'isActive' => true,
            'expiredAt' => now()->addYear(),
        ]);

        // -------------------------------------------------------------
        // 3. Products (Prebuilt PCs & Spareparts)
        // -------------------------------------------------------------
        Product::truncate();

        // Prebuilt PC 1: RigCraft Titan X Gaming (SRS §3.2 exemplar)
        $titan = Product::create([
            'name' => 'RigCraft Titan X Gaming',
            'type' => 'prebuilt_pc',
            'category' => 'Gaming PC',
            'brand' => 'RigCraft',
            'price' => 35000000,
            'stock' => 12,
            'status' => 'Aktif',
            'image_url' => 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1400&q=90',
            'gallery_images' => [
                'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1400&q=90',
                'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1400&q=90',
            ],
            'specs' => [
                'processor' => 'AMD Ryzen 9 7950X3D',
                'motherboard' => 'ASUS ROG STRIX X670E',
                'powerWattage' => 850,
                'socket' => 'AM5',
                'ram' => '32GB DDR5 6000MHz',
                'storage' => '2TB NVMe Gen4 SSD',
                'gpu' => 'NVIDIA RTX 4070 Ti Super 16GB',
            ],
            'gameBenchmarks' => [
                ['gameName' => 'Cyberpunk 2077', 'setting' => '4K Ultra', 'avgFps' => 85],
                ['gameName' => 'Fortnite', 'setting' => '1080p Epic', 'avgFps' => 240],
                ['gameName' => 'Valorant', 'setting' => '1080p High', 'avgFps' => 400],
            ],
            'upgradeOptions' => [
                ['title' => 'Upgrade RAM', 'description' => 'To 64GB DDR5 Corsair Vengeance', 'additionalPrice' => 1800000],
                ['title' => 'Upgrade Storage', 'description' => 'Tambah Samsung 990 Pro 2TB NVMe SSD', 'additionalPrice' => 2949000],
                ['title' => 'Upgrade GPU', 'description' => 'Ke RTX 4080 Super 16GB', 'additionalPrice' => 5500000],
            ],
        ]);

        Product::create([
            'name' => 'RigCraft Storm Pro',
            'type' => 'prebuilt_pc',
            'category' => 'Gaming PC',
            'brand' => 'RigCraft',
            'price' => 24999000,
            'stock' => 8,
            'status' => 'Aktif',
            'image_url' => 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1400&q=90',
            'specs' => [
                'processor' => 'AMD Ryzen 7 7800X3D',
                'motherboard' => 'MSI MAG B650 Tomahawk',
                'powerWattage' => 750,
                'socket' => 'AM5',
                'ram' => '32GB DDR5',
                'gpu' => 'RTX 4070',
            ],
            'gameBenchmarks' => [
                ['gameName' => 'Cyberpunk 2077', 'setting' => '1440p Ultra', 'avgFps' => 95],
                ['gameName' => 'Valorant', 'setting' => '1080p High', 'avgFps' => 380],
            ],
        ]);

        Product::create([
            'name' => 'RigCraft Nova Office',
            'type' => 'prebuilt_pc',
            'category' => 'Office PC',
            'brand' => 'RigCraft',
            'price' => 8999000,
            'stock' => 15,
            'status' => 'Aktif',
            'image_url' => 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1400&q=90',
            'specs' => [
                'processor' => 'Intel Core i5-13400',
                'motherboard' => 'ASUS Prime B760M',
                'powerWattage' => 500,
                'socket' => 'LGA1700',
                'ram' => '16GB DDR4',
                'gpu' => 'Intel UHD 730',
            ],
        ]);

        // Spareparts
        Product::create([
            'name' => 'AMD Ryzen 9 7950X3D',
            'type' => 'sparepart',
            'category' => 'CPU',
            'brand' => 'AMD',
            'price' => 8499000,
            'stock' => 45,
            'status' => 'Aktif',
            'image_url' => 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=900&q=85',
            'specs' => [
                'socket' => 'AM5',
                'cores' => 16,
                'threads' => 32,
                'powerWattage' => 120,
            ],
        ]);

        Product::create([
            'name' => 'Intel Core i7-14700K',
            'type' => 'sparepart',
            'category' => 'CPU',
            'brand' => 'Intel',
            'price' => 6899000,
            'stock' => 30,
            'status' => 'Aktif',
            'image_url' => 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=900&q=85',
            'specs' => [
                'socket' => 'LGA1700',
                'cores' => 20,
                'threads' => 28,
                'powerWattage' => 125,
            ],
        ]);

        Product::create([
            'name' => 'ASUS ROG STRIX X670E-E Gaming WiFi',
            'type' => 'sparepart',
            'category' => 'Motherboard',
            'brand' => 'ASUS',
            'price' => 7890000,
            'stock' => 18,
            'status' => 'Aktif',
            'image_url' => 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=85',
            'specs' => [
                'socket' => 'AM5',
                'ramType' => 'DDR5',
                'formFactor' => 'ATX',
                'powerWattage' => 50,
            ],
        ]);

        Product::create([
            'name' => 'MSI MAG B760 Tomahawk WiFi',
            'type' => 'sparepart',
            'category' => 'Motherboard',
            'brand' => 'MSI',
            'price' => 3349000,
            'stock' => 22,
            'status' => 'Aktif',
            'image_url' => 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=85',
            'specs' => [
                'socket' => 'LGA1700',
                'ramType' => 'DDR5',
                'formFactor' => 'ATX',
                'powerWattage' => 45,
            ],
        ]);

        Product::create([
            'name' => 'RTX 4070 Ti Super',
            'type' => 'sparepart',
            'category' => 'GPU',
            'brand' => 'NVIDIA',
            'price' => 15499000,
            'stock' => 32,
            'status' => 'Aktif',
            'image_url' => 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=900&q=85',
            'specs' => [
                'vram' => '16GB GDDR6X',
                'powerWattage' => 285,
            ],
        ]);

        Product::create([
            'name' => 'Corsair Vengeance DDR5 32GB',
            'type' => 'sparepart',
            'category' => 'RAM',
            'brand' => 'Corsair',
            'price' => 1825000,
            'stock' => 78,
            'status' => 'Aktif',
            'image_url' => 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=900&q=85',
            'specs' => [
                'ramType' => 'DDR5',
                'capacity' => '32GB (2x16GB)',
                'speed' => '6000MHz',
                'powerWattage' => 15,
            ],
        ]);

        Product::create([
            'name' => 'Samsung 990 Pro 2TB',
            'type' => 'sparepart',
            'category' => 'SSD',
            'brand' => 'Samsung',
            'price' => 2949000,
            'stock' => 56,
            'status' => 'Aktif',
            'image_url' => 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=900&q=85',
            'specs' => [
                'capacity' => '2TB',
                'interface' => 'PCIe Gen4 NVMe',
                'readSpeed' => '7450 MB/s',
                'powerWattage' => 10,
            ],
        ]);

        Product::create([
            'name' => 'Corsair RM850x 850W',
            'type' => 'sparepart',
            'category' => 'PSU',
            'brand' => 'Corsair',
            'price' => 1899000,
            'stock' => 20,
            'status' => 'Aktif',
            'image_url' => 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=900&q=85',
            'specs' => [
                'powerWattage' => 850,
                'certification' => '80 Plus Gold',
                'modular' => 'Fully Modular',
            ],
        ]);

        // -------------------------------------------------------------
        // 4. Reviews (SRS §3.2)
        // -------------------------------------------------------------
        Review::truncate();

        Review::create([
            'userId' => (string) $customer->_id,
            'userName' => 'Adelia Devananda',
            'productId' => (string) $titan->_id,
            'rating' => 5,
            'comment' => 'Rakit PC di RigCraft rapi banget, cable management super bersih!',
        ]);

        // -------------------------------------------------------------
        // 5. Initial Orders
        // -------------------------------------------------------------
        Order::truncate();

        Order::create([
            'orderNumber' => '#RG-20261001',
            'userId' => (string) $customer->_id,
            'customerName' => 'Adelia Devananda',
            'customerEmail' => 'adel@example.com',
            'totalAmount' => 35000000,
            'status' => 'Diproses',
            'shippingDetails' => [
                'courier' => 'JNE Regular',
                'address' => 'Jl. Mawar No 12, Jakarta',
            ],
            'items' => [
                [
                    'productId' => (string) $titan->_id,
                    'name' => 'RigCraft Titan X Gaming',
                    'quantity' => 1,
                    'priceAtPurchase' => 35000000,
                ],
            ],
        ]);

        // -------------------------------------------------------------
        // 6. MongoDB Indexes (SRS NFR: Performance)
        // -------------------------------------------------------------
        Artisan::call('mongo:indexes');
        $this->command?->line(Artisan::output());
    }
}
