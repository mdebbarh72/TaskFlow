<?php

namespace App\Modules\Projects\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Projects\Models\Project;
use Illuminate\Http\JsonResponse;

class ProjectBacklogController extends Controller
{
    public function index(Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        $sprints = $project->sprints()
            ->whereIn('status', ['pending', 'active'])
            ->with('cards')
            ->get();

        $unassignedCards = $project->cards()
            ->whereNull('sprint_id')
            ->get();

        return response()->json([
            'sprints'          => $sprints,
            'unassigned_cards' => $unassignedCards,
        ]);
    }
}
