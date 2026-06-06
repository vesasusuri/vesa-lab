<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CvTemplate extends Model
{
    protected $fillable = [
        'slug',
        'name',
        'description',
        'view',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function toApiArray(): array
    {
        return [
            'slug' => $this->slug,
            'name' => $this->name,
            'description' => $this->description,
            'preview_url' => url("/api/cv/preview/{$this->slug}"),
        ];
    }
}
