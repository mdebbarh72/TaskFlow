import React, { useState, useEffect } from 'react';
import api from '../../../api/api';

const ListView = ({ projectId }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setCards([
        { id: 1, title: 'Implement Auth Guard', status: 'done', priority: 'high', sprint: 'Sprint 1' },
        { id: 2, title: 'Build Settings Page', status: 'inReview', priority: 'medium', sprint: 'Sprint 2' },
        { id: 3, title: 'Update API Docs', status: 'todo', priority: 'low', sprint: null },
      ]);
      setLoading(false);
    }, 500);
  }, [projectId]);

  if (loading) return <div className="p-8 text-[var(--color-on-surface-variant)]">Loading Cards...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[var(--color-on-surface)] flex items-center gap-3">
            <i className="fa-solid fa-list-ul text-[var(--color-primary)]"></i> All Cards
          </h2>
          <p className="text-[var(--color-on-surface-variant)] mt-1">A comprehensive list of all tasks in this project.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]"></i>
            <input type="text" placeholder="Search cards..." className="w-full bg-[var(--color-surface-container)] border border-[var(--color-surface-container-high)] text-[var(--color-on-surface)] text-sm rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-[var(--color-primary)]" />
          </div>
          <button className="bg-[var(--color-surface-container)] p-2.5 px-3 rounded-xl border border-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors">
            <i className="fa-solid fa-filter"></i>
          </button>
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
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-surface-container-high)]">
            {cards.map(card => (
              <tr key={card.id} className="hover:bg-[var(--color-surface)]/50 transition-colors cursor-pointer group">
                <td className="px-6 py-4">
                  <span className="font-semibold text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors">{card.title}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase border
                    ${card.status === 'done' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                      card.status === 'todo' ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' : 
                      'bg-amber-500/10 text-amber-500 border-amber-500/20'}
                  `}>
                    {card.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`flex w-fit px-2 py-0.5 rounded text-xs font-bold uppercase
                    ${card.priority === 'high' ? 'text-orange-500' : 'text-blue-500'}
                  `}>
                    {card.priority}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-[var(--color-on-surface-variant)] font-medium">
                  {card.sprint || 'Unassigned'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListView;
