<?php

namespace App\Modules\Projects\Policies;

use App\Modules\Projects\Models\Project;
use App\Modules\Users\Models\User;
use App\Shared\Enums\MembershipRole;
use App\Shared\Enums\MembershipStatus;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProjectPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Project $project): bool
    {
        return $this->getRole($user, $project) !== null;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Project $project): bool
    {
        return in_array($this->getRole($user, $project), [
            MembershipRole::OWNER->value,
            MembershipRole::MANAGER->value,
        ]);
    }

    public function delete(User $user, Project $project): bool
    {
        return $user->id === $project->owner_id;
    }

    public function manageMembers(User $user, Project $project): bool
    {
        return in_array($this->getRole($user, $project), [
            MembershipRole::OWNER->value,
            MembershipRole::MANAGER->value,
        ]);
    }

    private function getRole(User $user, Project $project): ?string
    {
        if ($user->id === $project->owner_id) {
            return MembershipRole::OWNER->value;
        }

        return $project->memberships()
            ->where('user_id', $user->id)
            ->where('status', MembershipStatus::ACTIVE->value)
            ->value('role');
    }
}
