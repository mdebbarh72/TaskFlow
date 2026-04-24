import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess('If the email exists, a reset code has been sent.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (password !== passwordConfirmation) {
      return setError('Passwords do not match.');
    }

    setLoading(true);
    
    try {
      await api.post('/auth/reset-password', {
        email,
        code,
        password,
        password_confirmation: passwordConfirmation
      });
      setSuccess('Password reset successfully. Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid code or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[var(--color-surface)]">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-primary)] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[var(--color-tertiary)] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

      <div className="w-full max-w-md bg-[var(--color-surface-container-lowest)]/80 backdrop-blur-2xl border border-[var(--color-surface-container-high)] rounded-[var(--radius-2xl)] p-8 shadow-2xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2 group">
             <div className="w-12 h-12 bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] rounded-[var(--radius-xl)] flex items-center justify-center shadow-lg group-hover:shadow-[var(--color-primary)]/40 transition-all duration-300 transform group-hover:scale-105">
                <i className="fa-solid fa-layer-group text-white text-2xl"></i>
             </div>
          </Link>
        </div>

        <h2 className="text-3xl font-extrabold text-center text-[var(--color-on-surface)] mb-2">
          {step === 1 ? 'Forgot Password?' : 'Reset Password'}
        </h2>
        <p className="text-center text-[var(--color-on-surface-variant)] mb-8 text-sm">
          {step === 1 
            ? "Enter your email address and we'll send you a 6-digit reset code."
            : "Enter the code you received and your new password."}
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm px-4 py-3 rounded-[var(--radius-xl)] mb-6 flex items-center gap-3">
             <i className="fa-solid fa-circle-exclamation"></i>
             <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm px-4 py-3 rounded-[var(--radius-xl)] mb-6 flex items-center gap-3">
             <i className="fa-solid fa-circle-check"></i>
             <p>{success}</p>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestOTP} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--color-on-surface-variant)] group-focus-within:text-[var(--color-primary)] transition-colors">
                   <i className="fa-regular fa-envelope"></i>
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-container-high)] text-[var(--color-on-surface)] rounded-[var(--radius-xl)] pl-11 pr-4 py-3.5 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all placeholder:text-[var(--color-outline)]"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] hover:opacity-90 text-[var(--color-on-primary)] font-bold py-3.5 rounded-[var(--radius-xl)] transition-all disabled:opacity-50 shadow-lg shadow-[var(--color-primary)]/20 mt-2 flex items-center justify-center gap-2"
            >
              {loading ? <i className="fa-solid fa-circle-notch fa-spin text-lg"></i> : 'Send Reset Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] ml-1">6-Digit Code</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--color-on-surface-variant)] group-focus-within:text-[var(--color-primary)] transition-colors">
                   <i className="fa-solid fa-hashtag"></i>
                </div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full tracking-widest text-center font-mono text-xl bg-[var(--color-surface)] border border-[var(--color-surface-container-high)] text-[var(--color-on-surface)] rounded-[var(--radius-xl)] pl-11 pr-4 py-3.5 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all placeholder:text-[var(--color-outline)]"
                  placeholder="000000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] ml-1">New Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--color-on-surface-variant)] group-focus-within:text-[var(--color-primary)] transition-colors">
                   <i className="fa-solid fa-lock"></i>
                </div>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-container-high)] text-[var(--color-on-surface)] rounded-[var(--radius-xl)] pl-11 pr-4 py-3.5 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all placeholder:text-[var(--color-outline)]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] ml-1">Confirm New Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--color-on-surface-variant)] group-focus-within:text-[var(--color-primary)] transition-colors">
                   <i className="fa-solid fa-lock"></i>
                </div>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-container-high)] text-[var(--color-on-surface)] rounded-[var(--radius-xl)] pl-11 pr-4 py-3.5 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all placeholder:text-[var(--color-outline)]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] hover:opacity-90 text-[var(--color-on-primary)] font-bold py-3.5 rounded-[var(--radius-xl)] transition-all disabled:opacity-50 shadow-lg shadow-[var(--color-primary)]/20 mt-2 flex items-center justify-center gap-2"
            >
              {loading ? <i className="fa-solid fa-circle-notch fa-spin text-lg"></i> : 'Reset Password'}
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-[var(--color-surface-container-high)] text-center">
          <p className="text-[var(--color-on-surface-variant)] text-sm">
            Remember your password?{' '}
            <Link to="/login" className="font-bold text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors">
              Log in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
