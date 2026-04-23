<?php

namespace App\Modules\Projects\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Projects\Models\Project;
use App\Modules\Projects\Requests\CreateProjectRequest;
use App\Modules\Projects\Requests\UpdateProjectRequest;
use App\Modules\Projects\Services\ProjectService;
use Illuminate\Http\JsonResponse;

class ProjectController extends Controller
{
    public function __construct(
        private ProjectService $projectService,
    ) {}

    public function index(): JsonResponse
    {
        $projects = $this->projectService->listForUser(auth()->id());

        return response()->json($projects);
    }

    public function store(CreateProjectRequest $request): JsonResponse
    {
        $project = $this->projectService->create($request->toDTO());

        return response()->json($project, 201);
    }

    public function show(Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        return response()->json($project);
    }

    public function update(UpdateProjectRequest $request, Project $project): JsonResponse
    {
        $this->authorize('update', $project);
        $this->projectService->update($project, $request->toDTO());

        return response()->json($project->fresh());
    }

    public function destroy(Project $project): JsonResponse
    {
        $this->authorize('delete', $project);
        $this->projectService->delete($project);

        return response()->json(['message' => 'Project deleted successfully.']);
    }
}
