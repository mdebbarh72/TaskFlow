import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import ProjectCard from '../components/ProjectCard';
import ProjectForm from '../components/ProjectForm';
import Modal from '../components/Modal';
import Toast from '../components/Toast';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get('/projects');
      setProjects(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load projects. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateNew = () => {
    setEditingProject(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    try {
      await api.delete(`/projects/${projectToDelete.id}`);
      setProjects(prev => prev.filter(p => p.id !== projectToDelete.id));
      setToast({ message: 'Project deleted successfully.', type: 'success' });
      setIsDeleteModalOpen(false);
    } catch (err) {
      setToast({ message: 'Failed to delete project.', type: 'error' });
    } finally {
      setIsDeleting(false);
      setProjectToDelete(null);
    }
  };

  const handleFormSuccess = (updatedProject, action) => {
    if (action === 'created') {
      setProjects(prev => [updatedProject, ...prev]);
      setToast({ message: 'Project created successfully!', type: 'success' });
    } else {
      setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
      setToast({ message: 'Project updated successfully!', type: 'success' });
    }
    setIsFormModalOpen(false);
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-on-surface)]">
            Projects
          </h1>
          <p className="text-[var(--color-on-surface-variant)] mt-1">
            Manage your workspace projects and team collaborations.
          </p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="btn-primary"
        >
          <i className="fa-solid fa-plus text-[20px]"></i> New Project
        </button>
      </div>

      {/* Filters/Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-outline)] text-[18px]"></i>
          <input 
            type="text"
            placeholder="Search projects..."
            className="no-line-input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <i className="fa-solid fa-filter text-[18px]"></i> Filters
        </button>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-48 bg-[var(--color-surface-container-low)] rounded-[var(--radius-xl)]"></div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 p-8 rounded-[var(--radius-2xl)] text-center flex flex-col items-center gap-4">
          <i className="fa-solid fa-circle-exclamation text-[48px] text-red-500"></i>
          <h3 className="text-lg font-medium text-red-800">{error}</h3>
          <button onClick={fetchProjects} className="btn-secondary text-red-700 border-red-200">Try Again</button>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-[var(--color-surface-container-lowest)] border-2 border-dashed border-[var(--color-surface-container-high)] p-20 rounded-[var(--radius-2xl)] text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[var(--color-surface-container-low)] flex items-center justify-center mb-2">
             <i className="fa-regular fa-folder text-[32px] text-[var(--color-outline)]"></i>
          </div>
          <h3 className="text-lg font-medium text-[var(--color-on-surface)]">
            {searchTerm ? 'No projects match your search' : 'No projects yet'}
          </h3>
          <p className="text-[var(--color-on-surface-variant)] max-w-sm">
            {searchTerm ? 'Try adjusting your search terms or filters.' : 'Your projects will appear here once you create them or get invited to join a team.'}
          </p>
          {!searchTerm && (
            <button onClick={handleCreateNew} className="btn-primary mt-2">
              <i className="fa-solid fa-plus text-[18px]"></i> Create Your First Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onClick={(p) => navigate(`/projects/${p.id}/dashboard`)}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      <Modal 
        isOpen={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'Create New Project'}
      >
        <ProjectForm 
          project={editingProject} 
          onSuccess={handleFormSuccess}
          onCancel={() => setIsFormModalOpen(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Project"
      >
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <i className="fa-solid fa-circle-exclamation text-[24px] text-red-600"></i>
            </div>
            <div>
              <h4 className="font-bold text-red-900">Are you absolutely sure?</h4>
              <p className="text-sm text-red-700 mt-1 leading-relaxed">
                This action cannot be undone. This will permanently delete the <strong>{projectToDelete?.name}</strong> project and all associated tasks, sprints, and data.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--color-surface-container-high)]">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="btn-tertiary text-sm"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="btn-primary bg-red-600 hover:bg-red-700 border-none text-sm min-w-[140px]"
              disabled={isDeleting}
            >
              {isDeleting ? <i className="fa-solid fa-circle-notch fa-spin text-[18px]"></i> : 'Delete Project'}
            </button>
          </div>
        </div>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Projects;
