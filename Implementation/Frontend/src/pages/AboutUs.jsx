import React from 'react';

const AboutUs = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--color-on-surface)] mb-4">
          Empowering Teams to Build the Future
        </h1>
        <p className="text-lg text-[var(--color-on-surface-variant)] max-w-2xl mx-auto leading-relaxed">
          TaskFlow is built for high-performance teams who refuse to settle for average. We provide the clarity and structure you need to plan, track, and ship world-class software.
        </p>
      </div>

      <div className="space-y-16">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-5">
            <h2 className="text-2xl font-bold text-[var(--color-on-surface)]">Built for Agile Velocity</h2>
            <p className="text-[var(--color-on-surface-variant)] leading-relaxed">
              Whether you're running two-week sprints or managing a continuous flow Kanban board, TaskFlow adapts to your team's rhythm. Break down complex epics into actionable tasks, manage dependencies, and monitor your team's progress with real-time analytics and intuitive boards.
            </p>
          </div>
          <div className="flex-1 bg-[var(--color-surface-container-lowest)] p-2 rounded-[var(--radius-2xl)] kinetic-shadow min-h-[250px] flex items-center justify-center overflow-hidden">
            <img 
              src="/images/about/agile_board.png" 
              alt="Agile Board Interface" 
              className="w-full h-full object-cover rounded-[var(--radius-xl)]"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
          <div className="flex-1 space-y-5">
            <h2 className="text-2xl font-bold text-[var(--color-on-surface)]">Seamless Collaboration</h2>
            <p className="text-[var(--color-on-surface-variant)] leading-relaxed">
              Software development is a team sport. TaskFlow keeps everyone in the loop with integrated commenting, detailed activity logs, and instant notifications. From developers to product owners, ensure every voice is heard and every decision is documented right where the work happens.
            </p>
          </div>
          <div className="flex-1 w-full bg-[var(--color-surface-container-lowest)] p-2 rounded-[var(--radius-2xl)] min-h-[250px] flex items-center justify-center relative overflow-hidden kinetic-shadow">
             <img 
              src="/images/about/collaboration.png" 
              alt="Team Collaboration Interface" 
              className="w-full h-full object-cover rounded-[var(--radius-xl)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
