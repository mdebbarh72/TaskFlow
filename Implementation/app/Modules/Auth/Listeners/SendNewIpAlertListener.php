<?php

namespace App\Modules\Auth\Listeners;

use App\Modules\Auth\Events\NewIpLoginAttempt;
use App\Infrastructure\Email\Contracts\MailerInterface;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendNewIpAlertListener implements ShouldQueue
{
    public function __construct(private MailerInterface $mailer) {}

    public function handle(NewIpLoginAttempt $event): void
    {
        $this->mailer->sendNewIpLogin($event->user, $event->ipAddress);
    }
}
