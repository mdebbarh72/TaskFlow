<?php

namespace App\Modules\Collaboration\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Projects\Models\Project;
use Illuminate\Http\JsonResponse;

class ActivityLogController extends Controller
{
    public function index(Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        $logs = \App\Modules\Collaboration\Models\ActivityLog::where('project_id', $project->id)
            ->with('user:id,first_name,last_name,email')
            ->latest()
            ->paginate(50);

        return response()->json($logs);
    }
}
