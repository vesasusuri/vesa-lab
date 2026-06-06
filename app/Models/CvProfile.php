<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CvProfile extends Model
{
    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'full_name',
        'email',
        'phone',
        'headline',
        'summary',
        'location',
        'date_of_birth',
        'nationality',
        'website',
        'linkedin',
        'github',
        'github_repositories',
        'portfolio_links',
        'desired_role',
        'job_type',
        'expected_salary',
        'availability',
        'avatar_path',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'expected_salary' => 'integer',
            'github_repositories' => 'array',
            'portfolio_links' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function skills(): HasMany
    {
        return $this->hasMany(CvSkill::class)->orderBy('sort_order');
    }

    public function experiences(): HasMany
    {
        return $this->hasMany(CvExperience::class)->orderBy('sort_order');
    }

    public function education(): HasMany
    {
        return $this->hasMany(CvEducation::class)->orderBy('sort_order');
    }

    public function languages(): HasMany
    {
        return $this->hasMany(CvLanguage::class)->orderBy('sort_order');
    }

    public function projects(): HasMany
    {
        return $this->hasMany(CvProject::class)->orderBy('sort_order');
    }

    public function certifications(): HasMany
    {
        return $this->hasMany(CvCertification::class)->orderBy('sort_order');
    }

    public function resumes(): HasMany
    {
        return $this->hasMany(Resume::class);
    }
}
