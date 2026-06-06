<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\IssuesRefreshToken;
use App\Mail\VerificationCodeMail;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

class FirstLoginController extends Controller
{
    use IssuesRefreshToken;

public function sendCode(Request $request): JsonResponse
    {
        $request->validate([
            'email'         => 'required|email',
            'temp_password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->temp_password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials.'], 401);
        }

        if ($user->first_login_completed) {
            return response()->json(['message' => 'Account already activated. Please use the standard login.'], 422);
        }

        if ($user->account_status === User::STATUS_SUSPENDED) {
            return response()->json(['message' => 'This account has been suspended. Contact your administrator.'], 403);
        }

        $code            = str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT);
        $onboardingToken = Str::random(64);

        $user->update([
            'verification_code'             => $code,
            'verification_code_expires_at'  => now()->addMinutes(10),
            'onboarding_token'              => $onboardingToken,
            'onboarding_token_expires_at'   => now()->addHours(2),
        ]);

        Mail::to($user->email)->send(new VerificationCodeMail($user, $code));

        ActivityLog::create([
            'user_id'     => $user->id,
            'action'      => 'first_login_code_sent',
            'description' => "Verification code sent to {$user->email}",
            'ip'          => $request->ip(),
        ]);

        return response()->json(['onboarding_token' => $onboardingToken]);
    }

public function verifyCode(Request $request): JsonResponse
    {
        $request->validate([
            'onboarding_token' => 'required|string',
            'code'             => 'required|string|size:4',
        ]);

        $user = User::where('onboarding_token', $request->onboarding_token)->first();

        if (!$user || now()->isAfter($user->onboarding_token_expires_at)) {
            return response()->json(['message' => 'Session expired. Please start over.'], 401);
        }

        if ($user->verification_code !== $request->code) {
            return response()->json(['message' => 'Incorrect verification code.'], 422);
        }

        if (now()->isAfter($user->verification_code_expires_at)) {
            return response()->json(['message' => 'Verification code has expired. Please request a new one.'], 422);
        }

        $user->update([
            'verification_code'             => null,
            'verification_code_expires_at'  => null,
        ]);

        ActivityLog::create([
            'user_id'     => $user->id,
            'action'      => 'first_login_code_verified',
            'description' => "Verification code verified for {$user->email}",
            'ip'          => $request->ip(),
        ]);

        return response()->json(['onboarding_token' => $request->onboarding_token]);
    }

public function setPassword(Request $request): JsonResponse
    {
        $request->validate([
            'onboarding_token'      => 'required|string',
            'password'              => ['required', 'string', 'confirmed',
                Password::min(8)->mixedCase()->numbers()->symbols()],
            'password_confirmation' => 'required|string',
        ]);

        $user = User::where('onboarding_token', $request->onboarding_token)->first();

        if (!$user || now()->isAfter($user->onboarding_token_expires_at)) {
            return response()->json(['message' => 'Session expired. Please start over.'], 401);
        }

        $user->update([
            'password'                    => $request->password,
            'first_login_completed'       => true,
            'account_status'              => User::STATUS_ACTIVE,
            'password_changed_at'         => now(),
            'last_login_at'               => now(),
            'onboarding_token'            => null,
            'onboarding_token_expires_at' => null,
        ]);

        $token        = Auth::guard('api')->login($user);
        $refreshToken = $this->issueRefreshToken($user->id);
        $expiresIn    = $this->tokenTtlSeconds();

        ActivityLog::create([
            'user_id'     => $user->id,
            'action'      => 'first_login_completed',
            'description' => "Account activated for {$user->email}",
            'ip'          => $request->ip(),
        ]);

        return response()->json([
            'message'       => 'Password set successfully. Account activated.',
            'token'         => $token,
            'refresh_token' => $refreshToken,
            'token_type'    => 'bearer',
            'expires_in'    => $expiresIn,
            'expires_at'    => now()->addSeconds($expiresIn)->toIso8601String(),
            'user'          => $user->fresh(),
        ]);
    }

public function resendCode(Request $request): JsonResponse
    {
        $request->validate(['onboarding_token' => 'required|string']);

        $user = User::where('onboarding_token', $request->onboarding_token)->first();

        if (!$user || now()->isAfter($user->onboarding_token_expires_at)) {
            return response()->json(['message' => 'Session expired. Please start over.'], 401);
        }

        $code = str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT);

        $user->update([
            'verification_code'            => $code,
            'verification_code_expires_at' => now()->addMinutes(10),
        ]);

        Mail::to($user->email)->send(new VerificationCodeMail($user, $code));

        return response()->json(['message' => 'New code sent to your email.']);
    }
}
