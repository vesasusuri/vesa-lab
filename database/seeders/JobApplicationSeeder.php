<?php

namespace Database\Seeders;

use App\Models\JobApplication;
use App\Models\JobListing;
use App\Models\User;
use Illuminate\Database\Seeder;

class JobApplicationSeeder extends Seeder
{
    public function run(): void
    {
        $hr = User::query()->where('email', 'hr@beehired.com')->first();
        $alex = User::query()->where('email', 'alex.rivera@email.com')->first();
        $fatima = User::query()->where('email', 'fatima.alzahra@email.com')->first();

        if (!$hr) {
            return;
        }

        $jobs = JobListing::query()
            ->where('user_id', $hr->id)
            ->orderBy('id')
            ->limit(3)
            ->get();

        if ($jobs->isEmpty()) {
            return;
        }

        $applicants = array_filter([$alex, $fatima]);

        foreach ($applicants as $index => $candidate) {
            if (!$candidate) {
                continue;
            }

            $job = $jobs[$index % $jobs->count()];

            JobApplication::query()->updateOrCreate(
                [
                    'candidate_user_id' => $candidate->id,
                    'job_listing_id' => $job->id,
                ],
                [
                    'status' => JobApplication::STATUS_REVIEWING,
                ]
            );
        }
    }
}
