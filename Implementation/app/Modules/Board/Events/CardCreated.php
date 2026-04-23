<?php

namespace App\Modules\Board\Events;

use App\Modules\Board\Models\Card;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CardCreated
{
    use Dispatchable, SerializesModels;

    public function __construct(public Card $card) {}
}
