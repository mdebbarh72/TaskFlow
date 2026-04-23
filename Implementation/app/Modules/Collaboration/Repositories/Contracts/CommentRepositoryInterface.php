<?php

namespace App\Modules\Collaboration\Repositories\Contracts;

use App\Modules\Collaboration\Models\Comment;

interface CommentRepositoryInterface
{
    public function create(array $data): Comment;
    public function findByCard(int $cardId);
}
