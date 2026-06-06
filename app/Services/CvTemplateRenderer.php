<?php

namespace App\Services;

use App\Models\CvProfile;
use App\Models\CvTemplate;
use Illuminate\Support\Facades\View;
use Illuminate\View\View as ViewInstance;

class CvTemplateRenderer
{
    public function __construct(
        private readonly CvProfileService $cvProfileService,
    ) {
    }

    public function findTemplate(string $slug): CvTemplate
    {
        $template = CvTemplate::query()
            ->where('slug', $slug)
            ->where('is_active', true)
            ->first();

        if (!$template) {
            abort(404, 'CV template not found.');
        }

        return $template;
    }

    public function render(CvProfile $profile, string $templateSlug): string
    {
        $template = $this->findTemplate($templateSlug);
        $cv = $this->cvProfileService->toTemplateData($profile);

        return $this->renderView($template->view, $cv, $templateSlug);
    }

    public function renderView(string $viewName, array $cv, string $templateSlug): string
    {
        $view = "cv-templates.{$viewName}";

        if (!View::exists($view)) {
            abort(500, "Template view [{$view}] is missing.");
        }

        return View::make($view, [
            'cv' => $cv,
            'template' => $templateSlug,
        ])->render();
    }

    public function preview(CvProfile $profile, string $templateSlug): ViewInstance
    {
        $template = $this->findTemplate($templateSlug);
        $cv = $this->cvProfileService->toTemplateData($profile);

        return View::make("cv-templates.{$template->view}", [
            'cv' => $cv,
            'template' => $templateSlug,
            'preview' => true,
        ]);
    }
}
