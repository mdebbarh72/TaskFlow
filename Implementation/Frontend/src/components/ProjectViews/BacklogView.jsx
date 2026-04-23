import React, { useState, useEffect } from 'react';
import api from '../../../api/api';

const BacklogView = ({ projectId }) => {
  const [data, setData] = useState({ sprints: [], unassigned_cards: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBacklog();
  }, [projectId]);

  const fetchBacklog = async () => {
    try {
      setData({
        sprints: [
          { id: 's1', name: 'Sprint 1 - Core Auth', status: 'active', start_date: '2026-04-10', end_date: '2026-04-24', cards: [{id: 1, title: 'Implement Login'}, {id: 2, title: 'Session guards'}] },
          { id: 's2', name: 'Sprint 2 - UI Polish', status: 'pending', start_date: null, end_date: null, cards: [] }
        ],
        unassigned_cards: [
          { id: 'c3', title: 'Create interactive dashboard charts', priority: 'medium' },
          { id: 'c4', title: 'Email notification templates', priority: 'low' },
          { id: 'c5', title: 'Setup Stripe integration', priority: 'high' }
        ]
      });
      setLoading(false);
    } catch(err) {
      console.error(err);
      setLoading(false);
    }
  };

  if(loading) return <div className="p-8 text-[var(--color-on-surface-variant)] flex items-center gap-2"><i className="fa-solid fa-spinner fa-spin"></i> Loading Backlog...</div>;

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
          <button className="bg-[var(--color-surface-container)] p-2.5 px-3 rounded-xl border border-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors">
            <i className="fa-solid fa-filter"></i>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden">
        <div className="flex-1 overflow-y-auto hide-scrollbar space-y-6 pb-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-[var(--color-on-surface)]">Sprints</h3>
            <button className="text-[var(--color-primary)] font-medium text-sm hover:underline flex items-center gap-1.5">
              <i className="fa-solid fa-plus text-[10px]"></i> Create Sprint
            </button>
          </div>

          {data.sprints.map(sprint => (
            <div key={sprint.id} className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-container-high)] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-[var(--color-surface-container-low)] px-5 py-4 border-b border-[var(--color-surface-container-high)] flex justify-between items-center group">
                <div>
                  <h4 className="font-bold text-[var(--color-on-surface)] flex items-center gap-2 text-lg">
                    {sprint.name}
                    {sprint.status === 'active' && <span className="bg-emerald-500/10 text-emerald-500 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">Active</span>}
                    {sprint.status === 'pending' && <span className="bg-gray-500/10 text-gray-500 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-gray-500/20">Planning</span>}
                  </h4>
                  {sprint.start_date && (
                    <p className="text-xs text-[var(--color-on-surface-variant)] flex items-center gap-1.5 mt-1 font-medium">
                      <i className="fa-regular fa-calendar-days"></i> {new Date(sprint.start_date).toLocaleDateString()} - {new Date(sprint.end_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {sprint.status === 'pending' && (
                    <button className="bg-[var(--color-surface)] border border-[var(--color-primary)] text-[var(--color-primary)] px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)] transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                      Start Sprint
                    </button>
                  )}
                </div>
              </div>
              
              <div className="p-2 space-y-1 min-h-[60px] bg-[var(--color-surface)]/50">
                {sprint.cards.length === 0 ? (
                  <div className="text-center py-6 text-[var(--color-on-surface-variant)] text-sm border-2 border-dashed border-[var(--color-surface-container-high)] rounded-xl m-2">
                    Drag cards here or create new tasks to plan this sprint.
                  </div>
                ) : (
                  sprint.cards.map(card => (
                    <div key={card.id} className="flex items-center justify-between p-3 bg-[var(--color-surface)] hover:bg-[var(--color-surface-container-low)] rounded-xl border border-[var(--color-surface-container)] cursor-pointer transition-colors group">
                      <div className="flex items-center gap-3">
                        <i className="fa-solid fa-align-left text-[var(--color-on-surface-variant)]"></i>
                        <span className="font-medium text-[var(--color-on-surface)] text-sm">{card.title}</span>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-[var(--color-surface-container-high)] text-xs flex items-center justify-center font-bold text-[var(--color-on-surface-variant)]">
                        U
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="w-full lg:w-[400px] flex flex-col max-h-[100%]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-[var(--color-on-surface)]">Unassigned Cards</h3>
            <button className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--color-primary)] hover:text-white transition-colors">
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 hide-scrollbar">
            {data.unassigned_cards.map(card => (
              <div key={card.id} className="bg-[var(--color-surface)] p-4 rounded-xl border border-[var(--color-surface-container-high)] shadow-sm hover:shadow-md hover:border-[var(--color-primary)]/40 transition-all cursor-grab group">
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border
                    ${card.priority === 'high' ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' :
                      card.priority === 'medium' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600' :
                      'bg-blue-500/10 border-blue-500/20 text-blue-500'}
                  `}>
                    {card.priority}
                  </span>
                </div>
                <h4 className="font-semibold text-sm text-[var(--color-on-surface)]">{card.title}</h4>
              </div>
            ))}
            {data.unassigned_cards.length === 0 && (
              <div className="text-center py-12 text-[var(--color-on-surface-variant)] text-sm">
                Your backlog is entirely clear!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BacklogView;
