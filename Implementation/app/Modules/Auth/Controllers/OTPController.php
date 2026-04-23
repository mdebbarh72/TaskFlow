<?php

namespace App\Modules\Auth\Controllers;

use App\Http\Controllers\Controller;
use App\Infrastructure\OTP\Contracts\OTPServiceInterface;
use App\Infrastructure\OTP\DTOs\VerifyOTPDTO;
use App\Shared\Enums\OTPPurpose;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Modules\Users\Models\User;
use Illuminate\Support\Facades\DB;

class OTPController extends Controller
{
    public function __construct(private OTPServiceInterface $otpService) {}

    public function verify(Request $request): JsonResponse
    {
        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'code'    => 'required|string|size:6',
            'purpose' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $validator->errors()
            ], 422);
        }

        $purpose = OTPPurpose::from($request->purpose);
        $user = User::findOrFail($request->user_id);

        $isValid = $this->otpService->verify(new VerifyOTPDTO(
            userId: (int) $request->user_id,
            purpose: $purpose,
            code: $request->code
        ));

        if (!$isValid) {
            return response()->json(['message' => 'Invalid OTP code'], 422);
        }

        $data = ['message' => 'OTP verified successfully'];

        if (in_array($purpose, [OTPPurpose::NEW_IP, OTPPurpose::SUSPICIOUS_LOGIN])) {
            $data['token'] = $user->createToken('auth')->plainTextToken;
            
            DB::table('known_ips')->updateOrInsert(
                ['user_id' => $user->id, 'ip_address' => $request->ip()],
                ['first_seen_at' => now()]
            );
        }

        return response()->json($data);
    }
}
