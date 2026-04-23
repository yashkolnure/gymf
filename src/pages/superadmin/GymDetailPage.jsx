import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSuperAdminStore } from '../../context/superAdminStore';
import { superAdminAPI } from '../../services/superAdminAPI';
import toast from 'react-hot-toast';

const planColors = {
  trial:      'bg-gray-700/60 text-gray-300 border-gray-600',
  basic:      'bg-blue-500/10 text-blue-300 border-blue-500/30',
  advanced:   'bg-violet-500/10 text-violet-300 border-violet-500/30',
  enterprise: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
};

const statusColors = {
  active:    'bg-green-500/10 text-green-400 border-green-500/30',
  expired:   'bg-red-500/10 text-red-400 border-red-500/30',
  suspended: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  inactive:  'bg-gray-500/10 text-gray-400 border-gray-600',
};

const allModules = [
  { key: 'multiBranch',      label: 'Multi-Branch',       desc: 'Manage multiple gym locations' },
  { key: 'inventory',        label: 'Inventory',          desc: 'Track equipment & products' },
  { key: 'leads',            label: 'Leads & CRM',        desc: 'Manage prospective members' },
  { key: 'reports',          label: 'Advanced Reports',   desc: 'Revenue & member analytics' },
  { key: 'auditLogs',        label: 'Audit Logs',         desc: 'Track all staff actions' },
  { key: 'payroll',          label: 'Payroll',            desc: 'Staff salary management' },
  { key: 'smsNotifications', label: 'SMS Notifications',  desc: 'Send SMS to members' },
  { key: 'emailMarketing',   label: 'Email Marketing',    desc: 'Campaign emails' },
  { key: 'apiAccess',        label: 'API Access',         desc: 'Third-party integrations' },
  { key: 'whiteLabel',       label: 'White Label',        desc: 'Custom branding options' },
];

export default function GymDetailPage() {
  const { id } = useParams();
  const { token } = useSuperAdminStore();
  const navigate = useNavigate();

  const [gym, setGym] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState('');

  // Modals
  const [showAssignPlan, setShowAssignPlan] = useState(false);
  const [showExtend, setShowExtend] = useState(false);
  const [showLimits, setShowLimits] = useState(false);
  const [showSuspend, setShowSuspend] = useState(false);

  // Form states
  const [assignForm, setAssignForm] = useState({ plan: '', billingCycle: 'monthly' });
  const [extendForm, setExtendForm] = useState({ type: 'months', value: '1' });
  const [limitsForm, setLimitsForm] = useState({ maxBranches: '', maxMembers: '', maxStaff: '' });
  const [modules, setModules] = useState({});

  useEffect(() => { loadData(); }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [gymRes, plansRes] = await Promise.all([
        superAdminAPI.getGym(token, id),
        superAdminAPI.getPlans(token)
      ]);
      setGym(gymRes.data);
      setPlans(plansRes.data);

      // Init limits form
      setLimitsForm({
        maxBranches: gymRes.data.subscription?.maxBranches ?? '',
        maxMembers:  gymRes.data.subscription?.maxMembers ?? '',
        maxStaff:    gymRes.data.subscription?.maxStaff ?? '',
      });

      // Init modules from features array
      const feats = gymRes.data.subscription?.features || [];
      const modState = {};
      allModules.forEach(m => { modState[m.key] = feats.includes(m.key); });
      setModules(modState);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
  const daysLeft = gym?.subscription?.endDate
    ? Math.ceil((new Date(gym.subscription.endDate) - new Date()) / 86400000)
    : null;

  // ── Actions ──────────────────────────────────────────────────────────────

  const handleAssignPlan = async () => {
    if (!assignForm.plan) return toast.error('Select a plan');
    setSaving('plan');
    try {
      const res = await superAdminAPI.assignPlan(token, id, assignForm);
      toast.success(res.message);
      setShowAssignPlan(false);
      loadData();
    } catch (err) { toast.error(err.message); }
    finally { setSaving(''); }
  };

  const handleExtend = async () => {
    setSaving('extend');
    try {
      const body = extendForm.type === 'date'
        ? { newEndDate: extendForm.value }
        : extendForm.type === 'months'
        ? { months: Number(extendForm.value) }
        : { days: Number(extendForm.value) };
      const res = await superAdminAPI.extendSubscription(token, id, body);
      toast.success(res.message);
      setShowExtend(false);
      loadData();
    } catch (err) { toast.error(err.message); }
    finally { setSaving(''); }
  };

  const handleLimits = async () => {
    setSaving('limits');
    try {
      const res = await superAdminAPI.updateLimits(token, id, {
        maxBranches: Number(limitsForm.maxBranches),
        maxMembers:  Number(limitsForm.maxMembers),
        maxStaff:    Number(limitsForm.maxStaff),
      });
      toast.success(res.message);
      setShowLimits(false);
      loadData();
    } catch (err) { toast.error(err.message); }
    finally { setSaving(''); }
  };

  const handleModuleSave = async () => {
    setSaving('modules');
    try {
      const res = await superAdminAPI.updateModules(token, id, { features: modules });
      toast.success(res.message);
      loadData();
    } catch (err) { toast.error(err.message); }
    finally { setSaving(''); }
  };

  const handleSuspend = async () => {
    setSaving('suspend');
    try {
      const res = await superAdminAPI.suspendGym(token, id, {});
      toast.success(res.message);
      setShowSuspend(false);
      loadData();
    } catch (err) { toast.error(err.message); }
    finally { setSaving(''); }
  };

  const handleActivate = async () => {
    setSaving('activate');
    try {
      const res = await superAdminAPI.activateGym(token, id);
      toast.success(res.message);
      loadData();
    } catch (err) { toast.error(err.message); }
    finally { setSaving(''); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!gym) return <div className="p-6 text-gray-400">Gym not found</div>;

  const sub = gym.subscription || {};
  const isSuspended = sub.status === 'suspended';

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Back */}
      <button
        onClick={() => navigate('/super-admin/gyms')}
        className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Gyms
      </button>

      {/* Header Card */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-white">{gym.gymName}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${statusColors[sub.status] || ''}`}>
                {sub.status}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${planColors[sub.plan] || ''}`}>
                {sub.plan}
              </span>
            </div>
            <p className="text-gray-400 text-sm">{gym.email} · {gym.phone}</p>
            {gym.address?.city && (
              <p className="text-gray-500 text-xs mt-0.5">{gym.address.city}, {gym.address.state}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowAssignPlan(true)}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition"
            >
              Change Plan
            </button>
            <button
              onClick={() => setShowExtend(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition"
            >
              Extend Expiry
            </button>
            {isSuspended ? (
              <button
                onClick={handleActivate}
                disabled={saving === 'activate'}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition"
              >
                {saving === 'activate' ? 'Activating…' : 'Activate'}
              </button>
            ) : (
              <button
                onClick={() => setShowSuspend(true)}
                className="px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition"
              >
                Suspend
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Subscription Info */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-white font-semibold mb-4">Subscription Details</h2>
          <div className="space-y-3">
            {[
              ['Plan', <span className={`px-2 py-0.5 rounded text-xs font-semibold capitalize ${planColors[sub.plan] || ''}`}>{sub.plan}</span>],
              ['Billing Cycle', sub.billingCycle || '—'],
              ['Start Date', fmt(sub.startDate)],
              ['Expiry Date', fmt(sub.endDate)],
              ['Days Remaining', daysLeft !== null
                ? <span className={daysLeft <= 7 ? 'text-amber-400 font-bold' : daysLeft <= 30 ? 'text-yellow-400' : 'text-green-400'}>
                    {daysLeft > 0 ? `${daysLeft} days` : <span className="text-red-400">Expired</span>}
                  </span>
                : '—'
              ],
              ['Registered', fmt(gym.createdAt)],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{k}</span>
                <span className="text-white">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Owner + Stats */}
        <div className="space-y-4">
          {/* Owner */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="text-white font-semibold mb-3">Owner</h2>
            {gym.ownerDetails ? (
              <div className="space-y-2 text-sm">
                {[
                  ['Name',       gym.ownerDetails.name],
                  ['Email',      gym.ownerDetails.email],
                  ['Phone',      gym.ownerDetails.phone],
                  ['Last Login', fmt(gym.ownerDetails.lastLogin)],
                  ['Joined',     fmt(gym.ownerDetails.createdAt)],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between">
                    <span className="text-gray-400">{k}</span>
                    <span className="text-white">{v || '—'}</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-gray-500 text-sm">No owner info</p>}
          </div>

          {/* Stats */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="text-white font-semibold mb-3">Usage Stats</h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                ['Members', gym.stats?.totalMembers, sub.maxMembers === -1 ? '∞' : sub.maxMembers],
                ['Staff',   gym.staffCount,           sub.maxStaff   === -1 ? '∞' : sub.maxStaff],
                ['Branches',gym.stats?.totalBranches, sub.maxBranches === -1 ? '∞' : sub.maxBranches],
              ].map(([label, used, max]) => (
                <div key={label} className="bg-gray-800 rounded-lg p-3 text-center">
                  <p className="text-gray-400 text-xs mb-1">{label}</p>
                  <p className="text-white font-bold text-lg">{used ?? 0}</p>
                  <p className="text-gray-500 text-xs">/ {max}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Limits Override */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-white font-semibold">Custom Limits</h2>
            <p className="text-gray-500 text-xs mt-0.5">Override plan defaults for this gym specifically</p>
          </div>
          <button
            onClick={() => setShowLimits(true)}
            className="px-3 py-1.5 bg-gray-800 border border-gray-700 hover:border-violet-500 text-gray-300 hover:text-white text-sm rounded-lg transition"
          >
            Edit Limits
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            ['Max Branches', sub.maxBranches],
            ['Max Members',  sub.maxMembers],
            ['Max Staff',    sub.maxStaff],
          ].map(([label, val]) => (
            <div key={label} className="bg-gray-800/50 rounded-lg p-3">
              <p className="text-gray-400 text-xs mb-1">{label}</p>
              <p className="text-white font-semibold">{val === -1 ? 'Unlimited' : val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Module Access */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-white font-semibold">Module Access</h2>
            <p className="text-gray-500 text-xs mt-0.5">Toggle individual features for this gym</p>
          </div>
          <button
            onClick={handleModuleSave}
            disabled={saving === 'modules'}
            className="px-4 py-1.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition"
          >
            {saving === 'modules' ? 'Saving…' : 'Save Modules'}
          </button>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {allModules.map(mod => (
            <label
              key={mod.key}
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${
                modules[mod.key]
                  ? 'bg-violet-500/10 border-violet-500/40'
                  : 'bg-gray-800/40 border-gray-700/60 hover:border-gray-600'
              }`}
            >
              <div>
                <p className={`text-sm font-medium ${modules[mod.key] ? 'text-violet-300' : 'text-gray-300'}`}>
                  {mod.label}
                </p>
                <p className="text-gray-500 text-xs">{mod.desc}</p>
              </div>
              <div
                onClick={() => setModules(m => ({ ...m, [mod.key]: !m[mod.key] }))}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ml-3 ${
                  modules[mod.key] ? 'bg-violet-600' : 'bg-gray-700'
                }`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  modules[mod.key] ? 'translate-x-[18px]' : 'translate-x-[3px]'
                }`} />
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}

      {/* Assign Plan Modal */}
      {showAssignPlan && (
        <Modal title="Assign Subscription Plan" onClose={() => setShowAssignPlan(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Select Plan</label>
              <div className="grid gap-2">
                {plans.map(p => (
                  <label
                    key={p.name}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${
                      assignForm.plan === p.name
                        ? 'border-violet-500 bg-violet-500/10'
                        : 'border-gray-700 bg-gray-800/40 hover:border-gray-600'
                    }`}
                    onClick={() => setAssignForm(f => ({ ...f, plan: p.name }))}
                  >
                    <div>
                      <p className="text-white text-sm font-medium">{p.displayName}</p>
                      <p className="text-gray-500 text-xs">
                        Branches: {p.limits.maxBranches === -1 ? '∞' : p.limits.maxBranches} ·
                        Members: {p.limits.maxMembers === -1 ? '∞' : p.limits.maxMembers} ·
                        Staff: {p.limits.maxStaff === -1 ? '∞' : p.limits.maxStaff}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-violet-300 text-sm font-semibold">₹{p.pricing.monthly}/mo</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Billing Cycle</label>
              <select
                value={assignForm.billingCycle}
                onChange={e => setAssignForm(f => ({ ...f, billingCycle: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition"
              >
                <option value="monthly">Monthly</option>
                <option value="halfYearly">Half-Yearly (6 months)</option>
                <option value="yearly">Yearly (12 months)</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleAssignPlan}
                disabled={saving === 'plan'}
                className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition"
              >
                {saving === 'plan' ? 'Assigning…' : 'Assign Plan'}
              </button>
              <button onClick={() => setShowAssignPlan(false)} className="px-4 py-2.5 bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg hover:bg-gray-700 transition">
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Extend Modal */}
      {showExtend && (
        <Modal title="Extend Subscription" onClose={() => setShowExtend(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Extension Type</label>
              <select
                value={extendForm.type}
                onChange={e => setExtendForm(f => ({ ...f, type: e.target.value, value: e.target.value === 'date' ? '' : '1' }))}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition"
              >
                <option value="months">Add Months</option>
                <option value="days">Add Days</option>
                <option value="date">Set New Expiry Date</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                {extendForm.type === 'months' ? 'Number of Months'
                  : extendForm.type === 'days' ? 'Number of Days'
                  : 'New Expiry Date'}
              </label>
              <input
                type={extendForm.type === 'date' ? 'date' : 'number'}
                min={extendForm.type !== 'date' ? 1 : undefined}
                value={extendForm.value}
                onChange={e => setExtendForm(f => ({ ...f, value: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition"
              />
            </div>
            {gym.subscription?.endDate && (
              <p className="text-gray-500 text-xs">Current expiry: {fmt(gym.subscription.endDate)}</p>
            )}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleExtend}
                disabled={saving === 'extend' || !extendForm.value}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition"
              >
                {saving === 'extend' ? 'Extending…' : 'Confirm Extension'}
              </button>
              <button onClick={() => setShowExtend(false)} className="px-4 py-2.5 bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg hover:bg-gray-700 transition">
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Limits Modal */}
      {showLimits && (
        <Modal title="Override Limits" onClose={() => setShowLimits(false)}>
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">Set -1 for unlimited.</p>
            {[
              { key: 'maxBranches', label: 'Max Branches' },
              { key: 'maxMembers',  label: 'Max Members' },
              { key: 'maxStaff',    label: 'Max Staff' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm text-gray-300 mb-1.5">{label}</label>
                <input
                  type="number"
                  min={-1}
                  value={limitsForm[key]}
                  onChange={e => setLimitsForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition"
                />
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleLimits}
                disabled={saving === 'limits'}
                className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition"
              >
                {saving === 'limits' ? 'Saving…' : 'Save Limits'}
              </button>
              <button onClick={() => setShowLimits(false)} className="px-4 py-2.5 bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg hover:bg-gray-700 transition">
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Suspend Modal */}
      {showSuspend && (
        <Modal title="Suspend Gym" onClose={() => setShowSuspend(false)}>
          <div className="space-y-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-400 text-sm">
                Suspending will immediately block all gym staff and members from accessing the platform.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSuspend}
                disabled={saving === 'suspend'}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition"
              >
                {saving === 'suspend' ? 'Suspending…' : 'Yes, Suspend Gym'}
              </button>
              <button onClick={() => setShowSuspend(false)} className="px-4 py-2.5 bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg hover:bg-gray-700 transition">
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// Reusable modal wrapper
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-semibold text-lg">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-200 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
