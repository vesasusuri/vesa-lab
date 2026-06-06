<?php

namespace App\Http\Controllers\Concerns;

use App\Models\RefreshToken;
use Illuminate\Support\Str;

trait IssuesRefreshToken
{
    private function issueRefreshToken(int $userId): string
    {
        RefreshToken::where('user_id', $userId)->delete();

        $raw = Str::random(64);

        RefreshToken::create([
            'user_id'    => $userId,
            'token'      => hash('sha256', $raw),
            'expires_at' => now()->addMinutes((int) config('jwt.refresh_ttl', 43200)),
        ]);

        return $raw;
    }

    private function tokenTtlSeconds(): int
    {
        return max((int) config('jwt.ttl', 1), 1) * 60;
    }
}
