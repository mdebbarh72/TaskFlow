import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const Login = () => {
  const [step, setStep] = useState('login'); // 'login' or 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpData, setOtpData] = useState(null); // stores user_id and purpose
  
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const { login, verifyOTP } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    try {
      const result = await login(email, password);

      if (result?.requires_otp) {
        setOtpData({
          userId: result.user_id,
          purpose: result.purpose,
          message: result.message
        });
        setStep('otp');
        setToast({ message: result.message || 'Verification required. Check your email.', type: 'info' });
        return;
      }

      setToast({ message: 'Login successful! Entering workspace...', type: 'success' });
      setTimeout(() => navigate('/home'), 500);
    } catch (error) {
      let msg = 'Login failed. Please check your credentials.';

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

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setToast({ message: 'Please enter a valid 6-digit code.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      await verifyOTP(otpData.userId, otpCode, otpData.purpose);
      setToast({ message: 'Verification successful! Welcome back.', type: 'success' });
      setTimeout(() => navigate('/home'), 500);
    } catch (error) {
      let msg = 'Invalid OTP code. Please try again.';
      
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstKey = Object.keys(errors)[0];
        msg = errors[firstKey][0];
      } else if (error.response?.data?.message) {
        msg = error.response.data.message;
      }
      
      setToast({ message: msg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const renderLoginForm = () => (
    <form onSubmit={handleLoginSubmit} className="space-y-6 animate-in fade-in duration-500">
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-on-surface)]" htmlFor="email">Email address</label>
        <div className="relative group">
          <i className="fa-regular fa-envelope absolute left-3 top-3 text-[var(--color-outline)] group-focus-within:text-[var(--color-primary)] transition-colors text-[18px]"></i>
          <input
            id="email"
            type="email"
            className="no-line-input pl-10"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-[var(--color-on-surface)]" htmlFor="password">Password</label>
          <Link to="#" className="text-xs text-[var(--color-primary)] hover:underline font-medium">Forgot password?</Link>
        </div>
        <div className="relative group">
          <i className="fa-solid fa-lock absolute left-3 top-3 text-[var(--color-outline)] group-focus-within:text-[var(--color-primary)] transition-colors text-[18px]"></i>
          <input
            id="password"
            type="password"
            className="no-line-input pl-10"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base font-semibold">
        {loading ? 'Entering...' : (
          <>
            Sign In <i className="fa-solid fa-arrow-right text-[20px] ml-1"></i>
          </>
        )}
      </button>

      <p className="text-center text-sm text-[var(--color-on-surface-variant)] mt-8">
        Don't have an account? <Link to="/signup" className="text-[var(--color-primary)] font-semibold hover:underline">Create one for free</Link>
      </p>
    </form>
  );

  const renderOtpForm = () => (
    <form onSubmit={handleOtpSubmit} className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="text-center mb-6">
        <div className="inline-flex w-16 h-16 rounded-full bg-blue-50 text-[var(--color-primary)] items-center justify-center mb-4">
           <i className="fa-solid fa-shield-halved text-[32px]"></i>
        </div>
        <h2 className="text-xl font-bold text-[var(--color-on-surface)]">Two-Factor Authentication</h2>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-2 italic px-2">
          {otpData?.message || 'A verification code has been sent to your email. Please enter it below to continue.'}
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-on-surface)] text-center block" htmlFor="otp">Verification Code</label>
        <input
          id="otp"
          type="text"
          maxLength={6}
          className="no-line-input text-center text-2xl tracking-[0.5em] font-mono py-4"
          placeholder="000000"
          value={otpCode}
          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
          required
          autoFocus
        />
      </div>

      <button type="submit" disabled={loading || otpCode.length !== 6} className="btn-primary w-full py-3.5 text-base font-semibold">
        {loading ? 'Verifying...' : (
          <>
            Verify & Continue <i className="fa-solid fa-arrow-right text-[20px] ml-1"></i>
          </>
        )}
      </button>

      <button 
        type="button" 
        onClick={() => setStep('login')}
        className="flex items-center justify-center gap-2 w-full text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors underline decoration-dotted"
      >
        <i className="fa-solid fa-arrow-left text-[16px]"></i> Back to login
      </button>
    </form>
  );

  return (
    <div className="flex-1 flex flex-col items-center justify-center -mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="w-full max-w-md bg-[var(--color-surface-container-lowest)] p-10 rounded-[var(--radius-2xl)] kinetic-shadow">
        {step === 'login' && (
          <div className="text-center mb-10 overflow-hidden">
            <div className="inline-flex w-12 h-12 rounded-xl bg-[var(--color-primary)] bg-opacity-10 text-[var(--color-primary)] items-center justify-center mb-4">
               <i className="fa-solid fa-border-all text-[28px]"></i>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--color-on-surface)]">Welcome back</h1>
            <p className="text-[var(--color-on-surface-variant)] mt-2">Sign in to your kinetic workspace.</p>
          </div>
        )}

        {step === 'login' ? renderLoginForm() : renderOtpForm()}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Login;
