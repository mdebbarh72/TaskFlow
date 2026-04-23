<?php

namespace App\Modules\Board\DTOs;

class AssignCardDTO
{
    public function __construct(
        public readonly int $cardId,
        public readonly int $assigneeId,
        public readonly int $assignedBy,
    ) {}
}
