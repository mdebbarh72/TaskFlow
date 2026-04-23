<?php

namespace App\Modules\Collaboration\Listeners;

use App\Modules\Collaboration\Services\ActivityLogService;
use App\Modules\Collaboration\DTOs\LogActivityDTO;
use App\Modules\Board\Events\CardMoved;
use App\Modules\Board\Events\CardCreated;
use App\Modules\Board\Models\Card;

class LogActivityListener
{
    public function __construct(private ActivityLogService $activityLogService) {}

    public function handle($event): void
    {
        if ($event instanceof CardMoved) {
            $this->activityLogService->log(new LogActivityDTO(
                userId:          $event->movedBy,
                action:          'card.moved',
                actionableId:    $event->cardId,
                actionableType:  Card::class,
            ));
        }

        if ($event instanceof CardCreated) {
            $this->activityLogService->log(new LogActivityDTO(
                userId:          $event->card->created_by,
                action:          'card.created',
                actionableId:    $event->card->id,
                actionableType:  Card::class,
            ));
        }
    }
}
