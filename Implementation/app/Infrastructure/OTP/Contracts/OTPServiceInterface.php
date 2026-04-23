<?php

namespace App\Infrastructure\OTP\Contracts;

use App\Infrastructure\OTP\DTOs\GenerateOTPDTO;
use App\Infrastructure\OTP\DTOs\VerifyOTPDTO;

interface OTPServiceInterface
{
    public function generate(GenerateOTPDTO $dto): void;
    public function verify(VerifyOTPDTO $dto): bool;
}
