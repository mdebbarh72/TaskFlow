import React, { useState, useEffect } from 'react';
import api from '../../../api/api';

const StatCard = ({ title, value, subtitle, iconClass, colorClass }) => (
  <div className={`p-6 rounded-2xl border border-[var(--color-surface-container-high)] bg-[var(--color-surface-container-lowest)] shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow`}>
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 group-hover:scale-110 transition-transform ${colorClass}`}></div>
    <div className="flex justify-between items-start relative z-10">
      <div>
        <h4 className="text-sm font-medium text-[var(--color-on-surface-variant)] mb-1">{title}</h4>
        <div className="text-3xl font-extrabold text-[var(--color-on-surface)]">{value}</div>
        {subtitle && <p className="text-xs text-[var(--color-on-surface-variant)] mt-2 font-medium">{subtitle}</p>}
      </div>
      <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${colorClass.replace('bg-', 'bg-opacity-20 text-')}`}>
        <i className={`${iconClass} text-xl ${colorClass.replace('bg-', 'text-')}`}></i>
      </div>
    </div>
  </div>
);

const DashboardView = ({ projectId }) => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, [projectId]);

  if (loading) {
    return <div className="p-8 text-[var(--color-on-surface-variant)]">Loading Dashboard Metrics...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-[var(--color-on-surface)]">Project Overview</h2>
        <p className="text-[var(--color-on-surface-variant)] mt-1">Key metrics and progress for your current project.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Tasks" value="42" subtitle="12 created this week" iconClass="fa-solid fa-bullseye" colorClass="bg-blue-500" />
        <StatCard title="In Progress" value="8" subtitle="Across 2 active sprints" iconClass="fa-solid fa-chart-line" colorClass="bg-orange-500" />
        <StatCard title="Completed" value="29" subtitle="+5 from yesterday" iconClass="fa-solid fa-circle-check" colorClass="bg-emerald-500" />
        <StatCard title="Overdue" value="3" subtitle="Requires immediate attention" iconClass="fa-solid fa-clock" colorClass="bg-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-container-high)] rounded-2xl p-6">
          <h3 className="text-lg font-bold text-[var(--color-on-surface)] mb-6">Active Sprint Progress</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-[var(--color-on-surface)]">Sprint 1 - Core Features</span>
                <span className="text-emerald-500">65%</span>
              </div>
              <div className="h-3 w-full bg-[var(--color-surface-container-highest)] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full w-[65%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-[var(--color-on-surface)]">Sprint 2 - UI Polish</span>
                <span className="text-blue-500">12%</span>
              </div>
              <div className="h-3 w-full bg-[var(--color-surface-container-highest)] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full w-[12%]"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-container-high)] rounded-2xl p-6 flex flex-col items-center justify-center">
           <h3 className="text-lg font-bold text-[var(--color-on-surface)] self-start w-full mb-6">Priority Distribution</h3>
           
           <div className="relative w-48 h-48 rounded-full border-[16px] border-[var(--color-surface-container-highest)] flex items-center justify-center">
             <div className="absolute inset-0 rounded-full border-[16px] border-red-500" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 30%, 50% 50%)' }}></div>
             <div className="absolute inset-0 rounded-full border-[16px] border-orange-500" style={{ clipPath: 'polygon(50% 50%, 100% 30%, 100% 100%, 0% 100%, 0% 80%, 50% 50%)' }}></div>
             <div className="absolute inset-0 rounded-full border-[16px] border-blue-500" style={{ clipPath: 'polygon(50% 50%, 0% 80%, 0% 0%, 50% 0%, 50% 50%)' }}></div>
             <div className="text-center">
               <span className="block text-2xl font-bold text-[var(--color-on-surface)]">42</span>
               <span className="text-xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-widest">Cards</span>
             </div>
           </div>
           
           <div className="flex justify-center gap-4 mt-6 text-sm">
             <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500"></span> Blocker</div>
             <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-500"></span> High</div>
             <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Normal</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
