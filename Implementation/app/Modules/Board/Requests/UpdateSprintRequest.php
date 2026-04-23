<?php

namespace App\Modules\Board\Requests;

use App\Modules\Board\DTOs\UpdateSprintDTO;
use App\Modules\Board\Models\Sprint;
use App\Shared\Enums\SprintStatus;
use Illuminate\Foundation\Http\FormRequest;

class UpdateSprintRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('sprint'));
    }

    public function rules(): array
    {
        return [
            'name'        => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'start_date'  => 'nullable|date',
            'end_date'    => 'nullable|date|after_or_equal:start_date',
        ];
    }

    public function toDTO(): UpdateSprintDTO
    {
        return new UpdateSprintDTO(
            name:        $this->validated('name'),
            description: $this->validated('description'),
            startDate:   $this->validated('start_date'),
            endDate:     $this->validated('end_date'),
        );
    }
}
