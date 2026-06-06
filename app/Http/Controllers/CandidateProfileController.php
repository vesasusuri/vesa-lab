<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateCandidateProfileRequest;
use App\Http\Requests\UploadCandidateAvatarRequest;
use App\Models\User;
use App\Services\CvProfileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CandidateProfileController extends Controller
{
    public function __construct(
        private readonly CvProfileService $cvProfileService,
    ) {
    }

    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        $this->ensureCandidate($user);

        $profile = $this->cvProfileService->loadForUser($user);

        return response()->json([
            'profile' => $this->cvProfileService->toDashboardPayload($user, $profile),
        ]);
    }

    public function update(UpdateCandidateProfileRequest $request): JsonResponse
    {
        $user = $request->user();
        $this->ensureCandidate($user);

        $profile = $this->cvProfileService->updateDashboard($user, $request->validated());

        return response()->json([
            'message' => 'Profile saved successfully.',
            'profile' => $this->cvProfileService->toDashboardPayload($user->fresh(), $profile),
        ]);
    }

    public function uploadAvatar(UploadCandidateAvatarRequest $request): JsonResponse
    {
        $user = $request->user();
        $this->ensureCandidate($user);

        $profile = $this->cvProfileService->updateAvatar($user, $request->file('avatar'));

        return response()->json([
            'message' => 'Profile photo updated.',
            'profile' => $this->cvProfileService->toDashboardPayload($user->fresh(), $profile),
        ]);
    }

    public function destroy(Request $request): JsonResponse
    {
        $user = $request->user();
        $this->ensureCandidate($user);

        $this->cvProfileService->resetDashboard($user);

        return response()->json([
            'message' => 'Profile information cleared.',
            'profile' => $this->cvProfileService->toDashboardPayload($user->fresh(), null),
        ]);
    }

    private function ensureCandidate(User $user): void
    {
        if (!$user->isCandidate()) {
            abort(403, 'Only candidates can manage this profile.');
        }
    }
}
