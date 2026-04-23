<?php

namespace App\Modules\Collaboration\Requests;

use App\Modules\Board\Models\Card;
use App\Modules\Collaboration\DTOs\CreateCommentDTO;
use App\Modules\Collaboration\Models\Comment;
use Illuminate\Foundation\Http\FormRequest;

class CreateCommentRequest extends FormRequest
{
    public function authorize(): bool
    {
        $card = $this->route('card');

        return $card instanceof Card
            && $this->user()->can('create', [Comment::class, $card]);
    }

    public function rules(): array
    {
        return [
            'content' => 'required|string',
        ];
    }

    public function toDTO(): CreateCommentDTO
    {
        return new CreateCommentDTO(
            cardId:  $this->route('card')->id,
            userId:  $this->user()->id,
            content: $this->validated('content'),
        );
    }
}
