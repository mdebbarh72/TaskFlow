import React, { useState, useEffect } from 'react';
import api from '../../api.js';
import { toast } from 'react-hot-toast';

const StatCard = ({ title, value, subtitle, iconClass, colorClass }) => (
  <div className={`p-6 rounded-2xl border border-[var(--color-surface-container-high)] bg-[var(--color-surface-container-lowest)] shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow`}>
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 group-hover:scale-110 transition-transform ${colorClass}`}></div>
    <div className="flex justify-between items-start relative z-10">
      <div>
        <h4 className="text-sm font-medium text-[var(--color-on-surface-variant)] mb-1">{title}</h4>
        <div className="text-3xl font-extrabold text-[var(--color-on-surface)]">{value}</div>
        {subtitle && <p className="text-xs text-[var(--color-on-surface-variant)] mt-2 font-medium">{subtitle}</p>}
      </div>
      <div className={`flex items-center justify-center rounded-xl ${colorClass.replace('bg-', 'text-')}`}>
        <i className={`${iconClass} text-2xl`}></i>
      </div>
    </div>
  </div>
);

const DashboardView = ({ projectId }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  
  useEffect(() => {
    fetchStats();
    fetchRecentActivity();
  }, [projectId]);

  const fetchRecentActivity = async () => {
    try {
      const res = await api.get(`/projects/${projectId}/activity`);
      setRecentActivity(res.data.data?.slice(0, 5) || []);
    } catch (err) {
      console.error('Failed to fetch recent activity');
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/projects/${projectId}/dashboard`);
      setStats(res.data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch dashboard stats';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-[var(--color-on-surface-variant)] flex items-center justify-center h-full">
        <i className="fa-solid fa-circle-notch fa-spin text-2xl mr-3 text-[var(--color-primary)]"></i>
        Loading Dashboard Metrics...
      </div>
    );
  }

  if (!stats) return <div className="p-8 text-center">Failed to load statistics.</div>;

  const totalCards = stats.cards.total;
  const doneCards = stats.cards.done;
  const progressPercent = totalCards > 0 ? Math.round((doneCards / totalCards) * 100) : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-[var(--color-on-surface)]">Project Overview</h2>
        <p className="text-[var(--color-on-surface-variant)] mt-1">Key metrics and progress for your current project.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Tasks" value={stats.cards.total} subtitle={`${stats.cards.todo} in backlog`} iconClass="fa-solid fa-bullseye" colorClass="bg-blue-500" />
        <StatCard title="In Progress" value={stats.cards.doing} subtitle={`Across ${stats.sprints.active} active sprint(s)`} iconClass="fa-solid fa-chart-line" colorClass="bg-orange-500" />
        <StatCard title="Completed" value={stats.cards.done} subtitle={`${progressPercent}% of total work`} iconClass="fa-solid fa-circle-check" colorClass="bg-emerald-500" />
        <StatCard title="Total Sprints" value={stats.sprints.total} subtitle={`${stats.sprints.completed} completed`} iconClass="fa-solid fa-clock" colorClass="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-container-high)] rounded-2xl p-6">
          <h3 className="text-lg font-bold text-[var(--color-on-surface)] mb-6">Overall Progress</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-[var(--color-on-surface)]">Project Completion</span>
                <span className="text-emerald-500">{progressPercent}%</span>
              </div>
              <div className="h-4 w-full bg-[var(--color-surface-container-highest)] rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-4">
               <div className="text-center">
                 <div className="text-xl font-bold text-[var(--color-on-surface)]">{stats.cards.todo}</div>
                 <div className="text-[10px] uppercase font-bold text-[var(--color-on-surface-variant)]">To Do</div>
               </div>
               <div className="text-center border-x border-[var(--color-surface-container-high)]">
                 <div className="text-xl font-bold text-[var(--color-on-surface)]">{stats.cards.doing}</div>
                 <div className="text-[10px] uppercase font-bold text-[var(--color-on-surface-variant)]">Doing</div>
               </div>
               <div className="text-center">
                 <div className="text-xl font-bold text-[var(--color-on-surface)]">{stats.cards.done}</div>
                 <div className="text-[10px] uppercase font-bold text-[var(--color-on-surface-variant)]">Done</div>
               </div>
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-container-high)] rounded-2xl p-6 flex flex-col items-center justify-center">
           <h3 className="text-lg font-bold text-[var(--color-on-surface)] self-start w-full mb-6">Distribution</h3>
           
           <div className="relative w-48 h-48 rounded-full border-[16px] border-[var(--color-surface-container-highest)] flex items-center justify-center overflow-hidden">
             {/* Simplified radial visualization based on progress */}
             <div 
               className="absolute inset-0 rounded-full border-[16px] border-[var(--color-primary)] opacity-20"
               style={{ clipPath: `conic-gradient(from 0deg, var(--color-primary) ${progressPercent}%, transparent ${progressPercent}%)` }}
             ></div>
             <div className="text-center">
               <span className="block text-3xl font-bold text-[var(--color-on-surface)]">{stats.cards.total}</span>
               <span className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">Total Tasks</span>
             </div>
           </div>
           
           <div className="flex flex-col gap-3 w-full mt-8">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span> To Do</div>
                <span className="font-bold">{stats.cards.todo}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-500"></span> In Progress</div>
                <span className="font-bold">{stats.cards.doing}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span> In Review</div>
                <span className="font-bold">{stats.cards.inReview || 0}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Completed</div>
                <span className="font-bold">{stats.cards.done}</span>
              </div>
           </div>
        </div>
      </div>

      <div className="mt-8 bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-container-high)] rounded-2xl p-6">
        <h3 className="text-lg font-bold text-[var(--color-on-surface)] mb-6 flex items-center gap-2">
          <i className="fa-solid fa-clock-rotate-left text-[var(--color-primary)]"></i>
          Recent Activity
        </h3>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 p-3 hover:bg-[var(--color-surface-container-low)] rounded-xl transition-colors">
              <div className="w-10 h-10 rounded-full bg-[var(--color-surface-container-high)] flex items-center justify-center text-[var(--color-primary)] font-bold text-xs shrink-0">
                {activity.user?.name?.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="text-sm">
                  <span className="font-bold text-[var(--color-on-surface)]">{activity.user?.name}</span>
                  <span className="text-[var(--color-on-surface-variant)] ml-2">{activity.action.replace(/_/g, ' ')}</span>
                </div>
                <div className="text-[10px] text-[var(--color-on-surface-variant)] opacity-60 uppercase font-bold mt-0.5">
                  {new Date(activity.created_at).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {recentActivity.length === 0 && (
            <div className="text-center py-6 text-sm text-[var(--color-on-surface-variant)] italic">
              No recent activity recorded.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
