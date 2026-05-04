<?php

namespace App\Modules\Admin\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Users\Models\User;
use App\Modules\Projects\Models\Project;
use App\Shared\Enums\UserStatus;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Dashboard statistics for the admin panel.
     */
    public function stats(): JsonResponse
    {
        return response()->json([
            'total_users'   => User::count(),
            'active_users'  => User::where('status', UserStatus::ACTIVE->value)->count(),
            'banned_users'  => User::where('status', UserStatus::BANNED->value)->count(),
            'total_projects' => Project::count(),
        ]);
    }

    /**
     * Paginated user list with optional search by email or name.
     */
    public function users(Request $request): JsonResponse
    {
        $query = User::query();

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->whereRaw("CONCAT(first_name, ' ', last_name) ILIKE ?", ["%{$search}%"])
                  ->orWhere('email', 'ILIKE', "%{$search}%");
            });
        }

        $users = $query->select(['id', 'first_name', 'last_name', 'email', 'role', 'status', 'created_at'])
                       ->orderBy('created_at', 'desc')
                       ->paginate(15);

        return response()->json($users);
    }

    /**
     * Ban a user.
     */
    public function ban(User $user): JsonResponse
    {
        if ($user->isAdmin()) {
            return response()->json([
                'message' => 'You cannot ban another admin.',
            ], 403);
        }

        $user->update(['status' => UserStatus::BANNED->value]);

        return response()->json([
            'message' => "User {$user->name} has been banned.",
            'user'    => $user->fresh(['id', 'first_name', 'last_name', 'email', 'role', 'status']),
        ]);
    }

    /**
     * Unban a user.
     */
    public function unban(User $user): JsonResponse
    {
        $user->update(['status' => UserStatus::ACTIVE->value]);

        return response()->json([
            'message' => "User {$user->name} has been unbanned.",
            'user'    => $user->fresh(['id', 'first_name', 'last_name', 'email', 'role', 'status']),
        ]);
    }
}
