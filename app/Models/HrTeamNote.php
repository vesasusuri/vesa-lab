<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HrTeamNote extends Model
{
    protected $fillable = ['user_id', 'from_name', 'to_name', 'content', 'done'];

    protected $casts = ['done' => 'boolean'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
