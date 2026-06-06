<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PricingPlan extends Model
{
    protected $fillable = ['name', 'price', 'period', 'summary', 'highlights', 'featured', 'sort_order'];

    protected $casts = [
        'highlights' => 'array',
        'featured'   => 'boolean',
    ];
}
