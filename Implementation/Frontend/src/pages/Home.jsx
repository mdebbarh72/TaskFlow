import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import Toast from '../components/Toast';
import ProjectCard from '../components/ProjectCard';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
        setProjects(response.data);
      } catch (error) {
        setToast({ message: 'Failed to load projects.', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-8 animate-pulse">
        <div className="h-32 bg-[var(--color-surface-container-low)] rounded-[var(--radius-2xl)]"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-[var(--color-surface-container-lowest)] rounded-[var(--radius-xl)]"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Welcome Hero */}
      <header className="bg-[var(--color-surface-container-low)] p-12 rounded-[var(--radius-2xl)] relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-on-surface)] mb-4">
            Welcome back, {user?.name.split(' ')[0]}!
          </h1>
          <p className="text-[var(--color-on-surface-variant)] text-lg leading-relaxed">
            You have {projects.length} active projects in your workspace. Select one to continue your journey.
          </p>
        </div>
        
        {/* Abstract Kinetic Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)] opacity-[0.03] rounded-full blur-3xl -mr-20 -mt-20"></div>
      </header>

      {/* Projects Grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold text-[var(--color-on-surface)] flex items-center gap-2">
            <i className="fa-solid fa-border-all text-[20px] text-[var(--color-primary)]"></i>
            My Projects
          </h2>
          <button 
            onClick={() => navigate('/projects')}
            className="btn-tertiary flex items-center gap-2 text-sm"
          >
            View All <i className="fa-solid fa-arrow-right text-[16px]"></i>
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="bg-[var(--color-surface-container-lowest)] border-2 border-dashed border-[var(--color-surface-container-high)] p-20 rounded-[var(--radius-2xl)] text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[var(--color-surface-container-low)] flex items-center justify-center mb-2">
               <i className="fa-regular fa-folder text-[32px] text-[var(--color-outline)]"></i>
            </div>
            <h3 className="text-lg font-medium text-[var(--color-on-surface)]">No projects yet</h3>
            <p className="text-[var(--color-on-surface-variant)] max-w-sm">
              Your projects will appear here once you create them or get invited to join a team.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 6).map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onEdit={() => navigate('/projects')}
                onDelete={() => navigate('/projects')}
                onClick={(p) => navigate(`/projects/${p.id}/dashboard`)}
              />
            ))}
          </div>
        )}
      </section>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Home;
