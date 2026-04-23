<?php

namespace App\Modules\Projects\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Projects\Models\Project;
use App\Modules\Projects\Services\MembershipService;
use App\Modules\Projects\DTOs\InviteMemberDTO;
use App\Shared\Enums\MembershipRole;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class MembershipController extends Controller
{
    public function __construct(private MembershipService $membershipService) {}

    public function invite(Request $request, Project $project): JsonResponse
    {
        $response = Gate::inspect('manageMembers', $project);
        if ($response->denied()) {
            return response()->json(['message' => $response->message()], 403);
        }

        $request->validate([
            'email' => 'required|email',
            'role'  => 'nullable|string|in:owner,manager,member,viewer',
        ]);

        $dto = new InviteMemberDTO(
            projectId: $project->id,
            email:     $request->email,
            role:      $request->role ? MembershipRole::from($request->role) : MembershipRole::MEMBER
        );

        try {
            $this->membershipService->invite($dto, $project);
            return response()->json(['message' => 'Member invited successfully.']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function remove(Project $project, int $userId): JsonResponse
    {
        $response = Gate::inspect('manageMembers', $project);
        if ($response->denied()) {
            return response()->json(['message' => $response->message()], 403);
        }

        $this->membershipService->remove($project, $userId);

        return response()->json(['message' => 'Member removed successfully.']);
    }
}
