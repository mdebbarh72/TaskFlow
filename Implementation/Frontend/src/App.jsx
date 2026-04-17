import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Layout from './components/Layout';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Landing from './pages/Landing';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Testimonials from './pages/Testimonials';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import ForgotPassword from './pages/ForgotPassword';
import EmailVerification from './pages/EmailVerification';
import Banned from './pages/Banned';

const AppRoutes = () => {
  const { authenticated, isAdmin, isBanned, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--color-surface)] relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-primary)] rounded-full blur-[120px] opacity-10 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[var(--color-secondary)] rounded-full blur-[100px] opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="relative flex flex-col items-center">
          <div className="relative w-20 h-20 mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-[var(--color-surface-container-high)]"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-[var(--color-primary)] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-2 border-[var(--color-surface-container-highest)]"></div>
            <div className="absolute inset-2 rounded-full border-2 border-b-[var(--color-secondary)] border-t-transparent border-l-transparent border-r-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          
          <h2 className="text-xl font-bold tracking-tight text-[var(--color-on-surface)] animate-pulse">Connecting to Workspace</h2>
          <p className="text-[var(--color-on-surface-variant)] text-sm mt-2 font-medium opacity-60">Synchronizing your kinetic flow...</p>
        </div>
        
        {/* Fallback info for slow connections */}
        <div className="absolute bottom-12 left-0 right-0 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-[5000ms] fill-mode-both">
          <p className="text-xs text-[var(--color-on-surface-variant)] opacity-40 max-w-xs mx-auto">
            Taking longer than expected? Check your connection or the server status.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={authenticated ? <Navigate to="/home" replace /> : <Landing />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/testimonials" element={<Testimonials />} />
      <Route path="/login" element={authenticated ? <Navigate to="/home" replace /> : <Login />} />
      <Route path="/signup" element={authenticated ? <Navigate to="/home" replace /> : <Signup />} />
      <Route path="/forgot-password" element={authenticated ? <Navigate to="/home" replace /> : <ForgotPassword />} />
      <Route path="/email-verification" element={<EmailVerification />} />

      <Route path="/banned" element={<Banned />} />

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/home" element={isBanned ? <Navigate to="/banned" replace /> : <Home />} />
        <Route path="/profile" element={isBanned ? <Navigate to="/banned" replace /> : <Profile />} />
        <Route path="/projects" element={isBanned ? <Navigate to="/banned" replace /> : <Projects />} />
        <Route path="/projects/:id/dashboard" element={isBanned ? <Navigate to="/banned" replace /> : <ProjectDetails />} />
        <Route path="/admin" element={isBanned ? <Navigate to="/banned" replace /> : (isAdmin ? <Admin /> : <Navigate to="/home" replace />)} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <AppRoutes />
        </Layout>
      </Router>

      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(16px)',
            color: 'var(--color-on-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-surface-container-highest)',
            boxShadow: '0 12px 32px -4px rgba(25, 28, 30, 0.12)',
            fontSize: '14px',
            fontWeight: '500',
            padding: '12px 20px',
          },
          success: {
            iconTheme: {
              primary: 'var(--color-primary)',
              secondary: 'white',
            },
          },
          error: {
            style: {
              background: 'rgba(255, 245, 245, 0.9)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
            },
          }
        }}
      />
    </AuthProvider>
  );
}

export default App;
