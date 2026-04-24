import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile, isAdmin } = useAuth();
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    username: user?.profile?.username || '',
    email: user?.email || '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      username: user?.profile?.username || '',
      email: user?.email || '',
    });
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);


    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update profile.';
      toast.error(msg);
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
               {user?.first_name?.charAt(0) || user?.name?.charAt(0)}
             </div>
             <h2 className="text-xl font-bold text-[var(--color-on-surface)]">{user?.name}</h2>
             <p className="text-[var(--color-on-surface-variant)] text-sm mb-4">{user?.email}</p>
             
             {isAdmin && (
               <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[var(--color-primary)] text-xs font-bold uppercase tracking-wider">
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-on-surface)]" htmlFor="first_name">First Name</label>
                <div className="relative group">
                  <i className="fa-regular fa-user absolute left-3 top-3 text-[var(--color-outline)] group-focus-within:text-[var(--color-primary)] transition-colors text-[18px]"></i>
                  <input
                    id="first_name"
                    type="text"
                    className="no-line-input pl-10"
                    placeholder="First name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-on-surface)]" htmlFor="last_name">Last Name</label>
                <div className="relative group">
                  <i className="fa-regular fa-user absolute left-3 top-3 text-[var(--color-outline)] group-focus-within:text-[var(--color-primary)] transition-colors text-[18px]"></i>
                  <input
                    id="last_name"
                    type="text"
                    className="no-line-input pl-10"
                    placeholder="Last name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    required
                  />
                </div>
              </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-on-surface)]" htmlFor="username">Username</label>
                <div className="relative group">
                  <i className="fa-regular fa-id-badge absolute left-3 top-3 text-[var(--color-outline)] group-focus-within:text-[var(--color-primary)] transition-colors text-[18px]"></i>
                  <input
                    id="username"
                    type="text"
                    className="no-line-input pl-10"
                    placeholder="username"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
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
    </div>
  );
};

export default Profile;
