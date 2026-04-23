<?php

namespace App\Modules\Auth\Listeners;

use App\Modules\Auth\Events\SuspiciousLoginDetected;
use App\Infrastructure\Email\Contracts\MailerInterface;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendSuspiciousLoginAlertListener implements ShouldQueue
{
    public function __construct(private MailerInterface $mailer) {}

    public function handle(SuspiciousLoginDetected $event): void
    {
        $this->mailer->sendSuspiciousLogin($event->user, $event->ipAddress);
    }
}
