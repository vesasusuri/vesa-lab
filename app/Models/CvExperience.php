<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CvExperience extends Model
{
    protected $fillable = [
        'cv_profile_id',
        'company',
        'role',
        'start_date',
        'end_date',
        'is_current',
        'description',
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
