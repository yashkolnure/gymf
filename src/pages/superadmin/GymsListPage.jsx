import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSuperAdminStore } from '../../context/superAdminStore';
import { superAdminAPI } from '../../services/superAdminAPI';
import toast from 'react-hot-toast';

const planColors = {
  trial:      'bg-gray-700/60 text-gray-300',
  basic:      'bg-blue-500/20 text-blue-300',
  advanced:   'bg-violet-500/20 text-violet-300',
  enterprise: 'bg-amber-500/20 text-amber-300',
};

const statusColors = {
  active:    'bg-green-500/20 text-green-400',
  expired:   'bg-red-500/20 text-red-400',
  suspended: 'bg-orange-500/20 text-orange-400',
  inactive:  'bg-gray-500/20 text-gray-400',
};

const cycleLabel = { monthly: '1 mo', halfYearly: '6 mo', yearly: '1 yr', trial: 'Trial' };

export default function GymsListPage() {
  const { token } = useSuperAdminStore();
  const navigate = useNavigate();

  const [gyms, setGyms] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (search)       params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (planFilter)   params.plan   = planFilter;

      const res = await superAdminAPI.getGyms(token, params);
      setGyms(res.data);
      setPagination(res.pagination);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, page, search, statusFilter, planFilter]);

  useEffect(() => { load(); }, [load]);

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  const daysLeft = (endDate) => {
    if (!endDate) return null;
    const diff = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Registered Gyms</h1>
          <p className="text-gray-400 text-sm mt-0.5">{pagination.total} total registrations</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6 flex flex-wrap gap-3">
        <div className="flex-1 min-w-48">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search gym name or email…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg pl-9 pr-4 py-2 text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
            />
          </div>
        </div>

        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 transition"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="suspended">Suspended</option>
          <option value="inactive">Inactive</option>
        </select>

        <select
          value={planFilter}
          onChange={e => { setPlanFilter(e.target.value); setPage(1); }}
          className="bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 transition"
        >
          <option value="">All Plans</option>
          <option value="trial">Trial</option>
          <option value="basic">Basic</option>
          <option value="advanced">Advanced</option>
          <option value="enterprise">Enterprise</option>
        </select>

        {(search || statusFilter || planFilter) && (
          <button
            onClick={() => { setSearch(''); setStatusFilter(''); setPlanFilter(''); setPage(1); }}
            className="px-3 py-2 text-sm text-gray-400 hover:text-white bg-gray-800 border border-gray-700 rounded-lg transition"
          >
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-7 h-7 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : gyms.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
            </svg>
            No gyms found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-left">
                  <th className="px-5 py-3 text-gray-400 font-medium">Gym / Owner</th>
                  <th className="px-5 py-3 text-gray-400 font-medium">Plan</th>
                  <th className="px-5 py-3 text-gray-400 font-medium">Billing</th>
                  <th className="px-5 py-3 text-gray-400 font-medium">Status</th>
                  <th className="px-5 py-3 text-gray-400 font-medium">Start Date</th>
                  <th className="px-5 py-3 text-gray-400 font-medium">Expiry</th>
                  <th className="px-5 py-3 text-gray-400 font-medium">Days Left</th>
                  <th className="px-5 py-3 text-gray-400 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {gyms.map(gym => {
                  const dl = daysLeft(gym.subscription?.endDate);
                  return (
                    <tr
                      key={gym._id}
                      className="border-b border-gray-800/60 hover:bg-gray-800/40 transition cursor-pointer group"
                      onClick={() => navigate(`/super-admin/gyms/${gym._id}`)}
                    >
                      <td className="px-5 py-4">
                        <p className="text-white font-medium group-hover:text-violet-300 transition">{gym.gymName}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{gym.email}</p>
                        {gym.owner && (
                          <p className="text-gray-600 text-xs">{gym.owner.name}</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${planColors[gym.subscription?.plan] || ''}`}>
                          {gym.subscription?.plan || '—'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-300 text-xs">
                        {cycleLabel[gym.subscription?.billingCycle] || '—'}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${statusColors[gym.subscription?.status] || ''}`}>
                          {gym.subscription?.status || '—'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-xs whitespace-nowrap">
                        {fmt(gym.subscription?.startDate)}
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-xs whitespace-nowrap">
                        {fmt(gym.subscription?.endDate)}
                      </td>
                      <td className="px-5 py-4">
                        {dl !== null && (
                          <span className={`text-xs font-bold ${dl <= 7 ? 'text-amber-400' : dl <= 30 ? 'text-yellow-400' : 'text-gray-400'}`}>
                            {dl > 0 ? `${dl}d` : <span className="text-red-400">Expired</span>}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-violet-400 text-xs opacity-0 group-hover:opacity-100 transition">Manage →</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-800">
            <p className="text-gray-500 text-sm">
              Page {pagination.page} of {pagination.pages} · {pagination.total} total
            </p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 text-sm text-gray-300 bg-gray-800 border border-gray-700 rounded-lg disabled:opacity-40 hover:bg-gray-700 transition"
              >
                ← Prev
              </button>
              <button
                disabled={page >= pagination.pages}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 text-sm text-gray-300 bg-gray-800 border border-gray-700 rounded-lg disabled:opacity-40 hover:bg-gray-700 transition"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
