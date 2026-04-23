// PaymentsPage.jsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { paymentAPI } from '../../services/api';
import { PageHeader, Table, Card, Select, StatusBadge } from '../../components/ui';
import { IndianRupee, Download } from 'lucide-react';
import dayjs from 'dayjs';

export default function PaymentsPage() {
  const [filters, setFilters] = useState({ page: 1, limit: 25, status: '', method: '' });
  const up = (k, v) => setFilters(f => ({ ...f, [k]: v, page: 1 }));

  const { data, isLoading } = useQuery({ queryKey: ['payments', filters], queryFn: () => paymentAPI.getAll(filters) });
  const { data: summary } = useQuery({ queryKey: ['payment-summary'], queryFn: () => paymentAPI.getSummary({}) });

  const sumData = summary?.data?.summary || [];
  const paid = sumData.find(s => s._id === 'paid');
  const pending = sumData.find(s => s._id === 'pending');

  const columns = [
    { key: 'invoiceNumber', title: 'Invoice', render: (v) => <span className="font-mono text-xs text-gray-300">{v}</span> },
    { key: 'member', title: 'Member', render: (v) => <div><p className="text-sm font-medium text-white">{v?.name}</p><p className="text-xs text-gray-500">{v?.memberId}</p></div> },
    { key: 'type', title: 'Type', render: (v) => <span className="badge badge-blue capitalize">{v}</span> },
    { key: 'paidAmount', title: 'Amount', render: (v) => <span className="text-sm font-bold text-emerald-400">₹{(v || 0).toLocaleString('en-IN')}</span> },
    { key: 'paymentMethod', title: 'Method', render: (v) => <span className="badge badge-gray">{v}</span> },
    { key: 'status', title: 'Status', render: (v) => <StatusBadge status={v} /> },
    { key: 'paymentDate', title: 'Date', render: (v) => <span className="text-xs text-gray-400">{dayjs(v).format('DD MMM YYYY')}</span> },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader title="Payments" subtitle="All payment transactions" />
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center"><p className="text-2xl font-bold text-emerald-400">₹{((paid?.paid || 0) / 1000).toFixed(0)}K</p><p className="text-xs text-gray-400">Collected (Month)</p></div>
        <div className="card p-4 text-center"><p className="text-2xl font-bold text-amber-400">₹{((pending?.total || 0) / 1000).toFixed(0)}K</p><p className="text-xs text-gray-400">Pending Dues</p></div>
        <div className="card p-4 text-center"><p className="text-2xl font-bold text-primary">{paid?.count || 0}</p><p className="text-xs text-gray-400">Transactions</p></div>
      </div>
      <Card noPadding>
        <div className="p-4 border-b border-surface-border flex gap-3">
          <div className="w-36"><Select value={filters.status} onChange={v => up('status', v)} placeholder="All Status" options={[{ value: 'paid', label: 'Paid' }, { value: 'pending', label: 'Pending' }, { value: 'partial', label: 'Partial' }]} /></div>
          <div className="w-36"><Select value={filters.method} onChange={v => up('method', v)} placeholder="All Methods" options={[{ value: 'cash', label: 'Cash' }, { value: 'upi', label: 'UPI' }, { value: 'card', label: 'Card' }]} /></div>
        </div>
        <Table columns={columns} data={data?.data || []} loading={isLoading} />
      </Card>
    </div>
  );
}
