<?php

namespace App\Http\Controllers;

use App\Models\CvTemplate;
use App\Services\CvPdfExportService;
use App\Services\CvProfileService;
use App\Services\CvTemplateRenderer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class CvProfileController extends Controller
{
    public function __construct(
        private readonly CvProfileService $cvProfileService,
        private readonly CvTemplateRenderer $templateRenderer,
        private readonly CvPdfExportService $pdfExportService,
    ) {
    }

    public function show(Request $request): JsonResponse
    {
        $profile = $this->cvProfileService->loadForUser($request->user());

        if (!$profile) {
            return response()->json(['profile' => null]);
        }

        return response()->json([
            'profile' => $this->cvProfileService->toApiPayload($profile),
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'personal' => ['nullable', 'array'],
            'personal.full_name' => ['nullable', 'string', 'max:255'],
            'personal.email' => ['nullable', 'email', 'max:255'],
            'personal.phone' => ['nullable', 'string', 'max:64'],
            'personal.headline' => ['nullable', 'string', 'max:255'],
            'personal.summary' => ['nullable', 'string'],
            'personal.location' => ['nullable', 'string', 'max:255'],
            'personal.website' => ['nullable', 'string', 'max:255'],
            'personal.linkedin' => ['nullable', 'string', 'max:255'],
            'personal.github' => ['nullable', 'string', 'max:255'],
            'personal.github_repositories' => ['nullable', 'array'],
            'personal.github_repositories.*' => ['nullable', 'string', 'max:255'],
            'personal.portfolio_links' => ['nullable', 'array'],
            'personal.portfolio_links.*' => ['nullable', 'string', 'max:255'],
            'skills' => ['nullable', 'array'],
            'skills.*' => ['string', 'max:120'],
            'experiences' => ['nullable', 'array'],
            'experiences.*.company' => ['nullable', 'string', 'max:255'],
            'experiences.*.role' => ['nullable', 'string', 'max:255'],
            'experiences.*.startDate' => ['nullable', 'string', 'max:16'],
            'experiences.*.endDate' => ['nullable', 'string', 'max:16'],
            'experiences.*.current' => ['nullable', 'boolean'],
            'experiences.*.description' => ['nullable', 'string'],
            'education' => ['nullable', 'array'],
            'education.*.school' => ['nullable', 'string', 'max:255'],
            'education.*.degree' => ['nullable', 'string', 'max:255'],
            'education.*.fieldOfStudy' => ['nullable', 'string', 'max:255'],
            'education.*.startDate' => ['nullable', 'string', 'max:16'],
            'education.*.endDate' => ['nullable', 'string', 'max:16'],
            'education.*.current' => ['nullable', 'boolean'],
            'languages' => ['nullable', 'array'],
            'languages.*.language' => ['nullable', 'string', 'max:120'],
            'languages.*.level' => ['nullable', 'string', 'max:32'],
            'projects' => ['nullable', 'array'],
            'projects.*.name' => ['nullable', 'string', 'max:255'],
            'projects.*.description' => ['nullable', 'string'],
            'projects.*.technologies' => ['nullable', 'array'],
            'projects.*.technologies.*' => ['nullable', 'string', 'max:120'],
            'projects.*.url' => ['nullable', 'string', 'max:255'],
            'projects.*.startDate' => ['nullable', 'string', 'max:16'],
            'projects.*.endDate' => ['nullable', 'string', 'max:16'],
            'certifications' => ['nullable', 'array'],
            'certifications.*.name' => ['nullable', 'string', 'max:255'],
            'certifications.*.issuer' => ['nullable', 'string', 'max:255'],
            'certifications.*.year' => ['nullable', 'string', 'max:32'],
        ]);

        $profile = $this->cvProfileService->updateFromPayload($request->user(), $validated);

        return response()->json([
            'message' => 'CV profile saved successfully.',
            'profile' => $this->cvProfileService->toApiPayload($profile),
        ]);
    }

    public function templates(): JsonResponse
    {
        $templates = CvTemplate::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn (CvTemplate $t) => $t->toApiArray());

        return response()->json(['templates' => $templates]);
    }

    public function preview(Request $request, string $slug)
    {
        $profile = $this->requireProfile($request);

        return $this->templateRenderer->preview($profile, $slug);
    }

    public function exportPdf(Request $request): BinaryFileResponse|JsonResponse
    {
        $validated = $request->validate([
            'template' => ['required', 'string', 'exists:cv_templates,slug'],
        ]);

        $profile = $this->requireProfile($request);

        try {
            $pdfPath = $this->pdfExportService->export($profile, $validated['template']);
            $filename = 'cv-'.$validated['template'].'-'.now()->format('Y-m-d').'.pdf';

            return response()->download($pdfPath, $filename, [
                'Content-Type' => 'application/pdf',
            ])->deleteFileAfterSend(true);
        } catch (\Throwable $exception) {
            return response()->json([
                'message' => 'PDF export failed.',
                'error' => $exception->getMessage(),
            ], 422);
        }
    }

    private function requireProfile(Request $request)
    {
        $profile = $this->cvProfileService->loadForUser($request->user());

        if (!$profile) {
            abort(422, 'Save your CV profile before exporting.');
        }

        return $profile;
    }
}
