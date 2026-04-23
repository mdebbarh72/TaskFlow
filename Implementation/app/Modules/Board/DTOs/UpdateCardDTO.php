<?php

namespace App\Modules\Board\DTOs;

use App\Shared\Enums\CardPriority;
use App\Shared\Enums\CardStatus;

class UpdateCardDTO
{
    public function __construct(
        public readonly ?string       $title = null,
        public readonly ?string       $description = null,
        public readonly ?CardStatus   $status = null,
        public readonly ?CardPriority $priority = null,
        public readonly ?int          $assigneeId = null,
        /**
         * Use $updateSprint = true to explicitly set sprint_id (including to null for backlog).
         * Leave $updateSprint = false to skip updating sprint_id entirely.
         */
        public readonly ?int          $sprintId = null,
        public readonly bool          $updateSprint = false,
    ) {}
}
