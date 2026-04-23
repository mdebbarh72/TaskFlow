import React from 'react';
import Modal from './Modal';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Confirm Logout"
    >
      <div className="flex flex-col items-center text-center gap-6 py-4">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
          <i className="fa-solid fa-circle-exclamation text-[32px]"></i>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-[var(--color-on-surface)]">Ready to leave?</h3>
          <p className="text-[var(--color-on-surface-variant)] max-w-[280px]">
            You will need to sign in again to access your kinetic workspace.
          </p>
        </div>

        <div className="flex gap-4 w-full pt-4">
          <button 
            onClick={onClose}
            className="btn-secondary flex-1"
          >
            Stay
          </button>
          <button 
            onClick={onConfirm}
            className="btn-primary bg-red-500 hover:bg-red-600 border-none text-white flex-1 gap-2"
          >
            <i className="fa-solid fa-right-from-bracket text-[18px]"></i> Logout
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LogoutModal;
