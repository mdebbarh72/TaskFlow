<?php

namespace App\Modules\Projects\Policies;

use App\Modules\Projects\Models\Project;
use App\Modules\Users\Models\User;
use App\Shared\Enums\MembershipStatus;

class MembershipPolicy
{
    public function leave(User $user, Project $project): bool
    {
        if ((int) $project->owner_id !== (int) $user->id) {
            return $project->memberships()
                ->where('user_id', $user->id)
                ->where('status', MembershipStatus::ACTIVE->value)
                ->exists();
        }

        $activeMembers = $project->memberships()
            ->where('status', MembershipStatus::ACTIVE->value)
            ->count();

        return $activeMembers <= 1;
    }
}
