<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Interview extends Model
{
    public const STATUS_SCHEDULED = 'scheduled';

    public const STATUS_IN_PROGRESS = 'in_progress';

    public const STATUS_COMPLETED = 'completed';

    public const STATUS_CANCELLED = 'cancelled';

    public const STATUS_RESCHEDULED = 'rescheduled';

    public const TYPE_VIDEO = 'video';

    public const TYPE_IN_PERSON = 'in_person';

    public const TYPE_PHONE = 'phone';

    protected $fillable = [
        'hr_user_id',
        'candidate_user_id',
        'access_token',
        'room_name',
        'title',
        'company',
        'application_id',
        'scheduled_at',
        'duration_minutes',
        'type',
        'status',
        'location',
        'interviewer_name',
        'notes',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'scheduled_at' => 'datetime',
            'metadata' => 'array',
            'application_id' => 'integer',
            'duration_minutes' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Interview $interview) {
            if (empty($interview->access_token)) {
                $interview->access_token = static::generateAccessToken();
            }

            if (empty($interview->room_name)) {
                $interview->room_name = static::generateRoomName($interview->access_token);
            }
        });
    }

    public static function generateAccessToken(): string
    {
        do {
            $token = Str::random(48);
        } while (static::query()->where('access_token', $token)->exists());

        return $token;
    }

    public static function generateRoomName(string $accessToken): string
    {
        return 'beehired-'.substr(hash('sha256', $accessToken), 0, 32);
    }

    public function hrUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'hr_user_id');
    }

    public function candidateUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'candidate_user_id');
    }

    public function participantIds(): array
    {
        return [$this->hr_user_id, $this->candidate_user_id];
    }

    public function isParticipant(int $userId): bool
    {
        return in_array($userId, $this->participantIds(), true);
    }

    public function joinUrl(): string
    {
        return url('/user-dashboard/interviews/join/'.$this->access_token);
    }

    public function toApiArray(): array
    {
        return [
            'id' => $this->id,
            'access_token' => $this->access_token,
            'room_name' => $this->room_name,
            'title' => $this->title,
            'company' => $this->company,
            'application_id' => $this->application_id,
            'scheduled_at' => $this->scheduled_at?->toIso8601String(),
            'duration_minutes' => $this->duration_minutes,
            'type' => $this->type,
            'status' => $this->status,
            'location' => $this->location,
            'interviewer_name' => $this->interviewer_name,
            'notes' => $this->notes,
            'metadata' => $this->metadata ?? [],
            'join_url' => $this->joinUrl(),
            'hr_user' => $this->relationLoaded('hrUser') ? [
                'id' => $this->hrUser->id,
                'name' => $this->hrUser->name,
                'email' => $this->hrUser->email,
            ] : null,
            'candidate_user' => $this->relationLoaded('candidateUser') ? [
                'id' => $this->candidateUser->id,
                'name' => $this->candidateUser->name,
                'email' => $this->candidateUser->email,
            ] : null,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
