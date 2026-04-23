<?php

namespace App\Modules\Projects\Services;

use App\Modules\Projects\DTOs\InviteMemberDTO;
use App\Modules\Projects\Models\Project;
use App\Modules\Projects\Repositories\Contracts\MembershipRepositoryInterface;
use App\Modules\Users\Repositories\Contracts\UserRepositoryInterface;
use App\Infrastructure\Email\Contracts\MailerInterface;
use App\Shared\Enums\MembershipStatus;
use App\Shared\Exceptions\UserNotFoundException;
use Exception;

class MembershipService
{
    public function __construct(
        private MembershipRepositoryInterface $memberships,
        private UserRepositoryInterface       $users,
        private MailerInterface               $mailer
    ) {}

    public function invite(InviteMemberDTO $dto, Project $project): void
    {
        $user = $this->users->findByEmail($dto->email);
        if (!$user) {
            throw new UserNotFoundException("User with email {$dto->email} not found.");
        }

        if ($user->id === $project->owner_id) {
            throw new Exception("Project owner is already a member.");
        }

        $existing = $this->memberships->findByProjectAndUser($project->id, $user->id);
        if ($existing) {
            throw new Exception("User is already a member of this project.");
        }

        $this->memberships->create([
            'project_id' => $project->id,
            'user_id'    => $user->id,
            'role'       => $dto->role->value,
            'status'     => MembershipStatus::ACTIVE->value,
        ]);

        $this->mailer->sendProjectInvitation($user->email, $project, config('app.url') . "/projects/{$project->id}");
    }

    public function remove(Project $project, int $userId): void
    {
        $membership = $this->memberships->findByProjectAndUser($project->id, $userId);
        if ($membership) {
            $this->memberships->delete($membership);
        }
    }
}
