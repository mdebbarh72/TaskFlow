<?php

namespace App\Modules\Collaboration\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Board\Models\Card;
use App\Modules\Collaboration\Models\Comment;
use App\Modules\Collaboration\Requests\CreateCommentRequest;
use App\Modules\Collaboration\Services\CommentService;
use Illuminate\Http\JsonResponse;

class CommentController extends Controller
{
    public function __construct(
        private CommentService $commentService,
    ) {}

    public function index(Card $card): JsonResponse
    {
        $this->authorize('view', $card);

        return response()->json($this->commentService->getForCard($card->id));
    }

    public function store(CreateCommentRequest $request): JsonResponse
    {
        $comment = $this->commentService->create($request->toDTO());

        return response()->json($comment, 201);
    }
}
