<?php

namespace App\Modules\Auth\Listeners;

use App\Modules\Auth\Events\OTPGenerated;
use App\Infrastructure\Email\Contracts\MailerInterface;
use App\Modules\Users\Models\User;
use App\Shared\Enums\OTPPurpose;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendOTPEmailListener implements ShouldQueue
{
    public function __construct(private MailerInterface $mailer) {}

    public function handle(OTPGenerated $event): void
    {
        $user = User::find($event->userId);
        if (!$user) return;

        match($event->purpose) {
            OTPPurpose::PASSWORD_RESET    => $this->mailer->sendPasswordReset($user, $event->code),
            OTPPurpose::SUSPICIOUS_LOGIN  => $this->mailer->sendSuspiciousLogin($user, $event->code),
            OTPPurpose::NEW_IP            => $this->mailer->sendNewIpLogin($user, $event->code),
        };
    }
}
