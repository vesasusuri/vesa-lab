<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CvProject extends Model
{
    protected $fillable = [
        'cv_profile_id',
        'name',
        'description',
        'technologies',
        'url',
        'start_date',
        'end_date',
        'sort_order',
    ];

    protected function casts(): array
    {
        return ['technologies' => 'array'];
    }

    public function profile(): BelongsTo
    {
        return $this->belongsTo(CvProfile::class, 'cv_profile_id');
    }
}
