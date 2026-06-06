<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Conversation extends Model
{
    protected $fillable = [
        'candidate_user_id',
        'hr_user_id',
        'job_listing_id',
    ];

    public function candidate(): BelongsTo
    {
        return $this->belongsTo(User::class, 'candidate_user_id');
    }

    public function hr(): BelongsTo
    {
        return $this->belongsTo(User::class, 'hr_user_id');
    }

    public function jobListing(): BelongsTo
    {
        return $this->belongsTo(JobListing::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    public function latestMessage(): HasOne
    {
        return $this->hasOne(Message::class)->latestOfMany();
    }

    public function involvesUser(User $user): bool
    {
        return (int) $this->candidate_user_id === (int) $user->id
            || (int) $this->hr_user_id === (int) $user->id;
    }

    public function otherParticipant(User $user): ?User
    {
        if ((int) $this->candidate_user_id === (int) $user->id) {
            return $this->hr;
        }

        if ((int) $this->hr_user_id === (int) $user->id) {
            return $this->candidate;
        }

        return null;
    }
}
