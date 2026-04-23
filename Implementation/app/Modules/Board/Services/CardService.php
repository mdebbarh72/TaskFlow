<?php

namespace App\Modules\Board\Services;

use App\Modules\Board\Repositories\Contracts\CardRepositoryInterface;
use App\Modules\Board\DTOs\CreateCardDTO;
use App\Modules\Board\DTOs\MoveCardDTO;
use App\Modules\Board\DTOs\AssignCardDTO;
use App\Modules\Board\DTOs\UpdateCardDTO;
use App\Modules\Board\Models\Card;
use App\Modules\Board\Events\CardCreated;
use App\Modules\Board\Events\CardUpdated;
use App\Modules\Board\Events\CardDeleted;
use App\Modules\Board\Events\CardMoved;
use App\Modules\Board\Events\CardAssigned;
use App\Shared\Enums\CardStatus;
use App\Shared\Enums\SprintStatus;
use App\Modules\Collaboration\Services\ActivityLogService;
use App\Modules\Collaboration\DTOs\LogActivityDTO;
use InvalidArgumentException;

class CardService
{
    public function __construct(
        private CardRepositoryInterface $cards,
        private ActivityLogService      $activityLogger,
    ) {}

    public function create(CreateCardDTO $dto): Card
    {
        $card = $this->cards->create([
            'project_id'  => $dto->projectId,
            'title'       => $dto->title,
            'description' => $dto->description,
            'sprint_id'   => $dto->sprintId,
            'priority'    => $dto->priority->value,
            'created_by'  => $dto->createdBy,
            'status'      => CardStatus::TODO->value,
        ]);

        CardCreated::dispatch($card);
        $this->logActivity($card, 'created');

        return $card;
    }

    public function move(MoveCardDTO $dto): void
    {
        $card = $this->cards->findById($dto->cardId);

        if (!$card->sprint_id || $card->sprint->status !== SprintStatus::ACTIVE->value) {
            throw new InvalidArgumentException(
                'Cards can only be moved on the board when they belong to an active sprint.'
            );
        }

        $this->cards->updateStatus($dto->cardId, $dto->newStatus);
        CardMoved::dispatch($dto->cardId, $dto->newStatus, $dto->movedBy);
        $this->logActivity($card, 'moved_to_' . $dto->newStatus->value);
    }

    public function assign(AssignCardDTO $dto): void
    {
        $card = $this->cards->findById($dto->cardId);
        $this->cards->updateAssignee($dto->cardId, $dto->assigneeId);
        CardAssigned::dispatch($dto->cardId, $dto->assigneeId, $dto->assignedBy);
        $this->logActivity($card, 'assigned');
    }

    public function update(Card $card, UpdateCardDTO $dto): void
    {
        if ($dto->status !== null && $dto->status->value !== $card->status) {
            if (!$card->sprint_id || $card->sprint->status !== SprintStatus::ACTIVE->value) {
                throw new InvalidArgumentException(
                    'Card status can only be changed while the card is in an active sprint.'
                );
            }
        }

        // Bug fix: use explicit build instead of array_filter, so sprint_id=null is preserved
        $data = [];
        if ($dto->title !== null)       $data['title']       = $dto->title;
        if ($dto->description !== null) $data['description'] = $dto->description;
        if ($dto->status !== null)      $data['status']      = $dto->status->value;
        if ($dto->priority !== null)    $data['priority']    = $dto->priority->value;
        if ($dto->assigneeId !== null)  $data['assignee_id'] = $dto->assigneeId;

        // Explicitly allow sprint_id = null (card moved to backlog)
        if ($dto->updateSprint) {
            $data['sprint_id'] = $dto->sprintId;
        }

        if (!empty($data)) {
            $this->cards->update($card->id, $data);
        }

        $this->logActivity($card, 'updated');
        CardUpdated::dispatch($card->fresh());
    }

    public function delete(Card $card): void
    {
        $this->cards->delete($card->id);
        CardDeleted::dispatch($card->id);
        $this->logActivity($card, 'deleted');
    }

    private function logActivity(Card $card, string $action): void
    {
        $this->activityLogger->log(new LogActivityDTO(
            userId:         auth()->id() ?? $card->created_by,
            action:         "card_{$action}",
            actionableId:   $card->id,
            actionableType: Card::class,
        ));
    }
}
