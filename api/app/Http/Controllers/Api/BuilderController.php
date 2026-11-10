<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class BuilderController extends Controller
{
    /**
     * Cross-reference component JSON specs for compatibility (FR-004).
     */
    public function validateBuild(Request $request)
    {
        $componentIds = $request->input('components', []);

        // Load all selected products by their IDs
        $products = Product::whereIn('_id', array_values($componentIds))->get()->keyBy(function ($item) {
            return (string) $item->_id;
        });

        // Group by category
        $cpu = null;
        $motherboard = null;
        $ram = null;
        $gpu = null;
        $psu = null;

        foreach ($componentIds as $categoryKey => $id) {
            $prod = $products->get($id);
            if (!$prod) continue;

            $cat = strtoupper($prod->category);
            if (str_contains($cat, 'CPU') || str_contains($cat, 'PROCESSOR')) $cpu = $prod;
            elseif (str_contains($cat, 'MOTHERBOARD') || str_contains($cat, 'MAINBOARD')) $motherboard = $prod;
            elseif (str_contains($cat, 'RAM') || str_contains($cat, 'MEMORY')) $ram = $prod;
            elseif (str_contains($cat, 'GPU') || str_contains($cat, 'VGA') || str_contains($cat, 'GRAPHIC')) $gpu = $prod;
            elseif (str_contains($cat, 'PSU') || str_contains($cat, 'POWER')) $psu = $prod;
        }

        $warnings = [];
        $checks = [];

        // 1. CPU & Motherboard Socket Compatibility
        if ($cpu && $motherboard) {
            $cpuSocket = strtolower($cpu->specs['socket'] ?? '');
            $moboSocket = strtolower($motherboard->specs['socket'] ?? '');

            if ($cpuSocket && $moboSocket && $cpuSocket !== $moboSocket) {
                $warnings[] = "Incompatible Socket: CPU menggunakan socket '{$cpu->specs['socket']}', sedangkan motherboard menggunakan socket '{$motherboard->specs['socket']}'.";
                $checks['socket'] = false;
            } else {
                $checks['socket'] = true;
            }
        }

        // 2. RAM & Motherboard RAM Type Compatibility
        if ($ram && $motherboard) {
            $ramType = strtoupper($ram->specs['ramType'] ?? ($ram->specs['memoryType'] ?? ''));
            $moboRamType = strtoupper($motherboard->specs['ramType'] ?? ($motherboard->specs['memorySupport'] ?? ''));

            if ($ramType && $moboRamType && !str_contains($moboRamType, $ramType)) {
                $warnings[] = "Incompatible RAM: RAM bertipe '{$ramType}' tidak kompatibel dengan slot motherboard '{$moboRamType}'.";
                $checks['ram'] = false;
            } else {
                $checks['ram'] = true;
            }
        }

        // 3. Power Wattage vs PSU Capacity
        $estimatedWattage = 75; // Base system wattage (fans, chipset, storage)
        if ($cpu) {
            $estimatedWattage += (int) ($cpu->specs['powerWattage'] ?? ($cpu->specs['tdp'] ?? 105));
        }
        if ($gpu) {
            $estimatedWattage += (int) ($gpu->specs['powerWattage'] ?? ($gpu->specs['tdp'] ?? 220));
        }
        if ($ram) {
            $estimatedWattage += 15;
        }

        $checks['wattage'] = true;
        if ($psu) {
            $psuWattage = (int) ($psu->specs['powerWattage'] ?? ($psu->specs['wattage'] ?? 650));
            $safeLimit = $psuWattage * 0.85;

            if ($estimatedWattage > $safeLimit) {
                $warnings[] = "Daya PSU Kurang: Estimasi konsumsi sistem ({$estimatedWattage}W) mendekati atau melebihi kapasitas rekomendasi PSU ({$psuWattage}W). Disarankan minimal " . ceil($estimatedWattage / 0.8) . "W.";
                $checks['wattage'] = false;
            }
        }

        return response()->json([
            'success' => true,
            'is_compatible' => count($warnings) === 0,
            'estimated_wattage' => $estimatedWattage,
            'recommended_psu_wattage' => ceil(($estimatedWattage / 0.7) / 50) * 50,
            'checks' => $checks,
            'warnings' => $warnings,
        ]);
    }
}

