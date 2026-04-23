import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadAPI, staffAPI } from '../../services/api';
import { PageHeader, Modal, FormField, Select, StatusBadge, Card, Tabs, SearchBar, Avatar, EmptyState } from '../../components/ui';
import { Plus, TrendingUp, Target, Loader2, Phone, ChevronRight, ArrowRight, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const STAGES = [
  { value: 'new', label: 'New', color: 'bg-blue-500/20 border-blue-500/30', dot: 'bg-blue-400' },
  { value: 'contacted', label: 'Contacted', color: 'bg-indigo-500/20 border-indigo-500/30', dot: 'bg-indigo-400' },
  { value: 'follow_up', label: 'Follow Up', color: 'bg-amber-500/20 border-amber-500/30', dot: 'bg-amber-400' },
  { value: 'trial_scheduled', label: 'Trial Sched.', color: 'bg-orange-500/20 border-orange-500/30', dot: 'bg-orange-400' },
  { value: 'trial_done', label: 'Trial Done', color: 'bg-pink-500/20 border-pink-500/30', dot: 'bg-pink-400' },
  { value: 'negotiation', label: 'Negotiation', color: 'bg-violet-500/20 border-violet-500/30', dot: 'bg-violet-400' },
  { value: 'converted', label: 'Converted', color: 'bg-emerald-500/20 border-emerald-500/30', dot: 'bg-emerald-400' },
];

const SOURCES = ['walk_in', 'phone_call', 'social_media', 'referral', 'website', 'google', 'newspaper', 'event', 'other'];

export default function LeadsPage() {
  const qc = useQueryClient();
  const [view, setView] = useState('pipeline');
  const [addModal, setAddModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [followUpModal, setFollowUpModal] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', source: 'walk_in', priority: 'medium', interestedIn: [], notes: '' });
  const [fuForm, setFuForm] = useState({ date: dayjs().format('YYYY-MM-DD'), time: '10:00', type: 'call', notes: '' });
  const up = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const { data: pipeline, isLoading } = useQuery({ queryKey: ['lead-pipeline'], queryFn: () => leadAPI.getPipeline() });
  const { data: stats } = useQuery({ queryKey: ['lead-stats'], queryFn: () => leadAPI.getStats() });
  const { data: listData } = useQuery({ queryKey: ['leads-list'], queryFn: () => leadAPI.getAll({ limit: 100 }), enabled: view === 'list' });
  const { data: overdueData } = useQuery({ queryKey: ['leads-overdue'], queryFn: () => leadAPI.getAll({ overdue: true, limit: 20 }) });

  const addMutation = useMutation({
    mutationFn: (d) => leadAPI.create(d),
    onSuccess: (res) => { toast.success(`Lead ${res.data.name} added!`); setAddModal(false); setForm({ name: '', phone: '', email: '', source: 'walk_in', priority: 'medium', interestedIn: [], notes: '' }); qc.invalidateQueries(['lead-pipeline']); qc.invalidateQueries(['lead-stats']); }
  });

  const stageMutation = useMutation({
    mutationFn: ({ id, stage }) => leadAPI.updateStage(id, stage),
    onSuccess: () => { qc.invalidateQueries(['lead-pipeline']); toast.success('Stage updated'); }
  });

  const followUpMutation = useMutation({
    mutationFn: ({ id, data }) => leadAPI.addFollowUp(id, { ...data, date: new Date(data.date + 'T' + data.time) }),
    onSuccess: () => { toast.success('Follow-up added'); setFollowUpModal(false); qc.invalidateQueries(['lead-pipeline']); }
  });

  const convertMutation = useMutation({
    mutationFn: (id) => leadAPI.convert(id, {}),
    onSuccess: (res) => { toast.success(`🎉 ${res.data.lead.name} converted to member!`); qc.invalidateQueries(['lead-pipeline']); qc.invalidateQueries(['lead-stats']); }
  });

  const s = stats?.data;
  const overdueLeads = overdueData?.data || [];

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader title="Leads & CRM" subtitle={`${s?.total || 0} total leads • ${s?.conversionRate || 0}% conversion`}
        actions={<button onClick={() => setAddModal(true)} className="btn-primary flex items-center gap-2 text-sm"><Plus size={15} />Add Lead</button>} />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total', value: s?.total, color: 'text-white' },
          { label: 'Active', value: s?.total - (s?.converted || 0) - (s?.lost || 0), color: 'text-blue-400' },
          { label: 'Converted', value: s?.converted, color: 'text-emerald-400' },
          { label: 'Lost', value: s?.lost, color: 'text-red-400' },
          { label: 'This Month', value: s?.thisMonth, color: 'text-primary' },
        ].map(st => (
          <div key={st.label} className="card p-3 text-center">
            <p className={`text-xl font-bold ${st.color}`}>{st.value || 0}</p>
            <p className="text-xs text-gray-500 mt-0.5">{st.label}</p>
          </div>
        ))}
      </div>

      {/* Overdue Follow-ups */}
      {overdueLeads.length > 0 && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
          <p className="text-sm font-semibold text-red-400 mb-2">⚠️ {overdueLeads.length} overdue follow-ups</p>
          <div className="flex flex-wrap gap-2">
            {overdueLeads.slice(0, 5).map(l => (
              <div key={l._id} className="flex items-center gap-2 bg-surface-card border border-surface-border rounded-lg px-3 py-1.5 cursor-pointer hover:border-primary/40 transition-colors"
                onClick={() => { setSelected(l); setFollowUpModal(true); }}>
                <span className="text-sm text-white">{l.name}</span>
                <span className="text-xs text-red-400">{dayjs(l.nextFollowUpDate).fromNow()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Tabs tabs={[{ value: 'pipeline', label: '🗂 Pipeline' }, { value: 'list', label: '📋 List' }]} active={view} onChange={setView} />

      {/* Pipeline / Kanban */}
      {view === 'pipeline' && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {STAGES.map(stage => {
              const stageLeads = pipeline?.data?.[stage.value]?.leads || [];
              const count = pipeline?.data?.[stage.value]?.count || 0;
              return (
                <div key={stage.value} className={`w-64 rounded-xl border ${stage.color} flex flex-col`} style={{ minHeight: 200 }}>
                  <div className="flex items-center justify-between px-3 py-2.5 border-b border-inherit">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${stage.dot}`} />
                      <span className="text-xs font-bold text-white">{stage.label}</span>
                    </div>
                    <span className="text-xs text-gray-400 bg-surface-card px-1.5 py-0.5 rounded-full">{count}</span>
                  </div>
                  <div className="p-2 space-y-2 flex-1 overflow-y-auto max-h-96">
                    {isLoading ? (
                      <div className="flex justify-center py-4"><Loader2 size={18} className="animate-spin text-gray-500" /></div>
                    ) : stageLeads.length === 0 ? (
                      <p className="text-center text-xs text-gray-600 py-4">No leads</p>
                    ) : stageLeads.map(lead => (
                      <div key={lead._id} className="bg-surface-card/80 border border-surface-border rounded-lg p-2.5 hover:border-white/20 transition-colors group">
                        <div className="flex items-start justify-between mb-1">
                          <p className="text-sm font-semibold text-white leading-tight">{lead.name}</p>
                          <span className={`badge text-[10px] ${lead.priority === 'high' ? 'badge-red' : lead.priority === 'medium' ? 'badge-yellow' : 'badge-gray'}`}>{lead.priority}</span>
                        </div>
                        <p className="text-xs text-gray-400 flex items-center gap-1"><Phone size={9} />{lead.phone}</p>
                        {lead.nextFollowUpDate && (
                          <p className={`text-[10px] mt-1 ${new Date(lead.nextFollowUpDate) < new Date() ? 'text-red-400' : 'text-gray-500'}`}>
                            📅 {dayjs(lead.nextFollowUpDate).format('DD MMM')}
                          </p>
                        )}
                        <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {stage.value !== 'converted' && stage.value !== 'lost' && (
                            <button onClick={() => { setSelected(lead); setFollowUpModal(true); }} className="text-[10px] px-2 py-1 bg-primary/20 text-primary rounded-md hover:bg-primary/30 transition-colors">+ Follow-up</button>
                          )}
                          {stage.value === 'trial_done' && (
                            <button onClick={() => convertMutation.mutate(lead._id)} disabled={convertMutation.isPending} className="text-[10px] px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-md hover:bg-emerald-500/30 transition-colors">Convert</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <Card noPadding>
          <div className="divide-y divide-surface-border">
            {(listData?.data || []).map(lead => (
              <div key={lead._id} className="flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar name={lead.name} />
                  <div>
                    <p className="text-sm font-semibold text-white">{lead.name}</p>
                    <p className="text-xs text-gray-500">{lead.phone} • {lead.source?.replace(/_/g, ' ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={lead.stage} />
                  <button onClick={() => stageMutation.mutate({ id: lead._id, stage: getNextStage(lead.stage) })} className="btn-ghost text-xs py-1">
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Add Lead Modal */}
      <Modal open={addModal} onClose={() => setAddModal(false)} title="Add New Lead"
        footer={
          <>
            <button onClick={() => setAddModal(false)} className="btn-secondary">Cancel</button>
            <button onClick={() => addMutation.mutate(form)} disabled={addMutation.isPending} className="btn-primary flex items-center gap-2">
              {addMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : null}Add Lead
            </button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <FormField label="Full Name" required><input required value={form.name} onChange={e => up('name', e.target.value)} className="input" placeholder="Lead name" /></FormField>
          </div>
          <FormField label="Phone" required>
            <div className="flex gap-2"><span className="input w-14 text-center flex-shrink-0 text-gray-400">+91</span>
              <input required maxLength={10} value={form.phone} onChange={e => up('phone', e.target.value)} className="input flex-1" /></div>
          </FormField>
          <FormField label="Email"><input type="email" value={form.email} onChange={e => up('email', e.target.value)} className="input" /></FormField>
          <FormField label="Source" required>
            <Select value={form.source} onChange={v => up('source', v)} options={SOURCES.map(s => ({ value: s, label: s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) }))} />
          </FormField>
          <FormField label="Priority">
            <Select value={form.priority} onChange={v => up('priority', v)} options={[{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }]} />
          </FormField>
          <div className="col-span-2">
            <FormField label="Notes"><textarea rows={2} value={form.notes} onChange={e => up('notes', e.target.value)} className="input resize-none" /></FormField>
          </div>
        </div>
      </Modal>

      {/* Follow-up Modal */}
      <Modal open={followUpModal} onClose={() => setFollowUpModal(false)} title={`Add Follow-up — ${selected?.name}`}
        footer={
          <>
            <button onClick={() => setFollowUpModal(false)} className="btn-secondary">Cancel</button>
            <button onClick={() => followUpMutation.mutate({ id: selected?._id, data: fuForm })} disabled={followUpMutation.isPending} className="btn-primary flex items-center gap-2">
              {followUpMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : null}Save
            </button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Date"><input type="date" value={fuForm.date} onChange={e => setFuForm(f => ({ ...f, date: e.target.value }))} className="input" /></FormField>
          <FormField label="Time"><input type="time" value={fuForm.time} onChange={e => setFuForm(f => ({ ...f, time: e.target.value }))} className="input" /></FormField>
          <FormField label="Type">
            <Select value={fuForm.type} onChange={v => setFuForm(f => ({ ...f, type: v }))} options={[{ value: 'call', label: '📞 Call' }, { value: 'whatsapp', label: '💬 WhatsApp' }, { value: 'email', label: '📧 Email' }, { value: 'in_person', label: '🤝 In Person' }, { value: 'demo', label: '🏋️ Demo' }]} />
          </FormField>
          <div className="col-span-2">
            <FormField label="Notes"><textarea rows={2} value={fuForm.notes} onChange={e => setFuForm(f => ({ ...f, notes: e.target.value }))} className="input resize-none" placeholder="What was discussed?" /></FormField>
          </div>
        </div>
      </Modal>
    </div>
  );
}

const stageOrder = ['new', 'contacted', 'follow_up', 'trial_scheduled', 'trial_done', 'negotiation', 'converted'];
const getNextStage = (current) => {
  const idx = stageOrder.indexOf(current);
  return idx < stageOrder.length - 1 ? stageOrder[idx + 1] : current;
};
