<?php

namespace App\Http\Controllers;

use App\Models\Interview;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class InterviewController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $this->authorize('viewAny', Interview::class);

        $query = Interview::query()
            ->with(['hrUser:id,name,email', 'candidateUser:id,name,email'])
            ->orderByDesc('scheduled_at');

        if ($user->role === User::ROLE_HR) {
            $query->where('hr_user_id', $user->id);
        } elseif ($user->role === User::ROLE_CANDIDATE) {
            $query->where('candidate_user_id', $user->id);
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $interviews = $query->get()->map(fn (Interview $i) => $i->toApiArray());

        return response()->json(['interviews' => $interviews]);
    }

    public function candidates(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!in_array($user->role, [User::ROLE_HR, User::ROLE_ADMIN], true)) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $candidates = User::query()
            ->with(['candidateInterviews' => function ($query) use ($user) {
                $query
                    ->select([
                        'id',
                        'candidate_user_id',
                        'hr_user_id',
                        'title',
                        'company',
                        'application_id',
                        'scheduled_at',
                        'status',
                    ])
                    ->when($user->role === User::ROLE_HR, fn ($q) => $q->where('hr_user_id', $user->id))
                    ->latest('scheduled_at');
            }])
            ->where('role', User::ROLE_CANDIDATE)
            ->orderBy('name')
            ->get(['id', 'name', 'email'])
            ->map(function (User $u) {
                $latestInterview = $u->candidateInterviews->first();

                return [
                    'id' => $u->id,
                    '_id' => $u->id,
                    'userId' => $u->id,
                    'candidate_user_id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'initials' => $this->initials($u->name),
                    'interviews_count' => $u->candidateInterviews->count(),
                    'latest_interview' => $latestInterview ? [
                        'id' => $latestInterview->id,
                        'title' => $latestInterview->title,
                        'company' => $latestInterview->company,
                        'application_id' => $latestInterview->application_id,
                        'scheduled_at' => $latestInterview->scheduled_at?->toIso8601String(),
                        'status' => $latestInterview->status,
                    ] : null,
                ];
            })
            ->values();

        return response()->json(['candidates' => $candidates]);
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', Interview::class);

        $validated = $request->validate([
            'candidate_user_id' => ['required', 'integer', 'exists:users,id'],
            'title' => ['required', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'application_id' => ['nullable', 'integer'],
            'scheduled_at' => ['required', 'date'],
            'duration_minutes' => ['nullable', 'integer', 'min:15', 'max:480'],
            'type' => ['required', Rule::in([
                Interview::TYPE_VIDEO,
                Interview::TYPE_IN_PERSON,
                Interview::TYPE_PHONE,
            ])],
            'location' => ['nullable', 'string', 'max:255'],
            'interviewer_name' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:5000'],
            'metadata' => ['nullable', 'array'],
        ]);

        $candidate = User::query()->findOrFail($validated['candidate_user_id']);

        if ($candidate->role !== User::ROLE_CANDIDATE) {
            return response()->json([
                'message' => 'The selected user must be a candidate.',
            ], 422);
        }

        $interview = Interview::query()->create([
            'hr_user_id' => $request->user()->id,
            'candidate_user_id' => $candidate->id,
            'title' => $validated['title'],
            'company' => $validated['company'] ?? null,
            'application_id' => $validated['application_id'] ?? null,
            'scheduled_at' => $validated['scheduled_at'],
            'duration_minutes' => $validated['duration_minutes'] ?? 60,
            'type' => $validated['type'],
            'status' => Interview::STATUS_SCHEDULED,
            'location' => $validated['location'] ?? null,
            'interviewer_name' => $validated['interviewer_name'] ?? $request->user()->name,
            'notes' => $validated['notes'] ?? null,
            'metadata' => $validated['metadata'] ?? null,
        ]);

        $interview->load(['hrUser:id,name,email', 'candidateUser:id,name,email']);

        return response()->json([
            'message' => 'Interview scheduled successfully.',
            'interview' => $interview->toApiArray(),
        ], 201);
    }

    public function show(Request $request, Interview $interview): JsonResponse
    {
        $this->authorize('view', $interview);

        $interview->load(['hrUser:id,name,email', 'candidateUser:id,name,email']);

        return response()->json(['interview' => $interview->toApiArray()]);
    }

    public function update(Request $request, Interview $interview): JsonResponse
    {
        $this->authorize('update', $interview);

        $validated = $request->validate([
            'candidate_user_id' => ['sometimes', 'integer', 'exists:users,id'],
            'title' => ['sometimes', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'scheduled_at' => ['sometimes', 'date'],
            'duration_minutes' => ['nullable', 'integer', 'min:15', 'max:480'],
            'type' => ['sometimes', Rule::in([
                Interview::TYPE_VIDEO,
                Interview::TYPE_IN_PERSON,
                Interview::TYPE_PHONE,
            ])],
            'status' => ['sometimes', Rule::in([
                Interview::STATUS_SCHEDULED,
                Interview::STATUS_IN_PROGRESS,
                Interview::STATUS_COMPLETED,
                Interview::STATUS_CANCELLED,
                Interview::STATUS_RESCHEDULED,
            ])],
            'location' => ['nullable', 'string', 'max:255'],
            'interviewer_name' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:5000'],
            'metadata' => ['nullable', 'array'],
            'reschedule' => ['nullable', 'boolean'],
        ]);

        if (isset($validated['candidate_user_id'])) {
            $candidate = User::query()->findOrFail($validated['candidate_user_id']);
            if ($candidate->role !== User::ROLE_CANDIDATE) {
                return response()->json([
                    'message' => 'The selected user must be a candidate.',
                ], 422);
            }
        }

        if (!empty($validated['reschedule']) && isset($validated['scheduled_at'])) {
            $validated['status'] = Interview::STATUS_RESCHEDULED;
        }

        unset($validated['reschedule']);

        $interview->update($validated);
        $interview->load(['hrUser:id,name,email', 'candidateUser:id,name,email']);

        return response()->json([
            'message' => 'Interview updated successfully.',
            'interview' => $interview->toApiArray(),
        ]);
    }

    public function destroy(Request $request, Interview $interview): JsonResponse
    {
        $this->authorize('delete', $interview);

        $interview->delete();

        return response()->json(['message' => 'Interview deleted successfully.']);
    }

    public function roomAccess(Request $request, string $token): JsonResponse
    {
        $interview = Interview::query()
            ->where('access_token', $token)
            ->with(['hrUser:id,name,email', 'candidateUser:id,name,email'])
            ->firstOrFail();

        $this->authorize('join', $interview);

        if ($interview->status === Interview::STATUS_CANCELLED) {
            return response()->json([
                'message' => 'This interview has been cancelled.',
            ], 403);
        }

        if ($interview->status === Interview::STATUS_SCHEDULED) {
            $interview->update(['status' => Interview::STATUS_IN_PROGRESS]);
        }

        $payload = $interview->toApiArray();
        $payload['jitsi_domain'] = 'meet.jit.si';
        $payload['authorized'] = true;

        return response()->json(['interview' => $payload]);
    }

    private function initials(string $name): string
    {
        $parts = preg_split('/\s+/', trim($name)) ?: [];

        return strtoupper(collect($parts)->take(2)->map(fn ($p) => substr($p, 0, 1))->implode(''));
    }
}
