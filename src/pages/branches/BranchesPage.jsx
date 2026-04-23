import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { branchAPI } from '../../services/api';
import { PageHeader, Modal, FormField, Card } from '../../components/ui';
import { Plus, Building2, Loader2, MapPin, Phone, Users, UserCog, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const INDIAN_STATES = ['Andhra Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Jammu & Kashmir','Chandigarh'];

const FACILITIES = ['cardio', 'weights', 'pool', 'sauna', 'yoga_studio', 'crossfit', 'boxing', 'parking', 'locker', 'shower', 'cafe', 'physiotherapy'];

const facilityIcons = { cardio: '🏃', weights: '🏋️', pool: '🏊', sauna: '🧖', yoga_studio: '🧘', crossfit: '⚡', boxing: '🥊', parking: '🅿️', locker: '🔒', shower: '🚿', cafe: '☕', physiotherapy: '🩺' };

export default function BranchesPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    address: { street: '', city: '', state: 'Maharashtra', pincode: '', landmark: '' },
    facilities: [], maxCapacity: 100,
    operatingHours: {
      monday: { open: '06:00', close: '22:00', isClosed: false },
      tuesday: { open: '06:00', close: '22:00', isClosed: false },
      wednesday: { open: '06:00', close: '22:00', isClosed: false },
      thursday: { open: '06:00', close: '22:00', isClosed: false },
      friday: { open: '06:00', close: '22:00', isClosed: false },
      saturday: { open: '06:00', close: '20:00', isClosed: false },
      sunday: { open: '08:00', close: '14:00', isClosed: true },
    }
  });

  const up = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const upAddr = (k, v) => setForm(f => ({ ...f, address: { ...f.address, [k]: v } }));
  const toggleFacility = (f) => setForm(prev => ({
    ...prev,
    facilities: prev.facilities.includes(f)
      ? prev.facilities.filter(x => x !== f)
      : [...prev.facilities, f]
  }));

  const { data, isLoading } = useQuery({ queryKey: ['branches'], queryFn: () => branchAPI.getAll() });

  const openCreate = () => {
    setEditId(null);
    setForm({ name: '', phone: '', email: '', address: { street: '', city: '', state: 'Maharashtra', pincode: '', landmark: '' }, facilities: [], maxCapacity: 100 });
    setModal(true);
  };

  const mutation = useMutation({
    mutationFn: (d) => editId ? branchAPI.update(editId, d) : branchAPI.create(d),
    onSuccess: () => {
      toast.success(editId ? 'Branch updated!' : 'Branch created successfully!');
      setModal(false);
      qc.invalidateQueries(['branches']);
    }
  });

  const branches = data?.data || [];

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Branches"
        subtitle={`${branches.length} branch${branches.length !== 1 ? 'es' : ''} configured`}
        actions={
          <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={15} />Add Branch
          </button>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="card p-5"><div className="shimmer-line h-40 w-full" /></div>)}
        </div>
      ) : branches.length === 0 ? (
        <div className="text-center py-20">
          <Building2 size={48} className="mx-auto mb-4 text-gray-600" />
          <h3 className="text-white font-semibold mb-1">No branches yet</h3>
          <p className="text-gray-500 text-sm mb-4">Add your first branch to get started</p>
          <button onClick={openCreate} className="btn-primary flex items-center gap-2 mx-auto"><Plus size={14} />Add Branch</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {branches.map(branch => (
            <div key={branch._id} className="card p-5 hover:border-primary/20 transition-all duration-200 group">
              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <Building2 size={20} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display font-bold text-white truncate">{branch.name}</h3>
                    {branch.isMainBranch && (
                      <span className="badge badge-orange text-[10px] flex-shrink-0">Main</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">{branch.code}</p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-1.5 mb-4">
                {branch.address?.city && (
                  <p className="text-sm text-gray-400 flex items-center gap-2">
                    <MapPin size={13} className="text-gray-600 flex-shrink-0" />
                    {branch.address.street ? `${branch.address.street}, ` : ''}{branch.address.city}, {branch.address.state}
                    {branch.address.pincode && ` - ${branch.address.pincode}`}
                  </p>
                )}
                {branch.phone && (
                  <p className="text-sm text-gray-400 flex items-center gap-2">
                    <Phone size={13} className="text-gray-600 flex-shrink-0" />+91 {branch.phone}
                  </p>
                )}
              </div>

              {/* Facilities */}
              {branch.facilities?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {branch.facilities.slice(0, 5).map(f => (
                    <span key={f} title={f.replace(/_/g, ' ')} className="text-base">{facilityIcons[f] || '•'}</span>
                  ))}
                  {branch.facilities.length > 5 && (
                    <span className="text-xs text-gray-500 self-center">+{branch.facilities.length - 5}</span>
                  )}
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-surface-border">
                <div className="text-center">
                  <p className="text-lg font-bold text-white">{branch.stats?.activeMembers || 0}</p>
                  <p className="text-[10px] text-gray-500">Active</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-white">{branch.stats?.totalMembers || 0}</p>
                  <p className="text-[10px] text-gray-500">Total</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-white">{branch.stats?.totalStaff || 0}</p>
                  <p className="text-[10px] text-gray-500">Staff</p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => { setEditId(branch._id); setForm({ ...branch }); setModal(true); }}
                  className="btn-secondary flex-1 text-xs py-1.5"
                >Edit</button>
                <div className={`flex items-center gap-1 text-xs px-2 py-1.5 rounded-lg ${branch.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                  <CheckCircle size={11} />{branch.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>
          ))}

          {/* Add Card */}
          <button onClick={openCreate} className="card p-5 border-dashed border-2 flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-pointer min-h-[240px]">
            <div className="w-12 h-12 rounded-2xl bg-surface-card flex items-center justify-center">
              <Plus size={22} className="text-gray-500" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-400">Add New Branch</p>
              <p className="text-xs text-gray-600 mt-1">Expand your gym network</p>
            </div>
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={editId ? 'Edit Branch' : 'Add New Branch'}
        size="lg"
        footer={
          <>
            <button onClick={() => setModal(false)} className="btn-secondary">Cancel</button>
            <button onClick={() => mutation.mutate(form)} disabled={mutation.isPending} className="btn-primary flex items-center gap-2">
              {mutation.isPending ? <Loader2 size={14} className="animate-spin" /> : null}
              {editId ? 'Update Branch' : 'Create Branch'}
            </button>
          </>
        }
      >
        <div className="space-y-5">
          {/* Basic Info */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Basic Information</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <FormField label="Branch Name" required>
                  <input required value={form.name} onChange={e => up('name', e.target.value)} className="input" placeholder="e.g. Andheri West Branch" />
                </FormField>
              </div>
              <FormField label="Phone">
                <div className="flex gap-2">
                  <span className="input w-14 text-center flex-shrink-0 text-gray-400">+91</span>
                  <input value={form.phone} onChange={e => up('phone', e.target.value)} maxLength={10} className="input flex-1" />
                </div>
              </FormField>
              <FormField label="Email">
                <input type="email" value={form.email} onChange={e => up('email', e.target.value)} className="input" />
              </FormField>
              <FormField label="Max Capacity">
                <input type="number" min={1} value={form.maxCapacity} onChange={e => up('maxCapacity', parseInt(e.target.value))} className="input" />
              </FormField>
            </div>
          </div>

          {/* Address */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Address</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <input value={form.address?.street} onChange={e => upAddr('street', e.target.value)} placeholder="Street / Society / Building" className="input" />
              </div>
              <input value={form.address?.city} onChange={e => upAddr('city', e.target.value)} placeholder="City *" className="input" required />
              <select value={form.address?.state} onChange={e => upAddr('state', e.target.value)} className="input">
                {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
              </select>
              <input value={form.address?.pincode} onChange={e => upAddr('pincode', e.target.value)} placeholder="Pincode" maxLength={6} className="input" />
              <input value={form.address?.landmark} onChange={e => upAddr('landmark', e.target.value)} placeholder="Landmark (optional)" className="input" />
            </div>
          </div>

          {/* Facilities */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Facilities Available</p>
            <div className="flex flex-wrap gap-2">
              {FACILITIES.map(f => {
                const selected = form.facilities?.includes(f);
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => toggleFacility(f)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border
                      ${selected ? 'bg-primary/20 border-primary/40 text-primary' : 'bg-surface-card border-surface-border text-gray-400 hover:border-gray-500'}`}
                  >
                    <span>{facilityIcons[f]}</span>
                    {f.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
