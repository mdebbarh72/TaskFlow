<?php

namespace App\Modules\Auth\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Auth\Requests\LoginRequest;
use App\Modules\Auth\Services\LoginService;
use Illuminate\Http\JsonResponse;

class LoginController extends Controller
{
    public function __construct(private LoginService $loginService) {}

    public function store(LoginRequest $request): JsonResponse
    {
        $result = $this->loginService->handle($request->toDTO());
        return response()->json($result);
    }

    public function destroy(): JsonResponse
    {
        auth()->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out']);
    }
}
