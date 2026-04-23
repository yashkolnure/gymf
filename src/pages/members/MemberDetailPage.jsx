import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memberAPI, attendanceAPI, planAPI } from '../../services/api';
import { StatusBadge, Card, Modal, Select, FormField, Avatar, Tabs } from '../../components/ui';
import { ArrowLeft, Edit, QrCode, RefreshCw, MoreVertical, Phone, Mail, Calendar, Activity, CreditCard, MapPin, Loader2, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

export default function MemberDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [tab, setTab] = useState('overview');
  const [renewModal, setRenewModal] = useState(false);
  const [qrModal, setQrModal] = useState(false);
  const [renewForm, setRenewForm] = useState({ planId: '', paymentAmount: '', paymentMethod: 'cash' });
  const [month, setMonth] = useState(dayjs().format('YYYY-MM'));

  const { data, isLoading } = useQuery({ queryKey: ['member', id], queryFn: () => memberAPI.getOne(id) });
  const { data: plansData } = useQuery({ queryKey: ['plans'], queryFn: () => planAPI.getAll() });
  const { data: qrData } = useQuery({ queryKey: ['member-qr', id], queryFn: () => memberAPI.getQR(id), enabled: qrModal });
  const { data: monthlyAtt } = useQuery({ queryKey: ['member-monthly-att', id, month], queryFn: () => attendanceAPI.getMemberMonthly(id, month) });

  const member = data?.data;

  const renewMutation = useMutation({
    mutationFn: (d) => memberAPI.renew(id, d),
    onSuccess: () => { toast.success('Membership renewed!'); setRenewModal(false); qc.invalidateQueries(['member', id]); }
  });

  const freezeMutation = useMutation({
    mutationFn: () => memberAPI.freeze(id, { reason: 'Requested by member' }),
    onSuccess: () => { toast.success('Membership frozen'); qc.invalidateQueries(['member', id]); }
  });

  if (isLoading) return (
    <div className="flex items-center justify-center h-60">
      <Loader2 size={28} className="animate-spin text-primary" />
    </div>
  );
  if (!member) return <div className="text-center py-20 text-gray-500">Member not found</div>;

  const daysLeft = member.membership?.endDate ? Math.ceil((new Date(member.membership.endDate) - new Date()) / 86400000) : null;
  const isExpiringSoon = daysLeft !== null && daysLeft <= 7 && daysLeft >= 0;

  return (
    <div className="space-y-5 max-w-5xl animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/members')} className="btn-ghost p-2"><ArrowLeft size={18} /></button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <Avatar name={member.name} photo={member.photo} size="lg" />
            <div>
              <h1 className="font-display text-xl font-bold text-white">{member.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-400">{member.memberId}</span>
                <StatusBadge status={member.membership?.status || 'pending'} />
                {isExpiringSoon && <span className="badge badge-yellow">⚠ {daysLeft}d left</span>}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setQrModal(true)} className="btn-secondary flex items-center gap-1.5 text-sm"><QrCode size={14} />QR Code</button>
          <button onClick={() => setRenewModal(true)} className="btn-primary flex items-center gap-1.5 text-sm"><RefreshCw size={14} />Renew</button>
        </div>
      </div>

      {/* Expiry Alert */}
      {isExpiringSoon && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between">
          <p className="text-amber-300 text-sm">⚠️ Membership expiring in <strong>{daysLeft} days</strong> on {dayjs(member.membership.endDate).format('DD MMM YYYY')}</p>
          <button onClick={() => setRenewModal(true)} className="btn-primary text-sm py-1.5">Renew Now</button>
        </div>
      )}

      {/* Quick Info Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card p-4 flex items-center gap-3">
          <Phone size={15} className="text-primary flex-shrink-0" />
          <div><p className="text-xs text-gray-500">Phone</p><p className="text-sm font-medium text-white">{member.phone}</p></div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <Calendar size={15} className="text-emerald-400 flex-shrink-0" />
          <div><p className="text-xs text-gray-500">Joined</p><p className="text-sm font-medium text-white">{dayjs(member.createdAt).format('DD MMM YYYY')}</p></div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <Activity size={15} className="text-violet-400 flex-shrink-0" />
          <div><p className="text-xs text-gray-500">Total Visits</p><p className="text-sm font-medium text-white">{member.engagement?.totalVisits || 0}</p></div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <CreditCard size={15} className="text-amber-400 flex-shrink-0" />
          <div><p className="text-xs text-gray-500">Total Paid</p><p className="text-sm font-medium text-white">₹{(member.payment?.totalPaid || 0).toLocaleString('en-IN')}</p></div>
        </div>
      </div>

      <Tabs tabs={[
        { value: 'overview', label: 'Overview' },
        { value: 'attendance', label: 'Attendance' },
        { value: 'payments', label: 'Payments' },
      ]} active={tab} onChange={setTab} />

      {tab === 'overview' && (
        <div className="grid md:grid-cols-2 gap-5">
          {/* Membership */}
          <Card title="Membership">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Plan</span>
                <span className="text-white text-sm font-medium">{member.membership?.plan?.name || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Start Date</span>
                <span className="text-white text-sm">{member.membership?.startDate ? dayjs(member.membership.startDate).format('DD MMM YYYY') : '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Expiry Date</span>
                <span className={`text-sm font-medium ${isExpiringSoon ? 'text-amber-400' : 'text-white'}`}>
                  {member.membership?.endDate ? dayjs(member.membership.endDate).format('DD MMM YYYY') : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Status</span>
                <StatusBadge status={member.membership?.status || 'pending'} />
              </div>
              {member.assignedTrainer && (
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Trainer</span>
                  <span className="text-white text-sm">{member.assignedTrainer?.name}</span>
                </div>
              )}
              {member.membership?.status === 'active' && (
                <button onClick={() => freezeMutation.mutate()} disabled={freezeMutation.isPending} className="btn-secondary w-full text-sm mt-2">
                  {freezeMutation.isPending ? <Loader2 size={13} className="animate-spin mx-auto" /> : '❄️ Freeze Membership'}
                </button>
              )}
            </div>
          </Card>

          {/* Health */}
          <Card title="Health Info">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Height', value: member.healthInfo?.height ? `${member.healthInfo.height} cm` : '—' },
                { label: 'Weight', value: member.healthInfo?.weight ? `${member.healthInfo.weight} kg` : '—' },
                { label: 'BMI', value: member.bmi ? `${member.bmi}` : '—' },
                { label: 'Blood Group', value: member.healthInfo?.bloodGroup || '—' },
                { label: 'Fitness Goal', value: member.healthInfo?.fitnessGoal?.replace(/_/g, ' ') || '—' },
                { label: 'Last Visit', value: member.engagement?.lastVisit ? dayjs(member.engagement.lastVisit).format('DD MMM') : 'Never' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-surface-card/50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="text-sm font-semibold text-white capitalize mt-0.5">{value}</p>
                </div>
              ))}
            </div>
            {member.healthInfo?.medicalConditions?.length > 0 && (
              <div className="mt-3 p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                <p className="text-xs text-red-400 font-semibold">⚠ Medical Conditions</p>
                <p className="text-sm text-gray-300 mt-1">{member.healthInfo.medicalConditions.join(', ')}</p>
              </div>
            )}
          </Card>

          {/* Emergency Contact */}
          {member.emergencyContact?.name && (
            <Card title="Emergency Contact">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">Name</span><span className="text-white">{member.emergencyContact.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Phone</span><span className="text-white">{member.emergencyContact.phone}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Relation</span><span className="text-white capitalize">{member.emergencyContact.relation}</span></div>
              </div>
            </Card>
          )}
        </div>
      )}

      {tab === 'attendance' && (
        <Card title="Attendance Calendar" action={
          <input type="month" value={month} onChange={e => setMonth(e.target.value)} className="input py-1 text-xs w-36" />
        }>
          {monthlyAtt?.data && (
            <>
              <div className="flex gap-4 mb-4">
                <div className="bg-emerald-500/10 rounded-lg px-4 py-2 text-center">
                  <p className="text-xl font-bold text-emerald-400">{monthlyAtt.data.totalPresent}</p>
                  <p className="text-xs text-gray-400">Present</p>
                </div>
                <div className="bg-red-500/10 rounded-lg px-4 py-2 text-center">
                  <p className="text-xl font-bold text-red-400">{monthlyAtt.data.totalDays - monthlyAtt.data.totalPresent}</p>
                  <p className="text-xs text-gray-400">Absent</p>
                </div>
                <div className="bg-primary/10 rounded-lg px-4 py-2 text-center">
                  <p className="text-xl font-bold text-primary">{monthlyAtt.data.attendancePercentage}%</p>
                  <p className="text-xs text-gray-400">Rate</p>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <div key={i} className="text-xs text-gray-500 pb-1 font-bold">{d}</div>
                ))}
                {monthlyAtt.data.calendar.map((d) => (
                  <div key={d.day} title={d.present ? `Checked in${d.duration ? ` • ${d.duration} min` : ''}` : 'Absent'}
                    className={`aspect-square flex items-center justify-center rounded-lg text-xs font-medium transition-colors
                    ${d.present ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-surface-card/30 text-gray-600 border border-surface-border/30'}`}>
                    {d.day}
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      )}

      {tab === 'payments' && (
        <Card title="Payment History">
          {member.paymentHistory?.length > 0 ? (
            <div className="space-y-2">
              {member.paymentHistory.map((p) => (
                <div key={p._id} className="flex items-center justify-between p-3 rounded-xl bg-surface-card/50 border border-surface-border">
                  <div>
                    <p className="text-sm font-medium text-white">{p.invoiceNumber}</p>
                    <p className="text-xs text-gray-500">{dayjs(p.paymentDate).format('DD MMM YYYY')} • {p.paymentMethod?.toUpperCase()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-400">₹{p.paidAmount?.toLocaleString('en-IN')}</p>
                    <StatusBadge status={p.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-500 text-sm text-center py-8">No payment records</p>}
        </Card>
      )}

      {/* Renew Modal */}
      <Modal open={renewModal} onClose={() => setRenewModal(false)} title="Renew Membership"
        footer={
          <>
            <button onClick={() => setRenewModal(false)} className="btn-secondary">Cancel</button>
            <button onClick={() => renewMutation.mutate(renewForm)} disabled={renewMutation.isPending} className="btn-primary flex items-center gap-2">
              {renewMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : null} Renew
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Select Plan" required>
            <Select value={renewForm.planId} onChange={v => setRenewForm(f => ({ ...f, planId: v }))} placeholder="Choose a plan"
              options={(plansData?.data || []).map(p => ({ value: p._id, label: `${p.name} — ₹${p.effectivePrice || p.price} / ${p.duration?.value} ${p.duration?.unit}` }))} />
          </FormField>
          <FormField label="Amount (₹)">
            <input type="number" value={renewForm.paymentAmount} onChange={e => setRenewForm(f => ({ ...f, paymentAmount: e.target.value }))} placeholder="0" className="input" />
          </FormField>
          <FormField label="Payment Method">
            <Select value={renewForm.paymentMethod} onChange={v => setRenewForm(f => ({ ...f, paymentMethod: v }))} placeholder="Method"
              options={[{ value: 'cash', label: 'Cash' }, { value: 'upi', label: 'UPI' }, { value: 'card', label: 'Card' }, { value: 'netbanking', label: 'Net Banking' }]} />
          </FormField>
        </div>
      </Modal>

      {/* QR Modal */}
      <Modal open={qrModal} onClose={() => setQrModal(false)} title="Member QR Code" size="sm">
        <div className="text-center space-y-4">
          {qrData?.data?.qrCode?.data ? (
            <img src={qrData.data.qrCode.data} alt="QR Code" className="w-56 h-56 mx-auto rounded-xl border border-surface-border" />
          ) : <div className="w-56 h-56 mx-auto bg-surface-card rounded-xl flex items-center justify-center"><Loader2 size={28} className="animate-spin text-primary" /></div>}
          <div>
            <p className="font-bold text-white text-lg">{member.name}</p>
            <p className="text-gray-400 text-sm">{member.memberId}</p>
          </div>
          <p className="text-xs text-gray-500">Scan this QR for attendance check-in</p>
        </div>
      </Modal>
    </div>
  );
}
