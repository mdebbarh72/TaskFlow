<?php

namespace App\Modules\Auth\Listeners;

use App\Modules\Auth\Events\UserRegistered;
use App\Infrastructure\Email\Contracts\MailerInterface;
use Illuminate\Support\Facades\URL;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendWelcomeEmailListener implements ShouldQueue
{
    public function __construct(private MailerInterface $mailer) {}

    public function handle(UserRegistered $event): void
    {
        $this->mailer->sendWelcome($event->user);

        $url = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $event->user->id]
        );

        $this->mailer->sendVerification($event->user, $url);
    }
}
