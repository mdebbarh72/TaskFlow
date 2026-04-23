import React, { useState, useEffect } from 'react';
import api from '../../api.js';
import { toast } from 'react-hot-toast';
import TaskModal from './Forms/TaskModal';

const ListView = ({ projectId }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCards();
  }, [projectId]);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/projects/${projectId}/cards`);
      setCards(res.data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch cards';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (cardId) => {
    setSelectedCardId(cardId);
    setIsModalOpen(true);
  };

  if (loading) return (
    <div className="p-8 text-[var(--color-on-surface-variant)] flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-4">
        <i className="fa-solid fa-circle-notch fa-spin text-4xl text-[var(--color-primary)]"></i>
        <span className="font-medium animate-pulse">Loading Cards...</span>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[var(--color-on-surface)] flex items-center gap-3">
            <i className="fa-solid fa-list-ul text-[var(--color-primary)]"></i> All Cards
          </h2>
          <p className="text-[var(--color-on-surface-variant)] mt-1">A comprehensive list of all tasks in this project.</p>
        </div>
      </div>

      <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl border border-[var(--color-surface-container-high)] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--color-surface-container-low)] border-b border-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-bold">Title</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold">Priority</th>
              <th className="px-6 py-4 font-bold">Sprint</th>
              <th className="px-6 py-4 font-bold">Assignee</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-surface-container-high)]">
            {cards.map(card => (
              <tr 
                key={card.id} 
                onClick={() => handleCardClick(card.id)}
                className="hover:bg-[var(--color-surface)] transition-colors cursor-pointer group"
              >
                <td className="px-6 py-4">
                  <span className="font-semibold text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors">{card.title}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border
                    ${card.status === 'done' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                      card.status === 'todo' ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' : 
                      card.status === 'doing' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                      'bg-amber-500/10 text-amber-500 border-amber-500/20'}
                  `}>
                    {card.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold uppercase
                    ${card.priority === 'high' ? 'text-orange-500' : 
                      card.priority === 'medium' ? 'text-yellow-600' : 'text-blue-500'}
                  `}>
                    {card.priority}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-[var(--color-on-surface-variant)] font-medium">
                  {card.sprint?.name || 'Unassigned'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[var(--color-surface-container-high)] text-[10px] flex items-center justify-center font-bold text-[var(--color-on-surface-variant)]">
                      {card.assignee?.name?.charAt(0) || '?'}
                    </div>
                    <span className="text-xs text-[var(--color-on-surface)]">{card.assignee?.name || 'Unassigned'}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {cards.length === 0 && (
          <div className="p-12 text-center text-[var(--color-on-surface-variant)] opacity-60">
            No cards found in this project.
          </div>
        )}
      </div>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        cardId={selectedCardId} 
      />
    </div>
  );
};

export default ListView;
