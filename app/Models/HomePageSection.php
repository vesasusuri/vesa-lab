<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HomePageSection extends Model
{
    protected $fillable = [
        'key',
        'title',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(HomePageSectionItem::class, 'section_id')->orderBy('sort_order');
    }
}
