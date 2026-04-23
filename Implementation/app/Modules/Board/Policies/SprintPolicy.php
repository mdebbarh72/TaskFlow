<?php

namespace App\Modules\Board\Policies;

use App\Modules\Board\Models\Sprint;
use App\Modules\Projects\Models\Project;
use App\Modules\Users\Models\User;
use App\Shared\Enums\MembershipRole;
use App\Shared\Enums\MembershipStatus;
use Illuminate\Auth\Access\HandlesAuthorization;

class SprintPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user, Project $project): bool
    {
        return $this->isMember($user, $project);
    }

    public function view(User $user, Sprint $sprint): bool
    {
        return $this->isMember($user, $sprint->project);
    }

    public function create(User $user, Project $project): bool
    {
        return $this->hasRole($user, $project, [MembershipRole::OWNER, MembershipRole::MANAGER]);
    }

    public function update(User $user, Sprint $sprint): bool
    {
        return $this->hasRole($user, $sprint->project, [MembershipRole::OWNER, MembershipRole::MANAGER]);
    }

    public function delete(User $user, Sprint $sprint): bool
    {
        return $this->hasRole($user, $sprint->project, [MembershipRole::OWNER, MembershipRole::MANAGER]);
    }

    public function start(User $user, Sprint $sprint): bool
    {
        return $this->hasRole($user, $sprint->project, [MembershipRole::OWNER, MembershipRole::MANAGER]);
    }

    public function complete(User $user, Sprint $sprint): bool
    {
        return $this->hasRole($user, $sprint->project, [MembershipRole::OWNER, MembershipRole::MANAGER]);
    }

    private function isMember(User $user, Project $project): bool
    {
        if ($user->id === $project->owner_id) {
            return true;
        }

        return $project->memberships()
            ->where('user_id', $user->id)
            ->where('status', MembershipStatus::ACTIVE->value)
            ->exists();
    }

    private function hasRole(User $user, Project $project, array $roles): bool
    {
        if ($user->id === $project->owner_id) {
            return true;
        }

        $roleValues = array_map(fn ($r) => $r->value, $roles);

        $membership = $project->memberships()
            ->where('user_id', $user->id)
            ->where('status', MembershipStatus::ACTIVE->value)
            ->first();

        return $membership && in_array($membership->role, $roleValues);
    }
}
