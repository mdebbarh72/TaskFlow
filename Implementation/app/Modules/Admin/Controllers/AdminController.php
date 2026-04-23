<?php

namespace App\Modules\Admin\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Users\Models\User;
use App\Modules\Projects\Models\Project;
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
            'active_users'  => User::where('is_banned', false)->count(),
            'banned_users'  => User::where('is_banned', true)->count(),
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
                $q->where('name', 'ILIKE', "%{$search}%")
                  ->orWhere('email', 'ILIKE', "%{$search}%");
            });
        }

        $users = $query->select(['id', 'name', 'email', 'role', 'is_banned', 'created_at'])
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

        $user->update(['is_banned' => true]);

        return response()->json([
            'message' => "User {$user->name} has been banned.",
            'user'    => $user->fresh(['id', 'name', 'email', 'role', 'is_banned']),
        ]);
    }

    /**
     * Unban a user.
     */
    public function unban(User $user): JsonResponse
    {
        $user->update(['is_banned' => false]);

        return response()->json([
            'message' => "User {$user->name} has been unbanned.",
            'user'    => $user->fresh(['id', 'name', 'email', 'role', 'is_banned']),
        ]);
    }
}
