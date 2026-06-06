<?php

namespace App\Http\Controllers;

use App\Models\Resume;
use App\Services\Cv\ResumeProcessingPipeline;
use App\Services\CVRatingService;
use App\Services\CvProfileService;
use App\Services\JobMatchingService;
use App\Support\Utf8;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ResumeController extends Controller
{
    public function __construct(
        private readonly ResumeProcessingPipeline $pipeline,
        private readonly CVRatingService $cvRatingService,
        private readonly JobMatchingService $jobMatchingService,
        private readonly CvProfileService $cvProfileService,
    ) {
    }

    public function show(Request $request): JsonResponse
    {
        $resume = $this->latestResumeForUser($request);

        if (!$resume) {
            return response()->json(['resume' => null]);
        }

        return response()->json(['resume' => $resume->toApiArray()]);
    }

    public function upload(Request $request): JsonResponse
    {
        $maxKb = (int) config('resume.max_upload_kb', 5120);

        $validated = $request->validate([
            'resume' => [
                'required',
                'file',
                'max:'.$maxKb,
                function (string $attribute, mixed $value, \Closure $fail) {
                    if (!$value instanceof \Illuminate\Http\UploadedFile) {
                        $fail('Invalid upload.');

                        return;
                    }

                    $extension = strtolower($value->getClientOriginalExtension());

                    if (!in_array($extension, ['pdf', 'doc', 'docx'], true)) {
                        $fail('The resume must be a PDF or Word document (.pdf, .doc, .docx).');
                    }
                },
            ],
        ]);

        $file = $validated['resume'];
        $user = $request->user();
        $path = $file->store("resumes/{$user->id}", 'local');

        $resume = Resume::query()->create([
            'user_id' => $user->id,
            'original_filename' => Utf8::sanitizeString($file->getClientOriginalName()),
            'path' => $path,
            'file_size' => $file->getSize(),
            'status' => Resume::STATUS_UPLOADED,
        ]);

        try {
            $result = $this->pipeline->process($resume, forUpload: true);

            return response()->json($this->successPayload($result, 'Resume uploaded and analyzed successfully.'), 201);
        } catch (\Throwable $exception) {
            return $this->failureResponse($resume, $exception, 'Resume uploaded, but analysis failed.');
        }
    }

    public function analyze(Request $request, Resume $resume): JsonResponse
    {
        $this->authorizeResume($request, $resume);

        if ($resume->status === Resume::STATUS_PROCESSING) {
            return response()->json([
                'message' => 'Analysis already in progress.',
                'resume' => $resume->toApiArray(),
            ], 409);
        }

        $resume->update([
            'status' => Resume::STATUS_PROCESSING,
            'error_message' => null,
        ]);

        try {
            $result = $this->pipeline->process($resume);

            return response()->json($this->successPayload($result, 'Resume analyzed successfully.'));
        } catch (\Throwable $exception) {
            return $this->failureResponse($resume, $exception, 'Resume analysis failed.');
        }
    }

    public function atsScore(Request $request, Resume $resume): JsonResponse
    {
        $this->authorizeResume($request, $resume);

        if (!$resume->parsed_data) {
            return response()->json([
                'message' => 'Resume must be analyzed before ATS scoring.',
            ], 422);
        }

        $atsRating = $this->cvRatingService->rate(
            $resume->parsed_data,
            $resume->extracted_text ?? ''
        );

        $resume->update(['ats_rating' => Utf8::sanitizeArray($atsRating)]);

        return response()->json(['ats' => $atsRating]);
    }

    public function jobMatch(Request $request, Resume $resume): JsonResponse
    {
        $this->authorizeResume($request, $resume);

        if (!$resume->parsed_data) {
            return response()->json([
                'message' => 'Resume must be analyzed before job matching.',
            ], 422);
        }

        $validated = $request->validate([
            'job_listing_id' => ['nullable', 'integer', 'exists:job_listings,id'],
        ]);

        $jobs = \App\Models\JobListing::query()->where('is_active', true)->get();
        $this->jobMatchingService->ensureJobEmbeddings($jobs);

        $jobMatch = $this->jobMatchingService->match(
            $resume->parsed_data,
            $validated['job_listing_id'] ?? null
        );

        $resume->update(['job_match' => $jobMatch]);

        return response()->json(['job_match' => $jobMatch]);
    }

private function successPayload(Resume $result, string $message): array
    {
        $parsed = $result->parsed_data ?? [];

        return [
            'message' => $message,
            'resume' => $result->toApiArray(),
            'parsed' => $parsed,
            'structured' => $this->pipeline->presentForApi($parsed),
            'ats' => $result->ats_rating,
            'job_match' => $result->job_match,
            'profile' => $result->cvProfile
                ? $this->cvProfileService->toApiPayload($result->cvProfile)
                : null,
        ];
    }

    private function failureResponse(Resume $resume, \Throwable $exception, string $message): JsonResponse
    {
        $errors = $exception instanceof ValidationException
            ? $exception->errors()
            : [];

        $errorMessage = $errors !== []
            ? collect($errors)->flatten()->first() ?? 'Validation failed.'
            : Utf8::sanitizeString($exception->getMessage());

        $resume->update([
            'status' => Resume::STATUS_FAILED,
            'error_message' => Utf8::sanitizeString($errorMessage),
        ]);

        return response()->json([
            'message' => $message,
            'error' => $errorMessage,
            'errors' => $errors,
            'resume' => $resume->fresh()->toApiArray(),
        ], 422);
    }

    private function latestResumeForUser(Request $request): ?Resume
    {
        return Resume::query()
            ->where('user_id', $request->user()->id)
            ->latest()
            ->first();
    }

    private function authorizeResume(Request $request, Resume $resume): void
    {
        if ($resume->user_id !== $request->user()->id) {
            abort(403, 'You are not allowed to access this resume.');
        }
    }
}
