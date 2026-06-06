<?php

namespace App\Policies;

use App\Models\Interview;
use App\Models\User;

class InterviewPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, [User::ROLE_HR, User::ROLE_CANDIDATE, User::ROLE_ADMIN], true);
    }

    public function view(User $user, Interview $interview): bool
    {
        return $interview->isParticipant($user->id) || $user->role === User::ROLE_ADMIN;
    }

    public function create(User $user): bool
    {
        return $user->role === User::ROLE_HR || $user->role === User::ROLE_ADMIN;
    }

    public function update(User $user, Interview $interview): bool
    {
        return $user->id === $interview->hr_user_id || $user->role === User::ROLE_ADMIN;
    }

    public function delete(User $user, Interview $interview): bool
    {
        return $user->id === $interview->hr_user_id || $user->role === User::ROLE_ADMIN;
    }

    public function join(User $user, Interview $interview): bool
    {
        if ($interview->status === Interview::STATUS_CANCELLED) {
            return false;
        }

        return $interview->isParticipant($user->id) || $user->role === User::ROLE_ADMIN;
    }
}
