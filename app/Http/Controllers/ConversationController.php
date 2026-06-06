<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\JobApplication;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ConversationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $conversations = Conversation::query()
            ->with(['candidate', 'hr', 'latestMessage'])
            ->withMax('messages as last_message_at', 'created_at')
            ->where(function ($query) use ($user) {
                $query->where('candidate_user_id', $user->id)
                    ->orWhere('hr_user_id', $user->id);
            })
            ->orderByDesc('last_message_at')
            ->get();

        return response()->json([
            'conversations' => $conversations->map(fn (Conversation $conversation) => $this->formatConversationSummary($conversation, $user)),
        ]);
    }

    public function messageableCandidates(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isHr()) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $existingIds = Conversation::query()
            ->where('hr_user_id', $user->id)
            ->pluck('candidate_user_id');

        $candidates = User::query()
            ->where('role', User::ROLE_CANDIDATE)
            ->whereHas('candidateApplications.jobListing', fn ($query) => $query->where('user_id', $user->id))
            ->when($existingIds->isNotEmpty(), fn ($query) => $query->whereNotIn('id', $existingIds))
            ->orderBy('name')
            ->get(['id', 'name', 'email'])
            ->map(fn (User $candidate) => [
                'id' => $candidate->id,
                'name' => $candidate->name,
                'email' => $candidate->email,
                'initials' => $this->initials($candidate->name),
            ])
            ->values();

        return response()->json(['candidates' => $candidates]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->isHr()) {
            $validated = $request->validate([
                'candidate_user_id' => ['required', 'integer', 'exists:users,id'],
            ]);

            $candidate = User::query()->findOrFail($validated['candidate_user_id']);
            if (!$candidate->isCandidate()) {
                throw ValidationException::withMessages([
                    'candidate_user_id' => ['The selected user is not a candidate.'],
                ]);
            }

            if (!$this->hrCanMessageCandidate($user, $candidate)) {
                return response()->json([
                    'message' => 'You can only message candidates who applied to your job listings.',
                ], 403);
            }

            $conversation = Conversation::query()->firstOrCreate([
                'candidate_user_id' => $candidate->id,
                'hr_user_id' => $user->id,
            ]);
        } elseif ($user->isCandidate()) {
            return response()->json([
                'message' => 'Only HR can start a conversation. You can reply after a recruiter messages you.',
            ], 403);
        } else {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $conversation->load(['candidate', 'hr', 'latestMessage']);

        return response()->json([
            'conversation' => $this->formatConversationSummary($conversation, $user),
        ], 201);
    }

    public function messages(Request $request, Conversation $conversation): JsonResponse
    {
        $user = $request->user();

        if (!$conversation->involvesUser($user)) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        Message::query()
            ->where('conversation_id', $conversation->id)
            ->where('sender_id', '!=', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        $messages = $conversation->messages()
            ->orderBy('created_at')
            ->get();

        return response()->json([
            'messages' => $messages->map(fn (Message $message) => $this->formatMessage($message, $user)),
        ]);
    }

    public function storeMessage(Request $request, Conversation $conversation): JsonResponse
    {
        $user = $request->user();

        if (!$conversation->involvesUser($user)) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $validated = $request->validate([
            'body' => ['required', 'string', 'max:5000'],
        ]);

        $message = $conversation->messages()->create([
            'sender_id' => $user->id,
            'body' => trim($validated['body']),
        ]);

        $message->load('sender');

        return response()->json([
            'message' => $this->formatMessage($message, $user),
        ], 201);
    }

    private function hrCanMessageCandidate(User $hr, User $candidate): bool
    {
        return JobApplication::query()
            ->where('candidate_user_id', $candidate->id)
            ->whereHas('jobListing', fn ($query) => $query->where('user_id', $hr->id))
            ->exists();
    }

    private function formatConversationSummary(Conversation $conversation, User $user): array
    {
        $other = $conversation->otherParticipant($user);
        $name = $other?->name ?? 'Unknown';
        $latest = $conversation->latestMessage;

        $unread = Message::query()
            ->where('conversation_id', $conversation->id)
            ->where('sender_id', '!=', $user->id)
            ->whereNull('read_at')
            ->count();

        return [
            'id' => $conversation->id,
            'name' => $name,
            'role' => $other?->role === User::ROLE_CANDIDATE ? 'Candidate' : ($other?->role ?? ''),
            'initials' => $this->initials($name),
            'lastMessage' => $latest?->body ?? '',
            'time' => $latest ? $this->formatRelativeTime($latest->created_at) : '',
            'unread' => $unread,
            'other_user_id' => $other?->id,
        ];
    }

    private function formatMessage(Message $message, User $user): array
    {
        return [
            'id' => $message->id,
            'from' => (int) $message->sender_id === (int) $user->id ? 'me' : 'them',
            'text' => $message->body,
            'time' => $message->created_at->format('H:i'),
        ];
    }

    private function initials(string $name): string
    {
        $parts = preg_split('/\s+/', trim($name)) ?: [];

        return strtoupper(implode('', array_map(fn ($word) => mb_substr($word, 0, 1), array_slice($parts, 0, 2)))) ?: '?';
    }

    private function formatRelativeTime(\DateTimeInterface $date): string
    {
        $at = \Carbon\Carbon::parse($date);

        if ($at->isToday()) {
            return $at->format('H:i');
        }

        if ($at->isYesterday()) {
            return 'Yesterday';
        }

        if ($at->greaterThan(now()->subDays(7))) {
            return $at->format('D');
        }

        return $at->format('M j');
    }
}
