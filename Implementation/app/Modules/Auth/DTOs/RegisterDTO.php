<?php

namespace App\Modules\Auth\DTOs;

class RegisterDTO
{
    public function __construct(
        public readonly string $username,
        public readonly string $email,
        public readonly string $password,
    ) {}
}
