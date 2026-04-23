import React, { useState, useEffect } from 'react';
import api from '../../../api/api';

const BoardView = ({ projectId }) => {
  const [boardData, setBoardData] = useState({
    columns: {
      todo: { id: 'todo', title: 'To Do', cardIds: [] },
      doing: { id: 'doing', title: 'Doing', cardIds: [] },
      inReview: { id: 'inReview', title: 'In Review', cardIds: [] },
      done: { id: 'done', title: 'Done', cardIds: [] },
    },
    cards: {},
  });
  const [loading, setLoading] = useState(true);
  const [draggingCard, setDraggingCard] = useState(null);

  useEffect(() => {
    fetchBoard();
  }, [projectId]);

  const fetchBoard = async () => {
    try {
      const res = await api.get(`/projects/${projectId}/board`);
      
      const mockCards = {
        'c1': { id: 'c1', title: 'Design System Update', priority: 'high', sprint: 'Sprint 1', assignee: 'John D.' },
        'c2': { id: 'c2', title: 'Implement Auth Flow', priority: 'blocker', sprint: 'Sprint 1', assignee: 'Sarah W.' },
        'c3': { id: 'c3', title: 'Kanban Drag & Drop', priority: 'medium', sprint: 'Sprint 1', assignee: 'You' },
        'c4': { id: 'c4', title: 'Setup DB Migrations', priority: 'low', sprint: 'Sprint 1', assignee: 'Mike T.' },
      };

      setBoardData({
        columns: {
          todo: { id: 'todo', title: 'To Do', cardIds: ['c1', 'c2'] },
          doing: { id: 'doing', title: 'Doing', cardIds: ['c3'] },
          inReview: { id: 'inReview', title: 'In Review', cardIds: [] },
          done: { id: 'done', title: 'Done', cardIds: ['c4'] },
        },
        cards: mockCards,
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const onDragStart = (e, cardId, sourceCol) => {
    setDraggingCard(cardId);
    e.dataTransfer.setData('cardId', cardId);
    e.dataTransfer.setData('sourceCol', sourceCol);
    e.dataTransfer.effectAllowed = 'move';
    
    setTimeout(() => {
      e.target.style.opacity = '0.4';
      e.target.style.transform = 'scale(0.95)';
    }, 0);
  };

  const onDragEnd = (e) => {
    setDraggingCard(null);
    e.target.style.opacity = '1';
    e.target.style.transform = 'scale(1)';
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const dropZone = e.currentTarget;
    dropZone.classList.add('bg-[var(--color-primary)]/10', 'ring-2', 'ring-[var(--color-primary)]/50');
  };

  const onDragLeave = (e) => {
    const dropZone = e.currentTarget;
    dropZone.classList.remove('bg-[var(--color-primary)]/10', 'ring-2', 'ring-[var(--color-primary)]/50');
  };

  const onDrop = async (e, destColId) => {
    e.preventDefault();
    const dropZone = e.currentTarget;
    dropZone.classList.remove('bg-[var(--color-primary)]/10', 'ring-2', 'ring-[var(--color-primary)]/50');

    const cardId = e.dataTransfer.getData('cardId');
    const sourceColId = e.dataTransfer.getData('sourceCol');

    if (!cardId || sourceColId === destColId) {
      setDraggingCard(null);
      return;
    }

    const newBoard = { ...boardData };
    const sourceColCards = [...newBoard.columns[sourceColId].cardIds];
    const destColCards = [...newBoard.columns[destColId].cardIds];

    sourceColCards.splice(sourceColCards.indexOf(cardId), 1);
    destColCards.push(cardId);

    newBoard.columns[sourceColId].cardIds = sourceColCards;
    newBoard.columns[destColId].cardIds = destColCards;
    setBoardData(newBoard);
    setDraggingCard(null);

    try {
      await api.patch(`/cards/${cardId}`, { status: destColId });
    } catch (err) {
      console.error(err);
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'blocker': return 'bg-red-500/15 text-red-500 border-red-500/20';
      case 'high': return 'bg-orange-500/15 text-orange-500 border-orange-500/20';
      case 'medium': return 'bg-yellow-500/15 text-yellow-600 border-yellow-500/20';
      case 'low': return 'bg-blue-500/15 text-blue-500 border-blue-500/20';
      default: return 'bg-gray-500/15 text-gray-500 border-gray-500/20';
    }
  };

  if (loading) return <div className="p-8 text-[var(--color-on-surface-variant)] animate-pulse flex items-center gap-2"><i className="fa-solid fa-spinner fa-spin"></i> Loading Board...</div>;

  return (
    <div className="h-full p-6 flex flex-col pt-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[var(--color-on-surface)] flex items-center gap-2">
          <i className="fa-solid fa-border-all text-[var(--color-primary)]"></i> Active Sprint Board
        </h2>
        <div className="flex gap-3">
          <button className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-tertiary)] text-[var(--color-on-primary)] px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[var(--color-primary)]/25 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2">
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
                   column.id === 'inReview' ? 'bg-amber-500' : 'bg-emerald-500'}
               `}></div>
              <div className="flex justify-between items-center z-10 relative">
                <h3 className="font-bold text-[var(--color-on-surface)] text-sm tracking-wide uppercase flex items-center gap-2">
                  {column.title}
                  <span className="bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface-variant)] text-xs font-bold py-0.5 px-2.5 rounded-full border border-[var(--color-surface-container-high)]">
                    {column.cardIds.length}
                  </span>
                </h3>
                <button className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors p-1.5 rounded-md hover:bg-[var(--color-surface-container)]">
                  <i className="fa-solid fa-ellipsis-vertical px-1.5"></i>
                </button>
              </div>
            </div>

            <div
              className="flex-1 p-3 overflow-y-auto space-y-3 transition-colors duration-200 min-h-[200px]"
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
                    draggable
                    onDragStart={(e) => onDragStart(e, card.id, column.id)}
                    onDragEnd={onDragEnd}
                    className={`group bg-[var(--color-surface)] p-4 rounded-xl border border-[var(--color-surface-container-high)] shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing transition-all hover:border-[var(--color-primary)]/50 relative overflow-hidden ${isDragging ? 'opacity-0 scale-95' : 'opacity-100'}`}
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
                        <i className="fa-regular fa-clock"></i> {card.sprint}
                      </div>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] text-[var(--color-on-primary)] flex items-center justify-center font-bold text-[10px] shadow-sm" title={`Assignee: ${card.assignee}`}>
                        {card.assignee.charAt(0)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardView;
