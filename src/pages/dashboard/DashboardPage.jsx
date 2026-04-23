import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '../../services/api';
import { useAuthStore } from '../../context/authStore';
import { StatCard, Card } from '../../components/ui';
import {
  Users, CreditCard, ClipboardCheck, TrendingUp, UserX, Calendar,
  AlertTriangle, Target, IndianRupee, Activity, Zap, ArrowUpRight
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import dayjs from 'dayjs';

const COLORS = ['#FF6B35', '#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ec4899'];

const CustomTooltip = ({ active, payload, label, prefix = '' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-card border border-surface-border rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="text-sm font-bold">
          {prefix}{typeof p.value === 'number' ? p.value.toLocaleString('en-IN') : p.value}
        </p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const { user, tenant } = useAuthStore();

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: () => dashboardAPI.getSummary(),
    refetchInterval: 120000
  });

  const { data: revenueTrend } = useQuery({
    queryKey: ['revenue-trend'],
    queryFn: () => dashboardAPI.getRevenueTrend(6)
  });

  const { data: attendanceTrend } = useQuery({
    queryKey: ['attendance-trend'],
    queryFn: () => dashboardAPI.getAttendanceTrend(14)
  });

  const { data: planDist } = useQuery({
    queryKey: ['plan-distribution'],
    queryFn: () => dashboardAPI.getPlanDistribution()
  });

  const { data: leadFunnel } = useQuery({
    queryKey: ['lead-funnel'],
    queryFn: () => dashboardAPI.getLeadFunnel()
  });

  const { data: topMembers } = useQuery({
    queryKey: ['top-members'],
    queryFn: () => dashboardAPI.getTopMembers()
  });

  const s = summary?.data;
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">
            {greeting()}, <span className="text-gradient">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {tenant?.gymName} • {dayjs().format('dddd, DD MMMM YYYY')}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2">
          <Activity size={14} className="text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-400">{s?.attendance?.today || 0} present today</span>
        </div>
      </div>

      {/* Alert Banners */}
      {!summaryLoading && ((s?.members?.expiringThisWeek || 0) > 0 || (s?.members?.inactive7days || 0) > 0) && (
        <div className="flex flex-wrap gap-3">
          {s?.members?.expiringThisWeek > 0 && (
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2.5 text-sm">
              <AlertTriangle size={15} className="text-amber-400 flex-shrink-0" />
              <span className="text-amber-300"><strong>{s.members.expiringThisWeek}</strong> memberships expiring this week</span>
              <a href="/members?expiringIn=7" className="text-amber-400 hover:underline ml-1 flex items-center gap-0.5 text-xs">View <ArrowUpRight size={10} /></a>
            </div>
          )}
          {s?.members?.inactive7days > 0 && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5 text-sm">
              <UserX size={15} className="text-red-400 flex-shrink-0" />
              <span className="text-red-300"><strong>{s.members.inactive7days}</strong> members inactive for 7+ days</span>
            </div>
          )}
          {s?.leads?.pendingFollowUps > 0 && (
            <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-2.5 text-sm">
              <Target size={15} className="text-blue-400 flex-shrink-0" />
              <span className="text-blue-300"><strong>{s.leads.pendingFollowUps}</strong> lead follow-ups due today</span>
            </div>
          )}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <StatCard title="Total Members" value={s?.members?.total || 0} icon={Users} color="emerald"
          trend={s?.members?.growth} trendLabel={`${s?.members?.newThisMonth || 0} new this month`} loading={summaryLoading} />
        <StatCard title="Active Members" value={s?.members?.active || 0} icon={Zap} color="primary"
          subtitle={`${s?.members?.expired || 0} expired`} loading={summaryLoading} />
        <StatCard title="Today's Revenue" value={`₹${(s?.revenue?.today || 0).toLocaleString('en-IN')}`} icon={IndianRupee} color="blue"
          subtitle={`₹${(s?.revenue?.thisMonth || 0).toLocaleString('en-IN')} this month`} loading={summaryLoading} />
        <StatCard title="Today's Attendance" value={s?.attendance?.today || 0} icon={ClipboardCheck} color="violet"
          subtitle={`${s?.attendance?.thisMonth || 0} this month`} loading={summaryLoading} />
        <StatCard title="Active Leads" value={s?.leads?.active || 0} icon={TrendingUp} color="amber"
          subtitle={`${s?.leads?.newToday || 0} new today`} loading={summaryLoading} />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={16} className="text-red-400" />
          </div>
          <div>
            <p className="text-xl font-bold text-white">{s?.members?.expiringThisWeek || 0}</p>
            <p className="text-xs text-gray-400">Expiring this week</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
            <UserX size={16} className="text-orange-400" />
          </div>
          <div>
            <p className="text-xl font-bold text-white">{s?.members?.inactive7days || 0}</p>
            <p className="text-xs text-gray-400">Inactive (7+ days)</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <IndianRupee size={16} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-xl font-bold text-white">₹{((s?.revenue?.pending || 0) / 1000).toFixed(0)}K</p>
            <p className="text-xs text-gray-400">Pending dues</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
            <Calendar size={16} className="text-cyan-400" />
          </div>
          <div>
            <p className="text-xl font-bold text-white">{s?.staff?.presentToday || 0}/{s?.staff?.total || 0}</p>
            <p className="text-xs text-gray-400">Staff present</p>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Revenue Trend */}
        <div className="lg:col-span-2">
          <Card title="Revenue Trend" action={<span className="text-xs text-gray-500">Last 6 months</span>} noPadding>
            <div className="px-4 pb-2">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={revenueTrend?.data || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
                  <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                  <Tooltip content={<CustomTooltip prefix="₹" />} />
                  <Area type="monotone" dataKey="revenue" stroke="#FF6B35" strokeWidth={2.5} fill="url(#revGrad)" dot={{ fill: '#FF6B35', r: 3 }} activeDot={{ r: 5, fill: '#FF6B35' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Plan Distribution */}
        <Card title="Plan Distribution" noPadding>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={planDist?.data || []} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="count">
                  {(planDist?.data || []).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ background: '#16213e', border: '1px solid #2a2a3e', borderRadius: '10px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {(planDist?.data || []).slice(0, 4).map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-gray-400 truncate max-w-[100px]">{item.name}</span>
                  </div>
                  <span className="text-white font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Attendance Trend */}
        <div className="lg:col-span-2">
          <Card title="Daily Attendance" action={<span className="text-xs text-gray-500">Last 14 days</span>} noPadding>
            <div className="px-4 pb-2">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={attendanceTrend?.data || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
                  <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Lead Funnel */}
        <Card title="Lead Funnel" noPadding>
          <div className="p-4 space-y-2">
            {(leadFunnel?.data || []).slice(0, 6).map((item, i) => {
              const maxCount = Math.max(...(leadFunnel?.data || []).map(d => d.count), 1);
              const pct = (item.count / maxCount) * 100;
              return (
                <div key={item.stage} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 capitalize">{item.label}</span>
                    <span className="text-white font-semibold">{item.count}</span>
                  </div>
                  <div className="h-1.5 bg-surface-card rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: COLORS[i % COLORS.length] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Top Members */}
      {topMembers?.data?.length > 0 && (
        <Card title="🏆 Top Members This Month" action={<span className="text-xs text-gray-500">Most visits</span>}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {topMembers.data.slice(0, 5).map((m, i) => (
              <div key={m._id} className="flex flex-col items-center p-3 rounded-xl bg-surface-card/50 border border-surface-border hover:border-primary/30 transition-colors text-center">
                <div className="relative mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                    {m.name?.[0]?.toUpperCase()}
                  </div>
                  {i < 3 && <div className="absolute -top-1 -right-1 text-xs">{['🥇', '🥈', '🥉'][i]}</div>}
                </div>
                <p className="text-xs font-semibold text-white truncate w-full">{m.name}</p>
                <p className="text-xs text-primary font-bold mt-0.5">{m.visits} visits</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
