import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api.js';

import DashboardView from '../components/ProjectViews/DashboardView';
import BacklogView from '../components/ProjectViews/BacklogView';
import BoardView from '../components/ProjectViews/BoardView';
import ListView from '../components/ProjectViews/ListView';
import MembersView from '../components/ProjectViews/MembersView';
import ActivityView from '../components/ProjectViews/ActivityView';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', iconClass: 'fa-solid fa-chart-line' },
  { id: 'board', label: 'Kanban Board', iconClass: 'fa-solid fa-table-columns' },
  { id: 'backlog', label: 'Backlog', iconClass: 'fa-solid fa-list-check' },
  { id: 'list', label: 'All Cards', iconClass: 'fa-solid fa-list-ul' },
  { id: 'members', label: 'Members', iconClass: 'fa-solid fa-users' },
  { id: 'activity', label: 'Activity', iconClass: 'fa-solid fa-clock-rotate-left' },
];

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState(window.location.pathname.endsWith('/dashboard') ? 'dashboard' : 'board');
  const [loading, setLoading] = useState(true);
  const [showTabMenu, setShowTabMenu] = useState(false);
  const activeTabMeta = useMemo(
    () => tabs.find((tab) => tab.id === activeTab) || tabs[0],
    [activeTab]
  );

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  useEffect(() => {
    setShowTabMenu(false);
  }, [activeTab, id]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <i className="fa-solid fa-circle-notch fa-spin text-4xl text-[var(--color-primary)]"></i>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[80vh]">
        <div className="bg-[var(--color-surface-container)] rounded-2xl p-8 border border-[var(--color-surface-container-high)] shadow-xl glass">
          <h2 className="text-2xl font-bold text-[var(--color-error)] mb-2">Project Not Found</h2>
          <p className="text-[var(--color-on-surface-variant)] mb-6">The project you are looking for does not exist or you lack permission.</p>
          <button onClick={() => navigate('/projects')} className="bg-[var(--color-primary)] text-[var(--color-on-primary)] px-6 py-2 rounded-full font-medium transition-transform hover:scale-105 active:scale-95">
            Return to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-gradient-to-br from-[var(--color-surface-container-low)] to-[var(--color-surface-container)] overflow-hidden shadow-none border-0 mt-0 mx-0 relative backdrop-blur-xl">
      <div className="relative bg-[var(--color-surface-container-highest)]/60 backdrop-blur-md border-b border-[var(--color-surface-container-high)] z-10 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/10 to-transparent pointer-events-none"></div>
        <div className="flex items-center px-4 sm:px-6 py-4 sm:py-5">
          <button 
            onClick={() => navigate('/projects')}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center mr-3 sm:mr-5 rounded-full bg-[var(--color-surface)] shadow-md hover:shadow-lg hover:bg-[var(--color-surface-container-high)] transition-all duration-300 active:scale-90 border border-[var(--color-surface-container-high)] text-[var(--color-on-surface)]"
            title="Back to Projects"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div className="flex-1">
            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-tertiary)] to-[var(--color-secondary)] drop-shadow-sm line-clamp-1">
              {project.name}
            </h1>
            <p className="text-xs sm:text-sm font-medium text-[var(--color-on-surface-variant)] mt-1 sm:mt-1.5 max-w-2xl line-clamp-1">
              {project.description || 'No project description provided.'}
            </p>
          </div>
        </div>

        <div className="px-4 sm:px-6 pb-3 sm:pb-0 relative z-10">
          <div className="sm:hidden relative">
            <button
              onClick={() => setShowTabMenu((prev) => !prev)}
              className="w-full flex items-center justify-between rounded-xl border border-[var(--color-surface-container-high)] bg-[var(--color-surface)] px-4 py-3 text-sm font-semibold text-[var(--color-on-surface)]"
            >
              <span className="flex items-center gap-2">
                <i className={activeTabMeta.iconClass}></i>
                {activeTabMeta.label}
              </span>
              <i className={`fa-solid fa-chevron-${showTabMenu ? 'up' : 'down'} text-xs`}></i>
            </button>
            {showTabMenu && (
              <div className="mt-2 rounded-xl border border-[var(--color-surface-container-high)] bg-[var(--color-surface-container-lowest)] shadow-xl overflow-hidden relative z-30">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setShowTabMenu(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm flex items-center gap-2 transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                        : 'text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-low)]'
                    }`}
                  >
                    <i className={tab.iconClass}></i>
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="hidden sm:flex overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group flex items-center justify-center gap-2.5 px-6 py-3.5 font-semibold text-sm whitespace-nowrap transition-all duration-300 border-b-2 relative overflow-hidden
                    ${isActive 
                      ? 'border-[var(--color-primary)] text-[var(--color-primary)]' 
                      : 'border-transparent text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'
                    }`}
                >
                  {isActive && (
                    <span className="absolute inset-0 bg-[var(--color-primary)]/10 -z-10 rounded-t-lg transition-opacity"></span>
                  )}
                  <i className={`${tab.iconClass} text-lg transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:text-[var(--color-primary)]/70'}`}></i>
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-[var(--color-surface)]/40 relative animate-in fade-in duration-500">
        {activeTab === 'dashboard' && <DashboardView projectId={id} />}
        {activeTab === 'board' && <BoardView projectId={id} currentUserRole={project.current_user_role} />}
        {activeTab === 'backlog' && <BacklogView projectId={id} currentUserRole={project.current_user_role} />}
        {activeTab === 'list' && <ListView projectId={id} />}
        {activeTab === 'members' && <MembersView project={project} currentUserRole={project.current_user_role} />}
        {activeTab === 'activity' && <ActivityView projectId={id} />}
      </div>
    </div>
  );
};

export default ProjectDetails;
