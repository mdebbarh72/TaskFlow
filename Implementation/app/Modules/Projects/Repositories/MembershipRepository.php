<?php

namespace App\Modules\Projects\Repositories;

use App\Modules\Projects\Models\Membership;
use App\Modules\Projects\Repositories\Contracts\MembershipRepositoryInterface;

class MembershipRepository implements MembershipRepositoryInterface
{
    public function findByProjectAndUser(int $projectId, int $userId): ?Membership
    {
        return Membership::where('project_id', $projectId)
            ->where('user_id', $userId)
            ->first();
    }

    public function create(array $data): Membership
    {
        return Membership::create($data);
    }

    public function delete(Membership $membership): bool
    {
        return $membership->delete();
    }
}
