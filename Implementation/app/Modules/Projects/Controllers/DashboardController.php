<?php

namespace App\Modules\Projects\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Projects\Models\Project;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        return response()->json([
            'cards' => [
                'total' => $project->cards()->count(),
                'todo'  => $project->cards()->where('status', 'todo')->count(),
                'doing' => $project->cards()->where('status', 'doing')->count(),
                'done'  => $project->cards()->where('status', 'done')->count(),
            ],
            'sprints' => [
                'total'     => $project->sprints()->count(),
                'active'    => $project->sprints()->where('status', 'active')->count(),
                'completed' => $project->sprints()->where('status', 'completed')->count(),
            ],
            'recent_activity' => $project->activityLogs()
                ->with('user:id,name,email')
                ->latest()
                ->limit(10)
                ->get(),
        ]);
    }
}
