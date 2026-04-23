import React, { useEffect } from 'react';

const Toast = ({ message, type = 'info', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <i className="fa-regular fa-circle-check text-[20px] text-green-500"></i>,
    error: <i className="fa-solid fa-circle-exclamation text-[20px] text-red-500"></i>,
    info: <i className="fa-solid fa-circle-info text-[20px] text-[var(--color-primary)]"></i>
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom flex items-start gap-3 bg-[var(--color-surface-container-lowest)] kinetic-shadow px-4 py-3 rounded-[var(--radius-xl)] border border-[var(--color-outline-variant)]/15 max-w-sm">
      <div className="mt-0.5">
        {icons[type]}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-[var(--color-on-surface)]">{message}</p>
      </div>
      <button onClick={onClose} className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors p-1">
        <i className="fa-solid fa-xmark text-[18px]"></i>
      </button>
    </div>
  );
};

export default Toast;
