<?php

namespace App\Modules\Users\Repositories\Contracts;

use App\Modules\Users\Models\User;

interface UserRepositoryInterface
{
    public function findById(int $id): ?User;
    public function findByEmail(string $email): ?User;
    public function create(array $data): User;
    public function updatePassword(int $userId, string $passwordHash): void;
}
