<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 5 projects
        \App\Modules\Projects\Models\Project::factory(5)->create()->each(function ($project) {
            // For each project, create 3 memberships
            \App\Modules\Projects\Models\Membership::factory(3)->create(['project_id' => $project->id]);

            // For each project, create 2 sprints
            $sprints = \App\Modules\Board\Models\Sprint::factory(2)->create(['project_id' => $project->id]);

            // For each sprint, create 5 cards
            foreach ($sprints as $sprint) {
                \App\Modules\Board\Models\Card::factory(5)->create([
                    'project_id' => $project->id,
                    'sprint_id' => $sprint->id,
                ]);
            }
        });
    }
}
