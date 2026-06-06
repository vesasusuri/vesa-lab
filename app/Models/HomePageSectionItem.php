<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HomePageSectionItem extends Model
{
    protected $fillable = [
        'section_id',
        'title',
        'subtitle',
        'description',
        'cta_text',
        'image_url',
        'image_alt',
        'metadata',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'metadata' => 'array',
        'is_active' => 'boolean',
    ];

    public function section(): BelongsTo
    {
        return $this->belongsTo(HomePageSection::class, 'section_id');
    }
}
