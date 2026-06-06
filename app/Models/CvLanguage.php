<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CvLanguage extends Model
{
    protected $fillable = ['cv_profile_id', 'language', 'level', 'sort_order'];

    public function profile(): BelongsTo
    {
        return $this->belongsTo(CvProfile::class, 'cv_profile_id');
    }
}
