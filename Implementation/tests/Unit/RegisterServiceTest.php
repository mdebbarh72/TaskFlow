<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Modules\Auth\Services\RegisterService;
use App\Modules\Auth\DTOs\RegisterDTO;
use App\Modules\Users\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use App\Modules\Auth\Events\UserRegistered;
use Illuminate\Support\Facades\Hash;

class RegisterServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_register_user_and_dispatch_event(): void
    {
        Event::fake();

        $service = app(RegisterService::class);

        $dto = new RegisterDTO(
            username: 'TestUser',
            email: 'test@example.com',
            password: 'password123'
        );

        $user = $service->handle($dto);

        $this->assertInstanceOf(User::class, $user);
        $this->assertEquals('TestUser', $user->name);
        $this->assertEquals('test@example.com', $user->email);
        $this->assertTrue(Hash::check('password123', $user->password));

        Event::assertDispatched(UserRegistered::class, function ($event) use ($user) {
            return $event->user->id === $user->id;
        });
    }
}
