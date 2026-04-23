import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[var(--color-surface-container-low)] pt-16 pb-8 px-6 mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-2">
          <h3 className="font-semibold text-lg text-[var(--color-on-surface)] mb-4">TaskFlow<br/><span className="text-sm font-normal text-[var(--color-on-surface-variant)]">The Kinetic Workspace</span></h3>
          <p className="text-[var(--color-on-surface-variant)] text-sm leading-relaxed max-w-sm">
            Experience task management that feels weightless. Designed for modern teams who appreciate clarity, velocity, and focus.
          </p>
        </div>
        <div>
          <h4 className="font-medium text-[var(--color-on-surface)] mb-4">Product</h4>
          <ul className="space-y-3">
            <li><Link to="/" className="text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">Features</Link></li>
            <li><Link to="/" className="text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">Pricing</Link></li>
            <li><Link to="/" className="text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">Changelog</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-[var(--color-on-surface)] mb-4">Company</h4>
          <ul className="space-y-3">
            <li><Link to="/about" className="text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">Contact</Link></li>
            <li><Link to="/" className="text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">Legal</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-[var(--color-on-surface-variant)]">
          &copy; {new Date().getFullYear()} TaskFlow Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
