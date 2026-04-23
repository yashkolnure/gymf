import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { planAPI } from '../../services/api';
import { PageHeader, Modal, FormField, Select, Card } from '../../components/ui';
import { Plus, Edit, Trash2, Loader2, Check, Dumbbell } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['general', 'student', 'senior', 'couple', 'corporate', 'personal_training', 'group_class'];
const COLORS_LIST = ['#FF6B35', '#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#06b6d4'];

const emptyForm = { name: '', description: '', category: 'general', duration: { value: 1, unit: 'months' }, price: '', offerPrice: '', isOfferActive: false, gstApplicable: false, gstRate: 18, features: '', maxFreeze: 0, color: '#FF6B35', isPopular: false };

export default function PlansPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const up = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const upDur = (k, v) => setForm(f => ({ ...f, duration: { ...f.duration, [k]: v } }));

  const { data, isLoading } = useQuery({ queryKey: ['plans'], queryFn: () => planAPI.getAll() });

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModal(true); };
  const openEdit = (plan) => {
    setEditing(plan._id);
    setForm({ ...plan, features: plan.features?.join(', ') || '' });
    setModal(true);
  };

  const mutation = useMutation({
    mutationFn: (d) => {
      const payload = { ...d, features: d.features ? d.features.split(',').map(s => s.trim()).filter(Boolean) : [] };
      return editing ? planAPI.update(editing, payload) : planAPI.create(payload);
    },
    onSuccess: () => { toast.success(editing ? 'Plan updated' : 'Plan created'); setModal(false); qc.invalidateQueries(['plans']); }
  });

  const deleteMutation = useMutation({
    mutationFn: planAPI.delete,
    onSuccess: () => { toast.success('Plan deactivated'); qc.invalidateQueries(['plans']); }
  });

  const plans = data?.data || [];

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader title="Membership Plans" subtitle={`${plans.length} plans configured`}
        actions={<button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm"><Plus size={15} />New Plan</button>} />

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 size={28} className="animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <div key={plan._id} className="card p-5 hover:border-white/10 transition-all duration-200 relative overflow-hidden group" style={{ borderColor: plan.color + '30' }}>
              {plan.isPopular && <div className="absolute top-3 right-3 badge badge-orange text-[10px]">Popular</div>}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: plan.color + '20' }}>
                <Dumbbell size={18} style={{ color: plan.color }} />
              </div>
              <h3 className="font-display font-bold text-white text-base">{plan.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5 capitalize">{plan.category?.replace(/_/g, ' ')}</p>
              <div className="mt-3">
                <span className="text-2xl font-bold" style={{ color: plan.color }}>₹{(plan.effectivePrice || plan.price).toLocaleString('en-IN')}</span>
                <span className="text-gray-400 text-sm ml-1">/ {plan.duration?.value} {plan.duration?.unit}</span>
              </div>
              {plan.isOfferActive && plan.offerPrice && (
                <p className="text-xs text-gray-500 line-through">₹{plan.price.toLocaleString('en-IN')}</p>
              )}
              {plan.features?.length > 0 && (
                <div className="mt-3 space-y-1">
                  {plan.features.slice(0, 3).map((f, i) => (
                    <p key={i} className="text-xs text-gray-400 flex items-center gap-1"><Check size={10} className="text-emerald-400" />{f}</p>
                  ))}
                </div>
              )}
              <div className="mt-4 pt-3 border-t border-surface-border flex items-center gap-2">
                <span className="text-xs text-gray-500">{plan.stats?.activeEnrolled || 0} active</span>
                <div className="ml-auto flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(plan)} className="btn-ghost p-1.5"><Edit size={13} /></button>
                  <button onClick={() => { if (confirm('Deactivate this plan?')) deleteMutation.mutate(plan._id); }} className="btn-ghost p-1.5 text-red-400"><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          ))}
          <button onClick={openAdd} className="card p-5 border-dashed border-2 flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-pointer min-h-[200px]">
            <div className="w-10 h-10 rounded-full bg-surface-card flex items-center justify-center"><Plus size={18} className="text-gray-500" /></div>
            <p className="text-sm text-gray-500">Add New Plan</p>
          </button>
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Plan' : 'Create Plan'} size="lg"
        footer={
          <><button onClick={() => setModal(false)} className="btn-secondary">Cancel</button>
          <button onClick={() => mutation.mutate(form)} disabled={mutation.isPending} className="btn-primary flex items-center gap-2">
            {mutation.isPending ? <Loader2 size={14} className="animate-spin" /> : null}{editing ? 'Update' : 'Create'} Plan</button></>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><FormField label="Plan Name" required><input required value={form.name} onChange={e => up('name', e.target.value)} className="input" placeholder="e.g. Monthly Basic" /></FormField></div>
          <FormField label="Category"><Select value={form.category} onChange={v => up('category', v)} options={CATEGORIES.map(c => ({ value: c, label: c.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) }))} /></FormField>
          <div className="grid grid-cols-2 gap-2">
            <FormField label="Duration"><input type="number" min={1} value={form.duration?.value} onChange={e => upDur('value', parseInt(e.target.value))} className="input" /></FormField>
            <FormField label="Unit"><Select value={form.duration?.unit} onChange={v => upDur('unit', v)} options={[{ value: 'days', label: 'Days' }, { value: 'months', label: 'Months' }, { value: 'years', label: 'Years' }]} /></FormField>
          </div>
          <FormField label="Price (₹)" required><input type="number" required min={0} value={form.price} onChange={e => up('price', parseFloat(e.target.value))} className="input" placeholder="1500" /></FormField>
          <FormField label="Offer Price (₹)" hint="Strikethrough price"><input type="number" min={0} value={form.offerPrice} onChange={e => up('offerPrice', parseFloat(e.target.value))} className="input" placeholder="Optional" /></FormField>
          <div className="col-span-2"><FormField label="Features" hint="Comma separated: Cardio, Weights, Locker Room"><input value={form.features} onChange={e => up('features', e.target.value)} className="input" placeholder="Cardio equipment, Weight training, ..." /></FormField></div>
          <FormField label="Color"><div className="flex gap-2">{COLORS_LIST.map(c => <button key={c} type="button" onClick={() => up('color', c)} className={`w-7 h-7 rounded-full transition-transform ${form.color === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-surface-card' : ''}`} style={{ background: c }} />)}</div></FormField>
          <div className="flex items-center gap-4 pt-4">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isPopular} onChange={e => up('isPopular', e.target.checked)} className="w-4 h-4 accent-primary" /><span className="text-sm text-gray-300">Mark as Popular</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.gstApplicable} onChange={e => up('gstApplicable', e.target.checked)} className="w-4 h-4 accent-primary" /><span className="text-sm text-gray-300">GST Applicable</span></label>
          </div>
        </div>
      </Modal>
    </div>
  );
}
