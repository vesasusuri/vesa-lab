<?php

namespace App\Services\Cv;

use App\Support\Utf8;

class CvTextCleaningService
{
    public function clean(string $text): string
    {
        $text = Utf8::sanitizeString($text);

        $text = str_replace(["\r\n", "\r"], "\n", $text);

$text = preg_replace('/([A-Za-z])-\n([A-Za-z])/', '$1$2', $text) ?? $text;

$text = preg_replace('/([a-z0-9,;])\n([a-z])/', '$1 $2', $text) ?? $text;

        $text = preg_replace('/[ \t]+/', ' ', $text) ?? $text;
        $text = preg_replace('/[ \t]*\n[ \t]*/', "\n", $text) ?? $text;
        $text = preg_replace('/\n{3,}/', "\n\n", $text) ?? $text;
        $text = preg_replace('/  {3,}/', "\n", $text) ?? $text;
        $text = str_replace("\f", "\n\n", $text);

        $text = $this->normalizeContactLines($text);

        return trim(Utf8::sanitizeString($text));
    }

private function normalizeContactLines(string $text): string
    {
        $text = preg_replace_callback(
            '/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i',
            fn (array $m) => mb_strtolower($m[0]),
            $text
        ) ?? $text;

        $text = preg_replace_callback(
            '/(\+?\d[\d\s().-]{7,}\d)/',
            function (array $m) {
                $digits = preg_replace('/\D+/', '', $m[1]) ?? '';

                if (strlen($digits) < 8) {
                    return $m[1];
                }

                return $m[1];
            },
            $text
        ) ?? $text;

        return $text;
    }
}
