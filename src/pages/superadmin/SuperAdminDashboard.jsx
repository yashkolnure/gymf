import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSuperAdminStore } from '../../context/superAdminStore';
import { superAdminAPI } from '../../services/superAdminAPI';
import toast from 'react-hot-toast';

const StatCard = ({ label, value, icon, color, sub }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-400 text-sm mb-1">{label}</p>
        <p className={`text-3xl font-bold ${color}`}>{value ?? '—'}</p>
        {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
      </div>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color.replace('text-', 'bg-').replace('-400', '-500/15').replace('-300', '-500/15')}`}>
        {icon}
      </div>
    </div>
  </div>
);

const planColors = {
  trial:      'bg-gray-700 text-gray-200',
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

export default function SuperAdminDashboard() {
  const { token } = useSuperAdminStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentGyms, setRecentGyms] = useState([]);
  const [expiringSoon, setExpiringSoon] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [dashRes, recentRes, expiringRes] = await Promise.all([
        superAdminAPI.getDashboard(token),
        superAdminAPI.getGyms(token, { limit: 5, sortBy: 'createdAt', sortDir: 'desc' }),
        superAdminAPI.getGyms(token, {
          limit: 5,
          sortBy: 'subscription.endDate',
          sortDir: 'asc',
          status: 'active'
        })
      ]);
      setStats(dashRes.data);
      setRecentGyms(recentRes.data);
      setExpiringSoon(expiringRes.data.filter(g => {
        if (!g.subscription?.endDate) return false;
        const diff = new Date(g.subscription.endDate) - new Date();
        return diff > 0 && diff < 8 * 24 * 60 * 60 * 1000;
      }));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Platform Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Overview of all registered gyms and subscriptions</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-60">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            <StatCard label="Total Gyms"    value={stats?.totalGyms}     color="text-white"        icon={<GymIcon />} />
            <StatCard label="Active"        value={stats?.activeGyms}    color="text-green-400"    icon={<CheckIcon />} />
            <StatCard label="Expired"       value={stats?.expiredGyms}   color="text-red-400"      icon={<XIcon />} />
            <StatCard label="Suspended"     value={stats?.suspendedGyms} color="text-orange-400"   icon={<BanIcon />} />
            <StatCard label="On Trial"      value={stats?.trialGyms}     color="text-blue-400"     icon={<ClockIcon />} />
            <StatCard label="Expiring Soon" value={stats?.expiringSoon}  color="text-amber-400"    icon={<WarnIcon />} sub="within 7 days" />
          </div>

          {/* Plan breakdown */}
          {stats?.planBreakdown?.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
              <h2 className="text-white font-semibold mb-4">Plan Distribution</h2>
              <div className="flex flex-wrap gap-4">
                {stats.planBreakdown.map(p => (
                  <div key={p._id} className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${planColors[p._id] || 'bg-gray-700 text-gray-200'}`}>{p._id}</span>
                    <span className="text-white font-bold">{p.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recently Registered */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-semibold">Recently Registered</h2>
                <button
                  onClick={() => navigate('/super-admin/gyms')}
                  className="text-violet-400 hover:text-violet-300 text-xs transition"
                >
                  View all →
                </button>
              </div>
              <div className="space-y-3">
                {recentGyms.length === 0 && <p className="text-gray-500 text-sm">No gyms yet</p>}
                {recentGyms.map(gym => (
                  <div
                    key={gym._id}
                    onClick={() => navigate(`/super-admin/gyms/${gym._id}`)}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-800/60 hover:bg-gray-800 cursor-pointer transition group"
                  >
                    <div>
                      <p className="text-white text-sm font-medium group-hover:text-violet-300 transition">{gym.gymName}</p>
                      <p className="text-gray-500 text-xs">{gym.email} · {fmt(gym.createdAt)}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${planColors[gym.subscription?.plan] || ''}`}>
                      {gym.subscription?.plan}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Expiring Soon */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-semibold">Expiring Within 7 Days</h2>
                <span className="text-xs text-amber-400 font-medium">{expiringSoon.length} gym{expiringSoon.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="space-y-3">
                {expiringSoon.length === 0 && (
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    No subscriptions expiring soon
                  </div>
                )}
                {expiringSoon.map(gym => {
                  const daysLeft = Math.ceil((new Date(gym.subscription.endDate) - new Date()) / (1000 * 60 * 60 * 24));
                  return (
                    <div
                      key={gym._id}
                      onClick={() => navigate(`/super-admin/gyms/${gym._id}`)}
                      className="flex items-center justify-between p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 hover:border-amber-500/40 cursor-pointer transition"
                    >
                      <div>
                        <p className="text-white text-sm font-medium">{gym.gymName}</p>
                        <p className="text-gray-500 text-xs">Expires {fmt(gym.subscription?.endDate)}</p>
                      </div>
                      <span className="text-amber-400 text-xs font-bold">{daysLeft}d left</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Minimal inline icons
const GymIcon  = () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
const CheckIcon = () => <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const XIcon    = () => <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const BanIcon  = () => <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>;
const ClockIcon = () => <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const WarnIcon = () => <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
