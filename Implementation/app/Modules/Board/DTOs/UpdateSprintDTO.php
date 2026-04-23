<?php

namespace App\Modules\Board\DTOs;

use App\Shared\Enums\SprintStatus;

class UpdateSprintDTO
{
    public function __construct(
        public readonly ?string       $name = null,
        public readonly ?string       $description = null,
        public readonly ?SprintStatus $status = null,
        public readonly ?string       $startDate = null,
        public readonly ?string       $endDate = null,
    ) {}
}
