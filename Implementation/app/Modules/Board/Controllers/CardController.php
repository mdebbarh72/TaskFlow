<?php

namespace App\Modules\Board\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Board\DTOs\AssignCardDTO;
use App\Modules\Board\DTOs\MoveCardDTO;
use App\Modules\Board\DTOs\UpdateCardDTO;
use App\Modules\Board\Models\Card;
use App\Modules\Board\Models\Sprint;
use App\Modules\Board\Requests\CreateCardRequest;
use App\Modules\Board\Requests\UpdateCardRequest;
use App\Modules\Board\Services\CardService;
use App\Modules\Projects\Models\Project;
use App\Shared\Enums\CardStatus;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CardController extends Controller
{
    public function __construct(
        private CardService $cardService,
    ) {}

    /** List cards for a specific sprint. */
    public function index(Sprint $sprint): JsonResponse
    {
        $this->authorize('viewAny', [Card::class, $sprint->project]);

        return response()->json($sprint->cards);
    }

    /** List all cards in a project (for project-wide card list). */
    public function projectIndex(Project $project): JsonResponse
    {
        $this->authorize('viewAny', [Card::class, $project]);

        return response()->json(
            $project->cards()->with(['sprint', 'assignee'])->get()
        );
    }

    public function store(CreateCardRequest $request): JsonResponse
    {
        $card = $this->cardService->create($request->toDTO());

        return response()->json($card, 201);
    }

    public function show(Card $card): JsonResponse
    {
        $this->authorize('view', $card);

        return response()->json($card);
    }

    public function update(UpdateCardRequest $request, Card $card): JsonResponse
    {
        $this->cardService->update($card, $request->toDTO());

        return response()->json($card->fresh());
    }

    public function destroy(Card $card): JsonResponse
    {
        $this->authorize('delete', $card);
        $this->cardService->delete($card);

        return response()->json(['message' => 'Card deleted successfully.']);
    }

    public function move(Request $request, Card $card): JsonResponse
    {
        $this->authorize('move', $card);

        $request->validate(['status' => 'required|string|in:todo,doing,done']);

        $this->cardService->move(new MoveCardDTO(
            cardId:    $card->id,
            newStatus: CardStatus::from($request->status),
            movedBy:   auth()->id(),
        ));

        return response()->json(['message' => 'Card moved successfully.']);
    }

    public function assign(Request $request, Card $card): JsonResponse
    {
        $this->authorize('assign', $card);

        $request->validate(['assignee_id' => 'required|exists:users,id']);

        $this->cardService->assign(new AssignCardDTO(
            cardId:     $card->id,
            assigneeId: (int) $request->assignee_id,
            assignedBy: auth()->id(),
        ));

        return response()->json(['message' => 'Card assigned successfully.']);
    }

    /** Assign or remove a card from a sprint (move to/from backlog). */
    public function assignSprint(Request $request, Card $card): JsonResponse
    {
        $this->authorize('update', $card);

        $request->validate(['sprint_id' => 'nullable|exists:sprints,id']);

        $this->cardService->update($card, new UpdateCardDTO(
            sprintId: $request->sprint_id ? (int) $request->sprint_id : null,
        ));

        return response()->json(['message' => 'Card sprint assignment updated.']);
    }
}
