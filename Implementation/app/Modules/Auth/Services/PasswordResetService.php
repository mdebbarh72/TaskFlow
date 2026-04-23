<?php

namespace App\Modules\Auth\Services;

use App\Infrastructure\OTP\Contracts\OTPServiceInterface;
use App\Infrastructure\OTP\DTOs\GenerateOTPDTO;
use App\Modules\Users\Repositories\Contracts\UserRepositoryInterface;
use App\Shared\Enums\OTPPurpose;
use App\Shared\Exceptions\UserNotFoundException;
use Illuminate\Support\Facades\Hash;

class PasswordResetService
{
    public function __construct(
        private UserRepositoryInterface $users,
        private OTPServiceInterface     $otp,
    ) {}

    public function requestReset(string $email): void
    {
        $user = $this->users->findByEmail($email);
        if (!$user) {
            return; 
        }

        $this->otp->generate(new GenerateOTPDTO(
            userId: $user->id,
            purpose: OTPPurpose::PASSWORD_RESET,
            
        ));
    }

    public function reset(int $userId, string $password): void
    {
        $user = $this->users->findById($userId);
        if (!$user) {
            throw new UserNotFoundException();
        }

        $user->update([
            'password' => Hash::make($password),
        ]);
    }
}
