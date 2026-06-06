<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CvEducation extends Model
{
    protected $table = 'cv_education';

    protected $fillable = [
        'cv_profile_id',
        'institution',
        'degree',
        'field_of_study',
        'start_date',
        'end_date',
        'is_current',
        'sort_order',
    ];

    protected function casts(): array
    {
        return ['is_current' => 'boolean'];
    }

    public function profile(): BelongsTo
    {
        return $this->belongsTo(CvProfile::class, 'cv_profile_id');
    }
}
