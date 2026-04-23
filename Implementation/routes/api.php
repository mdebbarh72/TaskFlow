<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // Auth (public)
    Route::prefix('auth')->group(function () {
        Route::post('register',          [\App\Modules\Auth\Controllers\RegisterController::class,          'store']);
        Route::post('login',             [\App\Modules\Auth\Controllers\LoginController::class,             'store']);
        Route::post('verify-otp',        [\App\Modules\Auth\Controllers\OTPController::class,               'verify']);
        Route::post('forgot-password',   [\App\Modules\Auth\Controllers\PasswordResetController::class,     'request']);
        Route::post('reset-password',    [\App\Modules\Auth\Controllers\PasswordResetController::class,     'reset']);
        Route::get ('verify-email/{id}', [\App\Modules\Auth\Controllers\EmailVerificationController::class, 'verify'])->name('verification.verify');
    });

    // Authenticated routes
    Route::middleware('auth:sanctum')->group(function () {

        Route::post('auth/logout', [\App\Modules\Auth\Controllers\LoginController::class, 'destroy']);

        // Users 
        Route::get   ('profile',  [\App\Modules\Users\Controllers\ProfileController::class, 'show']);
        Route::put   ('profile',  [\App\Modules\Users\Controllers\ProfileController::class, 'update']);
        Route::patch ('password', [\App\Modules\Users\Controllers\ProfileController::class, 'changePassword']);

        //  Projects
        Route::apiResource('projects', \App\Modules\Projects\Controllers\ProjectController::class);
        Route::post  ('projects/{project}/invite',         [\App\Modules\Projects\Controllers\MembershipController::class,       'invite']);
        Route::delete('projects/{project}/members/{user}', [\App\Modules\Projects\Controllers\MembershipController::class,       'remove']);

        // Project views
        Route::get('projects/{project}/backlog',    [\App\Modules\Projects\Controllers\ProjectBacklogController::class,   'index']);
        Route::get('projects/{project}/board',      [\App\Modules\Projects\Controllers\ProjectBoardController::class,     'index']);
        Route::get('projects/{project}/dashboard',  [\App\Modules\Projects\Controllers\DashboardController::class,        'index']);
        Route::get('projects/{project}/activity',   [\App\Modules\Collaboration\Controllers\ActivityLogController::class, 'index']);

        // Project-wide card + sprint lists
        Route::get('projects/{project}/cards',      [\App\Modules\Board\Controllers\CardController::class,   'projectIndex']);
        Route::get('projects/{project}/sprints',    [\App\Modules\Board\Controllers\SprintController::class, 'index']);

        // Board 
        // Sprints (nested under project for create; standalone for update/delete/start/complete)
        Route::post  ('projects/{project}/sprints',           [\App\Modules\Board\Controllers\SprintController::class, 'store']);
        Route::get   ('sprints/{sprint}',                     [\App\Modules\Board\Controllers\SprintController::class, 'show']);
        Route::put   ('sprints/{sprint}',                     [\App\Modules\Board\Controllers\SprintController::class, 'update']);
        Route::patch ('sprints/{sprint}',                     [\App\Modules\Board\Controllers\SprintController::class, 'update']);
        Route::delete('sprints/{sprint}',                     [\App\Modules\Board\Controllers\SprintController::class, 'destroy']);
        Route::patch ('sprints/{sprint}/start',               [\App\Modules\Board\Controllers\SprintController::class, 'start']);
        Route::patch ('sprints/{sprint}/complete',            [\App\Modules\Board\Controllers\SprintController::class, 'complete']);

        // Cards
        Route::get   ('sprints/{sprint}/cards',               [\App\Modules\Board\Controllers\CardController::class, 'index']);
        Route::post  ('projects/{project}/cards',             [\App\Modules\Board\Controllers\CardController::class, 'store']);
        Route::get   ('cards/{card}',                         [\App\Modules\Board\Controllers\CardController::class, 'show']);
        Route::put   ('cards/{card}',                         [\App\Modules\Board\Controllers\CardController::class, 'update']);
        Route::patch ('cards/{card}',                         [\App\Modules\Board\Controllers\CardController::class, 'update']);
        Route::delete('cards/{card}',                         [\App\Modules\Board\Controllers\CardController::class, 'destroy']);
        Route::patch ('cards/{card}/move',                    [\App\Modules\Board\Controllers\CardController::class, 'move']);
        Route::patch ('cards/{card}/assign',                  [\App\Modules\Board\Controllers\CardController::class, 'assign']);
        Route::patch ('cards/{card}/sprint',                  [\App\Modules\Board\Controllers\CardController::class, 'assignSprint']);

        // Collaboration 
        Route::get ('cards/{card}/comments',                  [\App\Modules\Collaboration\Controllers\CommentController::class, 'index']);
        Route::post('cards/{card}/comments',                  [\App\Modules\Collaboration\Controllers\CommentController::class, 'store']);

        // Admin (requires global admin role)
        Route::middleware('admin')->prefix('admin')->group(function () {
            Route::get ('stats',              [\App\Modules\Admin\Controllers\AdminController::class, 'stats']);
            Route::get ('users',              [\App\Modules\Admin\Controllers\AdminController::class, 'users']);
            Route::patch('users/{user}/ban',  [\App\Modules\Admin\Controllers\AdminController::class, 'ban']);
            Route::patch('users/{user}/unban',[\App\Modules\Admin\Controllers\AdminController::class, 'unban']);
        });
    });
});
