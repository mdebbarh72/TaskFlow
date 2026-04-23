import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "Product Lead at Velocity",
      content: "TaskFlow completely changed how we think about our sprint planning. It feels less like using software and more like interacting with a physical board. The 'No-Line' logic reduces so much visual clutter."
    },
    {
      name: "David Chen",
      role: "Engineering Manager",
      content: "The aesthetic isn't just about looking good—it actually impacts cognitive load. We've noticed our engineers spend less time parsing the UI and more time focusing on the actual tickets. Absolutely brilliant."
    },
    {
      name: "Elena Rodriguez",
      role: "Creative Director",
      content: "Finally, a workspace tool designed with editorial authority. The typography choices and tonal depth make this the only tool our design team genuinely enjoys opening every morning."
    }
  ];

  return (
    <div className="py-12 w-full">
      <div className="text-center mb-16 animate-in slide-in-from-bottom-4 fade-in">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--color-on-surface)] mb-4">
          Loved by modern teams
        </h1>
        <p className="text-lg text-[var(--color-on-surface-variant)] max-w-2xl mx-auto">
          Don't just take our word for it. Here's what engineering leads, creative directors, and founders have to say.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t, i) => (
          <div key={i} className="bg-[var(--color-surface-container-lowest)] p-8 rounded-[var(--radius-xl)] kinetic-shadow flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300">
            <p className="text-[var(--color-on-surface-variant)] leading-relaxed mb-8 italic">
              "{t.content}"
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[var(--color-surface-container-high)] flex items-center justify-center font-bold text-[var(--color-primary)]">
                {t.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-[var(--color-on-surface)] text-sm">{t.name}</p>
                <p className="text-xs text-[var(--color-on-surface-variant)]">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
