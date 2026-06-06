<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JobListing extends Model
{
    public const JOB_TYPES = [
        'Full-time',
        'Part-time',
        'Contract',
        'Internship',
        'Remote',
    ];

    protected $fillable = [
        'user_id',
        'title',
        'company',
        'location',
        'salary',
        'type',
        'types',
        'tags',
        'description',
        'benefits',
        'embedding',
        'is_active',
        'is_featured',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'types' => 'array',
            'tags' => 'array',
            'embedding' => 'array',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
        ];
    }

    public function applications(): HasMany
    {
        return $this->hasMany(JobApplication::class);
    }

    protected static function booted(): void
    {
        static::saving(function (JobListing $job) {
            $types = self::normalizeTypes($job->types ?? ($job->type ? [$job->type] : []));
            $job->types = $types;
            $job->type = $types[0] ?? null;
        });
    }

public static function normalizeTypes(array|string|null $input): array
    {
        if (is_string($input)) {
            $input = array_map('trim', explode(',', $input));
        }

        if (!is_array($input)) {
            return [];
        }

        $allowed = array_flip(self::JOB_TYPES);
        $normalized = [];

        foreach ($input as $value) {
            if (!is_string($value)) {
                continue;
            }
            $value = trim($value);
            if ($value !== '' && isset($allowed[$value]) && !in_array($value, $normalized, true)) {
                $normalized[] = $value;
            }
        }

        return $normalized;
    }

    public static function typesLabel(array|string|null $types): string
    {
        $normalized = self::normalizeTypes($types);

        return $normalized !== [] ? implode(', ', $normalized) : 'Full-time';
    }

public static function mergeNormalizedInput(array $input): array
    {
        foreach (['title', 'company', 'location', 'salary', 'description'] as $field) {
            if (array_key_exists($field, $input) && is_string($input[$field])) {
                $input[$field] = trim($input[$field]);
            }
        }

        if (array_key_exists('types', $input)) {
            $input['types'] = self::normalizeTypes($input['types']);
        } elseif (!empty($input['type'])) {
            $input['types'] = self::normalizeTypes(
                is_array($input['type']) ? $input['type'] : [$input['type']]
            );
        }

        return $input;
    }

    public function toMatchText(): string
    {
        $tags = implode(', ', $this->tags ?? []);
        $types = self::typesLabel($this->types ?? $this->type);

        return trim("{$this->title} at {$this->company}. {$types}. {$this->description}. Skills: {$tags}");
    }
}
