<?php

namespace App\Modules\Board\Requests;

use App\Modules\Board\DTOs\CreateSprintDTO;
use App\Modules\Board\Models\Sprint;
use App\Modules\Projects\Models\Project;
use Illuminate\Foundation\Http\FormRequest;

class CreateSprintRequest extends FormRequest
{
    public function authorize(): bool
    {
        $projectParam = $this->route('project');
        
        // If route model binding didn't happen (common in modular structures or non-resource routes)
        $project = $projectParam instanceof Project 
            ? $projectParam 
            : Project::find($projectParam);

        return $project instanceof Project
            && $this->user()->can('create', [Sprint::class, $project]);
    }

    public function rules(): array
    {
        return [
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date'  => 'nullable|date',
            'end_date'    => 'nullable|date|after_or_equal:start_date',
        ];
    }

    public function toDTO(): CreateSprintDTO
    {
        return new CreateSprintDTO(
            name:        $this->validated('name'),
            projectId:   is_object($this->route('project')) ? $this->route('project')->id : (int)$this->route('project'),
            description: $this->validated('description'),
            startDate:   $this->validated('start_date'),
            endDate:     $this->validated('end_date'),
        );
    }
}
