<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    public const TYPE_APPLICATION_STATUS = 'application_status_changed';

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'message',
        'icon',
        'action_url',
        'data',
        'read_at',
    ];

    protected function casts(): array
    {
        return [
            'data' => 'array',
            'read_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function markAsRead(): void
    {
        if ($this->read_at === null) {
            $this->update(['read_at' => now()]);
        }
    }

    public function toApiArray(): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'title' => $this->title,
            'text' => $this->message,
            'message' => $this->message,
            'icon' => $this->icon,
            'action_url' => $this->action_url,
            'data' => $this->data,
            'read' => $this->read_at !== null,
            'time' => $this->created_at?->diffForHumans() ?? '',
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
