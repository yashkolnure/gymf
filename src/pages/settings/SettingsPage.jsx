import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantAPI, authAPI } from '../../services/api';
import { useAuthStore } from '../../context/authStore';
import { PageHeader, Card, FormField, Tabs } from '../../components/ui';
import { Save, Loader2, Building2, Settings2, Bell, Shield, CreditCard, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const INDIAN_STATES = ['Maharashtra','Gujarat','Karnataka','Tamil Nadu','Telangana','Delhi','Uttar Pradesh','Rajasthan','Punjab','Kerala','West Bengal','Madhya Pradesh','Andhra Pradesh','Bihar','Haryana','Goa','Assam','Others'];

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const qc = useQueryClient();
  const [tab, setTab] = useState('gym');
  const [showPw, setShowPw] = useState(false);

  const { data, isLoading } = useQuery({ queryKey: ['my-tenant'], queryFn: () => tenantAPI.getMy() });
  const gym = data?.data;

  // Gym info form
  const [gymForm, setGymForm] = useState({});
  const upG = (k, v) => setGymForm(f => ({ ...f, [k]: v }));
  const upGAddr = (k, v) => setGymForm(f => ({ ...f, address: { ...f.address, [k]: v } }));

  // Settings form
  const [settingsForm, setSettingsForm] = useState({});
  const upS = (k, v) => setSettingsForm(f => ({ ...f, settings: { ...(f.settings || {}), [k]: v } }));

  // Branding form
  const [brandForm, setBrandForm] = useState({});
  const upB = (k, v) => setBrandForm(f => ({ ...f, branding: { ...(f.branding || {}), [k]: v } }));

  // Password form
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  // Profile form
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '' });

  // Pre-fill forms when data loads
  useEffect(() => {
    if (gym) {
      setGymForm({ gymName: gym.gymName, phone: gym.phone, whatsapp: gym.whatsapp, email: gym.email, address: gym.address || {} });
      setSettingsForm({ settings: gym.settings || {} });
      setBrandForm({ branding: gym.branding || {} });
    }
  }, [gym]);

  const gymMutation = useMutation({
    mutationFn: () => tenantAPI.updateGymInfo(gymForm),
    onSuccess: () => { toast.success('Gym info updated!'); qc.invalidateQueries(['my-tenant']); }
  });

  const settingsMutation = useMutation({
    mutationFn: () => tenantAPI.updateSettings(settingsForm),
    onSuccess: () => { toast.success('Settings saved!'); qc.invalidateQueries(['my-tenant']); }
  });

  const brandingMutation = useMutation({
    mutationFn: () => tenantAPI.updateSettings(brandForm),
    onSuccess: () => { toast.success('Branding updated!'); qc.invalidateQueries(['my-tenant']); }
  });

  const profileMutation = useMutation({
    mutationFn: () => authAPI.updateProfile(profileForm),
    onSuccess: (res) => { toast.success('Profile updated!'); updateUser(res.data); }
  });

  const passwordMutation = useMutation({
    mutationFn: () => authAPI.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
    onSuccess: () => { toast.success('Password changed!'); setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); }
  });

  const PLAN_FEATURES = {
    trial: { maxBranches: 1, maxMembers: 100, maxStaff: 5, price: 'Free' },
    basic: { maxBranches: 1, maxMembers: 500, maxStaff: 10, price: '₹999/mo' },
    professional: { maxBranches: 5, maxMembers: 2000, maxStaff: 50, price: '₹2,999/mo' },
    enterprise: { maxBranches: 'Unlimited', maxMembers: 'Unlimited', maxStaff: 'Unlimited', price: 'Custom' },
  };

  const currentPlanFeatures = PLAN_FEATURES[gym?.subscription?.plan] || PLAN_FEATURES.trial;

  return (
    <div className="space-y-5 max-w-3xl animate-fade-in">
      <PageHeader title="Settings" subtitle="Manage your gym configuration & preferences" />

      <Tabs
        tabs={[
          { value: 'gym', label: '🏢 Gym Info' },
          { value: 'settings', label: '⚙️ Configuration' },
          { value: 'branding', label: '🎨 Branding' },
          { value: 'profile', label: '👤 My Profile' },
          { value: 'subscription', label: '💳 Plan' },
        ]}
        active={tab}
        onChange={setTab}
      />

      {/* ─── GYM INFO ────────────────────────────────────────────────── */}
      {tab === 'gym' && (
        <Card title="Gym Information">
          {isLoading ? <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="shimmer-line h-10 w-full" />)}</div> : (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <FormField label="Gym Name" required>
                    <input value={gymForm.gymName || ''} onChange={e => upG('gymName', e.target.value)} className="input" placeholder="Power Zone Fitness" />
                  </FormField>
                </div>
                <FormField label="Contact Phone">
                  <div className="flex gap-2">
                    <span className="input w-14 text-center flex-shrink-0 text-gray-400">+91</span>
                    <input value={gymForm.phone || ''} onChange={e => upG('phone', e.target.value)} maxLength={10} className="input flex-1" />
                  </div>
                </FormField>
                <FormField label="WhatsApp">
                  <div className="flex gap-2">
                    <span className="input w-14 text-center flex-shrink-0 text-gray-400">+91</span>
                    <input value={gymForm.whatsapp || ''} onChange={e => upG('whatsapp', e.target.value)} maxLength={10} className="input flex-1" />
                  </div>
                </FormField>
                <FormField label="Business Email">
                  <input type="email" value={gymForm.email || ''} onChange={e => upG('email', e.target.value)} className="input" />
                </FormField>
                <FormField label="GST Number">
                  <input value={gymForm.gstNumber || ''} onChange={e => upG('gstNumber', e.target.value)} className="input" placeholder="27XXXXX1234X1ZX" />
                </FormField>
              </div>

              <div className="pt-4 border-t border-surface-border">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Gym Address</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <input value={gymForm.address?.street || ''} onChange={e => upGAddr('street', e.target.value)} placeholder="Street / Society / Building" className="input" />
                  </div>
                  <input value={gymForm.address?.city || ''} onChange={e => upGAddr('city', e.target.value)} placeholder="City" className="input" />
                  <select value={gymForm.address?.state || 'Maharashtra'} onChange={e => upGAddr('state', e.target.value)} className="input">
                    {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                  <input value={gymForm.address?.pincode || ''} onChange={e => upGAddr('pincode', e.target.value)} placeholder="Pincode" maxLength={6} className="input" />
                </div>
              </div>

              <button onClick={() => gymMutation.mutate()} disabled={gymMutation.isPending} className="btn-primary flex items-center gap-2">
                {gymMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Save Gym Info
              </button>
            </div>
          )}
        </Card>
      )}

      {/* ─── CONFIGURATION ───────────────────────────────────────────── */}
      {tab === 'settings' && (
        <Card title="System Configuration">
          <div className="space-y-6">
            {/* Alerts */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2"><Bell size={12} />Alert Settings</p>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Expiry Alert (days before)" hint="Notify members X days before expiry">
                  <input type="number" min={1} max={30}
                    value={settingsForm.settings?.expiryAlertDays || 7}
                    onChange={e => upS('expiryAlertDays', parseInt(e.target.value))}
                    className="input" />
                </FormField>
                <FormField label="Inactivity Alert (days)" hint="Flag member if no visit in X days">
                  <input type="number" min={1} max={60}
                    value={settingsForm.settings?.inactivityAlertDays || 7}
                    onChange={e => upS('inactivityAlertDays', parseInt(e.target.value))}
                    className="input" />
                </FormField>
              </div>
            </div>

            {/* Toggles */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2"><Settings2 size={12} />Automation</p>
              <div className="space-y-3">
                {[
                  { key: 'autoExpireMembers', label: 'Auto-expire memberships', hint: 'Automatically mark memberships expired after end date', default: true },
                  { key: 'allowInterBranchAccess', label: 'Inter-branch access', hint: 'Allow members to check in at any branch', default: false },
                ].map(({ key, label, hint, default: def }) => (
                  <label key={key} className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-surface-border hover:border-primary/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={settingsForm.settings?.[key] ?? def}
                      onChange={e => upS(key, e.target.checked)}
                      className="w-4 h-4 accent-primary mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <p className="text-sm font-medium text-white">{label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{hint}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* GST */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">GST / Tax Settings</p>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={settingsForm.settings?.gstEnabled || false}
                    onChange={e => upS('gstEnabled', e.target.checked)} className="w-4 h-4 accent-primary" />
                  <span className="text-sm text-gray-300">Enable GST on invoices</span>
                </label>
                {settingsForm.settings?.gstEnabled && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Rate:</span>
                    <input type="number" value={settingsForm.settings?.gstRate || 18}
                      onChange={e => upS('gstRate', parseFloat(e.target.value))}
                      className="input w-20 py-1" min={0} max={28} />
                    <span className="text-sm text-gray-400">%</span>
                  </div>
                )}
              </div>
            </div>

            <button onClick={() => settingsMutation.mutate()} disabled={settingsMutation.isPending} className="btn-primary flex items-center gap-2">
              {settingsMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Save Configuration
            </button>
          </div>
        </Card>
      )}

      {/* ─── BRANDING ────────────────────────────────────────────────── */}
      {tab === 'branding' && (
        <Card title="Branding & Customization">
          <div className="space-y-5">
            <FormField label="Gym Tagline" hint="Shown in member communications">
              <input value={brandForm.branding?.tagline || ''} onChange={e => upB('tagline', e.target.value)}
                className="input" placeholder="Train Hard. Live Strong." />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Primary Color">
                <div className="flex gap-3 items-center">
                  <input type="color" value={brandForm.branding?.primaryColor || '#FF6B35'}
                    onChange={e => upB('primaryColor', e.target.value)}
                    className="w-12 h-10 rounded-lg border border-surface-border bg-transparent cursor-pointer" />
                  <input value={brandForm.branding?.primaryColor || '#FF6B35'}
                    onChange={e => upB('primaryColor', e.target.value)}
                    className="input flex-1 font-mono" placeholder="#FF6B35" />
                </div>
              </FormField>
              <FormField label="Secondary Color">
                <div className="flex gap-3 items-center">
                  <input type="color" value={brandForm.branding?.secondaryColor || '#1A1A2E'}
                    onChange={e => upB('secondaryColor', e.target.value)}
                    className="w-12 h-10 rounded-lg border border-surface-border bg-transparent cursor-pointer" />
                  <input value={brandForm.branding?.secondaryColor || '#1A1A2E'}
                    onChange={e => upB('secondaryColor', e.target.value)}
                    className="input flex-1 font-mono" placeholder="#1A1A2E" />
                </div>
              </FormField>
            </div>

            {/* Preview */}
            <div className="p-4 rounded-xl border border-surface-border bg-surface-card/30">
              <p className="text-xs text-gray-500 mb-3">Preview</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: brandForm.branding?.primaryColor || '#FF6B35' }}>
                  <Building2 size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-white">{gym?.gymName || 'Your Gym'}</p>
                  <p className="text-xs text-gray-400">{brandForm.branding?.tagline || 'Your tagline here'}</p>
                </div>
                <div className="ml-auto px-4 py-1.5 rounded-lg text-white text-sm font-medium"
                  style={{ background: brandForm.branding?.primaryColor || '#FF6B35' }}>
                  Button
                </div>
              </div>
            </div>

            <button onClick={() => brandingMutation.mutate()} disabled={brandingMutation.isPending} className="btn-primary flex items-center gap-2">
              {brandingMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Save Branding
            </button>
          </div>
        </Card>
      )}

      {/* ─── MY PROFILE ──────────────────────────────────────────────── */}
      {tab === 'profile' && (
        <div className="space-y-5">
          <Card title="Profile Information">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <div className="flex items-center gap-4 mb-4 p-4 bg-surface-card/50 rounded-xl border border-surface-border">
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-white">{user?.name}</p>
                    <p className="text-sm text-gray-400">{user?.email}</p>
                    <span className="badge badge-orange text-[10px] mt-1">{user?.role?.replace(/_/g, ' ')}</span>
                  </div>
                </div>
              </div>
              <FormField label="Full Name">
                <input value={profileForm.name} onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))} className="input" />
              </FormField>
              <FormField label="Phone">
                <div className="flex gap-2">
                  <span className="input w-14 text-center flex-shrink-0 text-gray-400">+91</span>
                  <input value={profileForm.phone} onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))} maxLength={10} className="input flex-1" />
                </div>
              </FormField>
            </div>
            <button onClick={() => profileMutation.mutate()} disabled={profileMutation.isPending} className="btn-primary flex items-center gap-2 mt-4">
              {profileMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}Update Profile
            </button>
          </Card>

          <Card title="Change Password">
            <div className="space-y-4">
              <FormField label="Current Password">
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={pwForm.currentPassword}
                    onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
                    className="input pr-10" placeholder="Enter current password" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="New Password" hint="Min. 8 characters">
                  <input type="password" value={pwForm.newPassword}
                    onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
                    className="input" placeholder="New password" minLength={8} />
                </FormField>
                <FormField label="Confirm Password">
                  <input type="password" value={pwForm.confirmPassword}
                    onChange={e => setPwForm(f => ({ ...f, confirmPassword: e.target.value }))}
                    className={`input ${pwForm.confirmPassword && pwForm.confirmPassword !== pwForm.newPassword ? 'border-red-500/50' : ''}`}
                    placeholder="Confirm new password" />
                  {pwForm.confirmPassword && pwForm.confirmPassword !== pwForm.newPassword && (
                    <p className="text-xs text-red-400 mt-1">Passwords don't match</p>
                  )}
                </FormField>
              </div>
              <button
                onClick={() => {
                  if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error("Passwords don't match"); return; }
                  if (pwForm.newPassword.length < 8) { toast.error('Min 8 characters required'); return; }
                  passwordMutation.mutate();
                }}
                disabled={passwordMutation.isPending}
                className="btn-primary flex items-center gap-2"
              >
                {passwordMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Shield size={14} />}
                Change Password
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* ─── SUBSCRIPTION ────────────────────────────────────────────── */}
      {tab === 'subscription' && (
        <div className="space-y-4">
          <Card title="Current Plan">
            <div className="flex items-center justify-between mb-6 p-4 bg-primary/5 border border-primary/20 rounded-xl">
              <div>
                <p className="text-sm text-gray-400">Active Plan</p>
                <p className="text-2xl font-display font-bold text-primary capitalize">{gym?.subscription?.plan || 'Trial'}</p>
              </div>
              <div className="text-right">
                <span className={`badge ${gym?.subscription?.status === 'active' ? 'badge-green' : 'badge-red'}`}>
                  {gym?.subscription?.status}
                </span>
                <p className="text-xs text-gray-400 mt-1">
                  Until {gym?.subscription?.endDate ? new Date(gym.subscription.endDate).toLocaleDateString('en-IN') : '—'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: 'Branches', value: currentPlanFeatures.maxBranches },
                { label: 'Members', value: currentPlanFeatures.maxMembers },
                { label: 'Staff', value: currentPlanFeatures.maxStaff },
              ].map(({ label, value }) => (
                <div key={label} className="text-center p-3 bg-surface-card/50 rounded-xl border border-surface-border">
                  <p className="text-lg font-bold text-white">{value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Upgrade Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: 'basic', name: 'Basic', price: '₹999', period: '/month', color: '#6366f1', features: ['1 Branch', '500 Members', '10 Staff', 'All core features', 'Email support'] },
              { id: 'professional', name: 'Professional', price: '₹2,999', period: '/month', color: '#FF6B35', popular: true, features: ['5 Branches', '2000 Members', '50 Staff', 'Mobile App', 'Priority support', 'SMS alerts'] },
              { id: 'enterprise', name: 'Enterprise', price: 'Custom', period: '', color: '#10b981', features: ['Unlimited branches', 'Unlimited members', 'White-label', 'API access', 'Dedicated support'] },
            ].map(plan => (
              <div key={plan.id} className={`card p-5 relative ${plan.popular ? 'border-primary/40' : ''}`} style={{ borderColor: plan.popular ? plan.color + '50' : undefined }}>
                {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 badge badge-orange text-[10px]">Most Popular</div>}
                <p className="font-display font-bold text-white text-lg">{plan.name}</p>
                <div className="mt-2 mb-4">
                  <span className="text-2xl font-bold" style={{ color: plan.color }}>{plan.price}</span>
                  <span className="text-gray-400 text-sm">{plan.period}</span>
                </div>
                <div className="space-y-1.5 mb-5">
                  {plan.features.map((f, i) => (
                    <p key={i} className="text-xs text-gray-400 flex items-center gap-1.5">
                      <span className="text-emerald-400">✓</span>{f}
                    </p>
                  ))}
                </div>
                <button className={`w-full text-sm py-2 rounded-lg font-medium transition-colors ${gym?.subscription?.plan === plan.id ? 'bg-surface-card/50 text-gray-400 cursor-default border border-surface-border' : 'text-white'}`}
                  style={{ background: gym?.subscription?.plan !== plan.id ? plan.color : undefined }}
                  disabled={gym?.subscription?.plan === plan.id}
                >
                  {gym?.subscription?.plan === plan.id ? 'Current Plan' : 'Upgrade'}
                </button>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500 text-center">Contact <span className="text-primary">support@gymproindia.in</span> for enterprise pricing or custom plans</p>
        </div>
      )}
    </div>
  );
}
