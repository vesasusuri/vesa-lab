<?php

namespace App\Http\Controllers;

use App\Models\Interview;
use App\Models\JobApplication;
use App\Models\JobListing;
use App\Models\User;
use App\Services\ApplicationNotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class HrController extends Controller
{
    public function __construct(
        private readonly ApplicationNotificationService $applicationNotifications,
    ) {
    }

private function ownedJobIds(Request $request): Collection
    {
        return JobListing::where('user_id', $request->user()->id)->pluck('id');
    }

public function overviewStats(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $jobIds = $this->ownedJobIds($request);

        $totalJobs    = JobListing::where('user_id', $userId)->where('status', 'active')->count();
        $totalApps    = JobApplication::whereIn('job_listing_id', $jobIds)->count();
        $newAppsWeek  = JobApplication::whereIn('job_listing_id', $jobIds)
                            ->where('created_at', '>=', now()->subWeek())
                            ->count();
        $interviews   = Interview::where('hr_user_id', $userId)->count();
        $interviewsWeek = Interview::where('hr_user_id', $userId)
                            ->where('created_at', '>=', now()->subWeek())
                            ->count();
        $hiresMonth   = JobApplication::whereIn('job_listing_id', $jobIds)
                            ->where('status', 'hired')
                            ->where('updated_at', '>=', now()->startOfMonth())
                            ->count();

        return response()->json([
            'stats' => [
                [
                    'id'    => 'postings',
                    'label' => 'Active Postings',
                    'value' => $totalJobs,
                    'sub'   => $totalJobs === 0 ? 'No active listings' : 'Currently live',
                    'icon'  => 'FiClipboard',
                ],
                [
                    'id'    => 'applications',
                    'label' => 'Applications',
                    'value' => $totalApps,
                    'sub'   => $newAppsWeek > 0 ? "+{$newAppsWeek} this week" : 'No new this week',
                    'icon'  => 'FiInbox',
                ],
                [
                    'id'    => 'interviews',
                    'label' => 'Interviews Set',
                    'value' => $interviews,
                    'sub'   => $interviewsWeek > 0 ? "{$interviewsWeek} this week" : 'None this week',
                    'icon'  => 'FiCalendar',
                ],
                [
                    'id'    => 'hires',
                    'label' => 'Hires This Month',
                    'value' => $hiresMonth,
                    'sub'   => $hiresMonth > 0 ? 'Great progress!' : 'None yet this month',
                    'icon'  => 'FiCheckCircle',
                ],
            ],
        ]);
    }

public function applications(Request $request): JsonResponse
    {
        $jobIds = $this->ownedJobIds($request);

        $apps = JobApplication::with([
                'candidate.cvProfile.skills',
                'candidate.cvProfile.experiences',
                'candidate.latestResume',
                'jobListing',
            ])
            ->whereIn('job_listing_id', $jobIds)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($a) => $this->mapApplication($a));

        return response()->json(['applications' => $apps]);
    }

    public function updateApplication(Request $request, $id): JsonResponse
    {
        $app = JobApplication::findOrFail($id);

if ($app->jobListing?->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $request->validate(['status' => 'required|in:reviewing,shortlisted,hired,rejected']);

        $previousStatus = $app->status;
        $app->status = $request->status;

        if ($app->status === JobApplication::STATUS_HIRED) {
            $app->hired_at = now();
        }

        $app->save();

        $this->applicationNotifications->notifyStatusChange($app, $previousStatus);

        return response()->json([
            'application' => $this->mapApplication(
                $app->fresh(['candidate.cvProfile.skills', 'candidate.cvProfile.experiences', 'candidate.latestResume', 'jobListing'])
            ),
        ]);
    }

public function jobApplicants(Request $request, $jobListingId): JsonResponse
    {
        $listing = JobListing::where('id', $jobListingId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $apps = JobApplication::with([
                'candidate.cvProfile.skills',
                'candidate.cvProfile.experiences',
                'candidate.latestResume',
                'jobListing',
            ])
            ->where('job_listing_id', $listing->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($a) => $this->mapApplication($a));

        return response()->json([
            'job'          => ['id' => $listing->id, 'title' => $listing->title],
            'applications' => $apps,
        ]);
    }

public function candidateProfile(Request $request, $userId): JsonResponse
    {
        if (!$this->hrCanViewCandidate($request, (int) $userId)) {
            return response()->json(['message' => 'Candidate not found.'], 404);
        }

        $user = User::with([
            'cvProfile.skills',
            'cvProfile.experiences',
            'cvProfile.education',
            'cvProfile.languages',
            'cvProfile.projects',
            'cvProfile.certifications',
            'latestResume',
        ])->findOrFail($userId);

        $cv = $user->cvProfile;

        $experiences = collect($cv?->experiences ?? [])->map(fn($e) => [
            'role'        => $e->role,
            'company'     => $e->company,
            'start_date'  => $e->start_date ?? '',
            'end_date'    => $e->end_date ?? '',
            'is_current'  => (bool) $e->is_current,
            'description' => $e->description ?? '',
        ])->values();

        $education = collect($cv?->education ?? [])->map(fn($e) => [
            'degree'         => $e->degree ?? '',
            'institution'    => $e->institution ?? '',
            'field_of_study' => $e->field_of_study ?? '',
            'start_date'     => $e->start_date ?? '',
            'end_date'       => $e->end_date ?? '',
            'is_current'     => (bool) ($e->is_current ?? false),
        ])->values();

        $resume = $user->latestResume ? [
            'id'           => $user->latestResume->id,
            'filename'     => $user->latestResume->original_filename,
            'ats_rating'   => $user->latestResume->ats_rating,
            'analyzed_at'  => $user->latestResume->analyzed_at?->format('M d, Y'),
            'status'       => $user->latestResume->status,
            'download_url' => url("/api/hr/candidates/{$userId}/resume/download"),
        ] : null;

        return response()->json([
            'id'              => $user->id,
            'name'            => $user->name,
            'email'           => $user->email,
            'initials'        => $this->initials($user->name),
            'headline'        => $cv?->headline ?? '',
            'summary'         => $cv?->summary ?? '',
            'phone'           => $cv?->phone ?? '',
            'location'        => $cv?->location ?? '',
            'linkedin'        => $cv?->linkedin ?? '',
            'github'          => $cv?->github ?? '',
            'website'         => $cv?->website ?? '',
            'desired_role'    => $cv?->desired_role ?? '',
            'expected_salary' => $cv?->expected_salary,
            'availability'    => $cv?->availability ?? '',
            'skills'          => $cv?->skills?->pluck('name') ?? [],
            'experiences'     => $experiences,
            'education'       => $education,
            'languages'       => $cv?->languages?->pluck('language') ?? [],
            'resume'          => $resume,
        ]);
    }

    public function downloadCandidateResume(Request $request, int $userId): StreamedResponse|JsonResponse
    {
        if (!$this->hrCanViewCandidate($request, $userId)) {
            return response()->json(['message' => 'Candidate not found.'], 404);
        }

        $resume = User::query()
            ->with('latestResume')
            ->findOrFail($userId)
            ->latestResume;

        if (!$resume || !Storage::disk('local')->exists($resume->path)) {
            return response()->json(['message' => 'No resume file available for this candidate.'], 404);
        }

        $filename = $resume->original_filename ?: 'resume.pdf';
        $mime = $this->resumeMimeType($filename);

        return Storage::disk('local')->download($resume->path, $filename, [
            'Content-Type' => $mime,
        ]);
    }

    private function hrCanViewCandidate(Request $request, int $userId): bool
    {
        $jobIds = $this->ownedJobIds($request);

        if ($jobIds->isEmpty()) {
            return false;
        }

        return JobApplication::query()
            ->where('candidate_user_id', $userId)
            ->whereIn('job_listing_id', $jobIds)
            ->exists();
    }

    private function resumeMimeType(string $filename): string
    {
        return match (strtolower(pathinfo($filename, PATHINFO_EXTENSION))) {
            'pdf' => 'application/pdf',
            'doc' => 'application/msword',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            default => 'application/octet-stream',
        };
    }

public function myApplications(Request $request): JsonResponse
    {
        $apps = JobApplication::with(['jobListing'])
            ->where('candidate_user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($a) => [
                'id'     => $a->id,
                'status' => ucfirst($a->status),
                'date'   => $a->created_at?->format('M d, Y') ?? '—',
                'job'    => [
                    'id'       => $a->jobListing?->id,
                    'title'    => $a->jobListing?->title    ?? '—',
                    'company'  => $a->jobListing?->company  ?? '—',
                    'location' => $a->jobListing?->location ?? '—',
                    'salary'   => $a->jobListing?->salary   ?? '—',
                    'type'     => $a->jobListing?->type     ?? '—',
                ],
            ]);

        return response()->json(['applications' => $apps]);
    }

public function analytics(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $jobIds = $this->ownedJobIds($request);

        $totalApps   = JobApplication::whereIn('job_listing_id', $jobIds)->count();
        $activeJobs  = JobListing::where('user_id', $userId)->where('status', 'active')->count();
        $hired       = JobApplication::whereIn('job_listing_id', $jobIds)->where('status', 'hired')->count();
        $shortlisted = JobApplication::whereIn('job_listing_id', $jobIds)->where('status', 'shortlisted')->count();
        $interviewed = Interview::where('hr_user_id', $userId)->count();

        $conversionRate = $totalApps > 0 ? round(($hired / $totalApps) * 100, 1) : 0;

        $stats = [
            ['label' => 'Total Applications', 'value' => (string) $totalApps,   'icon' => 'FaUsers'],
            ['label' => 'Conversion Rate',    'value' => $conversionRate . '%',  'icon' => 'FaPercent'],
            ['label' => 'Avg. Time to Hire',  'value' => '—',                    'icon' => 'FaClock'],
            ['label' => 'Active Jobs',        'value' => (string) $activeJobs,   'icon' => 'FaBriefcase'],
        ];

        $funnel = [
            ['label' => 'Applied',     'value' => $totalApps],
            ['label' => 'Shortlisted', 'value' => $shortlisted],
            ['label' => 'Interviewed', 'value' => $interviewed],
            ['label' => 'Hired',       'value' => $hired],
        ];

        $byJob = JobApplication::query()
            ->join('job_listings', 'job_applications.job_listing_id', '=', 'job_listings.id')
            ->where('job_listings.user_id', $userId)
            ->select('job_listings.title', DB::raw('count(*) as apps'))
            ->groupBy('job_listings.id', 'job_listings.title')
            ->orderByDesc('apps')
            ->limit(7)
            ->get()
            ->map(fn($r) => ['title' => $r->title, 'apps' => (int) $r->apps])
            ->values()
            ->toArray();

        $monthly = [];
        for ($i = 5; $i >= 0; $i--) {
            $date  = now()->subMonths($i);
            $count = JobApplication::whereIn('job_listing_id', $jobIds)
                ->whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();
            $monthly[] = ['month' => $date->format('M'), 'apps' => $count];
        }

        return response()->json(compact('stats', 'funnel', 'byJob', 'monthly'));
    }

public function hires(Request $request): JsonResponse
    {
        $jobIds = $this->ownedJobIds($request);

        $hires = JobApplication::with(['candidate', 'jobListing'])
            ->whereIn('job_listing_id', $jobIds)
            ->where('status', 'hired')
            ->orderByDesc('updated_at')
            ->get()
            ->map(function ($app) {
                $hiredAt = $app->hired_at ?? $app->updated_at;
                $daysAgo = $hiredAt ? now()->diffInDays($hiredAt) : 999;
                $status  = $daysAgo <= 30 ? 'Starting Soon' : 'Active';

                return [
                    'id'                => $app->id,
                    'candidate_user_id' => $app->candidate_user_id,
                    'name'              => $app->candidate?->name ?? 'Unknown',
                    'initials'          => $this->initials($app->candidate?->name),
                    'role'              => $app->jobListing?->title    ?? '—',
                    'dept'              => $app->jobListing?->company  ?? '—',
                    'location'          => $app->jobListing?->location ?? '—',
                    'salary'            => $app->jobListing?->salary   ?? '—',
                    'email'             => $app->candidate?->email     ?? '',
                    'hiredDate'         => $hiredAt?->format('M d, Y') ?? '—',
                    'status'            => $status,
                ];
            });

        return response()->json(['hires' => $hires]);
    }

public function apply(Request $request, $jobListingId): JsonResponse
    {
        $listing = JobListing::where('status', 'active')->findOrFail($jobListingId);

        $existing = JobApplication::where('candidate_user_id', $request->user()->id)
            ->where('job_listing_id', $jobListingId)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'You have already applied for this job.'], 422);
        }

        $application = JobApplication::create([
            'candidate_user_id' => $request->user()->id,
            'job_listing_id'    => $listing->id,
            'status'            => JobApplication::STATUS_REVIEWING,
        ]);

        return response()->json(['application' => $application], 201);
    }

private function mapApplication(JobApplication $app): array
    {
        $name = $app->candidate?->name ?? 'Unknown';
        $cv   = $app->candidate?->cvProfile;

        $skills = $cv?->skills?->pluck('name')->toArray() ?? [];

        $latestExp  = $cv?->experiences?->first();
        $experience = $latestExp
            ? trim(($latestExp->role ?? '') . ($latestExp->company ? ' at ' . $latestExp->company : ''))
            : '—';

        return [
            'id'                => $app->id,
            'candidate_user_id' => $app->candidate_user_id,
            'name'              => $name,
            'initials'          => $this->initials($name),
            'role'              => $app->jobListing?->title    ?? '—',
            'company'           => $app->jobListing?->company  ?? '—',
            'status'            => ucfirst($app->status),
            'date'              => $app->created_at?->diffForHumans() ?? '—',
            'email'             => $app->candidate?->email ?? '—',
            'phone'             => $cv?->phone    ?? '',
            'linkedin'          => $cv?->linkedin ?? '',
            'location'          => $cv?->location ?? $app->jobListing?->location ?? '—',
            'summary'           => $cv?->summary  ?? '',
            'headline'          => $cv?->headline ?? '',
            'skills'            => $skills,
            'experience'        => $experience,
            'job_listing_id'    => $app->job_listing_id,
            'history'           => [
                ['stage' => 'Applied', 'date' => $app->created_at?->format('M d, Y') ?? '—'],
            ],
        ];
    }

    private function initials(?string $name): string
    {
        if (!$name) {
            return '?';
        }

        return collect(explode(' ', trim($name)))
            ->filter()
            ->map(fn($w) => strtoupper($w[0]))
            ->take(2)
            ->implode('');
    }
}
