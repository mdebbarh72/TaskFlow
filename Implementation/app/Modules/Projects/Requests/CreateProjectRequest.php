<?php

namespace App\Modules\Projects\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use App\Modules\Projects\Models\Project;
use Illuminate\Auth\Access\AuthorizationException;
use App\Modules\Projects\DTOs\CreateProjectDTO;
use Illuminate\Http\Exceptions\HttpResponseException;

class CreateProjectRequest extends FormRequest
{
    private ?string $authorizationMessage = null;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $response = Gate::inspect('create', Project::class);
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
            'name'        => 'required|string|max:255',
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
            'message' => $this->authorizationMessage ?? 'You are not authorized to create projects.'
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
            'name.required' => 'The project name is required.',
            'name.string'   => 'The project name must be a string.',
        ];
    }

    public function toDTO(): CreateProjectDTO
    {
        return new CreateProjectDTO(
            name: $this->validated('name'),
            description: $this->validated('description'),
            ownerId: $this->user()->id,
        );
    }
}
