<?php

namespace App\Modules\Auth\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Auth\Services\PasswordResetService;
use App\Infrastructure\OTP\Contracts\OTPServiceInterface;
use App\Infrastructure\OTP\DTOs\VerifyOTPDTO;
use App\Shared\Enums\OTPPurpose;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PasswordResetController extends Controller
{
    public function __construct(
        private PasswordResetService $resetService,
        private OTPServiceInterface  $otpService
    ) {}

    public function request(Request $request): JsonResponse
    {
        $request->validate(['email' => 'required|email']);
        $this->resetService->requestReset($request->email);
        return response()->json(['message' => 'If the email exists, a reset code has been sent.']);
    }

    public function reset(Request $request): JsonResponse
    {
        $request->validate([
            'email'    => 'required|email|exists:users,email',
            'code'     => 'required|string|size:6',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = \App\Modules\Users\Models\User::where('email', $request->email)->first();

        $isValid = $this->otpService->verify(new VerifyOTPDTO(
            userId:  $user->id,
            purpose: OTPPurpose::PASSWORD_RESET,
            code:    $request->code
        ));

        if (!$isValid) {
            return response()->json(['message' => 'Invalid OTP code'], 422);
        }

        $this->resetService->reset($user->id, $request->password);

        return response()->json(['message' => 'Password reset successfully.']);
    }
}
