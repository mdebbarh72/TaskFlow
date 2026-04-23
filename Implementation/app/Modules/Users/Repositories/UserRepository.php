<?php

namespace App\Modules\Users\Repositories;

use App\Modules\Users\Models\User;
use App\Modules\Users\Repositories\Contracts\UserRepositoryInterface;

class UserRepository implements UserRepositoryInterface
{
    public function findById(int $id): ?User
    {
        return User::find($id);
    }

    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    public function create(array $data): User
    {
        return User::create($data);
    }

    public function updatePassword(int $userId, string $passwordHash): void
    {
        User::where('id', $userId)->update(['password' => $passwordHash]);
    }
}
