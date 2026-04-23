import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const Profile = () => {
  const { user, updateProfile, isAdmin } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    try {
      await updateProfile(formData);
      setToast({ message: 'Profile updated successfully!', type: 'success' });
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update profile.';
      setToast({ message: msg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <header className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-on-surface)]">My Profile</h1>
        <p className="text-[var(--color-on-surface-variant)] mt-2">Manage your personal information and preferences.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Sidebar Info */}
        <aside className="space-y-6">
          <div className="bg-[var(--color-surface-container-low)] p-8 rounded-[var(--radius-2xl)] text-center flex flex-col items-center">
             <div className="w-24 h-24 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-3xl font-bold mb-4 kinetic-shadow">
               {user?.name.charAt(0)}
             </div>
             <h2 className="text-xl font-bold text-[var(--color-on-surface)]">{user?.name}</h2>
             <p className="text-[var(--color-on-surface-variant)] text-sm mb-4">{user?.email}</p>
             
             {isAdmin && (
               <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-primary)] bg-opacity-10 text-[var(--color-primary)] text-xs font-bold uppercase tracking-wider">
                 <i className="fa-solid fa-shield-halved text-[14px]"></i> Global Admin
               </span>
             )}
          </div>
        </aside>

        {/* Edit Form */}
        <main className="md:col-span-2">
          <div className="bg-[var(--color-surface-container-lowest)] p-8 rounded-[var(--radius-2xl)] kinetic-shadow">
            <h3 className="text-lg font-semibold text-[var(--color-on-surface)] mb-6 flex items-center gap-2">
              <i className="fa-regular fa-user text-[20px] text-[var(--color-primary)]"></i>
              General Information
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-on-surface)]" htmlFor="name">Full Name</label>
                <div className="relative group">
                  <i className="fa-regular fa-user absolute left-3 top-3 text-[var(--color-outline)] group-focus-within:text-[var(--color-primary)] transition-colors text-[18px]"></i>
                  <input
                    id="name"
                    type="text"
                    className="no-line-input pl-10"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-on-surface)]" htmlFor="email">Email Address</label>
                <div className="relative group">
                  <i className="fa-regular fa-envelope absolute left-3 top-3 text-[var(--color-outline)] group-focus-within:text-[var(--color-primary)] transition-colors text-[18px]"></i>
                  <input
                    id="email"
                    type="email"
                    className="no-line-input pl-10"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="btn-primary w-full md:w-auto mt-4 px-8 gap-2"
              >
                {loading ? 'Saving...' : (
                  <>
                    <i className="fa-solid fa-floppy-disk text-[18px]"></i> Save Changes
                  </>
                )}
              </button>
            </form>
          </div>
        </main>

      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Profile;
