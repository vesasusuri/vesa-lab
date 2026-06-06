<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Resume extends Model
{
    public const STATUS_UPLOADED = 'uploaded';

    public const STATUS_PROCESSING = 'processing';

    public const STATUS_COMPLETED = 'completed';

public const STATUS_PARSED = 'completed';

    public const STATUS_FAILED = 'failed';

    protected $fillable = [
        'user_id',
        'cv_profile_id',
        'original_filename',
        'path',
        'file_size',
        'extracted_text',
        'parsed_data',
        'ats_rating',
        'job_match',
        'status',
        'error_message',
        'analyzed_at',
    ];

    protected function casts(): array
    {
        return [
            'parsed_data' => 'array',
            'ats_rating' => 'array',
            'job_match' => 'array',
            'analyzed_at' => 'datetime',
            'file_size' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function cvProfile(): BelongsTo
    {
        return $this->belongsTo(CvProfile::class);
    }

    public function toApiArray(): array
    {
        return [
            'id' => $this->id,
            'original_filename' => $this->original_filename,
            'file_size' => $this->file_size,
            'status' => $this->status,
            'parsed_data' => $this->parsed_data,
            'ats_rating' => $this->ats_rating,
            'job_match' => $this->job_match,
            'error_message' => $this->error_message,
            'analyzed_at' => $this->analyzed_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
