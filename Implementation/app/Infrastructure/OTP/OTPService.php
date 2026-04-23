<?php

namespace App\Infrastructure\OTP;

use App\Infrastructure\OTP\Contracts\OTPServiceInterface;
use App\Infrastructure\OTP\DTOs\GenerateOTPDTO;
use App\Infrastructure\OTP\DTOs\VerifyOTPDTO;
use App\Shared\Exceptions\OTPExpiredException;
use Illuminate\Support\Facades\Hash;
use App\Modules\Auth\Events\OTPGenerated;

class OTPService implements OTPServiceInterface
{
    public function __construct(private OTPRepository $repo) {}

    public function generate(GenerateOTPDTO $dto): void
    {
        $code = random_int(100000, 999999);
        $this->repo->store(
            userId:    $dto->userId,
            purpose:   $dto->purpose,
            codeHash:  Hash::make($code),
            expiresAt: now()->addMinutes(10)
        );
        OTPGenerated::dispatch($dto->userId, $dto->purpose, $code);
    }

    public function verify(VerifyOTPDTO $dto): bool
    {
        $record = $this->repo->findLatest($dto->userId, $dto->purpose);
        if (!$record || $record->expires_at->isPast()) {
            throw new OTPExpiredException();
        }
        return Hash::check($dto->code, $record->code_hash);
    }
}
