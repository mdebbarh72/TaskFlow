<?php

namespace App\Modules\Board\Services;

use App\Modules\Board\Repositories\Contracts\SprintRepositoryInterface;
use App\Modules\Board\DTOs\CreateSprintDTO;
use App\Modules\Board\DTOs\UpdateSprintDTO;
use App\Modules\Board\Models\Sprint;
use App\Shared\Enums\SprintStatus;
use App\Modules\Collaboration\Services\ActivityLogService;
use App\Modules\Collaboration\DTOs\LogActivityDTO;
use InvalidArgumentException;

class SprintService
{
    public function __construct(
        private SprintRepositoryInterface $sprints,
        private ActivityLogService         $activityLogger
    ) {}

    public function create(CreateSprintDTO $dto): Sprint
    {
        $sprint = $this->sprints->create([
            'project_id'  => $dto->projectId,
            'name'        => $dto->name,
            'description' => $dto->description,
            'status'      => SprintStatus::PENDING->value,
            'start_date'  => $dto->startDate,
            'end_date'    => $dto->endDate,
        ]);

        $this->logActivity($sprint, 'created');

        return $sprint;
    }

    public function update(Sprint $sprint, UpdateSprintDTO $dto): void
    {
        $data = array_filter([
            'name'        => $dto->name,
            'description' => $dto->description,
            'status'      => $dto->status?->value,
            'start_date'  => $dto->startDate,
            'end_date'    => $dto->endDate,
        ], fn($value) => $value !== null);

        $this->sprints->update($sprint->id, $data);
        $this->logActivity($sprint, 'updated');
    }

    public function start(Sprint $sprint): void
    {
        $alreadyActive = Sprint::where('project_id', $sprint->project_id)
            ->where('status', SprintStatus::ACTIVE->value)
            ->where('id', '!=', $sprint->id)
            ->exists();

        if ($alreadyActive) {
            throw new InvalidArgumentException(
                'Another sprint is already active in this project. Complete it before starting a new one.'
            );
        }

        $this->sprints->update($sprint->id, ['status' => SprintStatus::ACTIVE->value]);
        $this->logActivity($sprint, 'started');
    }

    public function complete(Sprint $sprint): void
    {
        $this->sprints->update($sprint->id, ['status' => SprintStatus::COMPLETED->value]);
        $this->logActivity($sprint, 'completed');
    }

    public function delete(Sprint $sprint): void
    {
        $this->sprints->delete($sprint->id);
        $this->logActivity($sprint, 'deleted');
    }

    private function logActivity(Sprint $sprint, string $action): void
    {
        $this->activityLogger->log(new LogActivityDTO(
            userId:         auth()->id() ?? $sprint->project->owner_id,
            action:         "sprint_{$action}",
            actionableId:   $sprint->id,
            actionableType: Sprint::class
        ));
    }
}
