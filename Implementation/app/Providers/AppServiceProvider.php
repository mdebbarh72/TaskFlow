<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Event;
use App\Modules\Auth\Events\OTPGenerated;
use App\Modules\Auth\Events\UserRegistered;
use App\Modules\Auth\Listeners\SendOTPEmailListener;
use App\Modules\Auth\Listeners\SendWelcomeEmailListener;
use Illuminate\Support\Facades\Gate;
use App\Modules\Projects\Models\Project;
use App\Modules\Projects\Policies\ProjectPolicy;
use App\Modules\Board\Models\Card;
use App\Modules\Board\Models\Sprint;
use App\Modules\Board\Policies\CardPolicy;
use App\Modules\Board\Policies\SprintPolicy;
use App\Modules\Collaboration\Models\Comment;
use App\Modules\Collaboration\Policies\CommentPolicy;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            \App\Modules\Board\Repositories\Contracts\CardRepositoryInterface::class,
            \App\Modules\Board\Repositories\CardRepository::class
        );
        $this->app->bind(
            \App\Modules\Projects\Repositories\Contracts\ProjectRepositoryInterface::class,
            \App\Modules\Projects\Repositories\ProjectRepository::class
        );
        $this->app->bind(
            \App\Modules\Users\Repositories\Contracts\UserRepositoryInterface::class,
            \App\Modules\Users\Repositories\UserRepository::class
        );
        $this->app->bind(
            \App\Infrastructure\OTP\Contracts\OTPServiceInterface::class,
            \App\Infrastructure\OTP\OTPService::class
        );
        $this->app->bind(
            \App\Infrastructure\Email\Contracts\MailerInterface::class,
            \App\Infrastructure\Email\EmailService::class
        );
        $this->app->bind(
            \App\Modules\Projects\Repositories\Contracts\MembershipRepositoryInterface::class,
            \App\Modules\Projects\Repositories\MembershipRepository::class
        );
        $this->app->bind(
            \App\Modules\Board\Repositories\Contracts\SprintRepositoryInterface::class,
            \App\Modules\Board\Repositories\SprintRepository::class
        );
        $this->app->bind(
            \App\Modules\Collaboration\Repositories\Contracts\CommentRepositoryInterface::class,
            \App\Modules\Collaboration\Repositories\CommentRepository::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Project::class, ProjectPolicy::class);
        Gate::policy(Card::class, CardPolicy::class);
        Gate::policy(Sprint::class, SprintPolicy::class);
        Gate::policy(Comment::class, CommentPolicy::class);

        Event::listen(OTPGenerated::class, SendOTPEmailListener::class);
        Event::listen(UserRegistered::class, SendWelcomeEmailListener::class);
    }
}
