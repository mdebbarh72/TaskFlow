import React, { useState } from 'react';
import Toast from '../components/Toast';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setToast({ message: "Thanks for reaching out! We'll get back to you soon.", type: 'success' });
      setFormData({ name: '', email: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto py-12 w-full">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        
        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-[var(--color-on-surface)] mb-4">Get in touch</h1>
            <p className="text-lg text-[var(--color-on-surface-variant)]">
              Have questions about the Kinetic Workspace? Want to see a custom demo? Use the form to drop us a message.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[var(--color-surface-container-lowest)] rounded-[var(--radius-full)] kinetic-shadow flex items-center justify-center">
                <i className="fa-regular fa-envelope text-[var(--color-primary)] text-[20px]"></i>
              </div>
              <div>
                <p className="font-semibold text-[var(--color-on-surface)]">Email</p>
                <p className="text-sm text-[var(--color-on-surface-variant)]">hello@taskflow.dev</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[var(--color-surface-container-lowest)] rounded-[var(--radius-full)] kinetic-shadow flex items-center justify-center">
                <i className="fa-solid fa-location-dot text-[var(--color-primary)] text-[20px]"></i>
              </div>
              <div>
                <p className="font-semibold text-[var(--color-on-surface)]">HQ Location</p>
                <p className="text-sm text-[var(--color-on-surface-variant)]">Kinetic Tower, San Francisco, CA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-[var(--color-surface-container-lowest)] p-8 rounded-[var(--radius-2xl)] kinetic-shadow">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--color-on-surface)]">Name</label>
              <input
                type="text"
                required
                className="no-line-input"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--color-on-surface)]">Email address</label>
              <input
                type="email"
                required
                className="no-line-input"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--color-on-surface)]">Message</label>
              <textarea
                required
                rows={4}
                className="no-line-input resize-none"
                placeholder="How can we help?"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              ></textarea>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Contact;
