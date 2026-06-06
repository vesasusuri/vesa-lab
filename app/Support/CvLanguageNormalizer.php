<?php

namespace App\Support;

final class CvLanguageNormalizer
{
    private const MAX_LEVEL_LENGTH = 32;

    private const MAX_LANGUAGE_LENGTH = 64;

    private const PROFICIENCY_WORDS = [
        'native', 'fluent', 'professional', 'advanced', 'intermediate', 'basic', 'beginner',
        'conversational', 'working', 'limited', 'proficient', 'mother tongue', 'bilingual',
    ];

public static function sanitizeRow(array $row): ?array
    {
        $language = trim((string) ($row['language'] ?? $row['name'] ?? ''));

        if ($language === '' || self::looksLikeMisplacedContent($language)) {
            return null;
        }

        if (mb_strlen($language) > self::MAX_LANGUAGE_LENGTH) {
            $language = mb_substr($language, 0, self::MAX_LANGUAGE_LENGTH);
        }

        return [
            'language' => $language,
            'level' => self::normalizeLevel((string) ($row['level'] ?? '')),
        ];
    }

    public static function normalizeLevel(string $level): string
    {
        $level = trim($level);

        if ($level === '' || self::looksLikeMisplacedContent($level)) {
            return 'Fluent';
        }

        $lower = mb_strtolower($level);

        foreach (self::PROFICIENCY_WORDS as $word) {
            if (str_contains($lower, $word)) {
                return self::formatProficiency($word);
            }
        }

        if (preg_match('/\b([ABC][12])\b/i', $level, $match)) {
            return strtoupper($match[1]);
        }

        if (mb_strlen($level) <= self::MAX_LEVEL_LENGTH && substr_count($level, ' ') <= 3) {
            return $level;
        }

        return 'Fluent';
    }

    private static function formatProficiency(string $word): string
    {
        return match ($word) {
            'mother tongue' => 'Native',
            'bilingual' => 'Fluent',
            default => ucfirst($word),
        };
    }

    private static function looksLikeMisplacedContent(string $value): bool
    {
        if (mb_strlen($value) > 80) {
            return true;
        }

        if (substr_count($value, ' ') > 6) {
            return true;
        }

        return (bool) preg_match(
            '/\b(implemented|developed|including|features|chatbot|anomaly|detection|forecast|reminder|responsible|managed|built|designed)\b/i',
            $value
        );
    }
}
