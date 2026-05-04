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
        if (is_string($card)) {
            $card = \App\Modules\Board\Models\Card::find($card);
        }

        return $card instanceof \App\Modules\Board\Models\Card
            && $this->user()->can('create', [\App\Modules\Collaboration\Models\Comment::class, $card]);
    }

    public function rules(): array
    {
        return [
            'description' => 'required|string',
        ];
    }

    public function toDTO(): CreateCommentDTO
    {
        $card = $this->route('card');
        $cardId = $card instanceof \App\Modules\Board\Models\Card ? $card->id : (int) $card;

        return new CreateCommentDTO(
            cardId:  $cardId,
            userId:  $this->user()->id,
            description: $this->validated('description'),
        );
    }
}
