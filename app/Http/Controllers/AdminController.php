<?php

namespace App\Http\Controllers;

use App\Mail\HrInvitationMail;
use App\Models\ActivityLog;
use App\Models\JobApplication;
use App\Models\JobListing;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AdminController extends Controller
{

public function stats(): JsonResponse
    {
        return response()->json([
            'total_users'        => User::count(),
            'hr_users'           => User::where('role', User::ROLE_HR)->count(),
            'active_hr'          => User::where('role', User::ROLE_HR)->where('account_status', User::STATUS_ACTIVE)->count(),
            'pending_hr'         => User::where('role', User::ROLE_HR)->where('account_status', User::STATUS_PENDING)->count(),
            'suspended_hr'       => User::where('role', User::ROLE_HR)->where('account_status', User::STATUS_SUSPENDED)->count(),
            'total_jobs'         => JobListing::count(),
            'active_jobs'        => JobListing::where('status', 'active')->count(),
            'total_applications' => JobApplication::count(),
            'total_hired'        => JobApplication::where('status', 'hired')->count(),
        ]);
    }

public function index(Request $request): JsonResponse
    {
        $query = User::where('role', User::ROLE_HR);

        if ($request->filled('status')) {
            $query->where('account_status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search): void {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%")
                  ->orWhere('company', 'LIKE', "%{$search}%");
            });
        }

        $hrUsers = $query->orderByDesc('created_at')->paginate(20);

        return response()->json(['hr_users' => $hrUsers]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email|unique:users,email',
            'company' => 'nullable|string|max:255',
        ]);

        $tempPassword = Str::random(12);

        $user = User::create([
            'name'                  => $validated['name'],
            'email'                 => $validated['email'],
            'company'               => $validated['company'] ?? null,
            'password'              => $tempPassword,
            'role'                  => User::ROLE_HR,
            'account_status'        => User::STATUS_PENDING,
            'first_login_completed' => false,
            'invited_by'            => auth()->id(),
        ]);

        Mail::to($user->email)->send(new HrInvitationMail($user, $tempPassword));

        ActivityLog::create([
            'user_id'     => auth()->id(),
            'action'      => 'hr_user_created',
            'description' => "Created HR user: {$user->email}",
            'ip'          => $request->ip(),
        ]);

        return response()->json(['hr_user' => $user], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name'    => 'sometimes|required|string|max:255',
            'company' => 'sometimes|nullable|string|max:255',
        ]);

        $user->fill($validated)->save();

        ActivityLog::create([
            'user_id'     => auth()->id(),
            'action'      => 'hr_user_updated',
            'description' => "Updated HR user: {$user->email}",
            'ip'          => $request->ip(),
        ]);

        return response()->json(['hr_user' => $user]);
    }

    public function deactivate(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $user->update(['account_status' => User::STATUS_SUSPENDED]);

        ActivityLog::create([
            'user_id'     => auth()->id(),
            'action'      => 'hr_user_deactivated',
            'description' => "Suspended HR user: {$user->email}",
            'ip'          => $request->ip(),
        ]);

        return response()->json(['hr_user' => $user]);
    }

    public function reactivate(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $user->update(['account_status' => User::STATUS_ACTIVE]);

        ActivityLog::create([
            'user_id'     => auth()->id(),
            'action'      => 'hr_user_reactivated',
            'description' => "Reactivated HR user: {$user->email}",
            'ip'          => $request->ip(),
        ]);

        return response()->json(['hr_user' => $user]);
    }

    public function resetPassword(Request $request, int $id): JsonResponse
    {
        $user         = User::findOrFail($id);
        $tempPassword = Str::random(12);

        $user->update([
            'password'                    => $tempPassword,
            'first_login_completed'       => false,
            'account_status'              => User::STATUS_PENDING,
            'password_changed_at'         => null,
            'onboarding_token'            => null,
            'onboarding_token_expires_at' => null,
        ]);

        Mail::to($user->email)->send(new HrInvitationMail($user, $tempPassword));

        ActivityLog::create([
            'user_id'     => auth()->id(),
            'action'      => 'hr_password_reset',
            'description' => "Reset password for HR user: {$user->email}",
            'ip'          => $request->ip(),
        ]);

        return response()->json(['message' => 'Password reset. Invitation email sent.']);
    }

public function logs(Request $request): JsonResponse
    {
        $query = ActivityLog::with('user:id,name,email');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search): void {
                $q->where('action', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%")
                  ->orWhere('ip', 'LIKE', "%{$search}%");
            });
        }

        $logs = $query->orderByDesc('created_at')->paginate(50);

        return response()->json(['logs' => $logs]);
    }
}
