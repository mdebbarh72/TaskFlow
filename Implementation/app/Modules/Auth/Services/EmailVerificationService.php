<?php

namespace App\Modules\Auth\Services;

use App\Modules\Users\Repositories\Contracts\UserRepositoryInterface;
use App\Shared\Exceptions\UserNotFoundException;

class EmailVerificationService
{
    public function __construct(private UserRepositoryInterface $users) {}

    public function verify(int $userId): void
    {
        $user = $this->users->findById($userId);
        if (!$user) {
            throw new UserNotFoundException();
        }

        if ($user->hasVerifiedEmail()) {
            return;
        }

        $user->markEmailAsVerified();
    }
}
