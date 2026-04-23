import React, { useState, useEffect } from 'react';
import api from '../../api.js';
import { toast } from 'react-hot-toast';
import TaskModal from './Forms/TaskModal';
import CardFormModal from './Forms/CardFormModal';

const BoardView = ({ projectId, currentUserRole }) => {
  const [boardData, setBoardData] = useState({
    columns: {
      todo: { id: 'todo', title: 'To Do', cardIds: [] },
      doing: { id: 'doing', title: 'Doing', cardIds: [] },
      reviewing: { id: 'reviewing', title: 'In Review', cardIds: [] },
      done: { id: 'done', title: 'Done', cardIds: [] },
    },
    cards: {},
  });
  const [loading, setLoading] = useState(true);
  const [draggingCard, setDraggingCard] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const canManage = currentUserRole === 'owner' || currentUserRole === 'manager';
  const canMove = currentUserRole !== 'viewer';

  useEffect(() => {
    fetchBoard();
  }, [projectId]);

  const fetchBoard = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/projects/${projectId}/board`);
      // Flatten cards from all active sprints
      const activeSprints = res.data.active_sprints || [];
      const cards = activeSprints.flatMap(sprint => 
        (sprint.cards || []).map(card => ({
          ...card,
          sprint: { name: sprint.name } // Ensure sprint name is available for the card UI
        }))
      );
      
      const newColumns = {
        todo: { id: 'todo', title: 'To Do', cardIds: [] },
        doing: { id: 'doing', title: 'Doing', cardIds: [] },
        reviewing: { id: 'reviewing', title: 'In Review', cardIds: [] },
        done: { id: 'done', title: 'Done', cardIds: [] },
      };

      const cardMap = {};
      cards.forEach(card => {
        cardMap[card.id] = card;
        if (newColumns[card.status]) {
          newColumns[card.status].cardIds.push(card.id);
        } else {
          // Fallback for unexpected statuses
          newColumns.todo.cardIds.push(card.id);
        }
      });

      setBoardData({
        columns: newColumns,
        cards: cardMap,
      });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch board';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const onDragStart = (e, cardId, sourceCol) => {
    if (!canMove) return;
    setDraggingCard(cardId);
    e.dataTransfer.setData('cardId', cardId);
    e.dataTransfer.setData('sourceCol', sourceCol);
    e.dataTransfer.effectAllowed = 'move';
    
    // Use a ghost image effect
    setTimeout(() => {
      const el = document.getElementById(`card-${cardId}`);
      if (el) el.style.opacity = '0.4';
    }, 0);
  };

  const onDragEnd = (e) => {
    // If setDraggingCard(null) was already called in onDrop, draggingCard might be null
    // But e.dataTransfer might still have the cardId or we can use the ID from the event target
    const targetId = e.target.id?.replace('card-', '');
    const cardId = draggingCard || targetId;
    
    if (cardId) {
      const el = document.getElementById(`card-${cardId}`);
      if (el) el.style.opacity = '1';
    }
    setDraggingCard(null);
  };

  const onDragOver = (e) => {
    if (!canMove) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('bg-[var(--color-primary)]/5', 'ring-2', 'ring-[var(--color-primary)]/20');
  };

  const onDragLeave = (e) => {
    e.currentTarget.classList.remove('bg-[var(--color-primary)]/5', 'ring-2', 'ring-[var(--color-primary)]/20');
  };

  const onDrop = async (e, destColId) => {
    if (!canMove) return;
    e.preventDefault();
    e.currentTarget.classList.remove('bg-[var(--color-primary)]/5', 'ring-2', 'ring-[var(--color-primary)]/20');

    const cardId = e.dataTransfer.getData('cardId');
    const sourceColId = e.dataTransfer.getData('sourceCol');

    if (!cardId || sourceColId === destColId) {
      // Just ensure the element opacity is reset
      const el = document.getElementById(`card-${cardId}`);
      if (el) el.style.opacity = '1';
      setDraggingCard(null);
      return;
    }

    // Optimistic Update
    const newBoard = { ...boardData };
    const sourceColCards = [...newBoard.columns[sourceColId].cardIds];
    const destColCards = [...newBoard.columns[destColId].cardIds];

    // Use findIndex with string comparison to avoid type mismatch issues (int vs string)
    const cardIdStr = cardId.toString();
    const sourceIndex = sourceColCards.findIndex(id => id.toString() === cardIdStr);
    
    if (sourceIndex !== -1) {
      sourceColCards.splice(sourceIndex, 1);
      destColCards.push(newBoard.cards[cardId]?.id || cardId); // Preserve original type if possible
    }

    newBoard.columns[sourceColId].cardIds = sourceColCards;
    newBoard.columns[destColId].cardIds = destColCards;
    
    // Update card status locally too
    if (newBoard.cards[cardId]) {
      newBoard.cards[cardId].status = destColId;
    }

    setBoardData(newBoard);
    setDraggingCard(null);

    try {
      await api.patch(`/cards/${cardId}/move`, { status: destColId });
      toast.success(`Moved to ${destColId}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to move card';
      toast.error(msg);
      fetchBoard(); // Revert on failure
    }
  };

  const moveCardToStatus = async (cardId, sourceColId, destColId) => {
    if (!cardId || sourceColId === destColId) return;

    const newBoard = { ...boardData };
    const sourceColCards = [...newBoard.columns[sourceColId].cardIds];
    const destColCards = [...newBoard.columns[destColId].cardIds];
    const sourceIndex = sourceColCards.findIndex((id) => id.toString() === cardId.toString());

    if (sourceIndex !== -1) {
      sourceColCards.splice(sourceIndex, 1);
      destColCards.push(newBoard.cards[cardId]?.id || cardId);
    }

    newBoard.columns[sourceColId].cardIds = sourceColCards;
    newBoard.columns[destColId].cardIds = destColCards;
    if (newBoard.cards[cardId]) {
      newBoard.cards[cardId].status = destColId;
    }

    setBoardData(newBoard);

    try {
      await api.patch(`/cards/${cardId}/move`, { status: destColId });
      toast.success(`Moved to ${destColId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to move card');
      fetchBoard();
    }
  };

  const handleCardClick = (cardId) => {
    setSelectedCardId(cardId);
    setIsTaskModalOpen(true);
  };

  const getPriorityColor = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'blocker': return 'bg-red-500/15 text-red-500 border-red-500/20';
      case 'high': return 'bg-orange-500/15 text-orange-500 border-orange-500/20';
      case 'medium': return 'bg-yellow-500/15 text-yellow-600 border-yellow-500/20';
      case 'low': return 'bg-blue-500/15 text-blue-500 border-blue-500/20';
      default: return 'bg-gray-500/15 text-gray-500 border-gray-500/20';
    }
  };

  if (loading) return (
    <div className="p-8 text-[var(--color-on-surface-variant)] flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-4">
        <i className="fa-solid fa-circle-notch fa-spin text-4xl text-[var(--color-primary)]"></i>
        <span className="font-medium animate-pulse">Loading Board...</span>
      </div>
    </div>
  );

  return (
    <div className="h-full p-6 flex flex-col pt-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[var(--color-on-surface)] flex items-center gap-2">
          <i className="fa-solid fa-border-all text-[var(--color-primary)]"></i> Active Sprint Board
        </h2>
        <div className="flex gap-3">
          <button 
            onClick={() => canManage && setIsCreateModalOpen(true)}
            disabled={!canManage}
            className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-tertiary)] text-[var(--color-on-primary)] px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[var(--color-primary)]/25 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-plus"></i> Add Task
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 hide-scrollbar snap-x">
        {Object.values(boardData.columns).map((column) => (
          <div 
            key={column.id} 
            className="flex flex-col min-w-[340px] w-[340px] max-h-full bg-[var(--color-surface)]/80 backdrop-blur-3xl rounded-2xl border border-[var(--color-surface-container-high)] shadow-sm overflow-hidden snap-start"
          >
            <div className={`p-4 border-b border-[var(--color-surface-container-high)] bg-gradient-to-b from-[var(--color-surface-container-low)] to-transparent relative overflow-hidden`}>
               <div className={`absolute top-0 left-0 right-0 h-1 
                 ${column.id === 'todo' ? 'bg-gray-400' : 
                   column.id === 'doing' ? 'bg-blue-500' : 
                   column.id === 'reviewing' ? 'bg-amber-500' : 'bg-emerald-500'}
               `}></div>
              <div className="flex justify-between items-center z-10 relative">
                <h3 className="font-bold text-[var(--color-on-surface)] text-sm tracking-wide uppercase flex items-center gap-2">
                  {column.title}
                  <span className="bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface-variant)] text-xs font-bold py-0.5 px-2.5 rounded-full border border-[var(--color-surface-container-high)]">
                    {column.cardIds.length}
                  </span>
                </h3>
              </div>
            </div>

            <div
              className="flex-1 p-3 overflow-y-auto space-y-3 transition-colors duration-200 min-h-[200px] hide-scrollbar"
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={(e) => onDrop(e, column.id)}
            >
              {column.cardIds.map((cardId) => {
                const card = boardData.cards[cardId];
                if (!card) return null;
                const isDragging = draggingCard === card.id;

                return (
                  <div
                    key={card.id}
                    id={`card-${card.id}`}
                    draggable={canMove}
                    onDragStart={(e) => onDragStart(e, card.id, column.id)}
                    onDragEnd={onDragEnd}
                    onClick={() => handleCardClick(card.id)}
                    className={`group bg-[var(--color-surface-container-lowest)] p-4 rounded-xl border border-[var(--color-surface-container-high)] shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing transition-all hover:border-[var(--color-primary)]/50 relative overflow-hidden ${isDragging ? 'opacity-0 scale-95' : 'opacity-100'}`}
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-surface-container-high)] group-hover:bg-[var(--color-primary)] transition-colors"></div>
                    <div className="flex justify-between items-start mb-2 pl-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getPriorityColor(card.priority)}`}>
                        {card.priority}
                      </span>
                      {column.id === 'done' && <i className="fa-solid fa-circle-check text-emerald-500"></i>}
                    </div>
                    
                    <h4 className="font-semibold text-[var(--color-on-surface)] text-[15px] leading-snug mb-3 pl-3">
                      {card.title}
                    </h4>

                    <div className="flex items-center justify-between text-xs text-[var(--color-on-surface-variant)] pt-3 border-t border-[var(--color-surface-container-high)] pl-3">
                      <div className="flex items-center gap-1.5 font-medium">
                        <i className="fa-regular fa-clock"></i> {card.sprint?.name || 'No Sprint'}
                      </div>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] text-[var(--color-on-primary)] flex items-center justify-center font-bold text-[10px] shadow-sm" title={`Assignee: ${card.assignee?.name || 'Unassigned'}`}>
                        {card.assignee?.name?.charAt(0) || '?'}
                      </div>
                    </div>
                    {canMove && (
                      <div className="mt-3 pl-3 md:hidden" onClick={(e) => e.stopPropagation()}>
                        <label className="text-[10px] font-semibold text-[var(--color-on-surface-variant)]">Move to</label>
                        <select
                          value={card.status}
                          onChange={(e) => moveCardToStatus(card.id, column.id, e.target.value)}
                          className="mt-1 w-full bg-[var(--color-surface)] border border-[var(--color-surface-container-high)] rounded-lg px-2 py-1.5 text-xs"
                        >
                          <option value="todo">To Do</option>
                          <option value="doing">Doing</option>
                          <option value="reviewing">In Review</option>
                          <option value="done">Done</option>
                        </select>
                      </div>
                    )}
                  </div>
                );
              })}
              {column.cardIds.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center py-8 text-[var(--color-on-surface-variant)] opacity-40 border-2 border-dashed border-[var(--color-surface-container-high)] rounded-xl">
                  <i className="fa-solid fa-inbox text-2xl mb-2"></i>
                  <p className="text-xs font-medium">No cards here</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <TaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
        cardId={selectedCardId} 
      />

      <CardFormModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        projectId={projectId}
        onSuccess={fetchBoard}
      />
    </div>
  );
};

export default BoardView;
