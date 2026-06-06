<?php

return [
    'max_upload_kb' => (int) env('RESUME_MAX_UPLOAD_KB', 5120),
    'allowed_mimes' => env('RESUME_ALLOWED_MIMES', 'pdf,doc,docx'),

    // Keeps /api/resume/upload from hanging until php artisan serve drops the connection.
    'upload' => [
        'time_limit_seconds' => (int) env('RESUME_UPLOAD_TIME_LIMIT', 300),
        'fast_mode' => env('RESUME_UPLOAD_FAST_MODE', true),
        'ollama_timeout' => (int) env('RESUME_UPLOAD_OLLAMA_TIMEOUT', 90),
        'ollama_max_attempts' => (int) env('RESUME_UPLOAD_OLLAMA_ATTEMPTS', 1),
        'skip_ats_ai' => env('RESUME_UPLOAD_SKIP_ATS_AI', true),
        'skip_job_embeddings' => env('RESUME_UPLOAD_SKIP_JOB_EMBEDDINGS', true),
    ],

    'ollama' => [
        'enabled'          => env('OLLAMA_ENABLED', true),
        'base_url'         => env('OLLAMA_BASE_URL', 'http://127.0.0.1:11434'),
        'model'            => env('OLLAMA_MODEL', 'llama3.2'),
        'embedding_model'  => env('OLLAMA_EMBEDDING_MODEL', 'nomic-embed-text'),
        'timeout'          => (int) env('OLLAMA_TIMEOUT', 180),
        // Larger context window: covers long resumes without truncation.
        // llama3.2 supports up to 128k; 32768 is a safe default that fits in ~8 GB VRAM.
        'num_ctx'          => (int) env('OLLAMA_NUM_CTX', 32768),
        // Max tokens to generate for the JSON response
        'num_predict'      => (int) env('OLLAMA_NUM_PREDICT', 4096),
        // Max characters of CV text passed to the prompt
        'max_prompt_chars' => (int) env('OLLAMA_MAX_PROMPT_CHARS', 32000),
    ],

    'ocr' => [
        'pdftotext_binary'    => env('PDFTOTEXT_BINARY'),
        'tesseract_enabled'   => env('TESSERACT_ENABLED', true),
        'tesseract_binary'    => env('TESSERACT_BINARY', 'tesseract'),
        'tesseract_languages' => array_filter(explode(',', env('TESSERACT_LANGUAGES', 'eng'))),
        // pdftoppm (part of poppler-utils) converts PDF pages to images before OCR
        'pdftoppm_binary'     => env('PDFTOPPM_BINARY', 'pdftoppm'),
        // DPI for page-to-image conversion — 300 gives good OCR quality without huge files
        'ocr_dpi'             => (int) env('OCR_DPI', 300),
        // Minimum extracted text length before we try the next extraction method
        'min_text_length'     => (int) env('OCR_MIN_TEXT_LENGTH', 200),
    ],

    'puppeteer' => [
        'node_binary' => env('CV_PDF_NODE_BINARY', 'node'),
        'timeout'     => (int) env('CV_PDF_TIMEOUT', 60),
    ],
];
