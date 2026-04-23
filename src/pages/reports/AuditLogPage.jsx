import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportAPI, staffAPI } from '../../services/api';
import { PageHeader, Card, SearchBar, Select, Avatar, Pagination } from '../../components/ui';
import {
  Shield, User, Users, CreditCard, ClipboardCheck, TrendingUp,
  Settings, Package, Activity, Clock, Download, BarChart2
} from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
dayjs.extend(relativeTime);

const ACTION_ICONS = {
  member_created: { icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  member_updated: { icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  member_deleted: { icon: Users, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  member_status_changed: { icon: Users, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  payment_created: { icon: CreditCard, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  payment_refunded: { icon: CreditCard, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  staff_created: { icon: User, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
  staff_updated: { icon: User, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  staff_deleted: { icon: User, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  plan_created: { icon: Package, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
  plan_updated: { icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  plan_deleted: { icon: Package, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  lead_created: { icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  lead_updated: { icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  lead_converted: { icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  branch_created: { icon: Settings, color: 'text-primary', bg: 'bg-primary/10 border-primary/20' },
  settings_updated: { icon: Settings, color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/20' },
  login: { icon: Shield, color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/20' },
  checkin: { icon: ClipboardCheck, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
};

const getActionIcon = (action) => ACTION_ICONS[action] || { icon: Activity, color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/20' };

const ACTION_LABELS = {
  member_created: 'Member Created', member_updated: 'Member Updated',
  member_deleted: 'Member Deleted', member_status_changed: 'Member Status Changed',
  payment_created: 'Payment Recorded', payment_refunded: 'Payment Refunded',
  staff_created: 'Staff Added', staff_updated: 'Staff Updated', staff_deleted: 'Staff Removed',
  plan_created: 'Plan Created', plan_updated: 'Plan Updated', plan_deleted: 'Plan Deleted',
  lead_created: 'Lead Added', lead_updated: 'Lead Updated', lead_converted: 'Lead Converted',
  branch_created: 'Branch Created', settings_updated: 'Settings Updated',
  checkin: 'Attendance Check-in', login: 'User Login',
};

export default function AuditLogPage() {
  const [view, setView] = useState('list');
  const [filters, setFilters] = useState({ search: '', action: '', page: 1, limit: 30 });
  const upF = (k, v) => setFilters(f => ({ ...f, [k]: v, page: 1 }));

  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs', filters],
    queryFn: () => reportAPI.getAuditLogs(filters),
  });

  const { data: summaryData } = useQuery({
    queryKey: ['audit-summary'],
    queryFn: () => reportAPI.getAuditSummary(),
  });

  const { data: staffData } = useQuery({
    queryKey: ['staff'],
    queryFn: () => staffAPI.getAll(),
  });

  const logs = data?.data || [];
  const pagination = data?.pagination;
  const actionTypes = data?.actionTypes || [];
  const summary = summaryData?.data;

  const exportCSV = () => {
    if (!logs.length) return;
    const rows = [
      ['Timestamp', 'Action', 'Performed By', 'Role', 'Description', 'IP Address'],
      ...logs.map(l => [
        dayjs(l.createdAt).format('DD/MM/YYYY HH:mm:ss'),
        l.action,
        l.performedBy?.name || '—',
        l.performedBy?.role || '—',
        l.description || '—',
        l.performedBy?.ip || '—'
      ])
    ];
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url; a.download = `audit-log-${dayjs().format('YYYY-MM-DD')}.csv`; a.click();
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Audit Logs"
        subtitle="Complete record of all actions performed in your gym"
        actions={
          <div className="flex gap-2">
            <div className="flex bg-surface-card border border-surface-border rounded-xl p-1">
              {['list', 'analytics'].map(v => (
                <button key={v} onClick={() => setView(v)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors capitalize ${view === v ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}>
                  {v}
                </button>
              ))}
            </div>
            <button onClick={exportCSV} className="btn-secondary flex items-center gap-2 text-sm">
              <Download size={14} />Export CSV
            </button>
          </div>
        }
      />

      {/* Analytics view */}
      {view === 'analytics' && (
        <div className="space-y-4">
          {/* Top actions */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card title="Actions (Last 30 Days)">
              <div className="space-y-2">
                {(summary?.byAction || []).map((item, i) => (
                  <div key={item._id} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border flex-shrink-0 ${getActionIcon(item._id).bg}`}>
                      {(() => { const { icon: Icon, color } = getActionIcon(item._id); return <Icon size={14} className={color} />; })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-xs text-gray-300 truncate">{ACTION_LABELS[item._id] || item._id}</p>
                        <span className="text-xs font-bold text-white ml-2">{item.count}</span>
                      </div>
                      <div className="h-1.5 bg-surface-card rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${(item.count / (summary.byAction[0]?.count || 1)) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Most Active Staff (Last 30 Days)">
              <div className="space-y-3">
                {(summary?.byUser || []).map((item, i) => (
                  <div key={String(item._id)} className="flex items-center gap-3">
                    <Avatar name={item.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500 capitalize">{item.role?.replace(/_/g, ' ')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">{item.count}</p>
                      <p className="text-xs text-gray-500">actions</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Daily activity chart */}
          <Card title="Daily Activity (Last 30 Days)">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={summary?.dailyActivity || []} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
                <XAxis dataKey="_id" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false}
                  tickFormatter={v => dayjs(v).format('DD')} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#16213e', border: '1px solid #2a2a3e', borderRadius: '10px', color: '#fff' }}
                  formatter={(v) => [v, 'Actions']}
                  labelFormatter={l => dayjs(l).format('DD MMM')}
                />
                <Bar dataKey="count" fill="#FF6B35" radius={[3,3,0,0]} maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* List view */}
      {view === 'list' && (
        <Card noPadding>
          {/* Filters */}
          <div className="p-4 border-b border-surface-border flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-48">
              <SearchBar value={filters.search} onChange={v => upF('search', v)} placeholder="Search by name, description..." />
            </div>
            <div className="w-52">
              <Select
                value={filters.action}
                onChange={v => upF('action', v)}
                placeholder="All Actions"
                options={actionTypes.map(a => ({ value: a, label: ACTION_LABELS[a] || a }))}
              />
            </div>
            <div className="w-52">
              <Select
                value={filters.userId}
                onChange={v => upF('userId', v)}
                placeholder="All Staff"
                options={(staffData?.data || []).map(s => ({ value: s._id, label: s.name }))}
              />
            </div>
            {(filters.search || filters.action || filters.userId) && (
              <button
                onClick={() => setFilters({ search: '', action: '', userId: '', page: 1, limit: 30 })}
                className="btn-ghost text-xs text-red-400"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Log entries */}
          {isLoading ? (
            <div className="p-6 space-y-3">{[1,2,3,4,5,6].map(i => <div key={i} className="shimmer-line h-16 w-full" />)}</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Shield size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium text-white mb-1">No audit logs found</p>
              <p className="text-sm">Logs appear as staff perform actions in the system</p>
            </div>
          ) : (
            <div className="divide-y divide-surface-border/50">
              {logs.map(log => {
                const { icon: Icon, color, bg } = getActionIcon(log.action);
                return (
                  <div key={log._id} className="flex items-start gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors">
                    {/* Action icon */}
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 mt-0.5 ${bg}`}>
                      <Icon size={15} className={color} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-white">
                            {log.description || ACTION_LABELS[log.action] || log.action}
                          </p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            {log.performedBy?.name && (
                              <div className="flex items-center gap-1.5">
                                <Avatar name={log.performedBy.name} size="sm" />
                                <span className="text-xs text-gray-400">{log.performedBy.name}</span>
                                <span className="text-xs text-gray-600 capitalize">({log.performedBy.role?.replace(/_/g, ' ')})</span>
                              </div>
                            )}
                            {log.performedBy?.ip && (
                              <span className="text-xs text-gray-600 font-mono">· {log.performedBy.ip}</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                            <Clock size={11} />
                            {dayjs(log.createdAt).format('DD MMM, hh:mm A')}
                          </p>
                          <p className="text-xs text-gray-600 mt-0.5">{dayjs(log.createdAt).fromNow()}</p>
                        </div>
                      </div>

                      {/* Entity reference */}
                      {log.entity?.identifier && (
                        <div className="mt-2 flex items-center gap-1.5">
                          <span className="text-xs text-gray-600">Entity:</span>
                          <span className="text-xs font-medium text-gray-300 bg-surface-card px-2 py-0.5 rounded-md border border-surface-border">
                            {log.entity.identifier}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <Pagination pagination={pagination} onChange={(p) => setFilters(f => ({ ...f, page: p }))} />
        </Card>
      )}
    </div>
  );
}
