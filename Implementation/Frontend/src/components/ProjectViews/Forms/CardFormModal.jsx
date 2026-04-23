import React, { useState } from 'react';

const CardFormModal = ({ isOpen, onClose, onSubmit, initialData = null, sprints = [] }) => {
  const [formData, setFormData] = useState(initialData || {
    title: '',
    description: '',
    priority: 'medium',
    sprint_id: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-container-high)] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="px-6 py-4 border-b border-[var(--color-surface-container-high)] flex justify-between items-center bg-[var(--color-surface-container-low)]">
          <h3 className="text-lg font-bold text-[var(--color-on-surface)]">{initialData ? 'Update Task' : 'Create New Task'}</h3>
          <button onClick={onClose} className="p-1.5 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] transition-colors">
             <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-1.5">Task Title</label>
            <input 
              type="text" 
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-container-high)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
              placeholder="E.g., Implement OAuth2"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-1.5">Description</label>
            <textarea 
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-container-high)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all resize-none"
              placeholder="Task details and acceptance criteria..."
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-1.5">Priority</label>
              <select 
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-container-high)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] appearance-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="blocker">Blocker</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-1.5">Target Sprint</label>
              <select 
                value={formData.sprint_id}
                onChange={(e) => setFormData({...formData, sprint_id: e.target.value})}
                className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-container-high)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] appearance-none"
              >
                <option value="">Backlog (Unassigned)</option>
                {sprints.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-[var(--color-surface-container-high)] mt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold rounded-xl text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)] transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-tertiary)] text-[var(--color-on-primary)] hover:opacity-90 transition-opacity shadow-md flex items-center gap-2">
               <i className="fa-solid fa-check"></i> Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CardFormModal;
