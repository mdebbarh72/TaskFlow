import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    try {
      await signup(formData);
      setToast({ message: 'Account created successfully! Welcome to the workspace.', type: 'success' });
      setTimeout(() => navigate('/home'), 500);
    } catch (error) {
      let msg = 'Registration failed.';
      
      if (error.response?.data?.errors) {
        const errorObj = error.response.data.errors;
        const firstKey = Object.keys(errorObj)[0];
        msg = errorObj[firstKey][0];
      } else if (error.response?.data?.message) {
        msg = error.response.data.message;
      }
      
      setToast({ message: msg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center -mt-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="w-full max-w-md bg-[var(--color-surface-container-lowest)] p-10 rounded-[var(--radius-2xl)] kinetic-shadow">
        <div className="text-center mb-10">
          <div className="inline-flex w-12 h-12 rounded-xl bg-[var(--color-primary)] bg-opacity-10 text-[var(--color-primary)] items-center justify-center mb-4">
             <i className="fa-solid fa-border-all text-[28px]"></i>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-on-surface)]">Join the motion</h1>
          <p className="text-[var(--color-on-surface-variant)] mt-2">Start for free and experience the kinetic workspace.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-on-surface)]" htmlFor="username">Username</label>
            <div className="relative group">
              <i className="fa-regular fa-user absolute left-3 top-3 text-[var(--color-outline)] group-focus-within:text-[var(--color-primary)] transition-colors text-[18px]"></i>
              <input
                id="username"
                type="text"
                className="no-line-input pl-10"
                placeholder="jane_doe"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-on-surface)]" htmlFor="email">Email address</label>
            <div className="relative group">
              <i className="fa-regular fa-envelope absolute left-3 top-3 text-[var(--color-outline)] group-focus-within:text-[var(--color-primary)] transition-colors text-[18px]"></i>
              <input
                id="email"
                type="email"
                className="no-line-input pl-10"
                placeholder="you@company.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-on-surface)]" htmlFor="password">Password</label>
            <div className="relative group">
              <i className="fa-solid fa-lock absolute left-3 top-3 text-[var(--color-outline)] group-focus-within:text-[var(--color-primary)] transition-colors text-[18px]"></i>
              <input
                id="password"
                type="password"
                className="no-line-input pl-10"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-on-surface)]" htmlFor="password_confirmation">Confirm Password</label>
            <div className="relative group">
              <i className="fa-solid fa-lock absolute left-3 top-3 text-[var(--color-outline)] group-focus-within:text-[var(--color-primary)] transition-colors text-[18px]"></i>
              <input
                id="password_confirmation"
                type="password"
                className="no-line-input pl-10"
                placeholder="••••••••"
                value={formData.password_confirmation}
                onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 mt-4 text-base font-semibold">
            {loading ? 'Creating...' : (
              <>
                Get Started <i className="fa-solid fa-arrow-right text-[20px] ml-1"></i>
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-[var(--color-on-surface-variant)] mt-8">
          Already have an account? <Link to="/login" className="text-[var(--color-primary)] font-semibold hover:underline">Log in here</Link>
        </p>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Signup;
