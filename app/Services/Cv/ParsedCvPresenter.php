<?php

namespace App\Services\Cv;

class ParsedCvPresenter
{

public function toStructured(array $parsed): array
    {
        return [
            'personal_info' => [
                'full_name' => trim((string) ($parsed['name'] ?? '')),
                'email' => trim((string) ($parsed['email'] ?? '')),
                'phone' => trim((string) ($parsed['phone'] ?? '')),
                'location' => trim((string) ($parsed['location'] ?? '')),
            ],
            'summary' => trim((string) ($parsed['summary'] ?? $parsed['bio'] ?? '')),
            'skills' => array_values($parsed['skills'] ?? []),
            'experience' => $this->mapExperience($parsed['experience'] ?? []),
            'education' => $this->mapEducation($parsed['education'] ?? []),
            'languages' => $this->mapLanguages($parsed['languages'] ?? []),
            'certifications' => $this->mapCertifications($parsed['certifications'] ?? []),
            'projects' => $this->mapProjects($parsed['projects'] ?? []),
            'github' => trim((string) ($parsed['github'] ?? '')),
            'github_repositories' => array_values($parsed['github_repositories'] ?? []),
            'portfolio_links' => array_values($parsed['portfolio_links'] ?? []),
        ];
    }

private function mapExperience(array $items): array
    {
        $mapped = [];

        foreach ($items as $item) {
            if (!is_array($item)) {
                continue;
            }

            $mapped[] = [
                'title' => trim((string) ($item['role'] ?? $item['title'] ?? '')),
                'company' => trim((string) ($item['company'] ?? '')),
                'start_date' => trim((string) ($item['start_date'] ?? '')),
                'end_date' => trim((string) ($item['end_date'] ?? '')),
                'description' => trim((string) ($item['description'] ?? '')),
            ];
        }

        return $mapped;
    }

private function mapEducation(array $items): array
    {
        $mapped = [];

        foreach ($items as $item) {
            if (!is_array($item)) {
                continue;
            }

            $mapped[] = [
                'institution' => trim((string) ($item['institution'] ?? '')),
                'degree' => trim((string) ($item['degree'] ?? '')),
                'field_of_study' => trim((string) ($item['field_of_study'] ?? '')),
                'year' => trim((string) ($item['end_date'] ?? $item['year'] ?? '')),
            ];
        }

        return $mapped;
    }

private function mapLanguages(array $items): array
    {
        $mapped = [];

        foreach ($items as $item) {
            if (!is_array($item)) {
                continue;
            }

            $mapped[] = [
                'language' => trim((string) ($item['language'] ?? '')),
                'level' => trim((string) ($item['level'] ?? '')),
            ];
        }

        return $mapped;
    }

private function mapCertifications(array $items): array
    {
        $mapped = [];

        foreach ($items as $item) {
            if (!is_array($item)) {
                continue;
            }

            $mapped[] = [
                'name' => trim((string) ($item['name'] ?? '')),
                'issuer' => trim((string) ($item['issuer'] ?? '')),
                'year' => trim((string) ($item['year'] ?? '')),
            ];
        }

        return $mapped;
    }

private function mapProjects(array $items): array
    {
        $mapped = [];

        foreach ($items as $item) {
            if (!is_array($item)) {
                continue;
            }

            $mapped[] = [
                'name' => trim((string) ($item['name'] ?? '')),
                'description' => trim((string) ($item['description'] ?? '')),
                'technologies' => is_array($item['technologies'] ?? null)
                    ? array_values($item['technologies'])
                    : [],
                'url' => trim((string) ($item['url'] ?? '')),
            ];
        }

        return $mapped;
    }
}
