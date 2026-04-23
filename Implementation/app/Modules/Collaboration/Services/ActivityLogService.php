<?php

namespace App\Modules\Collaboration\Services;

use App\Modules\Collaboration\Models\ActivityLog;
use App\Modules\Collaboration\DTOs\LogActivityDTO;

class ActivityLogService
{
    public function log(LogActivityDTO $dto): void
    {
        ActivityLog::create([
            'user_id'         => $dto->userId,
            'action'          => $dto->action,
            'actionable_id'   => $dto->actionableId,
            'actionable_type' => $dto->actionableType,
        ]);
    }
}
