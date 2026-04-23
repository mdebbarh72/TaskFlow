<?php

namespace App\Modules\Collaboration\Services;

use App\Modules\Collaboration\Repositories\Contracts\CommentRepositoryInterface;
use App\Modules\Collaboration\DTOs\CreateCommentDTO;
use App\Modules\Collaboration\Models\Comment;
use App\Modules\Collaboration\DTOs\LogActivityDTO;
use App\Modules\Collaboration\Services\ActivityLogService;

class CommentService
{
    public function __construct(
        private CommentRepositoryInterface $comments,
        private ActivityLogService         $activityLogger,
    ) {}

    public function create(CreateCommentDTO $dto): Comment
    {
        $comment = $this->comments->create([
            'card_id' => $dto->cardId,
            'user_id' => $dto->userId,
            'content' => $dto->content,
        ]);

        $this->activityLogger->log(new LogActivityDTO(
            userId:         $dto->userId,
            action:         'comment_added',
            actionableId:   $comment->id,
            actionableType: Comment::class,
        ));

        return $comment;
    }

    public function getForCard(int $cardId)
    {
        return $this->comments->findByCard($cardId);
    }
}
