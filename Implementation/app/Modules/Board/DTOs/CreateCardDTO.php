<?php

namespace App\Modules\Board\DTOs;

use App\Shared\Enums\CardPriority;

class CreateCardDTO
{
    public function __construct(
        public readonly string       $title,
        public readonly ?string      $description,
        public readonly int          $projectId,
        public readonly ?int         $sprintId,
        public readonly CardPriority $priority,
        public readonly int          $createdBy,
    ) {}
}
