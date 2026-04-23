<?php

namespace App\Modules\Board\Policies;

use App\Modules\Board\Models\Card;
use App\Modules\Projects\Models\Project;
use App\Modules\Users\Models\User;
use App\Shared\Enums\MembershipRole;
use App\Shared\Enums\MembershipStatus;
use Illuminate\Auth\Access\HandlesAuthorization;

class CardPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user, Project $project): bool
    {
        return $this->isMember($user, $project);
    }

    public function view(User $user, Card $card): bool
    {
        return $this->isMember($user, $this->resolveProject($card));
    }

    public function create(User $user, Project $project): bool
    {
        return $this->hasRole($user, $project, [MembershipRole::OWNER, MembershipRole::MANAGER]);
    }

    public function update(User $user, Card $card): bool
    {
        $project = $this->resolveProject($card);

        if ($this->hasRole($user, $project, [MembershipRole::OWNER, MembershipRole::MANAGER])) {
            return true;
        }

        return $user->id === $card->assignee_id && $this->isMember($user, $project);
    }

    public function delete(User $user, Card $card): bool
    {
        return $this->hasRole($user, $this->resolveProject($card), [MembershipRole::OWNER, MembershipRole::MANAGER]);
    }

    public function assign(User $user, Card $card): bool
    {
        return $this->delete($user, $card);
    }

    public function move(User $user, Card $card): bool
    {
        return $this->isMember($user, $this->resolveProject($card));
    }

    /**
     * Resolve the project — works for both backlog cards (project_id set) and sprint cards.
     */
    private function resolveProject(Card $card): Project
    {
        return $card->project_id ? $card->project : $card->sprint->project;
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
