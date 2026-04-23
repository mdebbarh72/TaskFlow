import React, { useState, useEffect } from 'react';
import api from '../../../api.js';
import { toast } from 'react-hot-toast';

const TaskModal = ({ isOpen, onClose, cardId }) => {
  const [task, setTask] = useState(null);
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtask, setNewSubtask] = useState('');
  const [loading, setLoading] = useState(true);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [members, setMembers] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);

  useEffect(() => {
    if (isOpen && cardId) {
      fetchTaskDetails();
    }
  }, [isOpen, cardId]);

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/cards/${cardId}`);
      setTask(res.data);
      setEditedTitle(res.data.title);
      setEditedDescription(res.data.description || '');
      
      // Fetch project members for assignment
      if (res.data.project_id) {
        fetchMembers(res.data.project_id);
      }

      setSubtasks(res.data.subtasks || []);
      
      // Fetch comments
      fetchComments();

      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch task details.');
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await api.get(`/cards/${cardId}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error('Failed to fetch comments');
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setIsPostingComment(true);
      const res = await api.post(`/cards/${cardId}/comments`, { description: newComment });
      setComments([res.data, ...comments]);
      setNewComment('');
      toast.success('Comment added');
    } catch (err) {
      toast.error('Failed to post comment');
    } finally {
      setIsPostingComment(false);
    }
  };

  const fetchMembers = async (projectId) => {
    try {
      const res = await api.get(`/projects/${projectId}/members`);
      setMembers(res.data.members || []);
    } catch (err) {
      console.error('Failed to fetch project members');
    }
  };

  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    
    try {
      const res = await api.post(`/cards/${cardId}/subtasks`, { title: newSubtask });
      setSubtasks([...subtasks, res.data]);
      setNewSubtask('');
    } catch (err) {
      toast.error('Failed to add subtask');
    }
  };

  const toggleSubtask = async (subtaskId) => {
    try {
      const res = await api.patch(`/cards/${cardId}/subtasks/${subtaskId}/toggle`);
      const updated = subtasks.map(s => s.id === subtaskId ? res.data : s);
      setSubtasks(updated);
    } catch (err) {
      toast.error('Failed to update subtask');
    }
  };

  const deleteSubtask = async (subtaskId) => {
    try {
      await api.delete(`/cards/${cardId}/subtasks/${subtaskId}`);
      setSubtasks(subtasks.filter(s => s.id !== subtaskId));
    } catch (err) {
      toast.error('Failed to delete subtask');
    }
  };

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      await api.put(`/cards/${cardId}`, {
        title: editedTitle,
        description: editedDescription,
      });
      setTask({ ...task, title: editedTitle, description: editedDescription });
      toast.success('Task updated successfully!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update task';
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-container-high)] rounded-2xl shadow-2xl w-full max-w-5xl h-full max-h-[94vh] sm:max-h-[90vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 duration-300">
        
        {loading ? (
          <div className="p-12 flex justify-center items-center h-full"><div className="w-8 h-8 rounded-full border-4 border-t-[var(--color-primary)] animate-spin"></div></div>
        ) : (
          <>
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[var(--color-surface-container-high)] bg-[var(--color-surface-container-low)] flex justify-between items-start">
              <div className="flex flex-col flex-1 mr-4">
                <span className="text-[10px] font-bold tracking-widest text-[var(--color-on-surface-variant)] uppercase mb-1 flex items-center gap-1.5"><i className="fa-regular fa-file-lines text-xs"></i> TASK-{task.project_task_number?.toString().padStart(3, '0') || task.id.toString().padStart(3, '0')}</span>
                <input 
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="text-lg sm:text-2xl font-bold text-[var(--color-on-surface)] leading-tight bg-transparent border-none focus:ring-0 p-0 w-full hover:bg-[var(--color-surface-container-high)]/20 rounded transition-colors"
                />
              </div>
              <button onClick={onClose} className="p-2 w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] hover:text-red-500 transition-colors">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row min-h-0">
              <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6 sm:space-y-8 hide-scrollbar lg:border-r border-[var(--color-surface-container-high)]">
                
                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)]">Description</h3>
                  <textarea 
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    rows="5"
                    className="w-full bg-[var(--color-surface)] p-5 rounded-xl border border-[var(--color-surface-container-high)] text-[var(--color-on-surface)] text-sm leading-relaxed focus:outline-none focus:border-[var(--color-primary)] transition-all resize-none"
                    placeholder="Task details and acceptance criteria..."
                  ></textarea>
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

                <div className="space-y-4 sm:space-y-6 pt-4 border-t border-[var(--color-surface-container-high)]">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] flex items-center gap-2">
                     <i className="fa-regular fa-message"></i> Comments ({comments.length})
                  </h3>
                  
                  <form onSubmit={handlePostComment} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex-shrink-0 flex items-center justify-center text-white font-bold text-xs">
                      ME
                    </div>
                    <div className="flex-1 space-y-2">
                      <textarea 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-container-high)] rounded-xl p-3 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-all resize-none min-h-[80px]"
                      ></textarea>
                      <div className="flex justify-end">
                        <button 
                          type="submit"
                          disabled={isPostingComment || !newComment.trim()}
                          className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[var(--color-primary)]/90 transition-colors disabled:opacity-50"
                        >
                          {isPostingComment ? 'Posting...' : 'Post Comment'}
                        </button>
                      </div>
                    </div>
                  </form>

                  <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 hide-scrollbar">
                    {comments.map(comment => (
                      <div key={comment.id} className="flex gap-4 group">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-secondary)]/20 flex-shrink-0 flex items-center justify-center text-[var(--color-secondary)] font-bold text-xs border border-[var(--color-secondary)]/10">
                          {comment.user?.name?.charAt(0) || '?'}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-[var(--color-on-surface)]">{comment.user?.name}</span>
                            <span className="text-[10px] text-[var(--color-on-surface-variant)]">{new Date(comment.created_at).toLocaleString()}</span>
                          </div>
                          <div className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed bg-[var(--color-surface-container-low)]/50 p-3 rounded-xl border border-[var(--color-surface-container-high)]/30 group-hover:border-[var(--color-primary)]/20 transition-all">
                            {comment.description}
                          </div>
                        </div>
                      </div>
                    ))}
                    {comments.length === 0 && (
                      <div className="text-center py-8 border border-dashed border-[var(--color-surface-container-high)] rounded-2xl text-sm text-[var(--color-on-surface-variant)] opacity-60">
                         No comments yet. Start the conversation!
                      </div>
                    )}
                  </div>
                </div>

              </div>
              
              <div className="w-full lg:w-80 bg-[var(--color-surface-container-lowest)] p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto border-t lg:border-t-0 border-[var(--color-surface-container-high)]">
                {/* Status Option Removed as requested */}

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-2">Priority</h4>
                  <div className={`px-3 py-2 rounded-xl text-sm font-bold uppercase border w-fit 
                    ${task.priority === 'high' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 
                      task.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' :
                      'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                    {task.priority}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-2">Assignee</h4>
                  <select 
                    value={task.assignee_id || ''}
                    onChange={async (e) => {
                      const newAssigneeId = e.target.value;
                      try {
                        await api.patch(`/cards/${task.id}/assign`, { assignee_id: newAssigneeId || null });
                        const member = members.find(m => m.id.toString() === newAssigneeId.toString());
                        setTask({ ...task, assignee_id: newAssigneeId, assignee: member });
                        toast.success('Assignee updated');
                      } catch (err) {
                        toast.error('Failed to update assignee');
                      }
                    }}
                    className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-container-high)] rounded-xl px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)] cursor-pointer"
                  >
                    <option value="">Unassigned</option>
                    {members.map(member => (
                      member.role !== 'viewer' ? <option key={member.id} value={member.id}>{member.name}</option> : null
                    ))}
                  </select>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-2">Sprint</h4>
                  <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-on-surface)]">
                    <i className="fa-regular fa-clock text-[var(--color-primary)]"></i> {task.sprint?.name || 'Unassigned'}
                  </div>
                </div>

                <div className="pt-4 sm:pt-6 mt-2 sm:mt-4 border-t border-[var(--color-surface-container-high)] space-y-2 sm:space-y-3">
                   <button 
                     onClick={handleSaveChanges}
                     disabled={isSaving}
                     className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-tertiary)] text-[var(--color-on-primary)] px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                   >
                     {isSaving ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-floppy-disk"></i>}
                     Save Changes
                   </button>
                   <button 
                     onClick={async () => {
                       if (window.confirm('Delete this task?')) {
                         try {
                           await api.delete(`/cards/${task.id}`);
                           toast.success('Task deleted successfully');
                           onClose();
                         } catch (err) {
                           const msg = err.response?.data?.message || 'Failed to delete task';
                           toast.error(msg);
                         }
                       }
                     }}
                     className="text-red-500 text-sm font-bold flex items-center justify-center gap-2 hover:bg-red-500/10 px-3 py-2 rounded-lg transition-colors w-full"
                   >
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
