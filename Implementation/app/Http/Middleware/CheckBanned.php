<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckBanned
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && $request->user()->isBanned()) {
            // Revoke all tokens for this user immediately
            $request->user()->tokens()->delete();
            
            return response()->json([
                'message' => 'Your account has been banned. Access denied.',
            ], 403);
        }

        return $next($request);
    }
}
