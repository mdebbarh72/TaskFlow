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
        $names = preg_split('/\s+/', trim($dto->username)) ?: [];
        $firstName = $names[0] ?? $dto->username;
        $lastName = trim(implode(' ', array_slice($names, 1)));

        $user = $this->users->create([
            'first_name' => $firstName,
            'last_name'  => $lastName,
            'email'      => $dto->email,
            'password'   => Hash::make($dto->password),
        ]);

        $user->profile()->create([
            'username' => $dto->username,
        ]);

        UserRegistered::dispatch($user);

        return $user;
    }
}
