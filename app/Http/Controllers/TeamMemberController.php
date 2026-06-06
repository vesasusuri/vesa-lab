<?php

namespace App\Http\Controllers;

use App\Models\TeamMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TeamMemberController extends Controller
{
    public function index() {
        $members = TeamMember::orderBy('sort_order')->get()->map(function ($m) {
            return [
                'id'         => $m->id,
                'name'       => $m->name,
                'occupation' => $m->occupation,
                'bio'        => $m->bio,
                'img'        => $m->image_path ? asset('storage/' . $m->image_path) : null,
            ];
        });
        return response()->json($members);
    }

    public function store(Request $request) {
        $request->validate([
            'name'       => 'required|string|max:100',
            'occupation' => 'required|string|max:100',
            'bio'        => 'required|string',
            'image'      => 'nullable|image|max:2048',
        ]);

        $path = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('team', 'public');
        }

        $member = TeamMember::create([
            'name'       => $request->name,
            'occupation' => $request->occupation,
            'bio'        => $request->bio,
            'image_path' => $path,
            'sort_order' => 0,
        ]);

        return response()->json($member, 201);
    }

    public function update(Request $request, $id) {
        $member = TeamMember::findOrFail($id);

        $request->validate([
            'name'       => 'required|string|max:100',
            'occupation' => 'required|string|max:100',
            'bio'        => 'required|string',
            'image'      => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($member->image_path) {
                Storage::disk('public')->delete($member->image_path);
            }
            $member->image_path = $request->file('image')->store('team', 'public');
        }

        $member->name       = $request->name;
        $member->occupation = $request->occupation;
        $member->bio        = $request->bio;
        $member->save();

        return response()->json($member);
    }

    public function destroy($id) {
        $member = TeamMember::findOrFail($id);
        if ($member->image_path) {
            Storage::disk('public')->delete($member->image_path);
        }
        $member->delete();
        return response()->json(['message' => 'Deleted']);
    }
}