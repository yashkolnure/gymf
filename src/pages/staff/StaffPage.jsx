import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffAPI, branchAPI } from '../../services/api';
import { PageHeader, Card, Modal, FormField, Select, Avatar, StatusBadge, Tabs } from '../../components/ui';
import { Plus, Loader2, UserCog, Edit, Shield, CheckCircle, XCircle, Phone, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const ROLES = [
  { value: 'branch_manager', label: 'Branch Manager', color: 'badge-blue', desc: 'Manages branch operations' },
  { value: 'receptionist', label: 'Receptionist', color: 'badge-gray', desc: 'Front desk and member management' },
  { value: 'trainer', label: 'Trainer', color: 'badge-green', desc: 'Fitness trainer / PT' },
];

const emptyForm = {
  name: '', email: '', phone: '', password: '', gender: '',
  role: 'receptionist', branch: '', permissions: []
};

export default function StaffPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState('list');
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editStaff, setEditStaff] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const up = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const { data: staffData, isLoading } = useQuery({ queryKey: ['staff'], queryFn: () => staffAPI.getAll() });
  const { data: branches } = useQuery({ queryKey: ['branches'], queryFn: () => branchAPI.getAll() });
  const { data: permData } = useQuery({ queryKey: ['permissions'], queryFn: () => staffAPI.getPermissions() });

  const allPermissions = permData?.data?.permissions || [];
  const roleDefaults = permData?.data?.roleDefaults || {};

  // Group permissions for display
  const permissionGroups = allPermissions.reduce((acc, p) => {
    if (!acc[p.group]) acc[p.group] = [];
    acc[p.group].push(p);
    return acc;
  }, {});

  const togglePermission = (key, currentPerms, setter) => {
    setter(f => ({
      ...f,
      permissions: f.permissions.includes(key)
        ? f.permissions.filter(p => p !== key)
        : [...f.permissions, key]
    }));
  };

  const applyRoleDefaults = (role) => {
    const defaults = roleDefaults[role] || [];
    setForm(f => ({ ...f, role, permissions: defaults }));
  };

  const createMutation = useMutation({
    mutationFn: (d) => staffAPI.create(d),
    onSuccess: (res) => {
      toast.success(res.message || 'Staff added!');
      setModal(false);
      setForm(emptyForm);
      qc.invalidateQueries(['staff']);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => staffAPI.update(id, data),
    onSuccess: () => { toast.success('Staff updated!'); setEditModal(false); qc.invalidateQueries(['staff']); }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => staffAPI.delete(id),
    onSuccess: (res) => { toast.success(res.message); qc.invalidateQueries(['staff']); }
  });

  const openEdit = (staff) => {
    setEditStaff(staff);
    setEditModal(true);
  };

  const staff = staffData?.data || [];
  const roleCount = (role) => staff.filter(s => s.role === role).length;

  const PermissionMatrix = ({ permissions, onChange }) => (
    <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
      {Object.entries(permissionGroups).map(([group, perms]) => (
        <div key={group}>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{group}</p>
          <div className="grid grid-cols-2 gap-1.5">
            {perms.map(perm => {
              const checked = permissions.includes(perm.key);
              return (
                <label key={perm.key} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all text-xs
                  ${checked ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-surface-card/50 border-surface-border text-gray-400 hover:border-gray-500'}`}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onChange(perm.key)}
                    className="w-3.5 h-3.5 accent-primary flex-shrink-0"
                  />
                  {perm.label}
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Staff Management"
        subtitle={`${staff.length} staff members`}
        actions={
          <button onClick={() => { setForm(emptyForm); setModal(true); }} className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={15} />Add Staff
          </button>
        }
      />

      {/* Role summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {ROLES.map(r => (
          <div key={r.value} className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-card border border-surface-border flex items-center justify-center flex-shrink-0">
              <UserCog size={18} className="text-gray-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{roleCount(r.value)}</p>
              <p className="text-xs text-gray-400">{r.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Staff List */}
      <Card noPadding>
        {isLoading ? (
          <div className="p-8 space-y-3">{[1,2,3].map(i => <div key={i} className="shimmer-line h-16 w-full" />)}</div>
        ) : staff.length === 0 ? (
          <div className="text-center py-16">
            <UserCog size={40} className="mx-auto mb-3 text-gray-600" />
            <p className="text-white font-semibold mb-1">No staff members yet</p>
            <p className="text-gray-500 text-sm mb-4">Add your first staff member to get started</p>
            <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-2 mx-auto"><Plus size={14} />Add Staff</button>
          </div>
        ) : (
          <div className="divide-y divide-surface-border">
            {staff.map(s => (
              <div key={s._id} className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors group">
                <div className="flex items-center gap-3">
                  <Avatar name={s.name} photo={s.avatar} size="md" />
                  <div>
                    <p className="text-sm font-semibold text-white">{s.name}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className={`badge text-[10px] ${ROLES.find(r => r.value === s.role)?.color || 'badge-gray'}`}>
                        {s.role?.replace(/_/g, ' ')}
                      </span>
                      {s.branch && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Building2 size={10} />{s.branch.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Permission count */}
                  <div className="hidden md:flex items-center gap-1.5">
                    <Shield size={13} className="text-gray-500" />
                    <span className="text-xs text-gray-400">{s.permissions?.length || 0} permissions</span>
                  </div>

                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
                    <Phone size={12} />{s.phone}
                  </div>

                  {s.isActive
                    ? <span className="badge badge-green text-[10px]">Active</span>
                    : <span className="badge badge-red text-[10px]">Inactive</span>
                  }

                  {/* Actions */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(s)} className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1">
                      <Edit size={12} />Edit
                    </button>
                    <button
                      onClick={() => { if (confirm(`Deactivate ${s.name}?`)) deleteMutation.mutate(s._id); }}
                      className="btn-danger text-xs py-1.5 px-3"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ─── Add Staff Modal ─────────────────────────────────────────── */}
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="Add Staff Member"
        size="xl"
        footer={
          <>
            <button onClick={() => setModal(false)} className="btn-secondary">Cancel</button>
            <button onClick={() => createMutation.mutate(form)} disabled={createMutation.isPending} className="btn-primary flex items-center gap-2">
              {createMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Add Staff
            </button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-6">
          {/* Left: Basic Info */}
          <div className="space-y-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Basic Information</p>

            <FormField label="Full Name" required>
              <input required value={form.name} onChange={e => up('name', e.target.value)} className="input" placeholder="Priya Sharma" autoFocus />
            </FormField>

            <FormField label="Email" required>
              <input type="email" required value={form.email} onChange={e => up('email', e.target.value)} className="input" placeholder="priya@gym.com" />
            </FormField>

            <FormField label="Phone" required>
              <div className="flex gap-2">
                <span className="input w-14 text-center flex-shrink-0 text-gray-400">+91</span>
                <input required maxLength={10} value={form.phone} onChange={e => up('phone', e.target.value)} className="input flex-1" placeholder="9876543210" />
              </div>
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Gender">
                <Select value={form.gender} onChange={v => up('gender', v)} placeholder="Select" options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' }]} />
              </FormField>
              <FormField label="Password" hint="Default: Gym@XXXX">
                <input type="password" value={form.password} onChange={e => up('password', e.target.value)} className="input" placeholder="Auto-generated" />
              </FormField>
            </div>

            <FormField label="Role" required>
              <div className="space-y-2">
                {ROLES.map(r => (
                  <label key={r.value} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all
                    ${form.role === r.value ? 'bg-primary/10 border-primary/40' : 'border-surface-border hover:border-gray-500'}`}>
                    <input
                      type="radio"
                      checked={form.role === r.value}
                      onChange={() => applyRoleDefaults(r.value)}
                      className="mt-0.5 accent-primary"
                    />
                    <div>
                      <p className="text-sm font-semibold text-white">{r.label}</p>
                      <p className="text-xs text-gray-400">{r.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </FormField>

            <FormField label="Branch" required>
              <Select
                value={form.branch}
                onChange={v => up('branch', v)}
                placeholder="Select branch"
                options={(branches?.data || []).map(b => ({ value: b._id, label: b.name }))}
              />
            </FormField>
          </div>

          {/* Right: Permissions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Shield size={12} />Permissions
              </p>
              <div className="flex gap-2">
                <button type="button" onClick={() => up('permissions', roleDefaults[form.role] || [])} className="text-xs text-primary hover:underline">
                  Reset to defaults
                </button>
                <span className="text-gray-600">|</span>
                <button type="button" onClick={() => up('permissions', allPermissions.map(p => p.key))} className="text-xs text-gray-400 hover:text-white">
                  Select all
                </button>
                <span className="text-gray-600">|</span>
                <button type="button" onClick={() => up('permissions', [])} className="text-xs text-gray-400 hover:text-white">
                  Clear all
                </button>
              </div>
            </div>

            <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl mb-3">
              <p className="text-xs text-amber-400">
                <strong>⚠️ Important:</strong> Permissions are scoped to the staff's assigned branch only. They cannot access other branches' data regardless of permissions.
              </p>
            </div>

            <PermissionMatrix
              permissions={form.permissions}
              onChange={(key) => togglePermission(key, form.permissions, setForm)}
            />

            <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
              <Shield size={11} />
              {form.permissions.length} of {allPermissions.length} permissions selected
            </p>
          </div>
        </div>
      </Modal>

      {/* ─── Edit Staff Modal ─────────────────────────────────────────── */}
      {editStaff && (
        <Modal
          open={editModal}
          onClose={() => setEditModal(false)}
          title={`Edit — ${editStaff.name}`}
          size="xl"
          footer={
            <>
              <button onClick={() => setEditModal(false)} className="btn-secondary">Cancel</button>
              <button
                onClick={() => updateMutation.mutate({ id: editStaff._id, data: editStaff })}
                disabled={updateMutation.isPending}
                className="btn-primary flex items-center gap-2"
              >
                {updateMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : null}
                Save Changes
              </button>
            </>
          }
        >
          <div className="grid grid-cols-2 gap-6">
            {/* Left: basic */}
            <div className="space-y-4">
              <FormField label="Full Name">
                <input value={editStaff.name} onChange={e => setEditStaff(s => ({ ...s, name: e.target.value }))} className="input" />
              </FormField>
              <FormField label="Phone">
                <div className="flex gap-2">
                  <span className="input w-14 text-center flex-shrink-0 text-gray-400">+91</span>
                  <input maxLength={10} value={editStaff.phone} onChange={e => setEditStaff(s => ({ ...s, phone: e.target.value }))} className="input flex-1" />
                </div>
              </FormField>
              <FormField label="Branch">
                <Select
                  value={editStaff.branch?._id || editStaff.branch}
                  onChange={v => setEditStaff(s => ({ ...s, branch: v }))}
                  options={(branches?.data || []).map(b => ({ value: b._id, label: b.name }))}
                />
              </FormField>
              <FormField label="Status">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editStaff.isActive}
                    onChange={e => setEditStaff(s => ({ ...s, isActive: e.target.checked }))}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm text-gray-300">Active (uncheck to deactivate)</span>
                </label>
              </FormField>

              {/* Current permissions summary */}
              <div className="mt-4 p-3 bg-surface-card/50 rounded-xl border border-surface-border">
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Current Access Summary</p>
                <div className="space-y-1">
                  {Object.entries(permissionGroups).map(([group, perms]) => {
                    const grantedCount = perms.filter(p => editStaff.permissions?.includes(p.key)).length;
                    if (grantedCount === 0) return null;
                    return (
                      <div key={group} className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">{group}</span>
                        <span className="text-primary font-medium">{grantedCount}/{perms.length}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: permissions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield size={12} />Edit Permissions
                </p>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setEditStaff(s => ({ ...s, permissions: roleDefaults[s.role] || [] }))} className="text-xs text-primary hover:underline">Defaults</button>
                  <span className="text-gray-600">|</span>
                  <button type="button" onClick={() => setEditStaff(s => ({ ...s, permissions: [] }))} className="text-xs text-gray-400 hover:text-white">Clear</button>
                </div>
              </div>
              <PermissionMatrix
                permissions={editStaff.permissions || []}
                onChange={(key) => setEditStaff(s => ({
                  ...s,
                  permissions: s.permissions?.includes(key)
                    ? s.permissions.filter(p => p !== key)
                    : [...(s.permissions || []), key]
                }))}
              />
              <p className="text-xs text-gray-500 mt-3">{editStaff.permissions?.length || 0} permissions active</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
