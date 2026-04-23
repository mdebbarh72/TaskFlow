<?php

namespace App\Shared\Traits;

use App\Modules\Collaboration\Models\ActivityLog;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait HasActivityLog
{
    public function activityLogs(): MorphMany
    {
        return $this->morphMany(ActivityLog::class, 'actionable');
    }
}
