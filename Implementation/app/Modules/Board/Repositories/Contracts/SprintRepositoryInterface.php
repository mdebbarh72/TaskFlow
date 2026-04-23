<?php

namespace App\Modules\Board\Repositories\Contracts;

use App\Modules\Board\Models\Sprint;

interface SprintRepositoryInterface
{
    public function findById(int $id): ?Sprint;
    public function create(array $data): Sprint;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}
