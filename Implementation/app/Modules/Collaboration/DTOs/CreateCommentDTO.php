<?php

namespace App\Modules\Collaboration\DTOs;

class CreateCommentDTO
{
    public function __construct(
        public readonly int    $cardId,
        public readonly int    $userId,
        public readonly string $content,
    ) {}
}
