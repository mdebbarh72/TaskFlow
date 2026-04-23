<?php

namespace App\Modules\Board\Repositories\Contracts;

use App\Modules\Board\Models\Card;
use App\Shared\Enums\CardStatus;

interface CardRepositoryInterface
{
    public function findById(int $id): ?Card;
    public function create(array $data): Card;
    public function updateStatus(int $id, CardStatus $status): void;
    public function updateAssignee(int $id, int $userId): void;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}
