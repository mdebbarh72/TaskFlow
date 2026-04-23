<?php

namespace App\Modules\Board\Events;

use App\Shared\Enums\CardStatus;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CardMoved
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public int        $cardId,
        public CardStatus $newStatus,
        public int        $movedBy
    ) {}
}
