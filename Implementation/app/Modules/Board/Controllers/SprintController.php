<?php

namespace App\Modules\Board\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Board\Models\Sprint;
use App\Modules\Board\Requests\CreateSprintRequest;
use App\Modules\Board\Requests\UpdateSprintRequest;
use App\Modules\Board\Services\SprintService;
use App\Modules\Projects\Models\Project;
use Illuminate\Http\JsonResponse;

class SprintController extends Controller
{
    public function __construct(
        private SprintService $sprintService,
    ) {}

    public function index(Project $project): JsonResponse
    {
        $this->authorize('viewAny', [Sprint::class, $project]);

        return response()->json($project->sprints);
    }

    public function store(CreateSprintRequest $request): JsonResponse
    {
        $sprint = $this->sprintService->create($request->toDTO());

        return response()->json($sprint, 201);
    }

    public function show(Sprint $sprint): JsonResponse
    {
        $this->authorize('view', $sprint);

        return response()->json($sprint);
    }

    public function update(UpdateSprintRequest $request, Sprint $sprint): JsonResponse
    {
        $this->sprintService->update($sprint, $request->toDTO());

        return response()->json($sprint->fresh());
    }

    public function destroy(Sprint $sprint): JsonResponse
    {
        $this->authorize('delete', $sprint);
        $this->sprintService->delete($sprint);

        return response()->json(['message' => 'Sprint deleted successfully.']);
    }

    public function start(Sprint $sprint): JsonResponse
    {
        $this->authorize('start', $sprint);
        $this->sprintService->start($sprint);

        return response()->json(['message' => 'Sprint started successfully.']);
    }

    public function complete(Sprint $sprint): JsonResponse
    {
        $this->authorize('complete', $sprint);
        $this->sprintService->complete($sprint);

        return response()->json(['message' => 'Sprint completed successfully.']);
    }
}
