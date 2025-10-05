<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Support\JsonFile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class MockApiController extends Controller
{
    private const DROPDOWNS   = 'mock/api/dropdowns.json';
    private const TEMPLATES   = 'mock/api/inspection_templates.json';
    private const ITEMS       = 'mock/api/items.json';
    private const INSPECTIONS = 'mock/api/inspections.json';

    public function dropdowns(): JsonResponse
    {
        return response()->json(JsonFile::read(self::DROPDOWNS));
    }

    public function templates(): JsonResponse
    {
        return response()->json(JsonFile::read(self::TEMPLATES));
    }

    public function items(): JsonResponse
    {
        return response()->json(JsonFile::read(self::ITEMS));
    }

    public function inspections(): JsonResponse
    {
        return response()->json(JsonFile::read(self::INSPECTIONS));
    }

    public function inspectionById(string $id): JsonResponse
    {
        $all = JsonFile::read(self::INSPECTIONS);
        $hit = collect($all['inspections'] ?? [])->firstWhere('id', $id);

        if (! $hit) {
            abort(404, 'Inspection not found');
        }

        return response()->json($hit);
    }

    private function buildWorksFromSelection(string $scopeId, array $selected): array
    {
        $tplAll = JsonFile::read(self::TEMPLATES);
        $tpl    = collect($tplAll['templates'] ?? [])->firstWhere('id', $scopeId);

        if (! $tpl) {
            return ['template_name' => null, 'subscopes' => []];
        }

        $subscopes = [];

        foreach ($tpl['works'] as $w) {
            $fields = [];

            foreach ($w['fields'] as $f) {
                $key      = $f['key'];
                $fields[] = [
                    'key'      => $key,
                    'selected' => array_key_exists($key, $selected)
                        ? (bool) $selected[$key]
                        : (bool) ($f['selected'] ?? false),
                ];
            }

            $subscopes[] = [
                'subscope_id' => $w['subscope_id'],
                'fields'      => $fields,
            ];
        }

        return [
            'template_name' => $tpl['template_name'] ?? null,
            'subscopes'     => $subscopes,
        ];
    }

    private function buildChargesFromOrder(string $scopeId, array $orderInformation): array
    {
        $totalQty = array_reduce(
            $orderInformation,
            static fn (int $carry, array $row): int => $carry + (int) ($row['qtyRequired'] ?? 0),
            0
        );

        $rateMap = [
            'inspection-basic'   => ['code' => 'SVC-INSP', 'desc' => 'Inspection Service',   'price' => 15.0, 'uom' => 'lot'],
            'testing'            => ['code' => 'SVC-TST',  'desc' => 'Testing Service',      'price' => 20.0, 'uom' => 'lot'],
            'stenciling-marking' => ['code' => 'SVC-MRK',  'desc' => 'Stenciling & Marking', 'price' => 8.0,  'uom' => 'lot'],
            'refurbish'          => ['code' => 'SVC-REF',  'desc' => 'Refurbish - Cleaning', 'price' => 10.0, 'uom' => 'lot'],
        ];

        $rate = $rateMap[$scopeId] ?? ['code' => 'SVC-GEN', 'desc' => 'General Service', 'price' => 10.0, 'uom' => 'lot'];

        if ($totalQty <= 0) {
            $totalQty = 1;
        }

        return [[
            'code'  => $rate['code'],
            'desc'  => $rate['desc'],
            'qty'   => $totalQty,
            'uom'   => $rate['uom'],
            'price' => $rate['price'],
        ]];
    }

    public function createInspection(Request $req): JsonResponse
    {
        $data = $req->validate([
            'serviceType'      => 'required|string',
            'scopeId'          => 'required|string',
            'orderInformation' => 'nullable|array',
            'works'            => 'nullable|array',
            'customer'         => 'nullable|array',
            'header'           => 'nullable|array',
            'charges'          => 'nullable|array',
        ]);

        $now   = now();
        $newId = 'INSP-' . $now->format('Ymd-His');

        $selectedMap      = Arr::get($data, 'works.selected', []);
        $worksNormalized  = $this->buildWorksFromSelection($data['scopeId'], is_array($selectedMap) ? $selectedMap : []);
        $orderInfo        = $data['orderInformation'] ?? [];
        $charges          = $data['charges'] ?? $this->buildChargesFromOrder($data['scopeId'], $orderInfo);

        $new = array_merge([
            'id'        => $newId,
            'no'        => $newId,
            'status'    => 'New',
            'createdAt' => $now->toISOString(),
            'progress'  => 0,
            'header'    => (object) [],
        ], $data);

        $new['works']   = $worksNormalized;
        $new['charges'] = $charges;

        $all                 = JsonFile::read(self::INSPECTIONS);
        $list                = Arr::get($all, 'inspections', []);
        array_unshift($list, $new);
        $all['inspections']  = $list;

        JsonFile::writeAtomic(self::INSPECTIONS, $all);

        return response()->json($new, 201);
    }
}