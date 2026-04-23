<?php

namespace App\Modules\Auth\Services;

use App\Modules\Auth\DTOs\RegisterDTO;
use App\Modules\Users\Models\User;
use App\Modules\Users\Repositories\Contracts\UserRepositoryInterface;
use App\Modules\Auth\Events\UserRegistered;
use Illuminate\Support\Facades\Hash;

class RegisterService
{
    public function __construct(private UserRepositoryInterface $users) {}

    public function handle(RegisterDTO $dto): User
    {
        $user = $this->users->create([
            'name'     => $dto->username,
            'email'    => $dto->email,
            'password' => Hash::make($dto->password),
        ]);

        UserRegistered::dispatch($user);

        return $user;
    }
}
