<?php

namespace App\Modules\Auth\DTOs;

class LoginDTO
{
    public function __construct(
        public readonly string $email,
        public readonly string $password,
        public readonly string $ipAddress,
        public readonly string $userAgent,
    ) {}
}
