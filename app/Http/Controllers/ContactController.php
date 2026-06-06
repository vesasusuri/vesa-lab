<?php

namespace App\Http\Controllers;

use App\Models\ContactSubmission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index(): JsonResponse
    {
        $submissions = ContactSubmission::latest()->get();

        return response()->json(['submissions' => $submissions]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'firstName' => ['required', 'string', 'max:255'],
            'lastName'  => ['required', 'string', 'max:255'],
            'email'     => ['required', 'email', 'max:255'],
            'notes'     => ['required', 'string', 'max:5000'],
        ]);

        ContactSubmission::create([
            'first_name' => $validated['firstName'],
            'last_name'  => $validated['lastName'],
            'email'      => $validated['email'],
            'notes'      => $validated['notes'],
        ]);

        return response()->json(['message' => 'Message sent successfully.'], 201);
    }
}
