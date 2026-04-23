import React, { useState, useEffect } from 'react';
import api from '../../api.js';

const ActivityView = ({ projectId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, [projectId]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/projects/${projectId}/activity`);
      setActivities(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch activity logs');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (action) => {
    if (action.includes('card')) return 'fa-solid fa-file-lines text-blue-500';
    if (action.includes('sprint')) return 'fa-solid fa-person-running text-emerald-500';
    if (action.includes('comment')) return 'fa-solid fa-comment-dots text-purple-500';
    return 'fa-solid fa-circle-dot text-[var(--color-primary)]';
  };

  const formatAction = (action) => {
    return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <i className="fa-solid fa-circle-notch fa-spin text-2xl text-[var(--color-primary)]"></i>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-[var(--color-on-surface)]">Activity Stream</h2>
        <button onClick={fetchActivities} className="p-2 rounded-full hover:bg-[var(--color-surface-container-high)] transition-colors">
          <i className="fa-solid fa-rotate-right text-[var(--color-on-surface-variant)]"></i>
        </button>
      </div>

      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-[var(--color-primary)]/40 before:via-[var(--color-surface-container-high)] before:to-transparent">
        {activities.map((activity) => (
          <div key={activity.id} className="relative flex items-start gap-6 animate-in slide-in-from-left-4 duration-500">
            <div className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-surface)] border border-[var(--color-surface-container-high)] shadow-sm z-10">
              <i className={getActivityIcon(activity.action)}></i>
            </div>
            
            <div className="ml-12 flex-1 pt-1.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[var(--color-on-surface)]">{activity.user?.name}</span>
                  <span className="text-[var(--color-on-surface-variant)] text-sm">{formatAction(activity.action)}</span>
                </div>
                <time className="text-[10px] font-bold tracking-widest uppercase text-[var(--color-on-surface-variant)] opacity-60">
                  {new Date(activity.created_at).toLocaleString()}
                </time>
              </div>
              
              {/* Optional: Add actionable context if available */}
              <div className="mt-2 bg-[var(--color-surface-container-low)]/40 border border-[var(--color-surface-container-high)]/30 rounded-xl p-3 text-sm text-[var(--color-on-surface-variant)] backdrop-blur-sm">
                Task activity recorded for ID: {activity.actionable_id}
              </div>
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="text-center py-20 bg-[var(--color-surface-container-low)] rounded-3xl border border-dashed border-[var(--color-surface-container-high)]">
            <div className="w-16 h-16 bg-[var(--color-surface)] rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--color-surface-container-high)] shadow-inner">
               <i className="fa-solid fa-wind text-2xl text-[var(--color-on-surface-variant)] opacity-40"></i>
            </div>
            <h3 className="text-lg font-bold text-[var(--color-on-surface)]">The stream is quiet</h3>
            <p className="text-[var(--color-on-surface-variant)] mt-1">No activities have been recorded in this project yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityView;
