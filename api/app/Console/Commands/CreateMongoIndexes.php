<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Throwable;

class CreateMongoIndexes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mongo:indexes';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create MongoDB indexes for catalog filters and lookups (SRS NFR: Performance)';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $indexes = [
            'users' => [
                ['key' => ['email' => 1], 'options' => ['name' => 'users_email_unique', 'unique' => true]],
            ],
            'products' => [
                ['key' => ['category' => 1], 'options' => ['name' => 'products_category_idx']],
                ['key' => ['brand' => 1], 'options' => ['name' => 'products_brand_idx']],
                ['key' => ['price' => 1], 'options' => ['name' => 'products_price_idx']],
                ['key' => ['type' => 1], 'options' => ['name' => 'products_type_idx']],
                ['key' => ['name' => 'text'], 'options' => ['name' => 'products_name_text']],
            ],
            'vouchers' => [
                ['key' => ['code' => 1], 'options' => ['name' => 'vouchers_code_unique', 'unique' => true]],
                ['key' => ['isActive' => 1], 'options' => ['name' => 'vouchers_active_idx']],
            ],
            'reviews' => [
                ['key' => ['productId' => 1], 'options' => ['name' => 'reviews_product_idx']],
                ['key' => ['userId' => 1], 'options' => ['name' => 'reviews_user_idx']],
            ],
            'carts' => [
                ['key' => ['userId' => 1], 'options' => ['name' => 'carts_user_unique', 'unique' => true]],
            ],
            'orders' => [
                ['key' => ['orderNumber' => 1], 'options' => ['name' => 'orders_number_unique', 'unique' => true]],
                ['key' => ['userId' => 1], 'options' => ['name' => 'orders_user_idx']],
                ['key' => ['status' => 1], 'options' => ['name' => 'orders_status_idx']],
                ['key' => ['created_at' => -1], 'options' => ['name' => 'orders_created_at_idx']],
            ],
        ];

        $connection = DB::connection('mongodb');
        $created = 0;
        $failed = 0;

        foreach ($indexes as $collectionName => $collectionIndexes) {
            try {
                $collection = $connection->getCollection($collectionName);
            } catch (Throwable $e) {
                $this->error("Collection '{$collectionName}': {$e->getMessage()}");
                $failed++;

                continue;
            }

            foreach ($collectionIndexes as $index) {
                try {
                    $collection->createIndex($index['key'], $index['options']);
                    $this->line("  ✔ {$collectionName}.{$index['options']['name']}");
                    $created++;
                } catch (Throwable $e) {
                    $this->warn("  ✘ {$collectionName}.{$index['options']['name']}: {$e->getMessage()}");
                    $failed++;
                }
            }
        }

        $this->newLine();
        $this->info("MongoDB indexes: {$created} created/verified, {$failed} failed.");

        return $failed === 0 ? self::SUCCESS : self::FAILURE;
    }
}
