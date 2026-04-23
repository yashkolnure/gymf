import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportAPI, memberAPI, paymentAPI } from '../../services/api';
import { PageHeader, Card, Select, Table, StatusBadge } from '../../components/ui';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { Download, FileText, Users, IndianRupee, TrendingUp } from 'lucide-react';
import dayjs from 'dayjs';

const COLORS = ['#FF6B35', '#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ec4899'];

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState('revenue');
  const [range, setRange] = useState('month');
  const [reportType, setReportType] = useState('new_members');

  const startDate = range === 'month'
    ? dayjs().startOf('month').format('YYYY-MM-DD')
    : range === 'quarter'
    ? dayjs().subtract(3, 'month').format('YYYY-MM-DD')
    : dayjs().subtract(1, 'year').format('YYYY-MM-DD');
  const endDate = dayjs().format('YYYY-MM-DD');

  const { data: revenueData } = useQuery({
    queryKey: ['report-revenue', range],
    queryFn: () => reportAPI.getRevenue({ startDate, endDate, groupBy: range === 'month' ? 'day' : 'month' })
  });

  const { data: memberReport } = useQuery({
    queryKey: ['report-members', reportType, range],
    queryFn: () => reportAPI.getMembers({ startDate, endDate, type: reportType })
  });

  const { data: memberStats } = useQuery({
    queryKey: ['member-stats-report'],
    queryFn: () => memberAPI.getStats()
  });

  const exportCSV = (data, filename) => {
    if (!data?.length) return;
    const keys = Object.keys(data[0]).filter(k => typeof data[0][k] !== 'object');
    const rows = [keys, ...data.map(r => keys.map(k => r[k] ?? ''))];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  };

  const reports = [
    { id: 'revenue', label: 'Revenue', icon: IndianRupee, color: 'text-emerald-400' },
    { id: 'members', label: 'Members', icon: Users, color: 'text-blue-400' },
    { id: 'attendance', label: 'Attendance', icon: TrendingUp, color: 'text-violet-400' },
  ];

  const memberColumns = [
    { key: 'name', title: 'Name', render: (v, r) => <div><p className="text-sm font-medium text-white">{v}</p><p className="text-xs text-gray-500">{r.memberId}</p></div> },
    { key: 'phone', title: 'Phone', render: v => <span className="text-sm text-gray-300">{v}</span> },
    { key: 'membership', title: 'Plan', render: v => <span className="text-sm text-gray-300">{v?.plan?.name || '—'}</span> },
    { key: 'membership', title: 'Expiry', render: v => <span className="text-xs text-gray-400">{v?.endDate ? dayjs(v.endDate).format('DD MMM YYYY') : '—'}</span> },
    { key: 'membership', title: 'Status', render: v => <StatusBadge status={v?.status || 'pending'} /> },
    { key: 'createdAt', title: 'Joined', render: v => <span className="text-xs text-gray-400">{dayjs(v).format('DD MMM YYYY')}</span> },
  ];

  const stats = memberStats?.data;

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Detailed insights for informed decisions"
        actions={
          <div className="w-44">
            <Select
              value={range}
              onChange={setRange}
              options={[
                { value: 'month', label: 'This Month' },
                { value: 'quarter', label: 'Last 3 Months' },
                { value: 'year', label: 'This Year' },
              ]}
            />
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Members', value: stats?.total || 0, color: 'text-white', icon: '👥' },
          { label: 'Active', value: stats?.active || 0, color: 'text-emerald-400', icon: '✅' },
          { label: 'Expired', value: stats?.expired || 0, color: 'text-red-400', icon: '❌' },
          { label: 'Expiring (7d)', value: stats?.expiringWeek || 0, color: 'text-amber-400', icon: '⚠️' },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">{s.icon}</span>
            </div>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Report Selector */}
      <div className="flex gap-2">
        {reports.map(r => (
          <button
            key={r.id}
            onClick={() => setActiveReport(r.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
              ${activeReport === r.id ? 'bg-primary text-white shadow-md shadow-primary/25' : 'bg-surface-card border border-surface-border text-gray-400 hover:text-white'}`}
          >
            <r.icon size={15} className={activeReport === r.id ? 'text-white' : r.color} />
            {r.label}
          </button>
        ))}
      </div>

      {/* Revenue Report */}
      {activeReport === 'revenue' && (
        <div className="space-y-4">
          <Card title="Daily Revenue" action={
            <button onClick={() => exportCSV(revenueData?.data, 'revenue-report.csv')} className="btn-ghost flex items-center gap-1.5 text-xs">
              <Download size={13} />Export CSV
            </button>
          }>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData?.data || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
                <XAxis dataKey="_id" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip
                  contentStyle={{ background: '#16213e', border: '1px solid #2a2a3e', borderRadius: '10px', color: '#fff' }}
                  formatter={(v) => [`₹${(v || 0).toLocaleString('en-IN')}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#FF6B35" strokeWidth={2.5} fill="url(#revGrad2)" dot={false} activeDot={{ r: 5, fill: '#FF6B35' }} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Revenue by method */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card title="Revenue by Payment Method">
              <div className="space-y-3">
                {[
                  { method: 'Cash', pct: 45, color: '#FF6B35' },
                  { method: 'UPI', pct: 35, color: '#6366f1' },
                  { method: 'Card', pct: 15, color: '#10b981' },
                  { method: 'Other', pct: 5, color: '#6b7280' },
                ].map(m => (
                  <div key={m.method} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">{m.method}</span>
                      <span className="text-white font-medium">{m.pct}%</span>
                    </div>
                    <div className="h-2 bg-surface-card rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${m.pct}%`, background: m.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Collection Summary">
              <div className="space-y-3">
                {[
                  { label: 'Membership Revenue', icon: '💳', color: 'text-emerald-400' },
                  { label: 'Personal Training', icon: '🏋️', color: 'text-blue-400' },
                  { label: 'Supplements', icon: '💊', color: 'text-amber-400' },
                  { label: 'Merchandise', icon: '👕', color: 'text-violet-400' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-surface-card/50 border border-surface-border">
                    <div className="flex items-center gap-2">
                      <span>{item.icon}</span>
                      <span className="text-sm text-gray-300">{item.label}</span>
                    </div>
                    <span className={`text-sm font-bold ${item.color}`}>₹—</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Members Report */}
      {activeReport === 'members' && (
        <div className="space-y-4">
          <Card noPadding action={
            <div className="flex items-center gap-2 p-4">
              <div className="w-44">
                <Select value={reportType} onChange={setReportType} options={[
                  { value: 'new_members', label: 'New Members' },
                  { value: 'expiring', label: 'Expiring' },
                  { value: 'summary', label: 'Summary' },
                ]} />
              </div>
              <button onClick={() => exportCSV(memberReport?.data, `members-${reportType}.csv`)} className="btn-secondary flex items-center gap-1.5 text-sm">
                <Download size={14} />Export
              </button>
            </div>
          }>
            <div className="px-4 pb-2 text-sm text-gray-400">
              {Array.isArray(memberReport?.data) ? `${memberReport.data.length} records` : ''}
            </div>
            {Array.isArray(memberReport?.data) ? (
              <Table
                columns={memberColumns}
                data={memberReport.data}
                emptyMessage="No members match this report criteria"
              />
            ) : memberReport?.data ? (
              <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(memberReport.data).map(([k, v]) => (
                  <div key={k} className="card p-4 text-center">
                    <p className="text-2xl font-bold text-white">{typeof v === 'number' ? v.toLocaleString('en-IN') : v}</p>
                    <p className="text-xs text-gray-400 mt-0.5 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </Card>
        </div>
      )}

      {/* Attendance Report */}
      {activeReport === 'attendance' && (
        <Card title="Attendance Analysis">
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Peak Day', value: 'Monday', icon: '📅' },
              { label: 'Peak Hour', value: '6–8 AM', icon: '⏰' },
              { label: 'Avg Daily', value: '—', icon: '📊' },
            ].map(s => (
              <div key={s.label} className="card p-4 text-center bg-surface-card/50">
                <span className="text-2xl">{s.icon}</span>
                <p className="text-lg font-bold text-white mt-2">{s.value}</p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="text-center py-8 text-gray-500">
            <TrendingUp size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Detailed attendance analytics coming soon</p>
            <p className="text-xs mt-1">View daily logs in the Attendance section</p>
          </div>
        </Card>
      )}
    </div>
  );
}
