<?php

namespace App\Infrastructure\OTP\DTOs;

use App\Shared\Enums\OTPPurpose;

class VerifyOTPDTO
{
    public function __construct(
        public readonly int        $userId,
        public readonly OTPPurpose $purpose,
        public readonly string     $code,
    ) {}
}
