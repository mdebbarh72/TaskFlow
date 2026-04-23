<?php

namespace App\Modules\Board\Requests;

use App\Modules\Board\DTOs\UpdateCardDTO;
use App\Shared\Enums\CardPriority;
use App\Shared\Enums\CardStatus;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCardRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('card'));
    }

    public function rules(): array
    {
        return [
            'title'       => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'status'      => 'nullable|string|in:todo,doing,done',
            'priority'    => 'nullable|string|in:low,medium,high,blocker',
            'assignee_id' => 'nullable|exists:users,id',
            'sprint_id'   => 'nullable|exists:sprints,id',
        ];
    }

    public function toDTO(): UpdateCardDTO
    {
        $validated = $this->validated();
        $updateSprint = array_key_exists('sprint_id', $validated);

        return new UpdateCardDTO(
            title:        $validated['title'] ?? null,
            description:  $validated['description'] ?? null,
            status:       isset($validated['status']) ? CardStatus::from($validated['status']) : null,
            priority:     isset($validated['priority']) ? CardPriority::from($validated['priority']) : null,
            assigneeId:   isset($validated['assignee_id']) ? (int) $validated['assignee_id'] : null,
            sprintId:     isset($validated['sprint_id']) ? (int) $validated['sprint_id'] : null,
            updateSprint: $updateSprint,
        );
    }
}
