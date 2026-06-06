<?php

namespace App\Support;

class HomePageMediaUrl
{
    public static function toPublic(?string $path): ?string
    {
        if (empty($path)) {
            return null;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        if (str_starts_with($path, '/api/home-page-sections/media/')) {
            return url($path);
        }

        if (str_starts_with($path, '/storage/')) {
            return url('/api/home-page-sections/media/' . ltrim(str_replace('/storage/', '', $path), '/'));
        }

        if (str_starts_with($path, 'home-sections/')) {
            return url('/api/home-page-sections/media/' . ltrim($path, '/'));
        }

        if (str_starts_with($path, '/')) {
            return url($path);
        }

        return url('/api/home-page-sections/media/' . ltrim($path, '/'));
    }
}
