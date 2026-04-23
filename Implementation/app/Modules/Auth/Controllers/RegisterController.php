<?php

namespace App\Modules\Auth\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Auth\Requests\RegisterRequest;
use App\Modules\Auth\Services\RegisterService;
use Illuminate\Http\JsonResponse;

class RegisterController extends Controller
{
    public function __construct(private RegisterService $registerService) {}

    public function store(RegisterRequest $request): JsonResponse
    {
        $user = $this->registerService->handle($request->toDTO());
        return response()->json([
            'message' => 'User registered successfully',
            'user'    => $user
        ], 201);
    }
}
