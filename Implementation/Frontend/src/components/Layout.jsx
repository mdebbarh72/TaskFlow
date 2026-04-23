import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[var(--color-surface)] text-[var(--color-on-surface)]">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
