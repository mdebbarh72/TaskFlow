import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const location = useLocation();
  const isWorkspace = location.pathname.startsWith('/projects/') && location.pathname.includes('/dashboard');
  const isBannedScreen = location.pathname === '/banned';

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[var(--color-surface)] text-[var(--color-on-surface)]">
      {!isBannedScreen && <Navbar />}
      <main className={`flex-1 w-full flex flex-col ${isWorkspace ? 'p-0' : 'max-w-7xl mx-auto px-6 py-12'}`}>
        {children}
      </main>
      {!isWorkspace && !isBannedScreen && <Footer />}
    </div>
  );
};

export default Layout;
