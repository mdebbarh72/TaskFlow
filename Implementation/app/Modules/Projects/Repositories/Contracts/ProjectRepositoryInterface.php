<?php

namespace App\Modules\Projects\Repositories\Contracts;

use App\Modules\Projects\Models\Project;

interface ProjectRepositoryInterface
{
    public function findById(int $id): ?Project;
    public function create(array $data): Project;
    public function update(Project $project, array $data): bool;
    public function delete(Project $project): bool;
    public function findForUser(int $userId);
}
