import React from 'react';

const ProjectCard = ({ project, onEdit, onDelete, onClick }) => {
  const formattedDate = new Date(project.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div 
      onClick={() => onClick && onClick(project)}
      className="group bg-[var(--color-surface-container-lowest)] p-6 rounded-[var(--radius-xl)] kinetic-shadow hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-[var(--color-primary)]/20 cursor-pointer relative overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--color-primary)] opacity-[0.02] rounded-full blur-2xl group-hover:opacity-[0.05] transition-opacity"></div>
      
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center font-bold text-xl shadow-sm">
          {project.name.charAt(0).toUpperCase()}
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(project); }}
            className="p-2 rounded-lg text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)] hover:text-[var(--color-primary)] transition-all"
            title="Edit Project"
          >
            <i className="fa-solid fa-pen-to-square text-[16px]"></i>
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(project); }}
            className="p-2 rounded-lg text-[var(--color-on-surface-variant)] hover:bg-red-50 hover:text-red-500 transition-all"
            title="Delete Project"
          >
            <i className="fa-solid fa-trash-can text-[16px]"></i>
          </button>
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors mb-2 line-clamp-1">
        {project.name}
      </h3>
      <p className="text-sm text-[var(--color-on-surface-variant)] line-clamp-2 mb-6 h-10 leading-relaxed">
        {project.description || "No description provided for this project."}
      </p>

      <div className="pt-4 border-t border-[var(--color-surface-container-high)]/50 flex items-center justify-between text-[10px] uppercase tracking-wider font-bold text-[var(--color-outline)]">
        <span className="flex items-center gap-1.5">
          <i className="fa-regular fa-calendar text-[12px] text-[var(--color-primary)]/60"></i> {formattedDate}
        </span>
        <span className="flex items-center gap-1.5 bg-[var(--color-surface-container-low)] px-2.5 py-1 rounded-full text-[var(--color-on-surface-variant)]">
          <i className="fa-solid fa-users text-[12px]"></i> {project.owner_id === project.current_user_id ? 'Owner' : 'Member'}
        </span>
      </div>
    </div>
  );
};

export default ProjectCard;
