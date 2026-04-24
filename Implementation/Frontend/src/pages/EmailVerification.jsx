import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[var(--color-surface)]">
      {/* Background Orbs */}
      <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-[var(--color-primary)] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[10%] w-[30%] h-[30%] bg-[var(--color-tertiary)] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

      <div className="w-full max-w-md bg-[var(--color-surface-container-lowest)]/80 backdrop-blur-2xl border border-[var(--color-surface-container-high)] rounded-[var(--radius-2xl)] p-10 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500 text-center flex flex-col items-center">
        
        {status === 'success' ? (
          <>
            <div className="w-20 h-20 bg-emerald-500/10 border-2 border-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
              <i className="fa-solid fa-check text-4xl"></i>
            </div>
            <h2 className="text-3xl font-extrabold text-[var(--color-on-surface)] mb-3">
              Email Verified!
            </h2>
            <p className="text-[var(--color-on-surface-variant)] mb-8 leading-relaxed">
              Thank you for verifying your email address. Your account is now fully active and you can access all features of TaskFlow.
            </p>
            <Link 
              to="/login"
              className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] hover:opacity-90 text-[var(--color-on-primary)] font-bold py-3.5 rounded-[var(--radius-xl)] transition-all shadow-lg shadow-[var(--color-primary)]/20 flex items-center justify-center gap-2"
            >
              Continue to Login <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-500/10 border-2 border-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-red-500/20">
              <i className="fa-solid fa-xmark text-4xl"></i>
            </div>
            <h2 className="text-3xl font-extrabold text-[var(--color-on-surface)] mb-3">
              Verification Failed
            </h2>
            <p className="text-[var(--color-on-surface-variant)] mb-8 leading-relaxed">
              The verification link is invalid or has expired. Please log in to your account and request a new verification email.
            </p>
            <Link 
              to="/login"
              className="w-full bg-[var(--color-surface-container-high)] hover:bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface)] font-bold py-3.5 rounded-[var(--radius-xl)] transition-all flex items-center justify-center gap-2"
            >
              Back to Login
            </Link>
          </>
        )}

      </div>
    </div>
  );
};

export default EmailVerification;
