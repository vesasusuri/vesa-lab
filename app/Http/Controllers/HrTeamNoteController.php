<?php

namespace App\Http\Controllers;

use App\Models\HrTeamNote;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HrTeamNoteController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $notes = HrTeamNote::where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json($notes);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'content'   => 'required|string|max:1000',
            'from_name' => 'nullable|string|max:100',
            'to_name'   => 'nullable|string|max:100',
        ]);

        $note = HrTeamNote::create([
            'user_id'   => $request->user()->id,
            'from_name' => $request->from_name ?? '',
            'to_name'   => $request->to_name   ?? '',
            'content'   => $request->content,
            'done'      => false,
        ]);

        return response()->json($note, 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $note = HrTeamNote::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $request->validate([
            'content'   => 'sometimes|string|max:1000',
            'from_name' => 'sometimes|nullable|string|max:100',
            'to_name'   => 'sometimes|nullable|string|max:100',
            'done'      => 'sometimes|boolean',
        ]);

        $note->update($request->only(['content', 'from_name', 'to_name', 'done']));

        return response()->json($note);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $note = HrTeamNote::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $note->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
