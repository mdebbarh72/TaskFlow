import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import Toast from '../components/Toast';

const Admin = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); 

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      setToast({ message: 'Failed to load statistics.', type: 'error' });
    }
  };

  const fetchUsers = useCallback(async () => {
    try {
      const res = await api.get('/admin/users', {
        params: { search: search || undefined, page },
      });
      setUsers(res.data.data);
      setPagination({
        current_page: res.data.current_page,
        last_page: res.data.last_page,
        total: res.data.total,
      });
    } catch (err) {
      setToast({ message: 'Failed to load users.', type: 'error' });
    }
  }, [search, page]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchUsers()]);
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleBanToggle = async (targetUser) => {
    const action = targetUser.is_banned ? 'unban' : 'ban';
    setActionLoading(targetUser.id);

    try {
      await api.patch(`/admin/users/${targetUser.id}/${action}`);
      setToast({
        message: `${targetUser.name} has been ${action === 'ban' ? 'banned' : 'unbanned'}.`,
        type: 'success',
      });
      await Promise.all([fetchStats(), fetchUsers()]);
    } catch (err) {
      const msg = err.response?.data?.message || `Failed to ${action} user.`;
      setToast({ message: msg, type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-8 animate-pulse">
        <div className="h-10 w-48 bg-[var(--color-surface-container-low)] rounded-[var(--radius-lg)]"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-[var(--color-surface-container-lowest)] rounded-[var(--radius-xl)]"></div>
          ))}
        </div>
        <div className="h-96 bg-[var(--color-surface-container-lowest)] rounded-[var(--radius-xl)]"></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Users',    value: stats?.total_users ?? 0,    icon: <i className="fa-solid fa-users text-[22px]"></i>,        color: 'text-[var(--color-primary)]',  bg: 'bg-blue-50' },
    { label: 'Active Users',   value: stats?.active_users ?? 0,   icon: <i className="fa-solid fa-user-check text-[22px]"></i>,     color: 'text-emerald-600',             bg: 'bg-emerald-50' },
    { label: 'Banned Users',   value: stats?.banned_users ?? 0,   icon: <i className="fa-solid fa-user-xmark text-[22px]"></i>,         color: 'text-red-500',                 bg: 'bg-red-50' },
    { label: 'Total Projects', value: stats?.total_projects ?? 0, icon: <i className="fa-regular fa-folder-open text-[22px]"></i>,  color: 'text-amber-600',               bg: 'bg-amber-50' },
  ];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-on-surface)] flex items-center gap-3">
          <i className="fa-solid fa-shield-halved text-[28px] text-[var(--color-primary)]"></i>
          Admin Panel
        </h1>
        <p className="text-[var(--color-on-surface-variant)] mt-2">Manage users and monitor platform statistics.</p>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.label} className="bg-[var(--color-surface-container-lowest)] p-6 rounded-[var(--radius-xl)] kinetic-shadow flex items-center gap-4">
            <div className={`w-12 h-12 rounded-[var(--radius-lg)] ${card.bg} ${card.color} flex items-center justify-center`}>
              {card.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--color-on-surface)]">{card.value}</p>
              <p className="text-sm text-[var(--color-on-surface-variant)]">{card.label}</p>
            </div>
          </div>
        ))}
      </section>

      {/* User Management */}
      <section className="bg-[var(--color-surface-container-lowest)] rounded-[var(--radius-2xl)] kinetic-shadow overflow-hidden">
        
        {/* Search Bar */}
        <div className="p-6 border-b border-[var(--color-surface-container)]">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1 group">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-3 text-[var(--color-outline)] group-focus-within:text-[var(--color-primary)] transition-colors text-[18px]"></i>
              <input
                type="text"
                className="no-line-input pl-10"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary px-6 gap-2">
              <i className="fa-solid fa-magnifying-glass text-[18px]"></i> Search
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--color-surface-container)]">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface-variant)]">User</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface-variant)]">Email</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface-variant)]">Role</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface-variant)]">Status</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface-variant)]">Joined</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface-variant)] text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[var(--color-on-surface-variant)]">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="border-b border-[var(--color-surface-container)] hover:bg-[var(--color-surface-container-low)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-bold">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-[var(--color-on-surface)]">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--color-on-surface-variant)]">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        u.role === 'admin' 
                          ? 'bg-blue-50 text-[var(--color-primary)]' 
                          : 'bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)]'
                      }`}>
                        {u.role === 'admin' && <i className="fa-solid fa-shield-halved text-[12px]"></i>}
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {u.is_banned ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-600">
                          <i className="fa-solid fa-ban text-[12px]"></i> Banned
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">
                          <i className="fa-regular fa-circle-check text-[12px]"></i> Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--color-on-surface-variant)]">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u.role !== 'admin' && u.id !== user?.id && (
                        <button
                          onClick={() => handleBanToggle(u)}
                          disabled={actionLoading === u.id}
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-[var(--radius-lg)] transition-colors ${
                            u.is_banned
                              ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                              : 'bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                        >
                          {actionLoading === u.id ? 'Loading...' : (
                            u.is_banned 
                              ? <><i className="fa-solid fa-user-check text-[14px]"></i> Unban</> 
                              : <><i className="fa-solid fa-user-xmark text-[14px]"></i> Ban</>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--color-surface-container)]">
            <p className="text-sm text-[var(--color-on-surface-variant)]">
              Page {pagination.current_page} of {pagination.last_page} — {pagination.total} users total
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="btn-secondary px-3 py-1.5 text-sm disabled:opacity-40 gap-1"
              >
                <i className="fa-solid fa-chevron-left text-[14px]"></i> Prev
              </button>
              <button
                onClick={() => setPage(p => Math.min(pagination.last_page, p + 1))}
                disabled={page >= pagination.last_page}
                className="btn-secondary px-3 py-1.5 text-sm disabled:opacity-40 gap-1"
              >
                Next <i className="fa-solid fa-chevron-right text-[14px]"></i>
              </button>
            </div>
          </div>
        )}
      </section>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Admin;
