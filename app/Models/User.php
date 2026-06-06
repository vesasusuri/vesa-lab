<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'role', 'company',
        'account_status', 'first_login_completed',
        'last_login_at', 'password_changed_at',
        'verification_code', 'verification_code_expires_at',
        'onboarding_token', 'onboarding_token_expires_at',
        'invited_by',
    ];

    protected $hidden = ['password', 'remember_token', 'verification_code', 'onboarding_token'];

    public function getJWTIdentifier(): mixed
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return [];
    }

    public const ROLE_CANDIDATE = 'candidate';
    public const ROLE_HR        = 'hr';
    public const ROLE_ADMIN     = 'admin';

    public const STATUS_PENDING   = 'pending_activation';
    public const STATUS_ACTIVE    = 'active';
    public const STATUS_SUSPENDED = 'suspended';

    protected function casts(): array
    {
        return [
            'email_verified_at'            => 'datetime',
            'password'                     => 'hashed',
            'first_login_completed'        => 'boolean',
            'last_login_at'                => 'datetime',
            'password_changed_at'          => 'datetime',
            'verification_code_expires_at' => 'datetime',
            'onboarding_token_expires_at'  => 'datetime',
        ];
    }

    public function isPendingActivation(): bool
    {
        return $this->account_status === self::STATUS_PENDING;
    }

    public function isHr(): bool
    {
        return $this->role === self::ROLE_HR || $this->role === self::ROLE_ADMIN;
    }

    public function isCandidate(): bool
    {
        return $this->role === self::ROLE_CANDIDATE;
    }

public function invitedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'invited_by');
    }

    public function invitees(): HasMany
    {
        return $this->hasMany(User::class, 'invited_by');
    }

    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }

    public function hrInterviews(): HasMany
    {
        return $this->hasMany(Interview::class, 'hr_user_id');
    }

    public function candidateInterviews(): HasMany
    {
        return $this->hasMany(Interview::class, 'candidate_user_id');
    }

    public function latestResume(): HasOne
    {
        return $this->hasOne(Resume::class)->latestOfMany();
    }

    public function resumes(): HasMany
    {
        return $this->hasMany(Resume::class);
    }

    public function cvProfile(): HasOne
    {
        return $this->hasOne(CvProfile::class);
    }

    public function candidateConversations(): HasMany
    {
        return $this->hasMany(Conversation::class, 'candidate_user_id');
    }

    public function hrConversations(): HasMany
    {
        return $this->hasMany(Conversation::class, 'hr_user_id');
    }

    public function candidateApplications(): HasMany
    {
        return $this->hasMany(JobApplication::class, 'candidate_user_id');
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class)->latest();
    }
}
