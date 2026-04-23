import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memberAPI, planAPI, branchAPI, staffAPI } from '../../services/api';
import { PageHeader, FormField, Select, Card, Tabs } from '../../components/ui';
import { ArrowLeft, Save, User, Heart, CreditCard, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const INDIAN_STATES = ['Maharashtra', 'Gujarat', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Delhi', 'Uttar Pradesh', 'Rajasthan', 'Punjab', 'Kerala', 'West Bengal', 'Madhya Pradesh', 'Andhra Pradesh', 'Bihar', 'Haryana', 'Others'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const SOURCES = ['walk_in', 'existing_member', 'social_media', 'referral', 'google', 'newspaper', 'other'];
const GOALS = ['weight_loss', 'muscle_gain', 'endurance', 'flexibility', 'general_fitness', 'sports_training', 'rehabilitation'];

export default function AddMemberPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [tab, setTab] = useState('personal');

  const [form, setForm] = useState({
    name: '', email: '', phone: '', whatsapp: '', gender: '', dateOfBirth: '',
    address: { street: '', city: '', state: '', pincode: '' },
    emergencyContact: { name: '', phone: '', relation: '' },
    healthInfo: { height: '', weight: '', bloodGroup: '', fitnessGoal: '', medicalConditions: '' },
    occupation: '', referredBy: '', branchId: '',
    planId: '', startDate: dayjs().format('YYYY-MM-DD'), customPrice: '', paymentAmount: '', paymentMethod: 'cash',
    assignedTrainerId: '', notes: '',
  });

  const up = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const upNested = (parent, k, v) => setForm(f => ({ ...f, [parent]: { ...f[parent], [k]: v } }));

  const { data: plans } = useQuery({ queryKey: ['plans'], queryFn: () => planAPI.getAll() });
  const { data: branches } = useQuery({ queryKey: ['branches'], queryFn: () => branchAPI.getAll() });
  const { data: trainers } = useQuery({ queryKey: ['trainers'], queryFn: () => staffAPI.getAll({ role: 'trainer' }) });

  const selectedPlan = plans?.data?.find(p => p._id === form.planId);

  const mutation = useMutation({
    mutationFn: (data) => memberAPI.create(data),
    onSuccess: (res) => {
      toast.success(`${res.data.name} added successfully!`);
      qc.invalidateQueries(['members']);
      qc.invalidateQueries(['member-stats']);
      navigate(`/members/${res.data._id}`);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.gender) {
      toast.error('Please fill required fields: Name, Phone, Gender');
      return;
    }
    mutation.mutate({
      ...form,
      healthInfo: {
        ...form.healthInfo,
        medicalConditions: form.healthInfo.medicalConditions ? form.healthInfo.medicalConditions.split(',').map(s => s.trim()) : []
      }
    });
  };

  const tabs = [
    { value: 'personal', label: '👤 Personal' },
    { value: 'health', label: '❤️ Health' },
    { value: 'membership', label: '💳 Membership' },
  ];

  return (
    <div className="space-y-5 max-w-3xl animate-fade-in">
      <PageHeader
        title="Add New Member"
        actions={
          <button onClick={() => navigate('/members')} className="btn-ghost flex items-center gap-2 text-sm">
            <ArrowLeft size={15} />Back
          </button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-wrap gap-2 items-center">
          <Tabs tabs={tabs} active={tab} onChange={setTab} />
        </div>

        {/* Personal Tab */}
        {tab === 'personal' && (
          <Card title="Personal Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Full Name" required>
                <input required value={form.name} onChange={e => up('name', e.target.value)} placeholder="Ramesh Kumar" className="input" />
              </FormField>
              <FormField label="Gender" required>
                <Select value={form.gender} onChange={v => up('gender', v)} placeholder="Select gender"
                  options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' }]} />
              </FormField>
              <FormField label="Mobile Number" required>
                <div className="flex gap-2">
                  <span className="input w-14 text-center flex-shrink-0 text-gray-400">+91</span>
                  <input required pattern="[6-9]\d{9}" maxLength={10} value={form.phone} onChange={e => up('phone', e.target.value)} placeholder="9876543210" className="input flex-1" />
                </div>
              </FormField>
              <FormField label="WhatsApp Number">
                <div className="flex gap-2">
                  <span className="input w-14 text-center flex-shrink-0 text-gray-400">+91</span>
                  <input maxLength={10} value={form.whatsapp} onChange={e => up('whatsapp', e.target.value)} placeholder="Same as mobile" className="input flex-1" />
                </div>
              </FormField>
              <FormField label="Email Address">
                <input type="email" value={form.email} onChange={e => up('email', e.target.value)} placeholder="member@email.com" className="input" />
              </FormField>
              <FormField label="Date of Birth">
                <input type="date" value={form.dateOfBirth} onChange={e => up('dateOfBirth', e.target.value)} className="input" max={dayjs().format('YYYY-MM-DD')} />
              </FormField>
              <FormField label="Occupation">
                <input value={form.occupation} onChange={e => up('occupation', e.target.value)} placeholder="Software Engineer" className="input" />
              </FormField>
              <FormField label="How did they find us?">
                <Select value={form.referredBy} onChange={v => up('referredBy', v)} placeholder="Source"
                  options={SOURCES.map(s => ({ value: s, label: s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) }))} />
              </FormField>
            </div>

            <div className="mt-4 pt-4 border-t border-surface-border">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Address</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <input value={form.address.street} onChange={e => upNested('address', 'street', e.target.value)} placeholder="Street / Flat / Society" className="input" />
                </div>
                <input value={form.address.city} onChange={e => upNested('address', 'city', e.target.value)} placeholder="City" className="input" />
                <Select value={form.address.state} onChange={v => upNested('address', 'state', v)} placeholder="State"
                  options={INDIAN_STATES.map(s => ({ value: s, label: s }))} />
                <input value={form.address.pincode} onChange={e => upNested('address', 'pincode', e.target.value)} placeholder="Pincode" className="input" maxLength={6} />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-surface-border">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Emergency Contact</p>
              <div className="grid grid-cols-3 gap-3">
                <input value={form.emergencyContact.name} onChange={e => upNested('emergencyContact', 'name', e.target.value)} placeholder="Contact Name" className="input" />
                <input value={form.emergencyContact.phone} onChange={e => upNested('emergencyContact', 'phone', e.target.value)} placeholder="Phone" className="input" maxLength={10} />
                <input value={form.emergencyContact.relation} onChange={e => upNested('emergencyContact', 'relation', e.target.value)} placeholder="Relation (Parent/Spouse)" className="input" />
              </div>
            </div>
          </Card>
        )}

        {/* Health Tab */}
        {tab === 'health' && (
          <Card title="Health & Fitness Information">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormField label="Height (cm)">
                <input type="number" min={100} max={250} value={form.healthInfo.height} onChange={e => upNested('healthInfo', 'height', e.target.value)} placeholder="170" className="input" />
              </FormField>
              <FormField label="Weight (kg)">
                <input type="number" min={30} max={300} value={form.healthInfo.weight} onChange={e => upNested('healthInfo', 'weight', e.target.value)} placeholder="70" className="input" />
              </FormField>
              <FormField label="Blood Group">
                <Select value={form.healthInfo.bloodGroup} onChange={v => upNested('healthInfo', 'bloodGroup', v)} placeholder="Select"
                  options={BLOOD_GROUPS.map(b => ({ value: b, label: b }))} />
              </FormField>
              <FormField label="Fitness Goal">
                <Select value={form.healthInfo.fitnessGoal} onChange={v => upNested('healthInfo', 'fitnessGoal', v)} placeholder="Select goal"
                  options={GOALS.map(g => ({ value: g, label: g.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) }))} />
              </FormField>
            </div>
            <div className="mt-4">
              <FormField label="Medical Conditions" hint="Comma separated: Diabetes, Hypertension, etc.">
                <input value={form.healthInfo.medicalConditions} onChange={e => upNested('healthInfo', 'medicalConditions', e.target.value)} placeholder="None" className="input" />
              </FormField>
            </div>
            <div className="mt-4">
              <FormField label="Trainer Assignment">
                <Select value={form.assignedTrainerId} onChange={v => up('assignedTrainerId', v)} placeholder="Assign a trainer (optional)"
                  options={(trainers?.data || []).map(t => ({ value: t._id, label: t.name }))} />
              </FormField>
            </div>
          </Card>
        )}

        {/* Membership Tab */}
        {tab === 'membership' && (
          <Card title="Membership & Payment">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Home Branch" required>
                <Select value={form.branchId} onChange={v => up('branchId', v)} placeholder="Select branch"
                  options={(branches?.data || []).map(b => ({ value: b._id, label: b.name }))} />
              </FormField>
              <FormField label="Membership Plan">
                <Select value={form.planId} onChange={v => up('planId', v)} placeholder="Select plan (optional)"
                  options={(plans?.data || []).map(p => ({ value: p._id, label: `${p.name} — ₹${p.effectivePrice || p.price} / ${p.duration?.value} ${p.duration?.unit}` }))} />
              </FormField>
              <FormField label="Start Date">
                <input type="date" value={form.startDate} onChange={e => up('startDate', e.target.value)} className="input" />
              </FormField>
              <FormField label="Custom Price (₹)" hint="Override plan price if needed">
                <input type="number" value={form.customPrice} onChange={e => up('customPrice', e.target.value)}
                  placeholder={selectedPlan ? `Default: ₹${selectedPlan.effectivePrice || selectedPlan.price}` : 'Enter amount'} className="input" />
              </FormField>
            </div>

            {/* Plan preview */}
            {selectedPlan && (
              <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">{selectedPlan.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{selectedPlan.duration?.value} {selectedPlan.duration?.unit}</p>
                    {selectedPlan.features?.slice(0, 3).map((f, i) => <span key={i} className="text-xs text-gray-500 mr-2">✓ {f}</span>)}
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">₹{(selectedPlan.effectivePrice || selectedPlan.price).toLocaleString('en-IN')}</p>
                    {form.customPrice && <p className="text-xs text-amber-400">Custom: ₹{parseInt(form.customPrice).toLocaleString('en-IN')}</p>}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-surface-border">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Payment Details</p>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Amount Collected (₹)">
                  <input type="number" value={form.paymentAmount} onChange={e => up('paymentAmount', e.target.value)}
                    placeholder="0" className="input" />
                </FormField>
                <FormField label="Payment Method">
                  <Select value={form.paymentMethod} onChange={v => up('paymentMethod', v)} placeholder="Select method"
                    options={[{ value: 'cash', label: '💵 Cash' }, { value: 'upi', label: '📱 UPI' }, { value: 'card', label: '💳 Card' }, { value: 'netbanking', label: '🏦 Net Banking' }, { value: 'cheque', label: '📝 Cheque' }]} />
                </FormField>
              </div>
            </div>

            <div className="mt-4">
              <FormField label="Notes">
                <textarea rows={3} value={form.notes} onChange={e => up('notes', e.target.value)}
                  placeholder="Any additional notes about this member..." className="input resize-none" />
              </FormField>
            </div>
          </Card>
        )}

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-2">
            {tab !== 'personal' && <button type="button" onClick={() => setTab(tab === 'health' ? 'personal' : 'health')} className="btn-secondary text-sm">← Previous</button>}
            {tab !== 'membership' && <button type="button" onClick={() => setTab(tab === 'personal' ? 'health' : 'membership')} className="btn-secondary text-sm">Next →</button>}
          </div>
          <button type="submit" disabled={mutation.isPending} className="btn-primary flex items-center gap-2">
            {mutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Add Member
          </button>
        </div>
      </form>
    </div>
  );
}
