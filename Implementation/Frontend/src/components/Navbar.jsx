import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoutModal from './LogoutModal';

const Navbar = () => {
  const { authenticated, user, isAdmin, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    setIsLogoutModalOpen(false);
    await logout();
  };

  const navLinks = authenticated ? [
    { name: 'Dashboard', path: '/home', icon: <i className="fa-solid fa-house text-[18px]"></i> },
    { name: 'Projects', path: '/projects', icon: <i className="fa-solid fa-border-all text-[18px]"></i> },
    { name: 'Profile', path: '/profile', icon: <i className="fa-regular fa-user text-[18px]"></i> },
    ...(isAdmin ? [{ name: 'Admin', path: '/admin', icon: <i className="fa-solid fa-shield-halved text-[18px]"></i> }] : []),
  ] : [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Contact', path: '/contact' },
  ];

  const activeLinkClass = "text-[var(--color-primary)] font-semibold";
  const baseLinkClass = "flex items-center gap-2 transition-colors hover:text-[var(--color-primary)] px-3 py-2 rounded-lg hover:bg-[var(--color-surface-container-low)]";

  return (
    <>
      <nav className="glass sticky top-0 z-40 w-full px-6 py-4 flex items-center justify-between kinetic-shadow">
        <Link to={authenticated ? "/home" : "/"} className="flex items-center gap-2 text-xl font-bold tracking-tighter text-[var(--color-on-surface)]">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center text-white">
            <i className="fa-solid fa-border-all text-[20px]"></i>
          </div>
          TaskFlow
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-4">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`${baseLinkClass} ${location.pathname === link.path ? activeLinkClass : 'text-[var(--color-on-surface-variant)]'}`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>

          <div className="h-6 w-px bg-[var(--color-surface-container-high)]"></div>

          <div className="flex items-center gap-4">
            {authenticated ? (
              <button 
                onClick={() => setIsLogoutModalOpen(true)}
                className="btn-tertiary text-red-500 hover:bg-red-50 flex items-center gap-2"
              >
                <i className="fa-solid fa-right-from-bracket text-[18px]"></i> Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="btn-tertiary">Log In</Link>
                <Link to="/signup" className="btn-primary">Sign Up</Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-[var(--color-on-surface)]" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <i className="fa-solid fa-xmark text-[24px]"></i> : <i className="fa-solid fa-bars text-[24px]"></i>}
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-16 left-0 w-full bg-[var(--color-surface)] p-6 border-b border-[var(--color-surface-container-high)] md:hidden animate-in slide-in-from-top-4">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className={`${baseLinkClass} ${location.pathname === link.path ? activeLinkClass : 'text-[var(--color-on-surface-variant)]'}`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
              <div className="h-px w-full bg-[var(--color-surface-container-high)] my-2"></div>
              {authenticated ? (
                <button 
                  onClick={() => { setIsOpen(false); setIsLogoutModalOpen(true); }}
                  className="btn-primary bg-red-500 hover:bg-red-600 border-none justify-start gap-2"
                >
                  <i className="fa-solid fa-right-from-bracket text-[18px]"></i> Logout
                </button>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary w-full" onClick={() => setIsOpen(false)}>Log In</Link>
                  <Link to="/signup" className="btn-primary w-full" onClick={() => setIsOpen(false)}>Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)} 
        onConfirm={handleLogout} 
      />
    </>
  );
};

export default Navbar;
