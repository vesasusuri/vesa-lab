<?php

namespace App\Services;

use App\Models\JobListing;
use App\Support\Utf8;
use Illuminate\Support\Collection;

class JobMatchingService
{
    public function __construct(private readonly AIService $aiService)
    {
    }

    public function match(array $parsedData, ?int $jobListingId = null, bool $skipCvEmbedding = false): array
    {
        $jobs = $this->loadJobs($jobListingId);

        if ($jobs->isEmpty()) {
            return Utf8::sanitizeArray([
                'match_percentage' => 0,
                'missing_skills' => [],
                'matched_job' => null,
            ]);
        }

        $cvEmbedding = null;

        if (!$skipCvEmbedding) {
            $cvText = $this->buildCvMatchText($parsedData);
            $cvEmbedding = $this->aiService->embed($cvText);
        }
        $cvSkills = $this->normalizeTokens($parsedData['skills'] ?? []);

        $best = null;

        foreach ($jobs as $job) {
            $jobSkills = $this->normalizeTokens($job->tags ?? []);
            $skillScore = $this->skillOverlapScore($cvSkills, $jobSkills);
            $embeddingScore = null;

            if ($cvEmbedding && is_array($job->embedding) && count($job->embedding) > 0) {
                $embeddingScore = $this->cosineSimilarity($cvEmbedding, $job->embedding);
            }

            $score = $embeddingScore !== null
                ? (int) round(($embeddingScore * 0.6 + $skillScore * 0.4) * 100)
                : (int) round($skillScore * 100);

            $missingSkills = array_values(array_diff($jobSkills, $cvSkills));

            $candidate = [
                'job_listing_id' => $job->id,
                'title' => $job->title,
                'company' => $job->company,
                'match_percentage' => max(0, min(100, $score)),
                'missing_skills' => $missingSkills,
            ];

            if ($best === null || $candidate['match_percentage'] > $best['match_percentage']) {
                $best = $candidate;
            }
        }

        return Utf8::sanitizeArray([
            'match_percentage' => $best['match_percentage'],
            'missing_skills' => $best['missing_skills'],
            'matched_job' => [
                'id' => $best['job_listing_id'],
                'title' => $best['title'],
                'company' => $best['company'],
            ],
        ]);
    }

    public function ensureJobEmbeddings(Collection $jobs): void
    {
        foreach ($jobs as $job) {
            if (is_array($job->embedding) && count($job->embedding) > 0) {
                continue;
            }

            $embedding = $this->aiService->embed($job->toMatchText());

            if ($embedding) {
                $job->update(['embedding' => $embedding]);
            }
        }
    }

    private function loadJobs(?int $jobListingId): Collection
    {
        $query = JobListing::query()->where('is_active', true);

        if ($jobListingId) {
            $query->where('id', $jobListingId);
        }

        return $query->get();
    }

    private function buildCvMatchText(array $parsedData): string
    {
        $parts = [
            $parsedData['name'] ?? '',
            implode(', ', $parsedData['skills'] ?? []),
            Utf8::jsonEncode($parsedData['experience'] ?? []),
            Utf8::jsonEncode($parsedData['education'] ?? []),
            Utf8::jsonEncode($parsedData['projects'] ?? []),
        ];

        return trim(implode("\n", array_filter($parts)));
    }

    private function normalizeTokens(array $items): array
    {
        return array_values(array_unique(array_map(
            fn ($item) => mb_strtolower(trim((string) $item)),
            array_filter($items, fn ($item) => is_string($item) && trim($item) !== '')
        )));
    }

    private function skillOverlapScore(array $cvSkills, array $jobSkills): float
    {
        if ($jobSkills === []) {
            return 0.5;
        }

        if ($cvSkills === []) {
            return 0.0;
        }

        $matched = array_intersect($cvSkills, $jobSkills);

        return count($matched) / count($jobSkills);
    }

    private function cosineSimilarity(array $a, array $b): float
    {
        $length = min(count($a), count($b));

        if ($length === 0) {
            return 0.0;
        }

        $dot = 0.0;
        $normA = 0.0;
        $normB = 0.0;

        for ($i = 0; $i < $length; $i++) {
            $dot += $a[$i] * $b[$i];
            $normA += $a[$i] ** 2;
            $normB += $b[$i] ** 2;
        }

        if ($normA == 0.0 || $normB == 0.0) {
            return 0.0;
        }

        return $dot / (sqrt($normA) * sqrt($normB));
    }
}
