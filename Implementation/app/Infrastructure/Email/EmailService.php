<?php

namespace App\Infrastructure\Email;

use App\Infrastructure\Email\Contracts\MailerInterface;
use App\Modules\Users\Models\User;
use App\Modules\Projects\Models\Project;
use Illuminate\Support\Facades\Mail;
use App\Infrastructure\Email\Templates\VerificationEmail;
use App\Infrastructure\Email\Templates\PasswordResetEmail;
use App\Infrastructure\Email\Templates\ProjectInvitationEmail;
use App\Infrastructure\Email\Templates\ProjectSharedEmail;
use App\Infrastructure\Email\Templates\WelcomeEmail;
use App\Infrastructure\Email\Templates\NewIpLoginEmail;
use App\Infrastructure\Email\Templates\SuspiciousLoginEmail;

class EmailService implements MailerInterface
{
    public function sendVerification(User $user, string $url): void
    {
        Mail::to($user->email)->send(new VerificationEmail($user, $url));
    }

    public function sendPasswordReset(User $user, string $otp): void
    {
        Mail::to($user->email)->send(new PasswordResetEmail($user, $otp));
    }

    public function sendProjectInvitation(string $to, Project $project, string $inviteUrl): void
    {
        Mail::to($to)->send(new ProjectInvitationEmail($project, $inviteUrl));
    }

    public function sendProjectShared(string $to, Project $project, string $viewUrl): void
    {
        Mail::to($to)->send(new ProjectSharedEmail($project, $viewUrl));
    }

    public function sendWelcome(User $user): void
    {
        Mail::to($user->email)->send(new WelcomeEmail($user));
    }

    public function sendNewIpLogin(User $user, string $otp): void
    {
        Mail::to($user->email)->send(new NewIpLoginEmail($user, $otp));
    }

    public function sendSuspiciousLogin(User $user, string $otp): void
    {
        Mail::to($user->email)->send(new SuspiciousLoginEmail($user, $otp));
    }
}
