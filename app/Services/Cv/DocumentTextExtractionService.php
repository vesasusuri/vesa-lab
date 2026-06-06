<?php

namespace App\Services\Cv;

use App\Services\OCRService;
use Illuminate\Support\Facades\Storage;
use ZipArchive;

class DocumentTextExtractionService
{
    public function __construct(
        private readonly OCRService $ocrService,
        private readonly CvTextCleaningService $textCleaning,
    ) {
    }

    public function extract(string $storagePath, string $disk = 'local'): string
    {
        $absolutePath = Storage::disk($disk)->path($storagePath);

        if (!is_file($absolutePath)) {
            throw new \RuntimeException('Resume file not found for text extraction.');
        }

        $extension = strtolower(pathinfo($absolutePath, PATHINFO_EXTENSION));

        $raw = match ($extension) {
            'pdf' => $this->extractPdf($storagePath, $disk),
            'doc', 'docx' => $this->extractDocx($absolutePath),
            default => throw new \RuntimeException(
                'Unsupported file type. Upload a PDF or Word document (.docx).'
            ),
        };

        $cleaned = $this->textCleaning->clean($raw);

        if (mb_strlen(trim($cleaned)) < (int) config('resume.ocr.min_text_length', 200)) {
            throw new \RuntimeException(
                'Unable to extract readable text from this file. ' .
                'Try a text-based PDF/DOCX, or enable Tesseract OCR for scanned PDFs.'
            );
        }

        return $cleaned;
    }

    private function extractPdf(string $storagePath, string $disk): string
    {
        return $this->ocrService->extractRawFromPdf($storagePath, $disk);
    }

    private function extractDocx(string $absolutePath): string
    {
        $zip = new ZipArchive();

        if ($zip->open($absolutePath) !== true) {
            throw new \RuntimeException('Unable to read DOCX file.');
        }

        $xml = $zip->getFromName('word/document.xml');
        $zip->close();

        if ($xml === false || $xml === '') {
            throw new \RuntimeException('DOCX file contains no readable document body.');
        }

        $xml = preg_replace('/<\/w:p>/', "\n", $xml) ?? $xml;
        $xml = preg_replace('/<\/w:tr>/', "\n", $xml) ?? $xml;
        $xml = preg_replace('/<w:tab[^>]*\/>/', "\t", $xml) ?? $xml;

        if (preg_match_all('/<w:t[^>]*>([^<]*)<\/w:t>/', $xml, $matches)) {
            return implode('', $matches[1]);
        }

        return html_entity_decode(strip_tags($xml), ENT_QUOTES | ENT_XML1, 'UTF-8');
    }
}
