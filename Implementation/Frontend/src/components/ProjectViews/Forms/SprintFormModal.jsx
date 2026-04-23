import React, { useState, useEffect } from 'react';
import api from '../../../api.js';
import { toast } from 'react-hot-toast';

const SprintFormModal = ({ isOpen, onClose, projectId, onSuccess, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: ''
  });
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData({
          name: '',
          description: '',
          start_date: '',
          end_date: ''
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      if (initialData) {
        await api.put(`/sprints/${initialData.id}`, formData);
        toast.success('Sprint updated successfully!');
      } else {
        await api.post(`/projects/${projectId}/sprints`, formData);
        toast.success('Sprint created successfully!');
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      const message = err.response?.data?.message || 'Error saving sprint. Please try again.';
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
        toast.error(message);
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-container-high)] rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="px-6 py-4 border-b border-[var(--color-surface-container-high)] flex justify-between items-center bg-[var(--color-surface-container-low)]">
          <h3 className="text-lg font-bold text-[var(--color-on-surface)] flex items-center gap-2">
            <i className="fa-regular fa-calendar-days text-[var(--color-primary)]"></i>
            {initialData ? 'Update Sprint' : 'Create New Sprint'}
          </h3>
          <button onClick={onClose} className="p-1.5 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] transition-colors">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto max-h-[calc(90vh-76px)]">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-1.5">Sprint Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className={`w-full bg-[var(--color-surface)] border ${errors.name ? 'border-red-500' : 'border-[var(--color-surface-container-high)]'} rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all`}
              placeholder="e.g. Sprint 3 - User Settings"
            />
            {errors.name && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.name[0]}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-1.5">Goal / Description</label>
            <textarea 
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-container-high)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-all resize-none"
              placeholder="What is the main goal of this sprint?"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-1.5">Start Date</label>
                <div className="relative group">
                  <i className="fa-regular fa-calendar absolute left-3 top-3 text-[var(--color-outline)] group-focus-within:text-[var(--color-primary)] transition-colors text-[18px] pointer-events-none"></i>
                  <input 
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                    onClick={(e) => e.target.showPicker && e.target.showPicker()}
                    className={`w-full bg-[var(--color-surface)] border ${errors.start_date ? 'border-red-500' : 'border-[var(--color-surface-container-high)]'} rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-all [color-scheme:dark]`}
                  />
                </div>
              {errors.start_date && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.start_date[0]}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-1.5">End Date</label>
                <div className="relative group">
                  <i className="fa-regular fa-calendar-check absolute left-3 top-3 text-[var(--color-outline)] group-focus-within:text-[var(--color-primary)] transition-colors text-[18px] pointer-events-none"></i>
                  <input 
                    type="date"
                    required
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                    onClick={(e) => e.target.showPicker && e.target.showPicker()}
                    className={`w-full bg-[var(--color-surface)] border ${errors.end_date ? 'border-red-500' : 'border-[var(--color-surface-container-high)]'} rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-all [color-scheme:dark]`}
                  />
                </div>
              {errors.end_date && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.end_date[0]}</p>}
            </div>
          </div>

          <div className="pt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 border-t border-[var(--color-surface-container-high)] mt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold rounded-xl text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)] transition-colors">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-tertiary)] text-[var(--color-on-primary)] hover:opacity-90 transition-opacity flex items-center gap-2 shadow-md disabled:opacity-50"
            >
              {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-regular fa-square-check"></i>}
              Save Sprint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SprintFormModal;
