<?php

namespace App\Http\Controllers;

use App\Models\JobApplication;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class HiresController extends Controller
{
    public function index(): JsonResponse
    {
        $user = Auth::guard('api')->user();

        $hires = JobApplication::with(['candidate', 'jobListing.user'])
            ->whereHas('jobListing', fn ($q) => $q->where('user_id', $user->id))
            ->where('status', JobApplication::STATUS_HIRED)
            ->orderByDesc('hired_at')
            ->get()
            ->map(fn ($a) => $this->format($a));

        return response()->json(['hires' => $hires]);
    }

    public function destroy(JobApplication $application): JsonResponse
    {
        $user = Auth::guard('api')->user();

        if ($application->jobListing->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $application->update([
            'status'    => JobApplication::STATUS_SHORTLISTED,
            'hired_at'  => null,
        ]);

        return response()->json(['message' => 'Hire removed.']);
    }

    private function format(JobApplication $a): array
    {
        $candidate  = $a->candidate;
        $listing    = $a->jobListing;
        $hiredBy    = $listing?->user;
        $name       = $candidate?->name ?? 'Unknown';
        $nameParts  = explode(' ', trim($name));
        $initials   = strtoupper(
            ($nameParts[0][0] ?? '') . ($nameParts[1][0] ?? $nameParts[0][1] ?? '')
        );

        $hiredAt = $a->hired_at ?? $a->updated_at;
        $daysAgo = $hiredAt ? now()->diffInDays($hiredAt) : 999;
        $status  = $daysAgo <= 30 ? 'Starting Soon' : 'Active';

        return [
            'id'              => $a->id,
            'name'            => $name,
            'role'            => $listing?->title ?? '—',
            'initials'        => $initials,
            'status'          => $status,
            'hired_at'        => $hiredAt?->toIso8601String(),
            'email'           => $candidate?->email,
            'location'        => $listing?->location ?? '—',
            'salary'          => $listing?->salary ?? '—',
            'employment_type' => $listing?->type ?? ($listing?->types[0] ?? 'Full-time'),
            'company'         => $listing?->company ?? '—',
            'hired_by'        => $hiredBy ? $hiredBy->name : '—',
        ];
    }
}
