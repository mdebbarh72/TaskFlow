<?php

namespace App\Modules\Projects\Repositories;

use App\Modules\Projects\Models\Project;
use App\Modules\Projects\Repositories\Contracts\ProjectRepositoryInterface;
use App\Shared\Enums\MembershipStatus;

class ProjectRepository implements ProjectRepositoryInterface
{
    public function findById(int $id): ?Project
    {
        return Project::find($id);
    }

    public function create(array $data): Project
    {
        return Project::create($data);
    }

    public function update(Project $project, array $data): bool
    {
        return $project->update($data);
    }

    public function delete(Project $project): bool
    {
        return $project->delete();
    }

    public function findForUser(int $userId)
    {
        return Project::with(['memberships' => function ($query) use ($userId) {
                $query->where('user_id', $userId)
                    ->where('status', MembershipStatus::ACTIVE->value);
            }])
            ->where('owner_id', $userId)
            ->orWhereHas('memberships', function ($query) use ($userId) {
                $query->where('user_id', $userId)
                    ->where('status', MembershipStatus::ACTIVE->value);
            })
            ->get()
            ->map(function (Project $project) use ($userId) {
                $role = (int) $project->owner_id === (int) $userId
                    ? 'owner'
                    : optional($project->memberships->first())->role;
                $project->setAttribute('current_user_role', $role);
                return $project;
            });
    }
}
