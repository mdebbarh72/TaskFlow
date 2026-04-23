<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api(prepend: [
            \App\Http\Middleware\CheckBanned::class,
        ]);

        $middleware->alias([
            'verified' => \App\Http\Middleware\EnsureEmailIsVerified::class,
            'admin'    => \App\Http\Middleware\EnsureAdmin::class,
            'banned'   => \App\Http\Middleware\CheckBanned::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {

        // 401 — Not authenticated
        $exceptions->render(function (AuthenticationException $e, \Illuminate\Http\Request $request) {
            return response()->json([
                'message' => 'Unauthenticated. Please log in.',
            ], 401);
        });

        // 403 — Not authorized
        $exceptions->render(function (AuthorizationException $e, \Illuminate\Http\Request $request) {
            return response()->json([
                'message' => $e->getMessage() ?: 'You are not authorized to perform this action.',
            ], 403);
        });

        // 404 — Model or route not found
        $exceptions->render(function (ModelNotFoundException $e, \Illuminate\Http\Request $request) {
            $model = class_basename($e->getModel());
            return response()->json([
                'message' => "{$model} not found.",
            ], 404);
        });

        // 422 — Validation errors
        $exceptions->render(function (ValidationException $e, \Illuminate\Http\Request $request) {
            return response()->json([
                'message' => 'The given data was invalid.',
                'errors'  => $e->errors(),
            ], 422);
        });

        // Any other HTTP exception (e.g. abort(400), abort(422), etc.)
        $exceptions->render(function (HttpException $e, \Illuminate\Http\Request $request) {
            return response()->json([
                'message' => $e->getMessage() ?: 'An error occurred.',
            ], $e->getStatusCode());
        });

        // 500 — Catch-all for unexpected errors
        $exceptions->render(function (\Throwable $e, \Illuminate\Http\Request $request) {
            if ($request->expectsJson() || str_starts_with($request->getPathInfo(), '/api')) {
                return response()->json([
                    'message' => app()->isProduction()
                        ? 'An unexpected error occurred. Please try again.'
                        : $e->getMessage(),
                ], 500);
            }
        });

    })->create();
