<?php

namespace App\Services;

use App\Models\JobApplication;
use App\Models\Notification;

class ApplicationNotificationService
{
    public function notifyStatusChange(JobApplication $application, string $previousStatus): void
    {
        $application->loadMissing(['candidate', 'jobListing']);

        $newStatus = $application->status;

        if ($previousStatus === $newStatus) {
            return;
        }

        $candidateId = $application->candidate_user_id;

        if (!$candidateId) {
            return;
        }

        $jobTitle = $application->jobListing?->title ?? 'a position';
        $company = $application->jobListing?->company ?? '';
        $label = $this->statusLabel($newStatus);
        $companyPart = $company !== '' ? " at {$company}" : '';

        Notification::query()->create([
            'user_id' => $candidateId,
            'type' => Notification::TYPE_APPLICATION_STATUS,
            'title' => 'Application update',
            'message' => "Your application for {$jobTitle}{$companyPart} is now {$label}.",
            'icon' => $this->statusIcon($newStatus),
            'action_url' => '/user-dashboard/applied-jobs',
            'data' => [
                'application_id' => $application->id,
                'job_listing_id' => $application->job_listing_id,
                'previous_status' => $previousStatus,
                'status' => $newStatus,
            ],
        ]);
    }

    private function statusLabel(string $status): string
    {
        return match ($status) {
            JobApplication::STATUS_REVIEWING => 'under review',
            JobApplication::STATUS_SHORTLISTED => 'shortlisted',
            JobApplication::STATUS_HIRED => 'marked as hired',
            JobApplication::STATUS_REJECTED => 'not selected',
            default => $status,
        };
    }

    private function statusIcon(string $status): string
    {
        return match ($status) {
            JobApplication::STATUS_SHORTLISTED => '⭐',
            JobApplication::STATUS_HIRED => '✅',
            JobApplication::STATUS_REJECTED => '✕',
            default => '📋',
        };
    }
}
