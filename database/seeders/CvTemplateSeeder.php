<?php

namespace Database\Seeders;

use App\Models\CvTemplate;
use Illuminate\Database\Seeder;

class CvTemplateSeeder extends Seeder
{
    public function run(): void
    {
        $templates = [
            [
                'slug' => 'modern',
                'name' => 'Modern',
                'description' => 'Clean two-column layout with accent sidebar',
                'view' => 'modern',
                'sort_order' => 1,
            ],
            [
                'slug' => 'minimal',
                'name' => 'Minimal',
                'description' => 'Simple typography-focused single column',
                'view' => 'minimal',
                'sort_order' => 2,
            ],
            [
                'slug' => 'ats',
                'name' => 'ATS-Friendly',
                'description' => 'Plain structure optimized for applicant tracking systems',
                'view' => 'ats',
                'sort_order' => 3,
            ],
            [
                'slug' => 'creative',
                'name' => 'Creative',
                'description' => 'Bold header with color accents',
                'view' => 'creative',
                'sort_order' => 4,
            ],
        ];

        foreach ($templates as $template) {
            CvTemplate::query()->updateOrCreate(
                ['slug' => $template['slug']],
                array_merge($template, ['is_active' => true])
            );
        }
    }
}
