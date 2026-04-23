import React from 'react';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, title, message, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-[var(--color-surface-container-lowest)] border border-red-500/20 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="px-6 py-4 flex justify-between items-center border-b border-[var(--color-surface-container-high)]">
          <h3 className="text-lg font-bold text-[var(--color-on-surface)] flex items-center gap-2">
            <span className="bg-red-500/10 p-1.5 w-8 h-8 flex justify-center items-center rounded-lg text-red-500"><i className="fa-solid fa-triangle-exclamation"></i></span>
            {title || 'Confirm Deletion'}
          </h3>
          <button onClick={onClose} className="p-1 w-8 h-8 flex justify-center items-center rounded-lg hover:bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] transition-colors">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="p-6">
          <p className="text-[var(--color-on-surface-variant)] mb-2">
            {message || `Are you sure you want to delete ${itemName}?`}
          </p>
          <p className="text-red-500 text-sm font-medium">This action cannot be undone.</p>
        </div>

        <div className="px-6 py-4 bg-[var(--color-surface-container-low)] border-t border-[var(--color-surface-container-high)] flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 text-sm font-bold rounded-xl text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)] transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-5 py-2 text-sm font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors shadow-md">
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
