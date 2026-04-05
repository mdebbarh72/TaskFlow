<?php

namespace Database\Factories;

use App\Modules\Board\Models\Sprint;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Sprint>
 */
class SprintFactory extends Factory
{
    protected $model = \App\Modules\Board\Models\Sprint::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'project_id' => \App\Modules\Projects\Models\Project::factory(),
            'name' => 'Sprint ' . fake()->numberBetween(1, 100),
            'start_date' => fake()->dateTimeBetween('-1 month', 'now'),
            'end_date' => fake()->dateTimeBetween('now', '+1 month'),
            'status' => fake()->randomElement(['planned', 'active', 'completed']),
            'description' => fake()->sentence(),
        ];
    }
}
