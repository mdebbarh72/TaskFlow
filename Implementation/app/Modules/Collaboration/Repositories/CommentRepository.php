<?php

namespace App\Modules\Collaboration\Repositories;

use App\Modules\Collaboration\Models\Comment;
use App\Modules\Collaboration\Repositories\Contracts\CommentRepositoryInterface;

class CommentRepository implements CommentRepositoryInterface
{
    public function create(array $data): Comment
    {
        return Comment::create($data);
    }

    public function findByCard(int $cardId)
    {
        return Comment::where('card_id', $cardId)->with('user')->get();
    }
}
