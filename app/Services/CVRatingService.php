<?php

namespace App\Services;

use App\Support\Utf8;
use Illuminate\Support\Facades\Log;

class CVRatingService
{
    public function __construct(private readonly AIService $aiService)
    {
    }

    public function rate(array $parsedData, string $extractedText = ''): array
    {
        if (config('resume.ollama.enabled')) {
            try {
                return $this->normalizeRating(
                    $this->aiService->requestJson($this->buildPrompt($parsedData, $extractedText))
                );
            } catch (\Throwable $exception) {
                Log::debug('AI ATS rating failed, using heuristic rating', [
                    'message' => $exception->getMessage(),
                ]);
            }
        }

        return Utf8::sanitizeArray($this->heuristicRate($parsedData, $extractedText));
    }

    private function buildPrompt(array $parsedData, string $extractedText): string
    {
        $json         = Utf8::jsonEncode($parsedData, JSON_PRETTY_PRINT);
        $textPreview  = mb_substr(trim(Utf8::sanitizeString($extractedText)), 0, 6000);

        return <<<PROMPT
You are an expert ATS (Applicant Tracking System) resume reviewer.

TASK: Score the resume and return exactly this JSON — nothing else, no markdown:
{"score": 0, "missing": [], "strengths": [], "suggestions": []}

SCORING RUBRIC (total 100 points):
- Contact info complete (name + email + phone): 10 pts
- Work experience section present with 2+ entries: 20 pts
- Each experience has role, company, dates, AND a description: up to 10 pts
- Education section present: 10 pts
- 5+ technical skills listed: 10 pts
- Projects section present: 8 pts
- Languages section present: 5 pts
- Certifications present: 5 pts
- GitHub or portfolio link present: 5 pts
- Descriptions contain measurable results (numbers, %, $, users, etc.): 10 pts
- No obvious issues (garbled text, very short content, no structure): 7 pts

FIELD RULES:
- score: integer 0–100 based on the rubric above
- missing: short strings for sections/fields that are absent or empty (e.g. "Work experience", "Contact phone", "GitHub profile")
- strengths: short strings for things done well (e.g. "5 technical skills listed", "Includes measurable results")
- suggestions: specific, actionable improvement advice (e.g. "Add quantified achievements to Software Engineer role at Acme", "Include a GitHub or portfolio link")
- All arrays must contain only strings, no objects.
- Be concise — 3 to 6 items per array at most.

PARSED CV DATA:
{$json}

RAW CV TEXT (first 6000 chars):
{$textPreview}
PROMPT;
    }

    public function heuristicRate(array $parsedData, string $extractedText = ''): array
    {
        $missing = [];
        $strengths = [];
        $suggestions = [];
        $score = 40;

        $sections = [
            'skills' => 'Skills section',
            'experience' => 'Work experience section',
            'education' => 'Education section',
            'projects' => 'Projects section',
            'languages' => 'Languages section',
            'certifications' => 'Certifications section',
        ];

        foreach ($sections as $key => $label) {
            if (empty($parsedData[$key])) {
                $missing[] = $label;
            } else {
                $score += 8;
            }
        }

        if (!empty($parsedData['email'])) {
            $score += 5;
        } else {
            $missing[] = 'Contact email';
        }

        if (!empty($parsedData['phone'])) {
            $score += 5;
        }

        if (count($parsedData['skills'] ?? []) >= 5) {
            $strengths[] = 'Strong skills coverage';
            $score += 10;
        } else {
            $suggestions[] = 'Add more technical keywords and skills';
        }

        if (!empty($parsedData['experience'])) {
            $strengths[] = 'Professional experience listed';
        } else {
            $suggestions[] = 'Add measurable achievements in work experience';
        }

        if (str_contains(mb_strtolower($extractedText), 'github')) {
            $strengths[] = 'GitHub profile referenced';
        } else {
            $missing[] = 'GitHub profile';
        }

        if (preg_match('/\d+%|\$\d+|\d+\s*(users|customers|projects)/i', $extractedText)) {
            $strengths[] = 'Includes measurable results';
        } else {
            $suggestions[] = 'Add measurable achievements with numbers';
        }

        $score = max(0, min(100, $score));

        return [
            'score' => $score,
            'missing' => array_values(array_unique($missing)),
            'strengths' => array_values(array_unique($strengths)),
            'suggestions' => array_values(array_unique($suggestions)),
        ];
    }

    private function normalizeRating(array $data): array
    {
        return Utf8::sanitizeArray([
            'score' => max(0, min(100, (int) ($data['score'] ?? 0))),
            'missing' => array_values(array_filter($data['missing'] ?? [], 'is_string')),
            'strengths' => array_values(array_filter($data['strengths'] ?? [], 'is_string')),
            'suggestions' => array_values(array_filter($data['suggestions'] ?? [], 'is_string')),
        ]);
    }
}
