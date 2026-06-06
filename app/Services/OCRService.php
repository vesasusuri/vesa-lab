<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Smalot\PdfParser\Parser as PdfParser;
use Spatie\PdfToText\Pdf;
use thiagoalessio\TesseractOCR\TesseractOCR;

class OCRService
{

public function extractRawFromPdf(string $storagePath, string $disk = 'local'): string
    {
        $absolutePath = Storage::disk($disk)->path($storagePath);

        if (!is_file($absolutePath)) {
            throw new \RuntimeException('Resume file not found for text extraction.');
        }

$text = $this->extractWithPdfToText($absolutePath);

if ($this->isTextTooShort($text)) {
            $text = $this->extractWithPdfParser($absolutePath);
        }

if ($this->isTextTooShort($text) && config('resume.ocr.tesseract_enabled')) {
            $text = $this->extractWithTesseractViaImages($absolutePath);

if ($this->isTextTooShort($text)) {
                $text = $this->extractWithTesseractDirect($absolutePath);
            }
        }

        return $text;
    }

public function extractFromPdf(string $storagePath, string $disk = 'local'): string
    {
        return $this->extractRawFromPdf($storagePath, $disk);
    }

private function extractWithPdfToText(string $path): string
    {
        try {
            $binary = config('resume.ocr.pdftotext_binary');

            return Pdf::getText($path, $binary ?: null);
        } catch (\Throwable $e) {
            Log::debug('pdftotext failed', ['message' => $e->getMessage()]);

            return '';
        }
    }

    private function extractWithPdfParser(string $path): string
    {
        try {
            return (new PdfParser())->parseFile($path)->getText();
        } catch (\Throwable $e) {
            Log::debug('pdfparser failed', ['message' => $e->getMessage()]);

            return '';
        }
    }

private function extractWithTesseractViaImages(string $pdfPath): string
    {
        $pdftoppm = config('resume.ocr.pdftoppm_binary', 'pdftoppm');

        if (!$this->commandExists($pdftoppm)) {
            Log::debug('pdftoppm not found, skipping image-based OCR');

            return '';
        }

        $tmpDir = sys_get_temp_dir() . '/beehired_ocr_' . uniqid('', true);

        try {
            mkdir($tmpDir, 0700, true);

$prefix  = $tmpDir . '/page';
            $dpi     = (int) config('resume.ocr.ocr_dpi', 300);
            $command = sprintf(
                '%s -r %d -png %s %s 2>/dev/null',
                escapeshellcmd($pdftoppm),
                $dpi,
                escapeshellarg($pdfPath),
                escapeshellarg($prefix)
            );

            exec($command, $output, $code);

            $images = glob($tmpDir . '/page-*.png') ?: glob($tmpDir . '/page*.png') ?: [];
            sort($images);

            if (!$images) {
                return '';
            }

            $pages = [];
            foreach ($images as $image) {
                $pages[] = $this->tesseractOnImage($image);
            }

            return implode("\n\n", array_filter($pages));

        } catch (\Throwable $e) {
            Log::debug('Tesseract via images failed', ['message' => $e->getMessage()]);

            return '';
        } finally {
            $this->removeDirectory($tmpDir);
        }
    }

private function extractWithTesseractDirect(string $path): string
    {
        try {
            $ocr    = new TesseractOCR($path);
            $binary = config('resume.ocr.tesseract_binary');

            if ($binary) {
                $ocr->executable($binary);
            }

            return (string) $ocr->run();
        } catch (\Throwable $e) {
            Log::debug('Tesseract direct failed', ['message' => $e->getMessage()]);

            return '';
        }
    }

    private function tesseractOnImage(string $imagePath): string
    {
        try {
            $ocr    = new TesseractOCR($imagePath);
            $binary = config('resume.ocr.tesseract_binary');

            if ($binary) {
                $ocr->executable($binary);
            }

$langs = config('resume.ocr.tesseract_languages', ['eng']);
            $ocr->lang(...$langs);

$ocr->psm(6);

            return (string) $ocr->run();
        } catch (\Throwable $e) {
            Log::debug('Tesseract image page failed', ['message' => $e->getMessage(), 'image' => $imagePath]);

            return '';
        }
    }

private function isTextTooShort(string $text): bool
    {
        return mb_strlen(trim($text)) < (int) config('resume.ocr.min_text_length', 200);
    }

    private function commandExists(string $command): bool
    {
        $which = PHP_OS_FAMILY === 'Windows' ? 'where' : 'which';
        exec("{$which} " . escapeshellarg($command) . ' 2>/dev/null', $out, $code);

        return $code === 0;
    }

    private function removeDirectory(string $dir): void
    {
        if (!is_dir($dir)) {
            return;
        }

        foreach (glob($dir . '/*') ?: [] as $file) {
            is_dir($file) ? $this->removeDirectory($file) : unlink($file);
        }

        rmdir($dir);
    }
}
