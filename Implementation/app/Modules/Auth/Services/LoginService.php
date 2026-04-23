<?php

namespace App\Modules\Auth\Services;

use App\Modules\Auth\DTOs\LoginDTO;
use App\Modules\Users\Models\User;
use App\Modules\Users\Repositories\Contracts\UserRepositoryInterface;
use App\Infrastructure\OTP\Contracts\OTPServiceInterface;
use App\Infrastructure\OTP\LoginAttemptRepository;
use App\Infrastructure\OTP\DTOs\GenerateOTPDTO;
use App\Shared\Enums\OTPPurpose;
use App\Modules\Auth\Events\UserLoggedIn;
use Illuminate\Support\Facades\Hash;
use App\Shared\Exceptions\InvalidCredentialsException;
use Illuminate\Support\Facades\DB;

class LoginService
{
    public function __construct(
        private UserRepositoryInterface $users,
        private OTPServiceInterface     $otp,
        private LoginAttemptRepository  $attempts,
    ) {}

    public function handle(LoginDTO $dto): array
    {
        $user = $this->users->findByEmail($dto->email);

        if (!$user || !Hash::check($dto->password, $user->password)) {
            $count = $this->attempts->record($dto->email, $dto->ipAddress);
            if ($count >= 5) {
                if ($user) {
                    $this->otp->generate(new GenerateOTPDTO(
                        userId:    $user->id,
                        purpose:   OTPPurpose::SUSPICIOUS_LOGIN,
                        ipAddress: $dto->ipAddress
                    ));
                }
            }
            throw new InvalidCredentialsException();
        }

        // Security check: Reject banned users
        if ($user->isBanned()) {
            $user->tokens()->delete(); // Revoke current tokens
            throw new \Illuminate\Auth\Access\AuthorizationException("Your account has been banned. Please contact support.");
        }

        // New IP address → require OTP before allowing login
        if ($this->isNewIp($user, $dto->ipAddress)) {
            $this->otp->generate(new GenerateOTPDTO(
                userId:    $user->id,
                purpose:   OTPPurpose::NEW_IP,
                ipAddress: $dto->ipAddress
            ));
            return [
                'requires_otp' => true,
                'user_id' => $user->id,
                'purpose' => OTPPurpose::NEW_IP->value,
                'message' => 'OTP verification is required for login from a new IP address.',
            ];
        }

        // All clear
        $this->recordKnownIp($user, $dto->ipAddress);
        $token = $user->createToken('auth')->plainTextToken;
        $this->attempts->clearFor($dto->email);
        UserLoggedIn::dispatch($user, $dto->ipAddress);
        return ['token' => $token];
    }

    private function recordKnownIp(User $user, string $ip): void
    {
        DB::table('known_ips')->updateOrInsert(
            ['user_id' => $user->id, 'ip_address' => $ip],
            ['first_seen_at' => now()]
        );
    }

    private function isNewIp(User $user, string $ip): bool
    {
        return !DB::table('known_ips')
            ->where('user_id', $user->id)
            ->where('ip_address', $ip)
            ->exists();
    }
}
