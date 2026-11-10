<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Get products with NoSQL filtering & search (FR-003).
     */
    public function index(Request $request)
    {
        $query = Product::query();

        // Search by name
        if ($request->filled('q')) {
            $keyword = preg_quote($request->q, '/');
            $query->where('name', 'regex', "/{$keyword}/i");
        }

        // Filter by category
        if ($request->filled('category') && $request->category !== 'Semua') {
            $query->where('category', $request->category);
        }

        // Filter by type (prebuilt_pc or sparepart)
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Filter by brand
        if ($request->filled('brand')) {
            $query->where('brand', $request->brand);
        }

        // Filter by price range
        if ($request->filled('min_price')) {
            $query->where('price', '>=', (int) $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', (int) $request->max_price);
        }

        // Status filter (only Active by default for public catalog)
        if (!$request->boolean('include_drafts')) {
            $query->where('status', '!=', 'Draft');
        }

        // Sorting
        $sortBy = $request->get('sort', 'created_at');
        $order = $request->get('order', 'desc');

        if ($sortBy === 'price_asc') {
            $query->orderBy('price', 'asc');
        } elseif ($sortBy === 'price_desc') {
            $query->orderBy('price', 'desc');
        } else {
            $query->orderBy('created_at', $order === 'asc' ? 'asc' : 'desc');
        }

        $limit = (int) $request->get('limit', 50);
        $products = $query->limit($limit)->get();

        return response()->json([
            'success' => true,
            'count' => $products->count(),
            'data' => $products,
        ]);
    }

    /**
     * Get single product detail with embedded benchmarks & specs (FR-005).
     */
    public function show($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $product,
        ]);
    }
}

