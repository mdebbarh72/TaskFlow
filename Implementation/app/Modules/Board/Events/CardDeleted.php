<?php

namespace App\Modules\Board\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CardDeleted
{
    use Dispatchable, SerializesModels;

    public function __construct(public int $cardId) {}
}
