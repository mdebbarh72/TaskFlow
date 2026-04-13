<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Modules\Auth\Services\LoginService;
use App\Modules\Auth\DTOs\LoginDTO;
use App\Modules\Users\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Shared\Exceptions\InvalidCredentialsException;

class LoginServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_throws_exception_on_invalid_credentials(): void
    {
        $service = app(LoginService::class);
        
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123')
        ]);

        $dto = new LoginDTO(
            email: 'test@example.com',
            password: 'wrongpassword',
            ipAddress: '127.0.0.1'
        );

        $this->expectException(InvalidCredentialsException::class);
        $service->handle($dto);
    }

    public function test_login_returns_token_for_valid_credentials(): void
    {
        $service = app(LoginService::class);
        
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123')
        ]);

        // Manually insert known IP to avoid OTP flow
        \Illuminate\Support\Facades\DB::table('known_ips')->insert([
            'user_id' => $user->id,
            'ip_address' => '127.0.0.1',
            'first_seen_at' => now(),
        ]);

        $dto = new LoginDTO(
            email: 'test@example.com',
            password: 'password123',
            ipAddress: '127.0.0.1'
        );

        $result = $service->handle($dto);

        $this->assertArrayHasKey('token', $result);
    }
}
