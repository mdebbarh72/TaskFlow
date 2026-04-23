<?php

namespace App\Modules\Board\DTOs;

use App\Shared\Enums\CardStatus;

class MoveCardDTO
{
    public function __construct(
        public readonly int        $cardId,
        public readonly CardStatus $newStatus,
        public readonly int        $movedBy,
    ) {}
}
