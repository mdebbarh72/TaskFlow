<?php

namespace App\Modules\Board\Requests;

use App\Modules\Board\DTOs\CreateCardDTO;
use App\Modules\Board\Models\Card;
use App\Modules\Projects\Models\Project;
use App\Shared\Enums\CardPriority;
use Illuminate\Foundation\Http\FormRequest;

class CreateCardRequest extends FormRequest
{
    public function authorize(): bool
    {
        $project = Project::find($this->input('project_id'));

        if (!$project) {
            return true; // Let validation report the missing project
        }

        return $this->user()->can('create', [Card::class, $project]);
    }

    public function rules(): array
    {
        return [
            'project_id'  => 'required|exists:projects,id',
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'sprint_id'   => 'nullable|exists:sprints,id',
            'priority'    => 'required|string|in:low,medium,high,blocker',
        ];
    }

    public function toDTO(): CreateCardDTO
    {
        return new CreateCardDTO(
            title:       $this->validated('title'),
            description: $this->validated('description'),
            projectId:   (int) $this->validated('project_id'),
            sprintId:    $this->validated('sprint_id') ? (int) $this->validated('sprint_id') : null,
            priority:    CardPriority::from($this->validated('priority')),
            createdBy:   $this->user()->id,
        );
    }
}
