import React from 'react';
import { useAuth } from '../context/AuthContext';

const Banned = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)] px-6">
      <div className="max-w-md w-full bg-[var(--color-surface-container-lowest)] border border-red-200 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
          <i className="fa-solid fa-ban text-2xl"></i>
        </div>
        <h1 className="text-2xl font-bold text-[var(--color-on-surface)]">Account Banned</h1>
        <p className="text-[var(--color-on-surface-variant)] mt-3">
          Your account has been banned. Please contact support if you believe this is a mistake.
        </p>
        <button
          onClick={logout}
          className="mt-6 w-full btn-primary bg-red-600 hover:bg-red-700 border-none"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Banned;
