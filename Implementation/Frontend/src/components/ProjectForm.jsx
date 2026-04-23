import React, { useState, useEffect } from 'react';
import api from '../api';

const ProjectForm = ({ project, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const isEditing = !!project;

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || ''
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      let response;
      if (isEditing) {
        response = await api.put(`/projects/${project.id}`, formData);
      } else {
        response = await api.post('/projects', formData);
      }
      onSuccess(response.data, isEditing ? 'updated' : 'created');
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        setErrors({ general: 'Something went wrong. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-600 text-sm animate-in fade-in slide-in-from-top-1">
          <i className="fa-solid fa-circle-exclamation text-[16px]"></i>
          {errors.general}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-semibold text-[var(--color-on-surface-variant)] block">
          Project Name
        </label>
        <div className="relative">
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className={`no-line-input ${errors.name ? 'ring-2 ring-red-500/50' : ''}`}
            placeholder="e.g. Marketing Campaign 2026"
            disabled={loading}
          />
        </div>
        {errors.name && (
          <p className="text-xs text-red-500 font-medium">{errors.name[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-semibold text-[var(--color-on-surface-variant)] block">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          className="no-line-input resize-none"
          placeholder="Briefly describe the goals and scope of this project..."
          disabled={loading}
        ></textarea>
        {errors.description && (
          <p className="text-xs text-red-500 font-medium">{errors.description[0]}</p>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--color-surface-container-high)]">
        <button
          type="button"
          onClick={onCancel}
          className="btn-tertiary text-sm"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary text-sm min-w-[120px] gap-2"
          disabled={loading}
        >
          {loading ? (
            <i className="fa-solid fa-circle-notch fa-spin text-[18px]"></i>
          ) : (
            <>
              <i className="fa-solid fa-floppy-disk text-[18px]"></i>
              {isEditing ? 'Update Project' : 'Create Project'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
