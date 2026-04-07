<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureNotBanned
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && $request->user()->isBanned()) {
            $request->user()->tokens()->delete();

            return response()->json([
                'message' => 'Your account has been banned.',
            ], 403);
        }

        return $next($request);
    }
}
