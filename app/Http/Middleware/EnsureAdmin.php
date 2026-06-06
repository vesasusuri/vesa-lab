<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;

class EnsureAdmin
{
    public function handle(Request $request, Closure $next): mixed
    {
        if (auth()->check() && auth()->user()->role === User::ROLE_ADMIN) {
            return $next($request);
        }

        return response()->json(['message' => 'Forbidden.'], 403);
    }
}
