<?php

namespace App\Http\Controllers;

use App\Models\HomePageSection;
use App\Models\HomePageSectionItem;
use App\Support\HomePageMediaUrl;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HomePageSectionItemController extends Controller
{
    public function store(Request $request, string $sectionKey): JsonResponse
    {
        $section = HomePageSection::query()->where('key', $sectionKey)->firstOrFail();

        $validated = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'ctaText' => ['nullable', 'string', 'max:255'],
            'imageUrl' => ['nullable', 'string'],
            'imageAlt' => ['nullable', 'string', 'max:255'],
            'metadata' => ['nullable', 'array'],
            'sortOrder' => ['nullable', 'integer', 'min:0'],
            'isActive' => ['nullable', 'boolean'],
        ]);

        $item = $section->items()->create([
            'title' => $validated['title'] ?? null,
            'subtitle' => $validated['subtitle'] ?? null,
            'description' => $validated['description'] ?? null,
            'cta_text' => $validated['ctaText'] ?? null,
            'image_url' => $validated['imageUrl'] ?? null,
            'image_alt' => $validated['imageAlt'] ?? null,
            'metadata' => $validated['metadata'] ?? null,
            'sort_order' => $validated['sortOrder'] ?? (((int) ($section->items()->max('sort_order') ?? 0)) + 1),
            'is_active' => $validated['isActive'] ?? true,
        ]);

        return response()->json([
            'message' => 'Section item created.',
            'item' => $this->itemToFrontendShape($item->fresh()),
        ], 201);
    }

    public function update(Request $request, HomePageSectionItem $item): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'ctaText' => ['nullable', 'string', 'max:255'],
            'imageUrl' => ['nullable', 'string'],
            'imageAlt' => ['nullable', 'string', 'max:255'],
            'metadata' => ['nullable', 'array'],
            'sortOrder' => ['nullable', 'integer', 'min:0'],
            'isActive' => ['nullable', 'boolean'],
        ]);

        $item->fill([
            'title' => $validated['title'] ?? $item->title,
            'subtitle' => $validated['subtitle'] ?? $item->subtitle,
            'description' => $validated['description'] ?? $item->description,
            'cta_text' => $validated['ctaText'] ?? $item->cta_text,
            'image_url' => $validated['imageUrl'] ?? $item->image_url,
            'image_alt' => $validated['imageAlt'] ?? $item->image_alt,
            'metadata' => array_key_exists('metadata', $validated) ? $validated['metadata'] : $item->metadata,
            'sort_order' => $validated['sortOrder'] ?? $item->sort_order,
            'is_active' => $validated['isActive'] ?? $item->is_active,
        ]);
        $item->save();

        return response()->json([
            'message' => 'Section item updated.',
            'item' => $this->itemToFrontendShape($item->fresh()),
        ]);
    }

    public function destroy(HomePageSectionItem $item): JsonResponse
    {
        $item->delete();

        return response()->json([
            'message' => 'Section item deleted.',
        ]);
    }

    private function itemToFrontendShape(HomePageSectionItem $item): array
    {
        return [
            'id' => $item->id,
            'title' => $item->title,
            'subtitle' => $item->subtitle,
            'description' => $item->description,
            'ctaText' => $item->cta_text,
            'imageUrl' => HomePageMediaUrl::toPublic($item->image_url),
            'imageAlt' => $item->image_alt,
            'metadata' => $item->metadata,
            'sortOrder' => $item->sort_order,
            'isActive' => (bool) $item->is_active,
        ];
    }
}
