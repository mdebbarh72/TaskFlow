<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Modules\Projects\Models\Project;
use App\Modules\Users\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProjectTest extends TestCase
{
    use RefreshDatabase;

    public function test_project_belongs_to_owner(): void
    {
        $owner = User::factory()->create();
        $project = Project::factory()->create(['owner_id' => $owner->id]);

        $this->assertInstanceOf(User::class, $project->owner);
        $this->assertEquals($owner->id, $project->owner->id);
    }

    public function test_project_has_memberships(): void
    {
        $project = Project::factory()->create();
        \App\Modules\Projects\Models\Membership::factory(3)->create(['project_id' => $project->id]);

        $this->assertCount(3, $project->memberships);
    }
}
