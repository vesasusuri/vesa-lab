<?php

namespace App\Support;

final class CvCertificationNormalizer
{
    private const MAX_YEAR_LENGTH = 8;

    private const MAX_NAME_LENGTH = 255;

    private const MAX_ISSUER_LENGTH = 255;

    private const CERT_KEYWORDS = '/\b(certified|certification|certificate|license|licence|aws|azure|gcp|google cloud|comptia|pmp|scrum|cpa|cissp|ceh|istqb|diploma)\b/i';

    private const JOB_TITLE_PATTERN = '/\b(developer|engineer|manager|analyst|intern|consultant|designer|architect|lead|director)\b/i';

public static function sanitizeRow(array $row): ?array
    {
        $name = trim((string) ($row['name'] ?? ''));

        if ($name === '' || self::looksLikeJobEntry($name, $row)) {
            return null;
        }

        $issuer = trim((string) ($row['issuer'] ?? ''));
        $issuer = $issuer !== '' ? mb_substr($issuer, 0, self::MAX_ISSUER_LENGTH) : null;

        return [
            'name' => mb_substr($name, 0, self::MAX_NAME_LENGTH),
            'issuer' => $issuer,
            'year' => self::normalizeYear((string) ($row['year'] ?? '')),
        ];
    }

    public static function normalizeYear(string $year): ?string
    {
        $year = trim($year, " \t\n\r\0\x0B-–—");

        if ($year === '') {
            return null;
        }

        if (preg_match('/present|current|ongoing/i', $year)) {
            return null;
        }

        if (preg_match('/\b((?:19|20)\d{2})\b/', $year, $match)) {
            return $match[1];
        }

        if (preg_match('/^(\d{4})$/', $year)) {
            return $year;
        }

        if (mb_strlen($year) <= self::MAX_YEAR_LENGTH && preg_match('/^[\d.\/\-–—]+$/u', $year)) {
            return mb_substr($year, 0, self::MAX_YEAR_LENGTH);
        }

        return null;
    }

private static function looksLikeJobEntry(string $name, array $row): bool
    {
        if (preg_match(self::CERT_KEYWORDS, $name)) {
            return false;
        }

        if (!preg_match(self::JOB_TITLE_PATTERN, $name)) {
            return false;
        }

        $year = (string) ($row['year'] ?? '');

        return preg_match('/present|current|ongoing|\d{4}\s*[-–—]/i', $year) === 1;
    }
}
