<?php

namespace App\Services;

use App\Support\CvCertificationNormalizer;
use App\Support\CvLanguageNormalizer;
use App\Models\CvCertification;
use App\Models\CvEducation;
use App\Models\CvExperience;
use App\Models\CvLanguage;
use App\Models\CvProfile;
use App\Models\CvProject;
use App\Models\CvSkill;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CvProfileService
{
    public function getOrCreateForUser(User $user): CvProfile
    {
        return CvProfile::query()->firstOrCreate(
            ['user_id' => $user->id],
            [
                'full_name' => $user->name,
                'email' => $user->email,
            ]
        );
    }

    public function loadForUser(User $user): ?CvProfile
    {
        return CvProfile::query()
            ->where('user_id', $user->id)
            ->with(['skills', 'experiences', 'education', 'languages', 'projects', 'certifications'])
            ->first();
    }

public function syncFromParsedData(User $user, array $parsed): CvProfile
    {
        return DB::transaction(function () use ($user, $parsed) {
            $profile = $this->getOrCreateForUser($user);

            $profile->update([
                'full_name' => $parsed['name'] ?? $profile->full_name ?? $user->name,
                'email' => $parsed['email'] ?? $profile->email ?? $user->email,
                'phone' => $parsed['phone'] ?? $profile->phone,
                'headline' => $parsed['headline'] ?? $profile->headline,
                'summary' => $parsed['summary'] ?? $parsed['bio'] ?? $profile->summary,
                'github' => $parsed['github'] ?? $profile->github,
                'github_repositories' => $parsed['github_repositories'] ?? $profile->github_repositories ?? [],
                'portfolio_links' => $parsed['portfolio_links'] ?? $profile->portfolio_links ?? [],
            ]);

            $this->replaceChildren($profile, $this->mapParsedToPayload($parsed));

            return $profile->fresh([
                'skills', 'experiences', 'education', 'languages', 'projects', 'certifications',
            ]);
        });
    }

public function updateFromPayload(User $user, array $payload): CvProfile
    {
        return DB::transaction(function () use ($user, $payload) {
            $profile = $this->getOrCreateForUser($user);
            $personal = $payload['personal'] ?? [];

            $profile->update(array_merge(
                $this->mapPersonalAttributes($personal, $user),
                [
                    'github_repositories' => $personal['github_repositories'] ?? $profile->github_repositories ?? [],
                    'portfolio_links' => $personal['portfolio_links'] ?? $profile->portfolio_links ?? [],
                ]
            ));

            $this->replaceChildren($profile, $payload);

            return $profile->fresh([
                'skills', 'experiences', 'education', 'languages', 'projects', 'certifications',
            ]);
        });
    }

public function toTemplateData(CvProfile $profile): array
    {
        $profile->loadMissing([
            'skills', 'experiences', 'education', 'languages', 'projects', 'certifications',
        ]);

        return [
            'personal' => [
                'name' => $profile->full_name ?? '',
                'email' => $profile->email ?? '',
                'phone' => $profile->phone ?? '',
                'headline' => $profile->headline ?? '',
                'summary' => $profile->summary ?? '',
                'location' => $profile->location ?? '',
                'website' => $profile->website ?? '',
                'linkedin' => $profile->linkedin ?? '',
                'github' => $profile->github ?? '',
                'github_repositories' => $profile->github_repositories ?? [],
                'portfolio_links' => $profile->portfolio_links ?? [],
            ],
            'skills' => $profile->skills->pluck('name')->all(),
            'experience' => $profile->experiences->map(fn (CvExperience $e) => [
                'company' => $e->company,
                'role' => $e->role,
                'start_date' => $e->start_date,
                'end_date' => $e->is_current ? 'Present' : $e->end_date,
                'description' => $e->description,
                'bullets' => $this->descriptionToBullets($e->description),
            ])->all(),
            'education' => $profile->education->map(fn (CvEducation $e) => [
                'institution' => $e->institution,
                'degree' => $e->degree,
                'field' => $e->field_of_study,
                'start_date' => $e->start_date,
                'end_date' => $e->is_current ? 'Present' : $e->end_date,
            ])->all(),
            'languages' => $profile->languages->map(fn (CvLanguage $l) => [
                'language' => $l->language,
                'level' => $l->level,
            ])->all(),
            'projects' => $profile->projects->map(fn (CvProject $p) => [
                'name' => $p->name,
                'description' => $p->description,
                'technologies' => $p->technologies ?? [],
                'url' => $p->url,
                'start_date' => $p->start_date,
                'end_date' => $p->end_date,
            ])->all(),
            'certifications' => $profile->certifications->map(fn (CvCertification $c) => [
                'name' => $c->name,
                'issuer' => $c->issuer,
                'year' => $c->year,
            ])->all(),
        ];
    }

    public function toApiPayload(CvProfile $profile): array
    {
        $profile->loadMissing([
            'skills', 'experiences', 'education', 'languages', 'projects', 'certifications',
        ]);

        return [
            'personal' => $this->personalToArray($profile),
            'skills' => $profile->skills->pluck('name')->all(),
            'experiences' => $profile->experiences->map(fn (CvExperience $e) => [
                'id' => $e->id,
                'company' => $this->str($e->company),
                'role' => $this->str($e->role),
                'startDate' => $this->str($e->start_date),
                'endDate' => $e->is_current ? '' : $this->str($e->end_date),
                'current' => $e->is_current,
                'description' => $this->str($e->description),
            ])->all(),
            'education' => $profile->education->map(fn (CvEducation $e) => [
                'id' => $e->id,
                'school' => $this->str($e->institution),
                'degree' => $this->str($e->degree),
                'fieldOfStudy' => $this->str($e->field_of_study),
                'startDate' => $this->str($e->start_date),
                'endDate' => $e->is_current ? '' : $this->str($e->end_date),
                'current' => $e->is_current,
            ])->all(),
            'languages' => $profile->languages->map(fn (CvLanguage $l) => [
                'id' => $l->id,
                'language' => $l->language,
                'level' => $l->level,
            ])->all(),
            'projects' => $profile->projects->map(fn (CvProject $p) => [
                'id' => $p->id,
                'name' => $this->str($p->name),
                'description' => $this->str($p->description),
                'technologies' => $p->technologies ?? [],
                'url' => $this->str($p->url),
                'startDate' => $this->str($p->start_date),
                'endDate' => $this->str($p->end_date),
            ])->all(),
            'certifications' => $profile->certifications->map(fn (CvCertification $c) => [
                'id' => $c->id,
                'name' => $this->str($c->name),
                'issuer' => $this->str($c->issuer),
                'year' => $this->str($c->year),
            ])->all(),
        ];
    }

    private function mapParsedToPayload(array $parsed): array
    {
        return [
            'skills' => $parsed['skills'] ?? [],
            'experiences' => collect($parsed['experience'] ?? [])->map(fn ($item) => [
                'company' => $item['company'] ?? '',
                'role' => $item['role'] ?? $item['title'] ?? '',
                'startDate' => $item['start_date'] ?? $item['startDate'] ?? '',
                'endDate' => $item['end_date'] ?? $item['endDate'] ?? '',
                'current' => empty($item['end_date']) && empty($item['endDate']),
                'description' => $item['description'] ?? '',
            ])->all(),
            'education' => collect($parsed['education'] ?? [])->map(fn ($item) => [
                'school' => $item['institution'] ?? $item['school'] ?? '',
                'degree' => $item['degree'] ?? '',
                'fieldOfStudy' => $item['field_of_study'] ?? $item['fieldOfStudy'] ?? $item['field'] ?? '',
                'startDate' => $item['start_date'] ?? $item['startDate'] ?? '',
                'endDate' => $item['end_date'] ?? $item['endDate'] ?? '',
                'current' => false,
            ])->all(),
            'languages' => collect($parsed['languages'] ?? [])->map(fn ($item) => [
                'language' => $item['language'] ?? $item['name'] ?? '',
                'level' => $item['level'] ?? 'Fluent',
            ])->all(),
            'projects' => collect($parsed['projects'] ?? [])->map(fn ($item) => [
                'name' => $item['name'] ?? '',
                'description' => $item['description'] ?? '',
                'technologies' => $item['technologies'] ?? [],
                'url' => $item['url'] ?? $item['link'] ?? null,
                'startDate' => $item['start_date'] ?? null,
                'endDate' => $item['end_date'] ?? null,
            ])->all(),
            'certifications' => collect($parsed['certifications'] ?? [])->map(fn ($item) => [
                'name' => $item['name'] ?? '',
                'issuer' => $item['issuer'] ?? null,
                'year' => isset($item['year']) ? (string) $item['year'] : null,
            ])->all(),
        ];
    }

    private function replaceChildren(CvProfile $profile, array $payload): void
    {
        $profile->skills()->delete();
        $profile->experiences()->delete();
        $profile->education()->delete();
        $profile->languages()->delete();
        $profile->projects()->delete();
        $profile->certifications()->delete();

        foreach ($payload['skills'] ?? [] as $i => $skill) {
            $name = is_string($skill) ? trim($skill) : '';
            if ($name === '') {
                continue;
            }
            CvSkill::query()->create([
                'cv_profile_id' => $profile->id,
                'name' => $name,
                'sort_order' => $i,
            ]);
        }

        foreach ($payload['experiences'] ?? [] as $i => $exp) {
            $exp = $this->normalizeExperiencePayload($exp);

            if ($exp['company'] === '' && $exp['role'] === '' && $exp['description'] === '') {
                continue;
            }

            CvExperience::query()->create([
                'cv_profile_id' => $profile->id,
                'company' => $exp['company'],
                'role' => $exp['role'],
                'start_date' => $exp['start_date'] ?: null,
                'end_date' => !empty($exp['current']) ? null : ($exp['end_date'] ?: null),
                'is_current' => !empty($exp['current']),
                'description' => $exp['description'] ?: null,
                'sort_order' => $i,
            ]);
        }

        foreach ($payload['education'] ?? [] as $i => $edu) {
            if (empty($edu['school']) && empty($edu['institution']) && empty($edu['degree'])) {
                continue;
            }
            CvEducation::query()->create([
                'cv_profile_id' => $profile->id,
                'institution' => $edu['school'] ?? $edu['institution'] ?? '',
                'degree' => $edu['degree'] ?? null,
                'field_of_study' => $edu['fieldOfStudy'] ?? $edu['field_of_study'] ?? $edu['field'] ?? null,
                'start_date' => $edu['startDate'] ?? $edu['start_date'] ?? null,
                'end_date' => !empty($edu['current']) ? null : ($edu['endDate'] ?? $edu['end_date'] ?? null),
                'is_current' => !empty($edu['current']),
                'sort_order' => $i,
            ]);
        }

        foreach ($payload['languages'] ?? [] as $i => $lang) {
            $sanitized = CvLanguageNormalizer::sanitizeRow(is_array($lang) ? $lang : []);

            if ($sanitized === null) {
                continue;
            }

            CvLanguage::query()->create([
                'cv_profile_id' => $profile->id,
                'language' => $sanitized['language'],
                'level' => $sanitized['level'],
                'sort_order' => $i,
            ]);
        }

        foreach ($payload['projects'] ?? [] as $i => $project) {
            if (empty($project['name'])) {
                continue;
            }
            CvProject::query()->create([
                'cv_profile_id' => $profile->id,
                'name' => $project['name'],
                'description' => $project['description'] ?? null,
                'technologies' => $project['technologies'] ?? [],
                'url' => $project['url'] ?? null,
                'start_date' => $project['startDate'] ?? $project['start_date'] ?? null,
                'end_date' => $project['endDate'] ?? $project['end_date'] ?? null,
                'sort_order' => $i,
            ]);
        }

        foreach ($payload['certifications'] ?? [] as $i => $cert) {
            $sanitized = CvCertificationNormalizer::sanitizeRow(is_array($cert) ? $cert : []);

            if ($sanitized === null) {
                continue;
            }

            CvCertification::query()->create([
                'cv_profile_id' => $profile->id,
                'name' => $sanitized['name'],
                'issuer' => $sanitized['issuer'],
                'year' => $sanitized['year'],
                'sort_order' => $i,
            ]);
        }
    }

    private function descriptionToBullets(?string $description): array
    {
        if (!$description) {
            return [];
        }

        $lines = preg_split('/\r\n|\r|\n/', $description) ?: [];

        return array_values(array_filter(array_map('trim', $lines)));
    }

    public function toDashboardPayload(User $user, ?CvProfile $profile): array
    {
        if (!$profile) {
            return $this->emptyDashboardPayload($user);
        }

        [$firstName, $lastName] = $this->resolveNameParts($profile, $user);
        $portfolioLinks = $profile->portfolio_links ?? [];

        return [
            'id' => $profile->id,
            'firstName' => $firstName,
            'lastName' => $lastName,
            'email' => $profile->email ?? $user->email,
            'phone' => $profile->phone ?? '',
            'location' => $profile->location ?? '',
            'dateOfBirth' => $profile->date_of_birth?->format('Y-m-d') ?? '',
            'nationality' => $profile->nationality ?? '',
            'jobTitle' => $profile->headline ?? '',
            'linkedin' => $profile->linkedin ?? '',
            'github' => $profile->github ?? '',
            'portfolio' => $profile->website ?? ($portfolioLinks[0] ?? ''),
            'desiredRole' => $profile->desired_role ?? '',
            'jobType' => $profile->job_type ?? 'Remote',
            'expectedSalary' => $profile->expected_salary !== null ? (string) $profile->expected_salary : '',
            'availability' => $profile->availability ?? 'Immediately',
            'about' => $profile->summary ?? '',
            'avatarUrl' => $profile->avatar_path
                ? '/storage/'.ltrim($profile->avatar_path, '/')
                : null,
        ];
    }

    public function updateDashboard(User $user, array $data): CvProfile
    {
        return DB::transaction(function () use ($user, $data) {
            $profile = $this->getOrCreateForUser($user);

            $firstName = trim((string) ($data['firstName'] ?? ''));
            $lastName = trim((string) ($data['lastName'] ?? ''));
            $fullName = trim($firstName.' '.$lastName) ?: ($profile->full_name ?? $user->name);

            $portfolio = trim((string) ($data['portfolio'] ?? ''));
            $portfolioLinks = $portfolio !== '' ? [$portfolio] : ($profile->portfolio_links ?? []);

            $salary = $data['expectedSalary'] ?? null;
            $expectedSalary = ($salary !== null && $salary !== '') ? (int) $salary : null;

            $profile->update([
                'first_name' => $firstName ?: null,
                'last_name' => $lastName ?: null,
                'full_name' => $fullName,
                'email' => $data['email'] ?? $profile->email ?? $user->email,
                'phone' => $data['phone'] ?? null,
                'headline' => $data['jobTitle'] ?? null,
                'summary' => $data['about'] ?? null,
                'location' => $data['location'] ?? null,
                'date_of_birth' => !empty($data['dateOfBirth']) ? $data['dateOfBirth'] : null,
                'nationality' => $data['nationality'] ?? null,
                'website' => $portfolio ?: null,
                'linkedin' => $data['linkedin'] ?? null,
                'github' => $data['github'] ?? null,
                'portfolio_links' => $portfolioLinks,
                'desired_role' => $data['desiredRole'] ?? null,
                'job_type' => $data['jobType'] ?? null,
                'expected_salary' => $expectedSalary,
                'availability' => $data['availability'] ?? null,
            ]);

            if (!empty($data['email']) && $data['email'] !== $user->email) {
                $user->update(['email' => $data['email']]);
            }

            if ($fullName !== $user->name) {
                $user->update(['name' => $fullName]);
            }

            return $profile->fresh();
        });
    }

    public function updateAvatar(User $user, \Illuminate\Http\UploadedFile $file): CvProfile
    {
        $profile = $this->getOrCreateForUser($user);

        if ($profile->avatar_path) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($profile->avatar_path);
        }

        $path = $file->store("avatars/{$user->id}", 'public');
        $profile->update(['avatar_path' => $path]);

        return $profile->fresh();
    }

    public function resetDashboard(User $user): void
    {
        $profile = $this->loadForUser($user);

        if (!$profile) {
            return;
        }

        DB::transaction(function () use ($profile) {
            if ($profile->avatar_path) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($profile->avatar_path);
            }

            $profile->update([
                'first_name' => null,
                'last_name' => null,
                'full_name' => null,
                'phone' => null,
                'headline' => null,
                'summary' => null,
                'location' => null,
                'date_of_birth' => null,
                'nationality' => null,
                'website' => null,
                'linkedin' => null,
                'github' => null,
                'portfolio_links' => [],
                'desired_role' => null,
                'job_type' => null,
                'expected_salary' => null,
                'availability' => null,
                'avatar_path' => null,
            ]);
        });
    }

    private function emptyDashboardPayload(User $user): array
    {
        [$firstName, $lastName] = $this->splitFullName($user->name);

        return [
            'id' => null,
            'firstName' => $firstName,
            'lastName' => $lastName,
            'email' => $user->email,
            'phone' => '',
            'location' => '',
            'dateOfBirth' => '',
            'nationality' => '',
            'jobTitle' => '',
            'linkedin' => '',
            'github' => '',
            'portfolio' => '',
            'desiredRole' => '',
            'jobType' => 'Remote',
            'expectedSalary' => '',
            'availability' => 'Immediately',
            'about' => '',
            'avatarUrl' => null,
        ];
    }

private function resolveNameParts(CvProfile $profile, User $user): array
    {
        if ($profile->first_name || $profile->last_name) {
            return [
                (string) ($profile->first_name ?? ''),
                (string) ($profile->last_name ?? ''),
            ];
        }

        return $this->splitFullName($profile->full_name ?? $user->name);
    }

private function splitFullName(?string $fullName): array
    {
        $fullName = trim((string) $fullName);
        if ($fullName === '') {
            return ['', ''];
        }

        $parts = preg_split('/\s+/', $fullName, 2) ?: [];

        return [
            $parts[0] ?? '',
            $parts[1] ?? '',
        ];
    }

    private function personalToArray(CvProfile $profile): array
    {
        return [
            'first_name' => $profile->first_name,
            'last_name' => $profile->last_name,
            'full_name' => $profile->full_name,
            'email' => $profile->email,
            'phone' => $profile->phone,
            'headline' => $profile->headline,
            'summary' => $profile->summary,
            'location' => $profile->location,
            'date_of_birth' => $profile->date_of_birth?->format('Y-m-d'),
            'nationality' => $profile->nationality,
            'website' => $profile->website,
            'linkedin' => $profile->linkedin,
            'github' => $profile->github,
            'github_repositories' => $profile->github_repositories ?? [],
            'portfolio_links' => $profile->portfolio_links ?? [],
            'desired_role' => $profile->desired_role,
            'job_type' => $profile->job_type,
            'expected_salary' => $profile->expected_salary,
            'availability' => $profile->availability,
        ];
    }

    private function mapPersonalAttributes(array $personal, User $user): array
    {
        $firstName = trim((string) ($personal['first_name'] ?? $personal['firstName'] ?? ''));
        $lastName = trim((string) ($personal['last_name'] ?? $personal['lastName'] ?? ''));
        $fullName = trim((string) ($personal['full_name'] ?? $personal['name'] ?? ''));

        if ($fullName === '' && ($firstName !== '' || $lastName !== '')) {
            $fullName = trim($firstName.' '.$lastName);
        }

        if ($fullName === '') {
            $fullName = $user->name;
        }

        if ($firstName === '' && $lastName === '') {
            [$firstName, $lastName] = $this->splitFullName($fullName);
        }

        return [
            'first_name' => $firstName ?: null,
            'last_name' => $lastName ?: null,
            'full_name' => $fullName,
            'email' => $personal['email'] ?? $user->email,
            'phone' => $personal['phone'] ?? null,
            'headline' => $personal['headline'] ?? null,
            'summary' => $personal['summary'] ?? null,
            'location' => $personal['location'] ?? null,
            'date_of_birth' => !empty($personal['date_of_birth'] ?? $personal['dateOfBirth'] ?? null)
                ? ($personal['date_of_birth'] ?? $personal['dateOfBirth'])
                : null,
            'nationality' => $personal['nationality'] ?? null,
            'website' => $personal['website'] ?? null,
            'linkedin' => $personal['linkedin'] ?? null,
            'github' => $personal['github'] ?? null,
            'desired_role' => $personal['desired_role'] ?? $personal['desiredRole'] ?? null,
            'job_type' => $personal['job_type'] ?? $personal['jobType'] ?? null,
            'expected_salary' => isset($personal['expected_salary']) || isset($personal['expectedSalary'])
                ? (int) ($personal['expected_salary'] ?? $personal['expectedSalary'])
                : null,
            'availability' => $personal['availability'] ?? null,
        ];
    }

    private function str(?string $value): string
    {
        return $value === null ? '' : trim($value);
    }

private function normalizeExperiencePayload(array $exp): array
    {
        $company = $this->str($exp['company'] ?? null);
        $role = $this->str($exp['role'] ?? $exp['title'] ?? null);
        $description = $this->str($exp['description'] ?? null);
        $startDate = $this->str($exp['startDate'] ?? $exp['start_date'] ?? null);
        $endDate = $this->str($exp['endDate'] ?? $exp['end_date'] ?? null);
        $current = !empty($exp['current']) || preg_match('/present|current/i', $endDate);

        if ($company === '' && $role === '' && $description !== '') {
            $lines = preg_split('/\r\n|\r|\n/', $description) ?: [];
            $headline = trim($lines[0] ?? '');

            if ($headline !== '') {
                if (preg_match('/^(.+?)\s+(?:at|@)\s+(.+)$/iu', $headline, $match)) {
                    $role = trim($match[1]);
                    $company = trim($match[2]);
                } elseif (preg_match('/^(.+?)\s*\|\s*(.+)$/', $headline, $match)) {
                    $role = trim($match[1]);
                    $company = trim($match[2]);
                } else {
                    $role = $headline;
                }

                $rest = array_slice($lines, 1);
                $description = trim(implode("\n", $rest));
            }
        }

        if (preg_match('/(\d{4})\s*[-–—]\s*((?:\d{4})|present|current)/i', $role.' '.$company.' '.$description, $dates)) {
            if ($startDate === '') {
                $startDate = $dates[1];
            }
            if ($endDate === '') {
                $endDate = $dates[2];
            }
        }

        if (preg_match('/present|current/i', $endDate)) {
            $current = true;
            $endDate = '';
        }

        return [
            'company' => $company,
            'role' => $role,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'current' => $current,
            'description' => $description,
        ];
    }
}
