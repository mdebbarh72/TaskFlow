<?php

namespace App\Modules\Board\Repositories;

use App\Modules\Board\Models\Card;
use App\Modules\Board\Repositories\Contracts\CardRepositoryInterface;
use App\Shared\Enums\CardStatus;

class CardRepository implements CardRepositoryInterface
{
    public function findById(int $id): ?Card
    {
        return Card::find($id);
    }

    public function create(array $data): Card
    {
        return Card::create($data);
    }

    public function updateStatus(int $id, CardStatus $status): void
    {
        Card::where('id', $id)->update(['status' => $status->value]);
    }

    public function updateAssignee(int $id, int $userId): void
    {
        Card::where('id', $id)->update(['assignee_id' => $userId]);
    }

    public function update(int $id, array $data): bool
    {
        return Card::where('id', $id)->update($data) > 0;
    }

    public function delete(int $id): bool
    {
        return Card::where('id', $id)->delete() > 0;
    }
}
