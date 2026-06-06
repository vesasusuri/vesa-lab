<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->ensureCandidate($request);

        $notifications = Notification::query()
            ->where('user_id', $request->user()->id)
            ->where('type', Notification::TYPE_APPLICATION_STATUS)
            ->latest()
            ->limit(30)
            ->get()
            ->map(fn (Notification $n) => $n->toApiArray());

        return response()->json(['notifications' => $notifications]);
    }

    public function unreadCount(Request $request): JsonResponse
    {
        $this->ensureCandidate($request);

        $count = Notification::query()
            ->where('user_id', $request->user()->id)
            ->where('type', Notification::TYPE_APPLICATION_STATUS)
            ->whereNull('read_at')
            ->count();

        return response()->json(['unread_count' => $count]);
    }

    public function markRead(Request $request, Notification $notification): JsonResponse
    {
        $this->ensureCandidate($request);

        if ($notification->user_id !== $request->user()->id
            || $notification->type !== Notification::TYPE_APPLICATION_STATUS) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $notification->markAsRead();

        return response()->json(['notification' => $notification->fresh()->toApiArray()]);
    }

    public function markAllRead(Request $request): JsonResponse
    {
        $this->ensureCandidate($request);

        Notification::query()
            ->where('user_id', $request->user()->id)
            ->where('type', Notification::TYPE_APPLICATION_STATUS)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['message' => 'All notifications marked as read.']);
    }

    private function ensureCandidate(Request $request): void
    {
        if (!$request->user()?->isCandidate()) {
            abort(403, 'Notifications are only available for candidate accounts.');
        }
    }
}
