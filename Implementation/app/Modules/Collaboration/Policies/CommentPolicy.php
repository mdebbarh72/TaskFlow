<?php

namespace App\Modules\Collaboration\Policies;

use App\Modules\Board\Models\Card;
use App\Modules\Users\Models\User;
use App\Shared\Enums\MembershipRole;
use App\Shared\Enums\MembershipStatus;
use Illuminate\Auth\Access\HandlesAuthorization;

class CommentPolicy
{
    use HandlesAuthorization;

    public function create(User $user, Card $card): bool
    {
        $project = $card->sprint_id ? $card->sprint->project : $card->project;

        if ($user->id === $project->owner_id) {
            return true;
        }

        $membership = $project->memberships()
            ->where('user_id', $user->id)
            ->where('status', MembershipStatus::ACTIVE->value)
            ->first();

        if (!$membership) {
            return false;
        }

        // Owner or Manager can comment on any card
        if (in_array($membership->role, [MembershipRole::OWNER->value, MembershipRole::MANAGER->value])) {
            return true;
        }

        // Members can only comment on their assigned card
        return $user->id === $card->assignee_id;
    }
}
