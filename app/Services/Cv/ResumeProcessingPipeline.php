<?php

namespace App\Services\Cv;

use App\Models\Resume;
use App\Services\AIService;
use App\Services\CVRatingService;
use App\Services\CvProfileService;
use App\Services\JobMatchingService;
use App\Support\Utf8;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ResumeProcessingPipeline
{
    public function __construct(
        private readonly DocumentTextExtractionService $documentExtraction,
        private readonly AIService $aiService,
        private readonly ParsedCvValidator $parsedCvValidator,
        private readonly ParsedCvPresenter $parsedCvPresenter,
        private readonly CVRatingService $cvRatingService,
        private readonly JobMatchingService $jobMatchingService,
        private readonly CvProfileService $cvProfileService,
    ) {
    }

    public function process(Resume $resume, bool $forUpload = false): Resume
    {
        if ($forUpload) {
            @set_time_limit((int) config('resume.upload.time_limit_seconds', 300));
        }

        $resume->update([
            'status' => Resume::STATUS_PROCESSING,
            'error_message' => null,
        ]);

        return DB::transaction(function () use ($resume, $forUpload) {
            
            $extractedText = $this->documentExtraction->extract($resume->path, 'local');

$parsedData = $this->aiService->parseCvText($extractedText, $forUpload);

$parsedData = $this->parsedCvValidator->validateAndSanitize($parsedData, $extractedText);

$atsRating = $this->rateSafely($parsedData, $extractedText, $forUpload);
            $jobMatch = $this->matchJobsSafely($parsedData, $forUpload);

$profile = $this->cvProfileService->syncFromParsedData($resume->user, $parsedData);

            $resume->update([
                'cv_profile_id' => $profile->id,
                'extracted_text' => $extractedText,
                'parsed_data' => $parsedData,
                'ats_rating' => $atsRating,
                'job_match' => $jobMatch,
                'status' => Resume::STATUS_COMPLETED,
                'analyzed_at' => now(),
            ]);

            return $resume->fresh(['cvProfile']);
        });
    }

public function presentForApi(array $parsedData): array
    {
        return $this->parsedCvPresenter->toStructured($parsedData);
    }

private function rateSafely(array $parsedData, string $extractedText, bool $forUpload = false): array
    {
        $skipAi = $forUpload
            && config('resume.upload.fast_mode', true)
            && config('resume.upload.skip_ats_ai', true);

        try {
            return Utf8::sanitizeArray(
                $skipAi
                    ? $this->cvRatingService->heuristicRate($parsedData, $extractedText)
                    : $this->cvRatingService->rate($parsedData, $extractedText)
            );
        } catch (\Throwable $e) {
            Log::warning('ATS rating skipped during CV upload', ['message' => $e->getMessage()]);

            return [
                'score' => 0,
                'missing' => [],
                'strengths' => [],
                'suggestions' => [],
            ];
        }
    }

private function matchJobsSafely(array $parsedData, bool $forUpload = false): array
    {
        try {
            $jobs = \App\Models\JobListing::query()->where('is_active', true)->get();

            $skipEmbeddings = $forUpload
                && config('resume.upload.fast_mode', true)
                && config('resume.upload.skip_job_embeddings', true);

            if (!$skipEmbeddings) {
                $this->jobMatchingService->ensureJobEmbeddings($jobs);
            }

            return $this->jobMatchingService->match($parsedData, skipCvEmbedding: $skipEmbeddings);
        } catch (\Throwable $e) {
            Log::warning('Job matching skipped during CV upload', ['message' => $e->getMessage()]);

            return [
                'match_percentage' => 0,
                'missing_skills' => [],
                'matched_job' => null,
            ];
        }
    }
}
