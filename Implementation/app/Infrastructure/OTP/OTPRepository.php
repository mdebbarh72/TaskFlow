<?php

namespace App\Infrastructure\OTP;

use App\Shared\Enums\OTPPurpose;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class OTPRepository
{
    public function store(int $userId, OTPPurpose $purpose, string $codeHash, Carbon $expiresAt): void
    {
        DB::table('otps')->insert([
            'user_id'    => $userId,
            'purpose'    => $purpose->value,
            'code_hash'  => $codeHash,
            'expires_at' => $expiresAt,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function findLatest(int $userId, OTPPurpose $purpose): ?object
    {
        $record = DB::table('otps')
            ->where('user_id', $userId)
            ->where('purpose', $purpose->value)
            ->orderBy('created_at', 'desc')
            ->first();

        if ($record) {
            $record->expires_at = Carbon::parse($record->expires_at);
        }

        return $record;
    }
}
