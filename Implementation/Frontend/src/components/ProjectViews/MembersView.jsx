import React, { useState, useEffect } from 'react';
import api from '../../api.js';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const MembersView = ({ project, currentUserRole }) => {
  const { user: currentUser } = useAuth();
  const [members, setMembers] = useState([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('viewer');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const projectId = project.id;
  const isOwner = currentUserRole === 'owner';

  useEffect(() => {
    fetchMembers();
  }, [projectId]);

  const fetchMembers = async () => {
    try {
      setFetching(true);
      const res = await api.get(`/projects/${projectId}/members`);
      setMembers(res.data.members || []);
    } catch(err) {
      console.error('Failed to fetch members:', err);
    } finally {
      setFetching(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.post(`/projects/${projectId}/invite`, { email, role });
      toast.success(`Invitation sent to ${email}`);
      setEmail('');
      fetchMembers();
    } catch(err) {
      const msg = err.response?.data?.message || 'Failed to invite member';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this member from the project?')) return;
    
    try {
      await api.delete(`/projects/${projectId}/members/${userId}`);
      setMembers(prev => prev.filter(m => m.id !== userId));
      toast.success('Member removed successfully');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to remove member';
      toast.error(msg);
    }
  };

  const handleLeaveProject = async () => {
    if (!window.confirm('Are you sure you want to leave this project?')) return;
    try {
      await api.delete(`/projects/${projectId}/leave`);
      toast.success('You left the project');
      window.location.href = '/projects';
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to leave project');
    }
  };

  if (fetching) return (
    <div className="p-8 text-[var(--color-on-surface-variant)] flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-4">
        <i className="fa-solid fa-circle-notch fa-spin text-4xl text-[var(--color-primary)]"></i>
        <span className="font-medium animate-pulse">Loading Team...</span>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
      {/* Left Col - List */}
      <div className="flex-1">
        <h2 className="text-3xl font-extrabold text-[var(--color-on-surface)] flex items-center gap-3 mb-1">
          <i className="fa-solid fa-users text-[var(--color-primary)]"></i> Team Members
        </h2>
        <p className="text-[var(--color-on-surface-variant)] mb-8">Manage the people who have access to this project.</p>

        <div className="space-y-3">
          {members.map(member => (
            <div key={member.id} className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-container-high)] rounded-2xl p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-tertiary)] flex items-center justify-center text-[var(--color-on-primary)] font-bold text-lg shadow-md">
                  {member.name?.charAt(0) || '?'}
                </div>
                <div>
                  <h4 className="font-bold text-[var(--color-on-surface)] text-sm">{member.name}</h4>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border
                  ${member.role === 'owner' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 
                    member.role === 'manager' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                    member.role === 'member' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                    'bg-gray-500/10 text-gray-400 border-gray-500/20'}
                `}>
                  {member.role}
                </span>
                
                {isOwner && member.id !== currentUser.id && (
                  <button 
                    onClick={() => handleRemoveMember(member.id)}
                    className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors text-xs font-bold border border-transparent hover:border-red-100"
                  >
                    <i className="fa-solid fa-user-minus"></i> Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Col - Invite */}
      <div className="w-full lg:w-[400px] space-y-4">
        {!isOwner && (
          <button
            onClick={handleLeaveProject}
            className="w-full border border-red-300 text-red-600 hover:bg-red-50 font-semibold py-2.5 rounded-xl transition-colors"
          >
            Leave Project
          </button>
        )}
        {isOwner && (
        <div className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-container-high)] rounded-2xl p-6 sticky top-6 shadow-md">
           <div className="flex items-center gap-2 mb-4">
             <i className="fa-solid fa-envelope text-[20px] text-[var(--color-primary)]"></i>
             <h3 className="font-bold text-lg text-[var(--color-on-surface)]">Invite Member</h3>
           </div>
           
           <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
             Invite teammates to collaborate. If they don't have an account, they'll receive instructions via email.
           </p>

           <form onSubmit={handleInvite} className="space-y-4">
             <div>
               <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-2">Email Address</label>
               <input 
                 type="email" 
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-container-high)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                 placeholder="name@example.com"
                 required
               />
             </div>
             <div>
               <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-2">Role</label>
               <select 
                 value={role}
                 onChange={(e) => setRole(e.target.value)}
                 className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-container-high)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all appearance-none"
               >
                 <option value="manager">Manager (Can manage sprints/cards)</option>
                 <option value="member">Member (Can edit assigned cards)</option>
                 <option value="viewer">Viewer (Read-only)</option>
               </select>
             </div>

             <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] hover:opacity-90 text-[var(--color-on-primary)] font-bold py-3 rounded-xl mt-4 flex items-center justify-center gap-2 transition-opacity disabled:opacity-50 shadow-lg shadow-[var(--color-primary)]/20"
             >
               {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <><i className="fa-solid fa-plus"></i> Send Invitation</>}
             </button>
           </form>

           <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-3 text-amber-500">
              <i className="fa-solid fa-shield-halved mt-0.5 text-lg"></i>
              <p className="text-xs font-medium leading-relaxed">
                Invited members will receive an email to join the project.
              </p>
           </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default MembersView;
