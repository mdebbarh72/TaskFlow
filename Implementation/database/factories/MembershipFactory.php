<?php

namespace Database\Factories;

use App\Modules\Projects\Models\Membership;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Membership>
 */
class MembershipFactory extends Factory
{
    protected $model = \App\Modules\Projects\Models\Membership::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'project_id' => \App\Modules\Projects\Models\Project::factory(),
            'user_id' => \App\Modules\Users\Models\User::factory(),
            'role' => \App\Shared\Enums\MembershipRole::MEMBER->value ?? 'member',
            'status' => \App\Shared\Enums\MembershipStatus::ACTIVE->value,
        ];
    }
}
