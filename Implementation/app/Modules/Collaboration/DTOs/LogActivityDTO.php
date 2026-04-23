<?php

namespace App\Modules\Collaboration\DTOs;

class LogActivityDTO
{
    public function __construct(
        public readonly int    $userId,
        public readonly string $action,
        public readonly int    $actionableId,
        public readonly string $actionableType,
    ) {}
}
