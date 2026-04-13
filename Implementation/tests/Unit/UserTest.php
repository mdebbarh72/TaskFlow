<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Modules\Users\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_check_if_admin(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'user']);

        $this->assertTrue($admin->isAdmin());
        $this->assertFalse($user->isAdmin());
    }

    public function test_user_can_check_if_banned(): void
    {
        $banned = User::factory()->create(['status' => 'banned']);
        $active = User::factory()->create(['status' => 'active']);

        $this->assertTrue($banned->isBanned());
        $this->assertFalse($active->isBanned());
    }
}
