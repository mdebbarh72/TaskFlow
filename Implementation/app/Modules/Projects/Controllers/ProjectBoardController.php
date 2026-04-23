<?php

namespace App\Modules\Projects\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Projects\Models\Project;
use Illuminate\Http\JsonResponse;

class ProjectBoardController extends Controller
{
    public function index(Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        $activeSprints = $project->sprints()
            ->where('status', 'active')
            ->with('cards')
            ->get();

        return response()->json(['active_sprints' => $activeSprints]);
    }
}
