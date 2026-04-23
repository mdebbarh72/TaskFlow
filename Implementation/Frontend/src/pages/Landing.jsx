import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const features = [
    {
      icon: <i className="fa-solid fa-border-all text-[24px] text-[var(--color-primary)]"></i>,
      title: "Living Canvases",
      description: "Move beyond rigid tables. Organize your projects with fluid boards that adapt to your workflow naturally."
    },
    {
      icon: <i className="fa-solid fa-bolt text-[24px] text-[var(--color-primary)]"></i>,
      title: "Real-Time Velocity",
      description: "With sub-millisecond sync, your team's changes appear instantly. Collaborate without breaking focus."
    },
    {
      icon: <i className="fa-solid fa-layer-group text-[24px] text-[var(--color-primary)]"></i>,
      title: "Tonal Depth",
      description: "Designed strictly with intentional asymmetry and depth to reduce cognitive load and enhance clarity."
    }
  ];

  return (
    <div className="flex flex-col gap-24">
      
      {/* Hero Section */}
      <section className="mt-12 text-center max-w-3xl mx-auto flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--radius-full)] bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] text-xs font-semibold mb-2">
          <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse"></span>
          TaskFlow 2.0 is live
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-[var(--color-on-surface)] leading-tight">
          The Kinetic <br /> Workspace.
        </h1>
        <p className="text-lg md:text-xl text-[var(--color-on-surface-variant)] max-w-2xl leading-relaxed">
          Reject the spreadsheet. Task management that feels effortless, weightless, and built for modern teams who demand precision and aesthetic excellence.
        </p>
        <div className="flex items-center gap-4 mt-4">
          <Link to="/signup" className="btn-primary text-lg px-6 py-3">
            Start for free <i className="fa-solid fa-arrow-right text-[20px]"></i>
          </Link>
          <a href="#features" className="btn-secondary text-lg px-6 py-3">
            See how it works
          </a>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="scroll-mt-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((item, idx) => (
            <div key={idx} className="bg-[var(--color-surface-container-lowest)] p-8 rounded-[var(--radius-xl)] kinetic-shadow hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-[var(--color-surface-container-low)] flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-on-surface)] mb-3">{item.title}</h3>
              <p className="text-[var(--color-on-surface-variant)] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-[var(--color-surface-container-low)] rounded-[var(--radius-2xl)] p-12 md:p-20 text-center flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--color-on-surface)] mb-6">
          A new paradigm for productivity.
        </h2>
        <p className="text-lg text-[var(--color-on-surface-variant)] max-w-2xl mb-10">
          We believe that the tools you use dictate the quality of your work. The Kinetic Workspace establishes a soft, layered environment that gets out of your way and lets your team's creativity take center stage.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center text-sm font-medium text-[var(--color-on-surface)]">
          <span className="flex items-center gap-2"><i className="fa-regular fa-circle-check text-[18px] text-[var(--color-primary)]"></i> No rigid boundaries</span>
          <span className="flex items-center gap-2"><i className="fa-regular fa-circle-check text-[18px] text-[var(--color-primary)]"></i> 100% borderless layouts</span>
          <span className="flex items-center gap-2"><i className="fa-regular fa-circle-check text-[18px] text-[var(--color-primary)]"></i> Physical interaction</span>
        </div>
      </section>

    </div>
  );
};

export default Landing;
