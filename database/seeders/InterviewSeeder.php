<?php

namespace Database\Seeders;

use App\Models\Interview;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class InterviewSeeder extends Seeder
{
    public const DEMO_PASSWORD = 'password';

    public function run(): void
    {
        $demoPassword = Hash::make(self::DEMO_PASSWORD);

        $accounts = [
            [
                'email' => 'hr@beehired.com',
                'name' => 'Mia Recruiter',
                'role' => User::ROLE_HR,
            ],
            [
                'email' => 'alex.rivera@email.com',
                'name' => 'Alex Rivera',
                'role' => User::ROLE_CANDIDATE,
            ],
            [
                'email' => 'fatima.alzahra@email.com',
                'name' => 'Fatima Al-Zahra',
                'role' => User::ROLE_CANDIDATE,
            ],
            [
                'email' => 'admin@beehired.com',
                'name' => 'Vesa Admin',
                'role' => User::ROLE_ADMIN,
            ],
        ];

        $usersByEmail = [];

        foreach ($accounts as $account) {
            $usersByEmail[$account['email']] = User::query()->updateOrCreate(
                ['email' => $account['email']],
                [
                    'name' => $account['name'],
                    'role' => $account['role'],
                    'password' => $demoPassword,
                ]
            );
        }

        $hr = $usersByEmail['hr@beehired.com'];
        $candidate = $usersByEmail['alex.rivera@email.com'];

        if (Interview::query()->where('hr_user_id', $hr->id)->exists()) {
            return;
        }

        Interview::query()->create([
            'hr_user_id' => $hr->id,
            'candidate_user_id' => $candidate->id,
            'title' => 'Senior Frontend Developer',
            'company' => 'TechHive',
            'scheduled_at' => now()->addDay()->setTime(14, 30),
            'duration_minutes' => 60,
            'type' => Interview::TYPE_VIDEO,
            'status' => Interview::STATUS_SCHEDULED,
            'interviewer_name' => $hr->name,
        ]);
    }
}
