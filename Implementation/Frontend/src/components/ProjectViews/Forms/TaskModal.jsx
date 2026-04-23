import React, { useState, useEffect } from 'react';
import api from '../../../../api/api';

const TaskModal = ({ isOpen, onClose, cardId }) => {
  const [task, setTask] = useState(null);
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtask, setNewSubtask] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && cardId) {
      fetchTaskDetails();
    }
  }, [isOpen, cardId]);

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      setTask({
        id: cardId,
        title: 'Implement Interactive Dynamic Charting',
        description: 'Use SVG/Tailwind to create a circular progress indicator for task distribution.',
        priority: 'high',
        status: 'doing',
        sprint: 'Sprint 2',
        assignee: 'John Doe',
      });
      setSubtasks([
        { id: 1, title: 'Build React component structure', is_completed: true },
        { id: 2, title: 'Add Tailwind generic styling', is_completed: false },
        { id: 3, title: 'Implement complex stroke dasharray', is_completed: false }
      ]);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    
    const subtask = { id: Date.now(), title: newSubtask, is_completed: false };
    setSubtasks([...subtasks, subtask]);
    setNewSubtask('');
  };

  const toggleSubtask = async (subtaskId) => {
    const updated = subtasks.map(s => s.id === subtaskId ? { ...s, is_completed: !s.is_completed } : s);
    setSubtasks(updated);
  };

  const deleteSubtask = async (subtaskId) => {
    setSubtasks(subtasks.filter(s => s.id !== subtaskId));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 lg:p-12">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-container-high)] rounded-2xl shadow-2xl w-full max-w-4xl h-full max-h-[85vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 duration-300">
        
        {loading ? (
          <div className="p-12 flex justify-center items-center h-full"><div className="w-8 h-8 rounded-full border-4 border-t-[var(--color-primary)] animate-spin"></div></div>
        ) : (
          <>
            <div className="px-6 py-4 border-b border-[var(--color-surface-container-high)] bg-[var(--color-surface-container-low)] flex justify-between items-start">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-widest text-[var(--color-on-surface-variant)] uppercase mb-1 flex items-center gap-1.5"><i className="fa-regular fa-file-lines text-xs"></i> CARD-{task.id}</span>
                <h2 className="text-2xl font-bold text-[var(--color-on-surface)] leading-tight">{task.title}</h2>
              </div>
              <button onClick={onClose} className="p-2 w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] hover:text-red-500 transition-colors">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col md:flex-row min-h-0">
              <div className="flex-1 p-6 lg:p-8 overflow-y-auto space-y-8 hide-scrollbar border-r border-[var(--color-surface-container-high)]">
                
                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)]">Description</h3>
                  <div className="bg-[var(--color-surface)] p-5 rounded-xl border border-[var(--color-surface-container-high)] text-[var(--color-on-surface)] text-sm leading-relaxed whitespace-pre-wrap">
                    {task.description || 'No description provided.'}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] flex items-center gap-2">
                       <i className="fa-regular fa-circle-check"></i> Subtasks
                    </h3>
                    <span className="text-xs font-semibold text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container-high)] px-2 py-0.5 rounded-md">
                      {subtasks.filter(s => s.is_completed).length} / {subtasks.length}
                    </span>
                  </div>

                  {subtasks.length > 0 && (
                     <div className="h-1.5 w-full bg-[var(--color-surface-container-high)] rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 transition-all duration-500" style={{width: `${(subtasks.filter(s => s.is_completed).length / subtasks.length) * 100}%`}}></div>
                     </div>
                  )}

                  <div className="space-y-2">
                    {subtasks.map(st => (
                      <div key={st.id} className={`group flex items-center justify-between p-3 rounded-xl border transition-colors ${st.is_completed ? 'bg-[var(--color-surface-container-low)] border-transparent' : 'bg-[var(--color-surface)] border-[var(--color-surface-container-high)] hover:border-[var(--color-primary)]/40'}`}>
                        <div className="flex items-center gap-3">
                          <button onClick={() => toggleSubtask(st.id)} className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${st.is_completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-400 text-transparent hover:border-emerald-500'}`}>
                             <i className="fa-solid fa-check text-[10px]"></i>
                          </button>
                          <span className={`text-sm font-medium transition-all ${st.is_completed ? 'text-[var(--color-on-surface-variant)] line-through' : 'text-[var(--color-on-surface)]'}`}>
                            {st.title}
                          </span>
                        </div>
                        <button onClick={() => deleteSubtask(st.id)} className="text-[var(--color-on-surface-variant)] opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all">
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddSubtask} className="mt-3 relative">
                    <input 
                      type="text" 
                      value={newSubtask}
                      onChange={(e) => setNewSubtask(e.target.value)}
                      placeholder="Add a new subtask..."
                      className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-container-high)] rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-[var(--color-primary)]"
                    />
                    <button type="submit" className="absolute right-3 w-6 h-6 flex items-center justify-center top-1/2 -translate-y-1/2 text-[var(--color-primary)] hover:text-[var(--color-tertiary)] transition-colors">
                      <i className="fa-solid fa-circle-plus text-lg"></i>
                    </button>
                  </form>
                </div>

                <div className="space-y-4 pt-4 border-t border-[var(--color-surface-container-high)]">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] flex items-center gap-2">
                     <i className="fa-regular fa-message"></i> Comments
                  </h3>
                  <div className="text-center py-6 border border-dashed border-[var(--color-surface-container-high)] rounded-xl text-sm text-[var(--color-on-surface-variant)]">
                    Comments functionality goes here.
                  </div>
                </div>

              </div>
              
              <div className="w-full md:w-64 lg:w-80 bg-[var(--color-surface-container-lowest)] p-6 space-y-6 overflow-y-auto">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-2">Status</h4>
                  <select className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-container-high)] rounded-xl px-3 py-2 text-sm font-bold capitalize outline-none focus:border-[var(--color-primary)]">
                    <option value="todo">To Do</option>
                    <option value="doing">Doing</option>
                    <option value="inReview">In Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-2">Priority</h4>
                  <div className={`px-3 py-2 rounded-xl text-sm font-bold uppercase border w-fit ${task.priority === 'high' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                    {task.priority}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-2">Assignee</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--color-secondary)] to-[var(--color-primary)] flex items-center justify-center text-white font-bold text-sm">
                      {task.assignee.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-[var(--color-on-surface)]">{task.assignee}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-2">Sprint</h4>
                  <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-on-surface)]">
                    <i className="fa-regular fa-clock text-[var(--color-primary)]"></i> {task.sprint || 'Unassigned'}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-[var(--color-surface-container-high)] block">
                   <button className="text-red-500 text-sm font-bold flex items-center justify-center gap-2 hover:bg-red-500/10 px-3 py-2.5 rounded-lg transition-colors w-full">
                     <i className="fa-solid fa-trash-can"></i> Delete Task
                   </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskModal;
