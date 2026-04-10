<?php

namespace App\Modules\Projects\Services;

use App\Modules\Projects\Repositories\Contracts\ProjectRepositoryInterface;
use App\Modules\Projects\DTOs\CreateProjectDTO;
use App\Modules\Projects\DTOs\UpdateProjectDTO;
use App\Modules\Projects\Models\Project;
use App\Modules\Projects\Events\ProjectCreated;
use Illuminate\Support\Collection;

class ProjectService
{
    public function __construct(
        private ProjectRepositoryInterface $projects,
    ) {}

    public function listForUser(int $userId): Collection
    {
        return $this->projects->findForUser($userId);
    }

    public function findById(int $id): ?Project
    {
        return $this->projects->findById($id);
    }

    public function create(CreateProjectDTO $dto): Project
    {
        $project = $this->projects->create([
            'name'        => $dto->name,
            'description' => $dto->description,
            'owner_id'    => $dto->ownerId,
        ]);

        // Automatically add owner as an active member
        $project->memberships()->create([
            'user_id' => $dto->ownerId,
            'role'    => \App\Shared\Enums\MembershipRole::OWNER->value,
            'status'  => \App\Shared\Enums\MembershipStatus::ACTIVE->value,
        ]);
        
        return $project->fresh();
    }

    public function update(Project $project, UpdateProjectDTO $dto): bool
    {
        $data = array_filter([
            'name'        => $dto->name,
            'description' => $dto->description,
        ], fn($value) => !is_null($value));

        return $this->projects->update($project, $data);
    }

    public function delete(Project $project): bool
    {
        return $this->projects->delete($project);
    }
}
