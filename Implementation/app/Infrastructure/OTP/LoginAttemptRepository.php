<?php

namespace App\Infrastructure\OTP;

use Illuminate\Support\Facades\DB;

class LoginAttemptRepository
{
    public function record(string $email, string $ipAddress): int
    {
        DB::table('login_attempts')->insert([
            'email'      => $email,
            'ip_address' => $ipAddress,
            'created_at' => now(),
        ]);

        return DB::table('login_attempts')
            ->where('email', $email)
            ->where('created_at', '>=', now()->subMinutes(30))
            ->count();
    }

    public function clearFor(string $email): void
    {
        DB::table('login_attempts')->where('email', $email)->delete();
    }
}
