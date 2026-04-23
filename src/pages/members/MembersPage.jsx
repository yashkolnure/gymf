import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { memberAPI, planAPI } from '../../services/api';
import { PageHeader, Table, Pagination, StatusBadge, SearchBar, Avatar, Select, Card, Tabs, EmptyState } from '../../components/ui';
import { Plus, Users, Download, Filter, RefreshCw, UserCheck, AlertTriangle } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export default function MembersPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [plan, setPlan] = useState('');
  const [tab, setTab] = useState('all');
  const [page, setPage] = useState(1);

  const params = {
    page, limit: 25, search,
    status: tab === 'expiring' ? 'active' : (status || undefined),
    expiringIn: tab === 'expiring' ? 7 : undefined,
    inactiveDays: tab === 'inactive' ? 7 : undefined,
    plan: plan || undefined
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['members', params],
    queryFn: () => memberAPI.getAll(params),
    keepPreviousData: true
  });

  const { data: statsData } = useQuery({ queryKey: ['member-stats'], queryFn: () => memberAPI.getStats() });
  const { data: plansData } = useQuery({ queryKey: ['plans'], queryFn: () => planAPI.getAll() });

  const stats = statsData?.data;
  const members = data?.data || [];
  const pagination = data?.pagination;

  const exportCSV = () => {
    const rows = [['Name', 'Phone', 'Member ID', 'Plan', 'Status', 'Expiry', 'Join Date']];
    members.forEach(m => {
      rows.push([m.name, m.phone, m.memberId, m.membership?.plan?.name || '-', m.membership?.status || '-',
        m.membership?.endDate ? dayjs(m.membership.endDate).format('DD/MM/YYYY') : '-',
        dayjs(m.createdAt).format('DD/MM/YYYY')]);
    });
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a'); a.href = url; a.download = 'members.csv'; a.click();
  };

  const columns = [
    {
      key: 'name', title: 'Member',
      render: (v, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} photo={row.photo} />
          <div>
            <p className="text-sm font-semibold text-white">{row.name}</p>
            <p className="text-xs text-gray-500">{row.memberId} • {row.phone}</p>
          </div>
        </div>
      )
    },
    {
      key: 'membership', title: 'Plan',
      render: (v) => (
        <div>
          <p className="text-sm text-white">{v?.plan?.name || <span className="text-gray-500">No plan</span>}</p>
          {v?.endDate && <p className="text-xs text-gray-500">{dayjs(v.endDate).format('DD MMM YYYY')}</p>}
        </div>
      )
    },
    {
      key: 'membership', title: 'Status',
      render: (v) => {
        const days = v?.endDate ? Math.ceil((new Date(v.endDate) - new Date()) / 86400000) : null;
        return (
          <div className="flex flex-col gap-1">
            <StatusBadge status={v?.status || 'pending'} />
            {days !== null && days <= 7 && days >= 0 && v?.status === 'active' && (
              <span className="text-xs text-amber-400 flex items-center gap-1">
                <AlertTriangle size={10} /> {days}d left
              </span>
            )}
          </div>
        );
      }
    },
    {
      key: 'engagement', title: 'Last Visit',
      render: (v) => (
        <span className={`text-xs ${v?.isInactive ? 'text-red-400' : 'text-gray-400'}`}>
          {v?.lastVisit ? dayjs(v.lastVisit).fromNow() : 'Never'}
        </span>
      )
    },
    {
      key: 'payment', title: 'Dues',
      render: (v) => (
        <span className={`text-sm font-medium ${(v?.totalDue || 0) > 0 ? 'text-red-400' : 'text-gray-400'}`}>
          {(v?.totalDue || 0) > 0 ? `₹${v.totalDue.toLocaleString('en-IN')}` : '—'}
        </span>
      )
    },
    {
      key: 'homeBranch', title: 'Branch',
      render: (v) => <span className="text-xs text-gray-400">{v?.name || '—'}</span>
    },
    {
      key: 'createdAt', title: 'Joined',
      render: (v) => <span className="text-xs text-gray-500">{dayjs(v).format('DD MMM YY')}</span>
    }
  ];

  const tabCounts = {
    all: stats?.total || 0,
    active: stats?.active || 0,
    expiring: stats?.expiringWeek || 0,
    inactive: stats?.inactive7days || 0,
    expired: stats?.expired || 0,
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Members"
        subtitle={`${stats?.total || 0} total members registered`}
        actions={
          <>
            <button onClick={exportCSV} className="btn-secondary flex items-center gap-2 text-sm">
              <Download size={15} />Export
            </button>
            <button onClick={() => navigate('/members/add')} className="btn-primary flex items-center gap-2 text-sm">
              <Plus size={15} />Add Member
            </button>
          </>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Total', value: stats?.total, color: 'text-white' },
          { label: 'Active', value: stats?.active, color: 'text-emerald-400' },
          { label: 'Expired', value: stats?.expired, color: 'text-red-400' },
          { label: 'Expiring (7d)', value: stats?.expiringWeek, color: 'text-amber-400' },
          { label: 'Inactive (7d)', value: stats?.inactive7days, color: 'text-orange-400' },
        ].map((stat) => (
          <div key={stat.label} className="card p-3 text-center">
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value || 0}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <Card noPadding>
        {/* Filters */}
        <div className="p-4 border-b border-surface-border flex flex-wrap items-center gap-3">
          <Tabs
            active={tab}
            onChange={(v) => { setTab(v); setStatus(''); setPage(1); }}
            tabs={[
              { value: 'all', label: 'All', count: tabCounts.all },
              { value: 'active', label: 'Active', count: tabCounts.active },
              { value: 'expiring', label: 'Expiring', count: tabCounts.expiring },
              { value: 'inactive', label: 'Inactive', count: tabCounts.inactive },
              { value: 'expired', label: 'Expired', count: tabCounts.expired },
            ]}
          />
          <div className="ml-auto flex items-center gap-2">
            <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search members..." />
            <div className="w-40">
              <Select
                value={plan}
                onChange={(v) => { setPlan(v); setPage(1); }}
                placeholder="All Plans"
                options={(plansData?.data || []).map(p => ({ value: p._id, label: p.name }))}
              />
            </div>
            <button onClick={() => refetch()} className="btn-ghost p-2"><RefreshCw size={15} /></button>
          </div>
        </div>

        {members.length === 0 && !isLoading ? (
          <EmptyState
            icon={Users}
            title="No members found"
            description={search ? `No results for "${search}"` : "Start by adding your first member"}
            action={<button onClick={() => navigate('/members/add')} className="btn-primary flex items-center gap-2"><Plus size={14} />Add First Member</button>}
          />
        ) : (
          <>
            <Table columns={columns} data={members} loading={isLoading} onRowClick={(row) => navigate(`/members/${row._id}`)} />
            <Pagination pagination={pagination} onChange={setPage} />
          </>
        )}
      </Card>
    </div>
  );
}
