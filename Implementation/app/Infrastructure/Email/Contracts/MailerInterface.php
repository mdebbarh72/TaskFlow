<?php

namespace App\Infrastructure\Email\Contracts;

use App\Modules\Users\Models\User;
use App\Modules\Projects\Models\Project;

interface MailerInterface
{
    public function sendVerification(User $user, string $url): void;
    public function sendPasswordReset(User $user, string $otp): void;
    public function sendProjectInvitation(string $to, Project $project, string $inviteUrl): void;
    public function sendProjectShared(string $to, Project $project, string $viewUrl): void;
    public function sendWelcome(User $user): void;
    public function sendNewIpLogin(User $user, string $otp): void;
    public function sendSuspiciousLogin(User $user, string $otp): void;
}
