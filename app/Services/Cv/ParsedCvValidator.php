<?php

namespace App\Services\Cv;

use App\Support\CvCertificationNormalizer;
use App\Support\CvLanguageNormalizer;
use App\Support\Utf8;
use Illuminate\Validation\ValidationException;

class ParsedCvValidator
{
    private const LIMITS = [
        'skills' => 80,
        'experience' => 30,
        'education' => 20,
        'projects' => 30,
        'languages' => 20,
        'certifications' => 30,
    ];

    private const GARBAGE_PATTERNS = [
        '/lorem ipsum/i',
        '/\[insert\b/i',
        '/your (name|email|phone) here/i',
        '/test@test/i',
    ];

public function validateAndSanitize(array $parsed, string $extractedText = ''): array
    {
        $parsed = Utf8::sanitizeArray($parsed);
        $parsed = $this->coerceScalarFields($parsed);

        $parsed['skills'] = $this->limitList(
            $this->filterGarbageStrings($parsed['skills'] ?? []),
            'skills'
        );
        $parsed['experience'] = $this->limitList(
            $this->filterExperienceRows($parsed['experience'] ?? []),
            'experience'
        );
        $parsed['education'] = $this->limitList(
            $this->filterEducationRows($parsed['education'] ?? []),
            'education'
        );
        $parsed['projects'] = $this->limitList($parsed['projects'] ?? [], 'projects');
        $parsed['languages'] = $this->limitList(
            $this->filterLanguageRows($parsed['languages'] ?? []),
            'languages'
        );
        $parsed['certifications'] = $this->limitList(
            $this->filterCertificationRows($parsed['certifications'] ?? []),
            'certifications'
        );

        if ($this->isEmptyProfile($parsed)) {
            if (mb_strlen(trim($extractedText)) >= (int) config('resume.ocr.min_text_length', 200)) {
                $parsed = $this->fillMinimalFromText($parsed, $extractedText);
            } else {
                throw ValidationException::withMessages([
                    'parsed' => ['Could not extract enough readable text from this CV. Try a clearer PDF or DOCX.'],
                ]);
            }
        }

        return $parsed;
    }

private function coerceScalarFields(array $parsed): array
    {
        $parsed['name'] = mb_substr(trim((string) ($parsed['name'] ?? '')), 0, 255);
        $parsed['email'] = $this->coerceEmail((string) ($parsed['email'] ?? ''));
        $parsed['phone'] = $this->coercePhone((string) ($parsed['phone'] ?? ''));
        $parsed['github'] = mb_substr(trim((string) ($parsed['github'] ?? '')), 0, 500);

        return $parsed;
    }

    private function coerceEmail(string $email): string
    {
        $email = trim(mb_strtolower($email));

        if ($email === '') {
            return '';
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return '';
        }

        if (preg_match('/@(example|test|localhost)\./i', $email)) {
            return '';
        }

        return mb_substr($email, 0, 255);
    }

    private function coercePhone(string $phone): string
    {
        $phone = trim($phone);

        if ($phone === '') {
            return '';
        }

        $digits = preg_replace('/\D+/', '', $phone) ?? '';

        if (strlen($digits) < 8) {
            return '';
        }

        return mb_substr($phone, 0, 64);
    }

private function fillMinimalFromText(array $parsed, string $text): array
    {
        if (trim((string) ($parsed['name'] ?? '')) === '') {
            $lines = array_values(array_filter(array_map('trim', explode("\n", $text))));
            $parsed['name'] = mb_substr($lines[0] ?? '', 0, 255);
        }

        if (trim((string) ($parsed['email'] ?? '')) === '') {
            if (preg_match('/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i', $text, $match)) {
                $parsed['email'] = $this->coerceEmail($match[0]);
            }
        }

        if (trim((string) ($parsed['phone'] ?? '')) === '') {
            if (preg_match('/(\+?\d[\d\s().-]{7,}\d)/', $text, $match)) {
                $parsed['phone'] = $this->coercePhone($match[1]);
            }
        }

        return $parsed;
    }

private function filterGarbageStrings(array $skills): array
    {
        $filtered = [];

        foreach ($skills as $skill) {
            if (!is_string($skill)) {
                continue;
            }

            $skill = trim($skill);

            if (mb_strlen($skill) < 2 || $this->looksLikeGarbage($skill)) {
                continue;
            }

            $filtered[] = $skill;
        }

        return array_values(array_unique($filtered));
    }

private function filterExperienceRows(array $rows): array
    {
        $filtered = [];

        foreach ($rows as $row) {
            if (!is_array($row)) {
                continue;
            }

            $company = trim((string) ($row['company'] ?? ''));
            $role = trim((string) ($row['role'] ?? ''));
            $description = trim((string) ($row['description'] ?? ''));

            if ($company === '' && $role === '' && $description === '') {
                continue;
            }

            $row = $this->enrichExperienceRow([
                'company' => $company,
                'role' => $role,
                'description' => $description,
                'start_date' => (string) ($row['start_date'] ?? ''),
                'end_date' => (string) ($row['end_date'] ?? ''),
            ]);

            $company = $row['company'];
            $role = $row['role'];
            $description = $row['description'];

            if (mb_strlen($company) < 2 && mb_strlen($role) < 2) {
                continue;
            }

            if ($this->looksLikeGarbage($company.$role.$description)) {
                continue;
            }

            if (!$this->datesLookReasonable($row['start_date'], $row['end_date'])) {
                $row['start_date'] = '';
                $row['end_date'] = '';
            }

            $filtered[] = $row;
        }

        return $this->dedupeExperienceRows($filtered);
    }

private function dedupeExperienceRows(array $rows): array
    {
        $seen = [];
        $unique = [];

        foreach ($rows as $row) {
            $key = mb_strtolower(trim((string) ($row['company'] ?? '')))
                .'|'
                .mb_strtolower(trim((string) ($row['role'] ?? '')))
                .'|'
                .mb_strtolower(trim((string) ($row['start_date'] ?? '')));

            if (isset($seen[$key])) {
                continue;
            }

            $seen[$key] = true;
            $unique[] = $row;
        }

        return $unique;
    }

private function filterCertificationRows(array $rows): array
    {
        $filtered = [];

        foreach ($rows as $row) {
            if (!is_array($row)) {
                continue;
            }

            $sanitized = CvCertificationNormalizer::sanitizeRow($row);

            if ($sanitized !== null) {
                $filtered[] = $sanitized;
            }
        }

        return $filtered;
    }

private function filterLanguageRows(array $rows): array
    {
        $filtered = [];

        foreach ($rows as $row) {
            if (!is_array($row)) {
                continue;
            }

            $sanitized = CvLanguageNormalizer::sanitizeRow($row);

            if ($sanitized !== null) {
                $filtered[] = $sanitized;
            }
        }

        return $filtered;
    }

private function limitList(array $items, string $field): array
    {
        $max = self::LIMITS[$field] ?? 50;

        return array_slice(array_values($items), 0, $max);
    }

private function filterEducationRows(array $rows): array
    {
        $filtered = [];

        foreach ($rows as $row) {
            if (!is_array($row)) {
                continue;
            }

            $institution = trim((string) ($row['institution'] ?? ''));

            if ($institution === '' || $this->looksLikeGarbage($institution)) {
                continue;
            }

            $filtered[] = $row;
        }

        return $filtered;
    }

private function enrichExperienceRow(array $row): array
    {
        $company = trim($row['company']);
        $role = trim($row['role']);
        $description = trim($row['description']);

        if ($company !== '' || $role !== '') {
            return $row;
        }

        if ($description === '') {
            return $row;
        }

        $lines = preg_split('/\r\n|\r|\n/', $description) ?: [];
        $headline = trim($lines[0] ?? '');

        if ($headline === '') {
            return $row;
        }

        if (preg_match('/^(.+?)\s+(?:at|@)\s+(.+)$/iu', $headline, $match)) {
            $row['role'] = trim($match[1]);
            $row['company'] = trim($match[2]);
        } elseif (preg_match('/^(.+?)\s*\|\s*(.+)$/', $headline, $match)) {
            $row['role'] = trim($match[1]);
            $row['company'] = trim($match[2]);
        } else {
            $row['role'] = $headline;
        }

        $row['description'] = trim(implode("\n", array_slice($lines, 1)));

        return $row;
    }

    private function looksLikeGarbage(string $value): bool
    {
        foreach (self::GARBAGE_PATTERNS as $pattern) {
            if (preg_match($pattern, $value)) {
                return true;
            }
        }

        return false;
    }

    private function datesLookReasonable(string $start, string $end): bool
    {
        $pattern = '/^(present|current|\d{4}([.\/-]\d{1,2})?|[a-z]{3,9}\s+\d{4})$/i';

        if ($start !== '' && !preg_match($pattern, trim($start))) {
            return false;
        }

        if ($end !== '' && !preg_match($pattern, trim($end))) {
            return false;
        }

        return true;
    }

private function isEmptyProfile(array $parsed): bool
    {
        $hasContact = trim((string) ($parsed['email'] ?? '')) !== ''
            || trim((string) ($parsed['phone'] ?? '')) !== ''
            || trim((string) ($parsed['name'] ?? '')) !== '';

        $hasContent = !empty($parsed['skills'])
            || !empty($parsed['experience'])
            || !empty($parsed['education']);

        return !$hasContact && !$hasContent;
    }
}
