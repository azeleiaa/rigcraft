<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use App\Models\Product;
use App\Models\Voucher;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Validate a promo voucher code.
     */
    public function validateVoucher(Request $request)
    {
        $code = strtoupper(trim($request->input('code', '')));
        $subtotal = (int) $request->input('subtotal', 0);

        $voucher = Voucher::where('code', $code)->where('isActive', true)->first();

        if (!$voucher) {
            return response()->json([
                'success' => false,
                'message' => 'Kode voucher tidak valid atau sudah kadaluarsa.',
            ], 404);
        }

        if ($subtotal < (int) $voucher->minPurchase) {
            $formattedMin = number_format($voucher->minPurchase, 0, ',', '.');
            return response()->json([
                'success' => false,
                'message' => "Minimal belanja untuk voucher ini adalah Rp {$formattedMin}.",
            ], 422);
        }

        $discount = 0;
        if ($voucher->discountPercentage > 0) {
            $discount = (int) round(($subtotal * $voucher->discountPercentage) / 100);
        } elseif ($voucher->discountAmount > 0) {
            $discount = (int) $voucher->discountAmount;
        }

        return response()->json([
            'success' => true,
            'message' => 'Voucher berhasil diterapkan!',
            'data' => [
                'code' => $voucher->code,
                'discountPercentage' => $voucher->discountPercentage,
                'discountAmount' => $discount,
            ],
        ]);
    }

    /**
     * Create checkout order (FR-006).
     */
    public function checkout(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'shippingDetails' => 'required|array',
            'shippingDetails.courier' => 'required|string',
            'shippingDetails.address' => 'required|string',
            'paymentMethod' => 'nullable|string',
            'voucherCode' => 'nullable|string',
        ]);

        $user = auth('api')->user();
        $userId = $user ? (string) $user->_id : null;

        // Calculate subtotal from products
        $itemProductIds = array_column($request->items, 'productId');
        $products = Product::whereIn('_id', $itemProductIds)->get()->keyBy(function ($p) {
            return (string) $p->_id;
        });

        $orderItems = [];
        $subtotal = 0;

        foreach ($request->items as $item) {
            $product = $products->get($item['productId']);
            $price = $product ? (int) $product->price : (int) ($item['price'] ?? 0);
            $qty = (int) ($item['quantity'] ?? 1);
            $name = $product ? $product->name : ($item['name'] ?? 'Item');

            $subtotal += ($price * $qty);
            $orderItems[] = [
                'productId' => $item['productId'],
                'name' => $name,
                'priceAtPurchase' => $price,
                'quantity' => $qty,
                'selectedSpecs' => $item['selectedSpecs'] ?? [],
            ];
        }

        // Apply voucher if present
        $discount = 0;
        $voucherId = null;
        if ($request->filled('voucherCode')) {
            $voucher = Voucher::where('code', strtoupper(trim($request->voucherCode)))
                ->where('isActive', true)
                ->first();

            if ($voucher && $subtotal >= (int) $voucher->minPurchase) {
                $voucherId = (string) $voucher->_id;
                if ($voucher->discountPercentage > 0) {
                    $discount = (int) round(($subtotal * $voucher->discountPercentage) / 100);
                } else {
                    $discount = (int) $voucher->discountAmount;
                }
            }
        }

        $totalAmount = max(0, $subtotal - $discount);
        $orderNumber = '#RG-' . date('Ymd') . rand(1000, 9999);

        $order = Order::create([
            'orderNumber' => $orderNumber,
            'userId' => $userId,
            'customerName' => $user ? $user->name : ($request->input('customerName', 'Tamu')),
            'customerEmail' => $user ? $user->email : ($request->input('customerEmail', '')),
            'totalAmount' => $totalAmount,
            'status' => 'Diproses',
            'shippingDetails' => $request->shippingDetails,
            'items' => $orderItems,
            'voucherId' => $voucherId,
            'voucherDiscount' => $discount,
            'paymentMethod' => $request->paymentMethod ?? 'Transfer Bank',
        ]);

        // Clear user's cart after successful checkout
        if ($userId) {
            Cart::where('userId', $userId)->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Pesanan berhasil dibuat!',
            'data' => [
                'id' => (string) $order->_id,
                'orderNumber' => $order->orderNumber,
                'totalAmount' => $order->totalAmount,
                'status' => $order->status,
            ],
        ], 201);
    }

    /**
     * Get order history for current user.
     */
    public function userOrders()
    {
        $userId = (string) auth('api')->id();
        $orders = Order::where('userId', $userId)->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $orders,
        ]);
    }
}

