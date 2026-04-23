<?php

namespace App\Modules\Projects\Repositories\Contracts;

use App\Modules\Projects\Models\Membership;
use App\Modules\Projects\Models\Project;

interface MembershipRepositoryInterface
{
    public function findByProjectAndUser(int $projectId, int $userId): ?Membership;
    public function create(array $data): Membership;
    public function delete(Membership $membership): bool;
}
