import React from 'react';

const AboutUs = () => {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--color-on-surface)] mb-4">
          Our Philosophy
        </h1>
        <p className="text-lg text-[var(--color-on-surface-variant)] max-w-2xl mx-auto">
          We set out to build a platform that doesn't just manage tasks, but rather elevates the way teams interact with their work.
        </p>
      </div>

      <div className="space-y-16">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-5">
            <h2 className="text-2xl font-semibold text-[var(--color-on-surface)]">The "No-Line" Rule</h2>
            <p className="text-[var(--color-on-surface-variant)] leading-relaxed">
              We fundamentally reject the "spreadsheet-as-software" aesthetic. In our workspace, every element breathes. By entirely eliminating 1px solid borders for sectioning, we rely on subtle tonal shifts between `surface` and `surface-container-low` to define boundaries cleanly and organically. You feel the architecture without seeing the walls.
            </p>
          </div>
          <div className="flex-1 bg-[var(--color-surface-container-lowest)] p-8 rounded-[var(--radius-2xl)] kinetic-shadow min-h-[250px] flex items-center justify-center">
            {/* Visual Representation */}
            <div className="w-full flex gap-4">
              <div className="w-1/3 bg-[var(--color-surface-container-low)] h-32 rounded-[var(--radius-lg)]"></div>
              <div className="w-2/3 bg-[var(--color-surface-bright)] h-32 rounded-[var(--radius-lg)] shadow-sm"></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
          <div className="flex-1 space-y-5">
            <h2 className="text-2xl font-semibold text-[var(--color-on-surface)]">Glass & Gradient</h2>
            <p className="text-[var(--color-on-surface-variant)] leading-relaxed">
              For primary actions and floating contexts, we deploy "Glassmorphism" combined with signature "Action Blue" gradients. It gives our most critical interactions a sort of "soul" that flat HEX colors simply cannot replicate. 
            </p>
          </div>
          <div className="flex-1 w-full bg-gradient-to-br from-[#dfe1f2] to-[#f2f4f6] p-8 rounded-[var(--radius-2xl)] min-h-[250px] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
            <div className="relative glass p-6 rounded-[var(--radius-xl)] w-3/4 text-center kinetic-shadow">
              <button className="btn-primary w-full">Floating Action</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
