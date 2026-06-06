<?php

namespace App\Support;

final class Utf8
{

public static function sanitizeString(string $text): string
    {
        if ($text === '') {
            return '';
        }

        $text = str_replace("\u{FFFD}", '', mb_scrub($text, 'UTF-8'));
        $text = preg_replace('/[\x{0080}-\x{009F}]/u', '', $text) ?? $text;
        $text = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $text) ?? $text;

        return $text;
    }

public static function sanitizeArray(array $data): array
    {
        $sanitized = [];

        foreach ($data as $key => $value) {
            $sanitizedKey = is_int($key) ? $key : self::sanitizeString((string) $key);

            if (is_string($value)) {
                $sanitized[$sanitizedKey] = self::sanitizeString($value);
            } elseif (is_array($value)) {
                $sanitized[$sanitizedKey] = self::sanitizeArray($value);
            } else {
                $sanitized[$sanitizedKey] = $value;
            }
        }

        return $sanitized;
    }

public static function jsonEncode(mixed $data, int $flags = 0): string
    {
        $payload = is_array($data) ? self::sanitizeArray($data) : $data;

        $encoded = json_encode(
            $payload,
            $flags | JSON_INVALID_UTF8_SUBSTITUTE | JSON_UNESCAPED_UNICODE
        );

        if ($encoded === false) {
            throw new \RuntimeException('Failed to encode data as JSON: '.json_last_error_msg());
        }

        return $encoded;
    }
}
