import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/10 backdrop-blur-sm animate-in fade-in transition-all">
      <div className="relative w-full max-w-lg glass rounded-[var(--radius-2xl)] kinetic-shadow border border-[var(--color-outline-variant)]/15 p-6 animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--color-on-surface)]">
            {title}
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center -mr-2 rounded-full text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)] transition-colors"
          >
            <i className="fa-solid fa-xmark text-[20px]"></i>
          </button>
        </div>

        <div className="text-[var(--color-on-surface-variant)]">
          {children}
        </div>

      </div>
    </div>
  );
};

export default Modal;
