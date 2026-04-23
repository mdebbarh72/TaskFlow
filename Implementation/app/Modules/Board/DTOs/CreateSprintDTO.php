<?php

namespace App\Modules\Board\DTOs;

class CreateSprintDTO
{
    public function __construct(
        public readonly string $name,
        public readonly int    $projectId,
        public readonly ?string $description = null,
        public readonly ?string $startDate = null,
        public readonly ?string $endDate = null,
    ) {}
}
