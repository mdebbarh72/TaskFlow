<?php

namespace Database\Factories;

use App\Modules\Board\Models\Card;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Card>
 */
class CardFactory extends Factory
{
    protected $model = \App\Modules\Board\Models\Card::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'project_id' => \App\Modules\Projects\Models\Project::factory(),
            'sprint_id' => \App\Modules\Board\Models\Sprint::factory(),
            'title' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'status' => fake()->randomElement(['todo', 'in_progress', 'review', 'done']),
            'priority' => fake()->randomElement(['low', 'medium', 'high', 'urgent']),
            'assignee_id' => \App\Modules\Users\Models\User::factory(),
            'created_by' => \App\Modules\Users\Models\User::factory(),
        ];
    }
}
