<?php

namespace App\Modules\Projects\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Auth\Access\AuthorizationException;
use App\Modules\Projects\DTOs\UpdateProjectDTO;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateProjectRequest extends FormRequest
{
    private ?string $authorizationMessage = null;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $project = $this->route('project');
        $response = Gate::inspect('update', $project);
        if ($response->denied()) {
            $this->authorizationMessage = $response->message();
            return false;
        }
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'        => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
        ];
    }

    /**
     * Handle a failed authorization attempt.
     *
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    protected function failedAuthorization()
    {
        throw new HttpResponseException(response()->json([
            'message' => $this->authorizationMessage ?? 'Only the project owner can update this project.'
        ], 403));
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'name.string' => 'The project name must be a valid string.',
        ];
    }

    public function toDTO(): UpdateProjectDTO
    {
        return new UpdateProjectDTO(
            name: $this->validated('name'),
            description: $this->validated('description'),
        );
    }
}
