<?php

namespace App\Services;

use App\Models\CvProfile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Str;
use RuntimeException;

class CvPdfExportService
{
    public function __construct(
        private readonly CvTemplateRenderer $templateRenderer,
    ) {
    }

    public function export(CvProfile $profile, string $templateSlug): string
    {
        $html = $this->templateRenderer->render($profile, $templateSlug);
        $tempDir = storage_path('app/cv-exports/'.Str::uuid());
        File::ensureDirectoryExists($tempDir);

        $htmlPath = $tempDir.'/cv.html';
        $pdfPath = $tempDir.'/cv.pdf';

        File::put($htmlPath, $html);

        $nodeBinary = (string) config('resume.puppeteer.node_binary', 'node');
        $scriptPath = base_path('scripts/generate-cv-pdf.mjs');
        $timeout = (int) config('resume.puppeteer.timeout', 60);

        $result = Process::timeout($timeout)->run([
            $nodeBinary,
            $scriptPath,
            $htmlPath,
            $pdfPath,
        ]);

        if (!$result->successful()) {
            File::deleteDirectory($tempDir);
            throw new RuntimeException(
                'PDF generation failed: '.trim($result->errorOutput() ?: $result->output())
            );
        }

        if (!File::exists($pdfPath)) {
            File::deleteDirectory($tempDir);
            throw new RuntimeException('PDF file was not created.');
        }

        File::delete($htmlPath);

        return $pdfPath;
    }
}
