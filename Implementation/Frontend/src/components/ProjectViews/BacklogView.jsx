import React, { useState, useEffect } from 'react';
import api from '../../api.js';
import { toast } from 'react-hot-toast';
import TaskModal from './Forms/TaskModal';
import SprintFormModal from './Forms/SprintFormModal';
import CardFormModal from './Forms/CardFormModal';

const BacklogView = ({ projectId, currentUserRole }) => {
  const [data, setData] = useState({ sprints: [], unassigned_cards: [] });
  const [loading, setLoading] = useState(true);
  const [draggingCardId, setDraggingCardId] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const canManage = currentUserRole === 'owner' || currentUserRole === 'manager';
  const canMove = currentUserRole !== 'viewer';

  useEffect(() => {
    fetchBacklog();
  }, [projectId]);

  const fetchBacklog = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/projects/${projectId}/backlog`);
      setData(res.data);
    } catch(err) {
      const msg = err.response?.data?.message || 'Failed to fetch backlog';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const onDragStart = (e, cardId) => {
    if (!canMove) return;
    setDraggingCardId(cardId);
    e.dataTransfer.setData('cardId', cardId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e) => {
    if (!canMove) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('bg-[var(--color-primary)]/10', 'ring-2', 'ring-[var(--color-primary)]/30');
  };

  const onDragLeave = (e) => {
    e.currentTarget.classList.remove('bg-[var(--color-primary)]/10', 'ring-2', 'ring-[var(--color-primary)]/30');
  };

  const onDrop = async (e, sprintId) => {
    if (!canMove) return;
    e.preventDefault();
    e.currentTarget.classList.remove('bg-[var(--color-primary)]/10', 'ring-2', 'ring-[var(--color-primary)]/30');
    
    const cardId = e.dataTransfer.getData('cardId');
    if (!cardId) return;

    try {
      await api.patch(`/cards/${cardId}/sprint`, { sprint_id: sprintId });
      toast.success('Card moved successfully');
      fetchBacklog(); // Refresh to show the card in the new sprint
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to move card';
      toast.error(msg);
    } finally {
      setDraggingCardId(null);
    }
  };

  const handleStartSprint = async (sprintId) => {
    try {
      await api.patch(`/sprints/${sprintId}/start`);
      toast.success('Sprint started!');
      fetchBacklog();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to start sprint';
      toast.error(msg);
    }
  };

  const handleCompleteSprint = async (sprintId) => {
    try {
      await api.patch(`/sprints/${sprintId}/complete`);
      toast.success('Sprint completed!');
      fetchBacklog();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to complete sprint';
      toast.error(msg);
    }
  };

  const handleCardClick = (cardId) => {
    setSelectedCardId(cardId);
    setIsTaskModalOpen(true);
  };

  if(loading) return (
    <div className="p-8 text-[var(--color-on-surface-variant)] flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-4">
        <i className="fa-solid fa-circle-notch fa-spin text-4xl text-[var(--color-primary)]"></i>
        <span className="font-medium animate-pulse">Loading Backlog...</span>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[var(--color-on-surface)] flex items-center gap-3">
            <i className="fa-solid fa-layer-group text-[var(--color-primary)]"></i> Product Backlog
          </h2>
          <p className="text-[var(--color-on-surface-variant)] mt-1">Plan sprints, refine user stories, and manage unassigned work.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]"></i>
            <input type="text" placeholder="Search backlog..." className="w-full bg-[var(--color-surface-container)] border border-[var(--color-surface-container-high)] text-[var(--color-on-surface)] text-sm rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all" />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden">
        {/* Sprints Column */}
        <div className="flex-1 overflow-y-auto hide-scrollbar space-y-6 pb-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-[var(--color-on-surface)]">Sprints</h3>
            <button
              onClick={() => canManage && setIsSprintModalOpen(true)}
              disabled={!canManage}
              className="text-[var(--color-primary)] font-medium text-sm hover:underline flex items-center gap-1.5"
            >
              <i className="fa-solid fa-plus text-[10px]"></i> Create Sprint
            </button>
          </div>

          {data.sprints.map(sprint => (
            <div 
              key={sprint.id} 
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={(e) => onDrop(e, sprint.id)}
              className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-container-high)] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="bg-[var(--color-surface-container-low)] px-5 py-4 border-b border-[var(--color-surface-container-high)] flex justify-between items-center group">
                <div>
                  <h4 className="font-bold text-[var(--color-on-surface)] flex items-center gap-2 text-lg">
                    {sprint.name}
                    {sprint.status === 'in_process' && <span className="bg-emerald-500/10 text-emerald-500 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">In Process</span>}
                    {sprint.status === 'pending' && <span className="bg-gray-500/10 text-gray-500 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-gray-500/20">Planning</span>}
                  </h4>
                  {sprint.start_date && (
                    <p className="text-xs text-[var(--color-on-surface-variant)] flex items-center gap-1.5 mt-1 font-medium">
                      <i className="fa-regular fa-calendar-days"></i> {new Date(sprint.start_date).toLocaleDateString()} - {new Date(sprint.end_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {canManage && sprint.status === 'pending' && (
                    <button 
                      onClick={() => handleStartSprint(sprint.id)}
                      className="bg-[var(--color-surface)] border border-[var(--color-primary)] text-[var(--color-primary)] px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)] transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                      Start Sprint
                    </button>
                  )}
                  {canManage && sprint.status === 'in_process' && (
                    <button 
                      onClick={() => handleCompleteSprint(sprint.id)}
                      className="bg-emerald-500 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-emerald-600 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-lg shadow-emerald-500/20"
                    >
                      Complete Sprint
                    </button>
                  )}
                </div>
              </div>
              
              <div className="p-2 space-y-1 min-h-[80px] bg-[var(--color-surface)]/50">
                {sprint.cards?.length === 0 ? (
                  <div className="text-center py-6 text-[var(--color-on-surface-variant)] text-sm border-2 border-dashed border-[var(--color-surface-container-high)] rounded-xl m-2 opacity-60">
                    Drag cards here to plan this sprint.
                  </div>
                ) : (
                  sprint.cards?.map(card => (
                    <div 
                      key={card.id} 
                      onClick={() => handleCardClick(card.id)}
                      className="flex items-center justify-between p-3 bg-[var(--color-surface-container-lowest)] hover:bg-[var(--color-surface-container-low)] rounded-xl border border-[var(--color-surface-container)] cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <i className="fa-solid fa-align-left text-[var(--color-on-surface-variant)]"></i>
                        <span className="font-medium text-[var(--color-on-surface)] text-sm">{card.title}</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border
                            ${card.priority === 'high' ? 'text-orange-500 border-orange-500/20' : 
                              card.priority === 'medium' ? 'text-yellow-600 border-yellow-500/20' : 
                              'text-blue-500 border-blue-500/20'}
                         `}>
                           {card.priority}
                         </span>
                         <div className="w-6 h-6 rounded-full bg-[var(--color-surface-container-high)] text-[10px] flex items-center justify-center font-bold text-[var(--color-on-surface-variant)]">
                           {card.assignee?.name?.charAt(0) || '?'}
                         </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        <div 
          className="w-full lg:w-[400px] flex flex-col max-h-[100%] rounded-2xl transition-all duration-300"
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={(e) => onDrop(e, null)}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-[var(--color-on-surface)]">Unassigned Cards</h3>
            <button
              onClick={() => canManage && setIsCardModalOpen(true)}
              disabled={!canManage}
              className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--color-primary)] hover:text-white transition-colors"
            >
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 hide-scrollbar">
            {data.unassigned_cards.map(card => (
              <div 
                key={card.id} 
                draggable={canMove}
                onDragStart={(e) => onDragStart(e, card.id)}
                onClick={() => handleCardClick(card.id)}
                className={`bg-[var(--color-surface-container-lowest)] p-4 rounded-xl border border-[var(--color-surface-container-high)] shadow-sm hover:shadow-md hover:border-[var(--color-primary)]/40 transition-all cursor-grab group ${draggingCardId === card.id ? 'opacity-40' : ''}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border
                    ${card.priority === 'high' ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' :
                      card.priority === 'medium' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600' :
                      'bg-blue-500/10 border-blue-500/20 text-blue-500'}
                  `}>
                    {card.priority}
                  </span>
                </div>
                <h4 className="font-semibold text-sm text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors">{card.title}</h4>
              </div>
            ))}
            {data.unassigned_cards.length === 0 && (
              <div className="text-center py-12 text-[var(--color-on-surface-variant)] text-sm opacity-60 bg-[var(--color-surface-container-low)]/30 rounded-2xl border-2 border-dashed border-[var(--color-surface-container-high)]">
                <i className="fa-solid fa-check-circle text-2xl mb-2 block"></i>
                Your backlog is clear!
              </div>
            )}
          </div>
        </div>
      </div>

      <TaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
        cardId={selectedCardId} 
      />

      <SprintFormModal 
        isOpen={isSprintModalOpen}
        onClose={() => setIsSprintModalOpen(false)}
        projectId={projectId}
        onSuccess={fetchBacklog}
      />

      <CardFormModal 
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        projectId={projectId}
        onSuccess={fetchBacklog}
      />
    </div>
  );
};

export default BacklogView;
