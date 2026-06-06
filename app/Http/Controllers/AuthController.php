<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\IssuesRefreshToken;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    use IssuesRefreshToken;

    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'email'     => ['required', 'email', 'max:255', 'unique:users,email'],
            'password'  => ['required', 'string', 'min:8', 'confirmed'],
            'role'      => ['prohibited'],
        ]);

        $user = User::query()->create([
            'name'                  => $validated['full_name'],
            'email'                 => $validated['email'],
            'password'              => $validated['password'],
            'role'                  => User::ROLE_CANDIDATE,
            'account_status'        => User::STATUS_ACTIVE,
            'first_login_completed' => true,
        ]);

        $token        = Auth::guard('api')->login($user);
        $refreshToken = $this->issueRefreshToken($user->id);

        return $this->authResponse([
            'message'       => 'Account created successfully.',
            'token'         => $token,
            'refresh_token' => $refreshToken,
            'user'          => $user,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (!$token = Auth::guard('api')->attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);
        }

        $user = Auth::guard('api')->user();

        if (!$user || !in_array($user->role, [User::ROLE_CANDIDATE, User::ROLE_HR, User::ROLE_ADMIN], true)) {
            Auth::guard('api')->logout();
            throw ValidationException::withMessages([
                'email' => ['This account is not allowed to sign in.'],
            ]);
        }

        if ($user->account_status === User::STATUS_SUSPENDED) {
            Auth::guard('api')->logout();
            throw ValidationException::withMessages([
                'email' => ['Your account has been suspended. Contact your administrator.'],
            ]);
        }

if (!$user->first_login_completed && $user->account_status === User::STATUS_PENDING) {
            Auth::guard('api')->logout();
            return response()->json(['first_login' => true, 'email' => $user->email], 200);
        }

        $user->update(['last_login_at' => now()]);

        $refreshToken = $this->issueRefreshToken($user->id);

        ActivityLog::create([
            'user_id'     => $user->id,
            'action'      => 'login',
            'description' => "User logged in: {$user->email}",
            'ip'          => $request->ip(),
        ]);

        return $this->authResponse([
            'message'       => 'Logged in successfully.',
            'token'         => $token,
            'refresh_token' => $refreshToken,
            'user'          => $user,
        ]);
    }

    public function refresh(Request $request): JsonResponse
    {
        $raw = $request->input('refresh_token');

        if (!$raw) {
            return response()->json(['message' => 'Refresh token required.'], 401);
        }

        $record = \App\Models\RefreshToken::where('token', hash('sha256', $raw))->first();

        if (!$record || $record->isExpired()) {
            return response()->json(['message' => 'Session expired. Please sign in again.'], 401);
        }

        $user         = $record->user;
        $newToken     = Auth::guard('api')->login($user);
        $refreshToken = $this->issueRefreshToken($user->id);

        return $this->authResponse([
            'message'       => 'Token refreshed.',
            'token'         => $newToken,
            'refresh_token' => $refreshToken,
            'user'          => $user,
        ]);
    }

    public function logout(): JsonResponse
    {
        $user = Auth::guard('api')->user();

        if ($user) {
            \App\Models\RefreshToken::where('user_id', $user->id)->delete();
        }

        Auth::guard('api')->logout();

        return response()->json(['message' => 'Logged out successfully.']);
    }

    public function user(): JsonResponse
    {
        return response()->json(['user' => Auth::guard('api')->user()]);
    }

    private function authResponse(array $payload, int $status = 200): JsonResponse
    {
        $expiresIn = $this->tokenTtlSeconds();

        return response()->json([
            ...$payload,
            'token_type' => 'bearer',
            'expires_in' => $expiresIn,
            'expires_at' => now()->addSeconds($expiresIn)->toIso8601String(),
        ], $status);
    }
}
