<?php

namespace App\Http\Controllers;

use App\Models\SavedJob;
use App\Models\JobListing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SavedJobController extends Controller
{
    
    public function index(Request $request): JsonResponse
    {
        $saved = SavedJob::with('jobListing')
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();

        $ids = $saved->pluck('job_listing_id');

        $jobs = $saved
            ->filter(fn($s) => $s->jobListing !== null)
            ->map(fn($s) => [
                'saved_job_id'   => $s->id,
                'job_listing_id' => $s->job_listing_id,
                'title'          => $s->jobListing->title,
                'company'        => $s->jobListing->company,
                'location'       => $s->jobListing->location ?? '—',
                'salary'         => $s->jobListing->salary   ?? '—',
                'type'           => $s->jobListing->type     ?? '',
                'saved_at'       => $s->created_at->format('M d, Y'),
            ])
            ->values();

        return response()->json([
            'saved_job_ids' => $ids,
            'saved_jobs'    => $jobs,
        ]);
    }

public function store(Request $request): JsonResponse
    {
        $request->validate(['job_listing_id' => 'required|integer|exists:job_listings,id']);

        SavedJob::firstOrCreate([
            'user_id'        => $request->user()->id,
            'job_listing_id' => $request->job_listing_id,
        ]);

        return response()->json(['saved' => true]);
    }

public function destroy(Request $request, $jobListingId): JsonResponse
    {
        SavedJob::where('user_id', $request->user()->id)
            ->where('job_listing_id', $jobListingId)
            ->delete();

        return response()->json(['saved' => false]);
    }
}
