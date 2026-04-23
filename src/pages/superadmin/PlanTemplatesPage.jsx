import { useState, useEffect } from 'react';
import { useSuperAdminStore } from '../../context/superAdminStore';
import { superAdminAPI } from '../../services/superAdminAPI';
import toast from 'react-hot-toast';

const featureKeys = [
  { key: 'multiBranch',      label: 'Multi-Branch' },
  { key: 'inventory',        label: 'Inventory' },
  { key: 'leads',            label: 'Leads & CRM' },
  { key: 'reports',          label: 'Reports' },
  { key: 'auditLogs',        label: 'Audit Logs' },
  { key: 'payroll',          label: 'Payroll' },
  { key: 'smsNotifications', label: 'SMS Notif.' },
  { key: 'emailMarketing',   label: 'Email Mktg' },
  { key: 'apiAccess',        label: 'API Access' },
  { key: 'whiteLabel',       label: 'White Label' },
];

const planGradients = {
  basic:      'from-blue-600/20 to-blue-500/5 border-blue-500/30',
  advanced:   'from-violet-600/20 to-violet-500/5 border-violet-500/30',
  enterprise: 'from-amber-600/20 to-amber-500/5 border-amber-500/30',
};

export default function PlanTemplatesPage() {
  const { token } = useSuperAdminStore();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editPlan, setEditPlan] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadPlans(); }, []);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const res = await superAdminAPI.getPlans(token);
      setPlans(res.data);
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  const openEdit = (plan) => {
    setEditPlan(plan);
    setForm({
      displayName: plan.displayName,
      description: plan.description || '',
      pricing: { ...plan.pricing },
      limits:  { ...plan.limits },
      features: { ...plan.features },
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await superAdminAPI.updatePlan(token, editPlan.name, form);
      toast.success(res.message || 'Plan updated');
      setEditPlan(null);
      loadPlans();
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const setField = (path, val) => {
    setForm(f => {
      const parts = path.split('.');
      if (parts.length === 1) return { ...f, [path]: val };
      return { ...f, [parts[0]]: { ...f[parts[0]], [parts[1]]: val } };
    });
  };

  if (loading) return (
    <div className="flex items-center justify-center h-60">
      <div className="w-7 h-7 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Plan Templates</h1>
        <p className="text-gray-400 text-sm mt-1">
          Configure default pricing, limits, and features for each subscription tier.
          Changes here affect new assignments; existing subscribers retain their current limits unless manually updated.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {plans.map(plan => (
          <div
            key={plan.name}
            className={`bg-gradient-to-b ${planGradients[plan.name] || 'from-gray-800/40 to-gray-900 border-gray-700'} border rounded-2xl p-6 flex flex-col`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-white font-bold text-lg">{plan.displayName}</h3>
                <p className="text-gray-400 text-xs mt-0.5">{plan.description}</p>
              </div>
              <button
                onClick={() => openEdit(plan)}
                className="text-xs px-3 py-1.5 bg-gray-800/80 hover:bg-gray-700 border border-gray-700 text-gray-300 hover:text-white rounded-lg transition"
              >
                Edit
              </button>
            </div>

            {/* Pricing */}
            <div className="bg-black/20 rounded-xl p-4 mb-4 space-y-2">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-2">Pricing (INR)</p>
              {[
                ['Monthly',     plan.pricing.monthly],
                ['Half-Yearly', plan.pricing.halfYearly],
                ['Yearly',      plan.pricing.yearly],
              ].map(([label, price]) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{label}</span>
                  <span className="text-white font-medium">₹{price?.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            {/* Limits */}
            <div className="flex gap-3 mb-4">
              {[
                ['Branches', plan.limits.maxBranches],
                ['Members',  plan.limits.maxMembers],
                ['Staff',    plan.limits.maxStaff],
              ].map(([l, v]) => (
                <div key={l} className="flex-1 bg-black/20 rounded-lg p-2.5 text-center">
                  <p className="text-gray-500 text-xs">{l}</p>
                  <p className="text-white font-bold text-sm mt-0.5">{v === -1 ? '∞' : v}</p>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="flex-1">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-2">Features</p>
              <div className="flex flex-wrap gap-1.5">
                {featureKeys.map(fk => (
                  <span
                    key={fk.key}
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      plan.features[fk.key]
                        ? 'bg-green-500/15 text-green-400'
                        : 'bg-gray-800 text-gray-600'
                    }`}
                  >
                    {fk.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-gray-800">
          <h2 className="text-white font-semibold">Full Comparison</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-5 py-3 text-gray-400 font-medium text-left">Feature</th>
                {plans.map(p => (
                  <th key={p.name} className="px-5 py-3 text-gray-300 font-semibold text-center capitalize">{p.displayName}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {featureKeys.map(fk => (
                <tr key={fk.key} className="border-b border-gray-800/50">
                  <td className="px-5 py-3 text-gray-300">{fk.label}</td>
                  {plans.map(p => (
                    <td key={p.name} className="px-5 py-3 text-center">
                      {p.features[fk.key]
                        ? <span className="text-green-400 text-base">✓</span>
                        : <span className="text-gray-700 text-base">—</span>
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEditPlan(null)} />
          <div className="relative bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold text-lg">Edit {editPlan.displayName} Plan</h3>
              <button onClick={() => setEditPlan(null)} className="text-gray-500 hover:text-gray-200 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-5">
              {/* Pricing */}
              <section>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-3">Pricing (₹)</p>
                <div className="grid grid-cols-3 gap-3">
                  {[['monthly', 'Monthly'], ['halfYearly', 'Half-Yearly'], ['yearly', 'Yearly']].map(([k, label]) => (
                    <div key={k}>
                      <label className="block text-xs text-gray-500 mb-1">{label}</label>
                      <input
                        type="number"
                        min={0}
                        value={form.pricing?.[k] ?? ''}
                        onChange={e => setField(`pricing.${k}`, Number(e.target.value))}
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 transition"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* Limits */}
              <section>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-3">Limits (-1 = unlimited)</p>
                <div className="grid grid-cols-3 gap-3">
                  {[['maxBranches', 'Branches'], ['maxMembers', 'Members'], ['maxStaff', 'Staff']].map(([k, label]) => (
                    <div key={k}>
                      <label className="block text-xs text-gray-500 mb-1">{label}</label>
                      <input
                        type="number"
                        min={-1}
                        value={form.limits?.[k] ?? ''}
                        onChange={e => setField(`limits.${k}`, Number(e.target.value))}
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 transition"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* Features */}
              <section>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-3">Features</p>
                <div className="grid grid-cols-2 gap-2">
                  {featureKeys.map(fk => (
                    <label
                      key={fk.key}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg border cursor-pointer transition ${
                        form.features?.[fk.key]
                          ? 'bg-violet-500/10 border-violet-500/40'
                          : 'bg-gray-800/40 border-gray-700/60'
                      }`}
                      onClick={() => setField(`features.${fk.key}`, !form.features?.[fk.key])}
                    >
                      <span className="text-sm text-gray-300">{fk.label}</span>
                      <div className={`relative h-4 w-8 rounded-full transition-colors flex-shrink-0 ml-2 ${form.features?.[fk.key] ? 'bg-violet-600' : 'bg-gray-700'}`}>
                        <span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${form.features?.[fk.key] ? 'translate-x-4' : 'translate-x-0.5'}`} />
                      </div>
                    </label>
                  ))}
                </div>
              </section>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition"
                >
                  {saving ? 'Saving…' : 'Save Plan Template'}
                </button>
                <button
                  onClick={() => setEditPlan(null)}
                  className="px-4 py-2.5 bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
