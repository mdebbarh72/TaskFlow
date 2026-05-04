<?php

namespace App\Modules\Auth\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Auth\Services\EmailVerificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmailVerificationController extends Controller
{
    public function __construct(private EmailVerificationService $verificationService) {}

    public function verify(Request $request, int $id)
    {
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');

        if (!$request->hasValidSignature()) {
            return redirect($frontendUrl . '/email-verification?status=error');
        }

        $this->verificationService->verify($id);

        return redirect($frontendUrl . '/email-verification?status=success');
    }
}
