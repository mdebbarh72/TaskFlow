<?php

namespace App\Modules\Board\Repositories;

use App\Modules\Board\Models\Sprint;
use App\Modules\Board\Repositories\Contracts\SprintRepositoryInterface;

class SprintRepository implements SprintRepositoryInterface
{
    public function findById(int $id): ?Sprint
    {
        return Sprint::find($id);
    }

    public function create(array $data): Sprint
    {
        return Sprint::create($data);
    }

    public function update(int $id, array $data): bool
    {
        return Sprint::where('id', $id)->update($data) > 0;
    }

    public function delete(int $id): bool
    {
        return Sprint::where('id', $id)->delete() > 0;
    }
}
