<?php

namespace App\Services;

use App\Support\Utf8;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIService
{
    private const PARSED_SCHEMA = [
        'name'                => '',
        'email'               => '',
        'phone'               => '',
        'skills'              => [],
        'education'           => [],
        'experience'          => [],
        'projects'            => [],
        'languages'           => [],
        'certifications'      => [],
        'github'              => '',
        'github_repositories' => [],
        'portfolio_links'     => [],
    ];

public function parseCvText(string $cvText, bool $forUpload = false): array
    {
        if (!config('resume.ollama.enabled')) {
            return Utf8::sanitizeArray($this->fallbackParse($cvText));
        }

        $fastUpload = $forUpload && config('resume.upload.fast_mode', true);
        $maxAttempts = $fastUpload
            ? (int) config('resume.upload.ollama_max_attempts', 1)
            : 3;
        $timeout = $fastUpload
            ? (int) config('resume.upload.ollama_timeout', 90)
            : (int) config('resume.ollama.timeout', 120);

        try {
            $response = $this->chatWithRetry(
                $this->buildParsePrompt($cvText),
                json: true,
                maxAttempts: $maxAttempts,
                timeout: $timeout,
            );

            return Utf8::sanitizeArray(
                $this->normalizeParsedData($this->decodeJson($response))
            );
        } catch (\Throwable $e) {
            Log::warning('Ollama CV parse failed — using fallback parser', [
                'message' => $e->getMessage(),
                'for_upload' => $forUpload,
            ]);

            return Utf8::sanitizeArray($this->fallbackParse($cvText));
        }
    }

    public function requestJson(string $prompt): array
    {
        return $this->decodeJson($this->chatWithRetry($prompt, json: true));
    }

    public function chat(string $prompt, bool $json = false): string
    {
        return $this->callOllama($prompt, $json);
    }

    public function embed(string $text): ?array
    {
        if (!config('resume.ollama.enabled')) {
            return null;
        }

        try {
            $baseUrl = rtrim((string) config('resume.ollama.base_url'), '/');
            $model   = (string) config('resume.ollama.embedding_model', 'nomic-embed-text');

            $response = Http::timeout((int) config('resume.ollama.timeout', 120))
                ->post("{$baseUrl}/api/embeddings", [
                    'model'  => $model,
                    'prompt' => $text,
                ])
                ->throw()
                ->json();

            $embedding = $response['embedding'] ?? null;

            return is_array($embedding) ? $embedding : null;
        } catch (\Throwable $e) {
            Log::debug('Ollama embedding failed', ['message' => $e->getMessage()]);

            return null;
        }
    }

private function chatWithRetry(
        string $prompt,
        bool $json = false,
        int $maxAttempts = 3,
        ?int $timeout = null,
    ): string {
        $attempt = 0;

        while (true) {
            $attempt++;
            try {
                return $this->callOllama($prompt, $json, $timeout);
            } catch (\Throwable $e) {
                if ($attempt >= $maxAttempts) {
                    throw $e;
                }

                $delay = 1000 * (2 ** ($attempt - 1)); 
                Log::debug("Ollama attempt {$attempt} failed, retrying in {$delay}ms", [
                    'message' => $e->getMessage(),
                ]);
                usleep($delay * 1000);
            }
        }
    }

    private function callOllama(string $prompt, bool $json = false, ?int $timeout = null): string
    {
        $baseUrl = rtrim((string) config('resume.ollama.base_url'), '/');
        $model   = (string) config('resume.ollama.model', 'llama3');
        $timeout ??= (int) config('resume.ollama.timeout', 120);

        $payload = [
            'model'   => $model,
            'prompt'  => $prompt,
            'stream'  => false,
            'options' => [
                'temperature' => 0,
                'top_p'       => 0.1,
                'num_ctx'     => (int) config('resume.ollama.num_ctx', 32768),
                'num_predict' => (int) config('resume.ollama.num_predict', 4096),
            ],
        ];

        if ($json) {
            $payload['format'] = 'json';
        }

        $response = Http::timeout($timeout)
            ->post("{$baseUrl}/api/generate", $payload)
            ->throw()
            ->json();

        return trim((string) ($response['response'] ?? ''));
    }

private function buildParsePrompt(string $cvText): string
    {
        $schema = json_encode(self::PARSED_SCHEMA, JSON_PRETTY_PRINT);
        $cvText = $this->truncateForPrompt($cvText);

        return <<<PROMPT
You are a precise CV/resume data extraction engine.

TASK: Extract structured information from the CV text below.

OUTPUT: Return exactly one valid JSON object matching this schema — nothing else, no markdown, no commentary:
{$schema}

EXTRACTION RULES:
- name: full name of the candidate (usually the first line)
- email: extract any email address; empty string if none
- phone: extract phone number in original format; empty string if none
- skills: flat array of individual skill strings — technologies, tools, soft skills, frameworks (e.g. ["React", "TypeScript", "Leadership"])
- education: array of objects with keys: institution, degree, field_of_study, start_date, end_date (use "Present" for ongoing)
- experience: array of objects with keys: company, role, start_date, end_date, description (description may be multi-sentence)
- projects: array of objects with keys: name, description, technologies (array), url
- languages: array of objects with keys: language, level (e.g. "Native", "Fluent", "B2")
- certifications: array of objects with keys: name, issuer, year
- github: GitHub profile URL only (not repo links); empty string if none
- github_repositories: array of individual GitHub repository URLs found in the CV
- portfolio_links: array of portfolio/personal website URLs (non-GitHub)

QUALITY RULES:
- Never invent data not present in the CV text.
- Use empty string "" or [] for any field not found.
- Preserve original date strings exactly (e.g. "Jan 2022", "2020-2023", "2021 – Present").
- Extract ALL work experiences, ALL education entries, ALL projects — do not truncate arrays.
- skills must be individual items, not sentences.

CV TEXT:
---
{$cvText}
---
PROMPT;
    }

private function decodeJson(string $raw): array
    {
        $raw = trim($raw);

        if (str_starts_with($raw, '```')) {
            $raw = preg_replace('/^```(?:json)?\s*/i', '', $raw) ?? $raw;
            $raw = preg_replace('/\s*```\s*$/', '', $raw) ?? $raw;
            $raw = trim($raw);
        }

        $start = mb_strpos($raw, '{');
        $end   = mb_strrpos($raw, '}');

        if ($start !== false && $end !== false && $end > $start) {
            $raw = mb_substr($raw, $start, $end - $start + 1);
        }

        $decoded = json_decode($raw, true);

        if (!is_array($decoded)) {
            throw new \RuntimeException('AI response was not valid JSON: ' . mb_substr($raw, 0, 120));
        }

        return $decoded;
    }

    private function normalizeParsedData(array $data): array
    {
        $normalized = self::PARSED_SCHEMA;

        foreach ($normalized as $key => $default) {
            if (!array_key_exists($key, $data)) {
                continue;
            }

            $value = $data[$key];

            if (is_array($default)) {
                $normalized[$key] = $this->normalizeArrayField($key, $value);
                continue;
            }

            $normalized[$key] = is_string($value) ? trim($value) : (string) $value;
        }

        return $normalized;
    }

    private function normalizeArrayField(string $key, mixed $value): array
    {
        if (!is_array($value)) {
            return [];
        }

        return match ($key) {
            'skills'                           => $this->normalizeStringList($value),
            'education'                        => $this->normalizeObjectList($value, ['institution', 'degree', 'field_of_study', 'start_date', 'end_date']),
            'experience'                       => $this->normalizeObjectList($value, ['company', 'role', 'start_date', 'end_date', 'description']),
            'projects'                         => $this->normalizeObjectList($value, ['name', 'description', 'technologies', 'url']),
            'github_repositories',
            'portfolio_links'                  => $this->normalizeStringList($value),
            'languages'                        => $this->normalizeObjectList($value, ['language', 'level']),
            'certifications'                   => $this->normalizeObjectList($value, ['name', 'issuer', 'year']),
            default                            => array_values($value),
        };
    }

    private function normalizeStringList(array $items): array
    {
        $values = [];

        foreach ($items as $item) {
            if (is_string($item)) {
                $values[] = $item;
                continue;
            }

            if (is_array($item)) {
                $values[] = $item['name'] ?? $item['skill'] ?? $item['title'] ?? '';
            }
        }

        $values = array_map(fn ($v) => trim((string) $v), $values);
        $values = array_filter($values, fn ($v) => $v !== '');

        return array_values(array_unique($values));
    }

    private function normalizeObjectList(array $items, array $keys): array
    {
        $normalized = [];

        foreach ($items as $item) {
            $row = array_fill_keys($keys, '');

            if (in_array('technologies', $keys, true)) {
                $row['technologies'] = [];
            }

            if (is_string($item)) {
                $targetKey     = in_array('description', $keys, true) ? 'description' : $keys[0];
                $row[$targetKey] = trim($item);
            } elseif (is_array($item)) {
                foreach ($keys as $key) {
                    $value    = $item[$key] ?? $this->alternateValueForKey($item, $key);
                    $row[$key] = is_array($value)
                        ? $this->normalizeStringList($value)
                        : trim((string) ($value ?? ''));
                }
            }

            if ($this->rowHasValue($row)) {
                $normalized[] = $row;
            }
        }

        return $normalized;
    }

    private function alternateValueForKey(array $item, string $key): mixed
    {
        return match ($key) {
            'institution'    => $item['school'] ?? $item['university'] ?? null,
            'field_of_study' => $item['field'] ?? $item['fieldOfStudy'] ?? $item['major'] ?? null,
            'role'           => $item['title'] ?? $item['position'] ?? null,
            'company'        => $item['employer'] ?? $item['organization'] ?? null,
            'start_date'     => $item['startDate'] ?? $item['from'] ?? null,
            'end_date'       => $item['endDate'] ?? $item['to'] ?? null,
            'technologies'   => $item['tech'] ?? $item['skills'] ?? [],
            'url'            => $item['link'] ?? $item['website'] ?? null,
            'language'       => $item['name'] ?? null,
            default          => null,
        };
    }

    private function rowHasValue(array $row): bool
    {
        foreach ($row as $value) {
            if (is_array($value) && $value !== []) {
                return true;
            }

            if (is_string($value) && trim($value) !== '') {
                return true;
            }
        }

        return false;
    }

    private function fallbackParse(string $cvText): array
    {
        $parsed = self::PARSED_SCHEMA;

        if (preg_match('/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i', $cvText, $email)) {
            $parsed['email'] = $email[0];
        }

        if (preg_match('/(\+?\d[\d\s().-]{7,}\d)/', $cvText, $phone)) {
            $parsed['phone'] = trim($phone[1]);
        }

        $lines          = array_values(array_filter(array_map('trim', explode("\n", $cvText))));
        $parsed['name'] = $lines[0] ?? '';

        $knownSkills = [
            'React', 'JavaScript', 'TypeScript', 'Node.js', 'Laravel', 'PHP', 'Python',
            'Docker', 'AWS', 'PostgreSQL', 'MySQL', 'Vue.js', 'Figma', 'Git', 'Kubernetes',
            'Tailwind', 'GraphQL', 'Redis', 'Java', 'C#', 'SQL', 'CI/CD', 'TensorFlow',
            'Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Agile', 'Scrum',
            'Jira', 'Excel', 'Power BI', 'REST API', 'Next.js', 'Express', 'MongoDB',
            'Swift', 'Kotlin', 'Flutter', 'Django', 'Spring Boot', 'Angular', 'Svelte',
            'Rust', 'Go', 'Scala', 'R', 'Pandas', 'NumPy', 'PyTorch', 'Selenium',
        ];

        $lower = mb_strtolower($cvText);

        foreach ($knownSkills as $skill) {
            if (str_contains($lower, mb_strtolower($skill))) {
                $parsed['skills'][] = $skill;
            }
        }

        $parsed['skills']          = array_values(array_unique($parsed['skills']));
        $parsed['education']       = $this->parseSectionRows($cvText, ['education'], ['institution', 'degree', 'field_of_study', 'start_date', 'end_date']);
        $parsed['experience']      = $this->parseExperienceSection($cvText);
        $parsed['projects']        = $this->parseSectionRows($cvText, ['projects', 'personal projects', 'side projects'], ['name', 'description', 'technologies']);
        $parsed['languages']       = $this->parseLanguageSection($cvText);
        $parsed['certifications']  = $this->parseSectionRows($cvText, ['certifications', 'certificates', 'licenses'], ['name', 'issuer', 'year']);
        $this->parseLinks($cvText, $parsed);

        return $parsed;
    }

    private function parseLinks(string $text, array &$parsed): void
    {
        preg_match_all('/https?:\/\/[^\s,)>\]"\']+|(?:www\.)[a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s,)>\]"\']*)?/i', $text, $matches);
        $links = array_values(array_unique(array_map(
            fn ($l) => str_starts_with($l, 'http') ? $l : "https://{$l}",
            $matches[0] ?? []
        )));

        foreach ($links as $link) {
            if (preg_match('/github\.com\/[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)?/i', $link)) {
                if ($parsed['github'] === '' && preg_match('/github\.com\/[A-Za-z0-9_.-]+\/?$/i', $link)) {
                    $parsed['github'] = rtrim($link, '/');
                } else {
                    $parsed['github_repositories'][] = rtrim($link, '/');
                }
                continue;
            }

            if (preg_match('/portfolio|behance|dribbble|vercel|netlify|gitlab|bitbucket/i', $link)) {
                $parsed['portfolio_links'][] = rtrim($link, '/');
            }
        }

        $parsed['github_repositories'] = array_values(array_unique($parsed['github_repositories']));
        $parsed['portfolio_links']      = array_values(array_unique($parsed['portfolio_links']));
    }

    private function parseExperienceSection(string $text): array
    {
        $section = $this->extractSection($text, ['experience', 'work experience', 'employment', 'work history']);

        if ($section === '') {
            return [];
        }

        $blocks = preg_split('/\n\s*\n/', $section) ?: [];
        $rows = [];

        foreach ($blocks as $block) {
            $lines = array_values(array_filter(array_map('trim', preg_split('/\n+/', trim($block)) ?: [])));

            if ($lines === []) {
                continue;
            }

            $row = [
                'company' => '',
                'role' => '',
                'start_date' => '',
                'end_date' => '',
                'description' => '',
            ];

            $headline = $lines[0];

            if (preg_match('/(.+?)\s+((?:19|20)\d{2}\s*[-–—]\s*(?:(?:19|20)\d{2}|present|current))\s*$/iu', $headline, $dateMatch)) {
                $headline = trim($dateMatch[1]);
                $parts = preg_split('/\s*[-–—]\s*/', trim($dateMatch[2])) ?: [];
                $row['start_date'] = trim($parts[0] ?? '');
                $row['end_date'] = trim($parts[1] ?? '');
            }

            if (preg_match('/^(.+?)\s+(?:at|@)\s+(.+)$/iu', $headline, $match)) {
                $row['role'] = trim($match[1]);
                $row['company'] = trim($match[2]);
            } elseif (preg_match('/^(.+?)\s*\|\s*(.+)$/', $headline, $match)) {
                $row['role'] = trim($match[1]);
                $row['company'] = trim($match[2]);
            } else {
                $parts = array_values(array_filter(array_map('trim', preg_split('/\s+[|–—-]\s+/', $headline) ?: [])));

                if (count($parts) >= 2) {
                    $row['role'] = $parts[0];
                    $row['company'] = $parts[1];
                    if (isset($parts[2]) && $row['start_date'] === '') {
                        $row['start_date'] = $parts[2];
                    }
                    if (isset($parts[3]) && $row['end_date'] === '') {
                        $row['end_date'] = $parts[3];
                    }
                } else {
                    $row['role'] = $headline;
                }
            }

            if (count($lines) > 1) {
                $row['description'] = implode("\n", array_slice($lines, 1));
            }

            if ($this->rowHasValue($row)) {
                $rows[] = $row;
            }
        }

        if ($rows !== []) {
            return $rows;
        }

        return $this->parseSectionRows($text, ['experience', 'work experience', 'employment', 'work history'], ['company', 'role', 'start_date', 'end_date', 'description']);
    }

    private function parseSectionRows(string $text, array $headings, array $keys): array
    {
        $section = $this->extractSection($text, $headings);

        if ($section === '') {
            return [];
        }

        $lines = array_values(array_filter(array_map('trim', preg_split('/\n+/', $section) ?: [])));
        $rows  = [];

        foreach ($lines as $line) {
            $line = preg_replace('/^[\-•*▪►]\s*/', '', $line) ?? $line;

            if ($line === '') {
                continue;
            }

            $row   = array_fill_keys($keys, '');
            $parts = array_values(array_filter(array_map('trim', preg_split('/\s+[|–—-]\s+/', $line) ?: [])));

            foreach ($keys as $index => $key) {
                if (!isset($parts[$index])) {
                    continue;
                }

                $row[$key] = $key === 'technologies' ? [$parts[$index]] : $parts[$index];
            }

            if ($this->rowHasValue($row)) {
                $rows[] = $row;
            }
        }

        return $rows;
    }

    private function parseLanguageSection(string $text): array
    {
        $section = $this->extractSection($text, ['languages', 'spoken languages']);

        if ($section === '') {
            return [];
        }

        $lines     = array_values(array_filter(array_map('trim', preg_split('/\n+/', $section) ?: [])));
        $languages = [];

        foreach ($lines as $line) {
            $line = preg_replace('/^[\-•*]\s*/', '', $line) ?? $line;

            if ($line === '') {
                continue;
            }

            $language = $line;
            $level = '';

            if (preg_match('/^(.+?)\s*[\(\[]\s*([^)\]]{1,40})\s*[\)\]]\s*$/u', $line, $match)) {
                $language = trim($match[1]);
                $level = trim($match[2]);
            } elseif (preg_match('/^(.{1,40}?)\s*[|–—:]\s*(.{1,40})$/u', $line, $match)) {
                $language = trim($match[1]);
                $level = trim($match[2]);
            } elseif (preg_match('/^([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s]{0,30}?)\s*[-–]\s*(.{1,40})$/u', $line, $match)) {
                $language = trim($match[1]);
                $level = trim($match[2]);
            }

            $sanitized = \App\Support\CvLanguageNormalizer::sanitizeRow([
                'language' => $language,
                'level' => $level,
            ]);

            if ($sanitized !== null) {
                $languages[] = $sanitized;
            }
        }

        return $languages;
    }

    private function extractSection(string $text, array $headings): string
    {
        $allHeadings = 'education|experience|work experience|work history|employment|projects|personal projects|skills|technical skills|technologies|tools|languages|spoken languages|certifications|certificates|licenses|summary|profile|objective|github|portfolio|contact|references';

        foreach ($headings as $heading) {
            $pattern = '/(?:^|\n)\s*' . preg_quote($heading, '/') . '\s*:?\s*\n(?P<body>.*?)(?=\n\s*(?:' . $allHeadings . ')\s*:?\s*\n|\z)/is';

            if (preg_match($pattern, $text, $match)) {
                return trim($match['body']);
            }
        }

        return '';
    }

    private function truncateForPrompt(string $cvText): string
    {
        $cvText  = trim(Utf8::sanitizeString($cvText));
        $maxChars = (int) config('resume.ollama.max_prompt_chars', 32000);

        if (mb_strlen($cvText) <= $maxChars) {
            return $cvText;
        }

        Log::debug('CV text truncated for prompt', [
            'original_length' => mb_strlen($cvText),
            'truncated_to'    => $maxChars,
        ]);

        return mb_substr($cvText, 0, $maxChars);
    }
}
