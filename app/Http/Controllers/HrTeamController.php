<?php

namespace App\Http\Controllers;

use App\Models\HrTeamMember;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class HrTeamController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $members = HrTeamMember::where('user_id', $request->user()->id)
            ->orderBy('created_at')
            ->get()
            ->map(fn($m) => $this->format($m));

        return response()->json($members);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name'  => 'required|string|max:100',
            'title' => 'nullable|string|max:100',
            'photo' => 'nullable|image|max:2048',
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('hr-team', 'public');
        }

        $member = HrTeamMember::create([
            'user_id'    => $request->user()->id,
            'name'       => $request->name,
            'title'      => $request->title ?? 'Team Member',
            'photo_path' => $photoPath,
        ]);

        return response()->json($this->format($member), 201);
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        $member = HrTeamMember::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        if ($member->photo_path) {
            Storage::disk('public')->delete($member->photo_path);
        }

        $member->delete();

        return response()->json(['message' => 'Deleted']);
    }

    private function format(HrTeamMember $m): array
    {
        return [
            'id'    => $m->id,
            'name'  => $m->name,
            'title' => $m->title,
            'photo' => $m->photo_path ? asset('storage/' . $m->photo_path) : null,
        ];
    }
}
