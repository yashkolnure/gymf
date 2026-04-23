import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';
import { Dumbbell, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';

const INDIAN_STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Chandigarh'];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', gymName: '', gymCity: '', gymState: 'Maharashtra', gymPhone: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setError('');
    const res = await register(form);
    if (res.success) navigate('/dashboard');
    else setError(res.message);
  };

  return (
    <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center p-4 bg-mesh">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary shadow-xl shadow-primary/30 mb-4">
            <Dumbbell size={26} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Register Your Gym</h1>
          <p className="text-gray-500 text-sm mt-1">Start your 14-day free trial — no credit card required</p>
        </div>

        <div className="card p-6">
          {/* Progress */}
          <div className="flex gap-2 mb-6">
            {[1, 2].map(s => (
              <div key={s} className={`flex-1 h-1.5 rounded-full transition-colors ${s <= step ? 'bg-primary' : 'bg-surface-border'}`} />
            ))}
          </div>
          <p className="text-xs text-gray-500 mb-5">{step === 1 ? 'Step 1: Your Account' : 'Step 2: Gym Details'}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <div className="form-group">
                  <label className="label">Full Name <span className="text-primary">*</span></label>
                  <input required value={form.name} onChange={e => update('name', e.target.value)} placeholder="Ramesh Kumar" className="input" autoFocus />
                </div>
                <div className="form-group">
                  <label className="label">Email <span className="text-primary">*</span></label>
                  <input type="email" required value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@email.com" className="input" />
                </div>
                <div className="form-group">
                  <label className="label">Mobile Number <span className="text-primary">*</span></label>
                  <div className="flex gap-2">
                    <div className="input w-16 text-center text-gray-400 cursor-default flex-shrink-0">+91</div>
                    <input required pattern="[6-9]\d{9}" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="9876543210" className="input flex-1" maxLength={10} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="label">Password <span className="text-primary">*</span></label>
                  <div className="relative">
                    <input type={showPw ? 'text' : 'password'} required minLength={8} value={form.password} onChange={e => update('password', e.target.value)} placeholder="Min. 8 characters" className="input pr-10" />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <button type="button" onClick={() => { if (!form.name || !form.email || !form.phone || !form.password) { setError('Please fill all fields'); return; } setError(''); setStep(2); }} className="btn-primary w-full flex items-center justify-center gap-2 py-2.5">
                  Continue <ArrowRight size={16} />
                </button>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label className="label">Gym Name <span className="text-primary">*</span></label>
                  <input required value={form.gymName} onChange={e => update('gymName', e.target.value)} placeholder="Power Zone Fitness" className="input" autoFocus />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="form-group">
                    <label className="label">City <span className="text-primary">*</span></label>
                    <input required value={form.gymCity} onChange={e => update('gymCity', e.target.value)} placeholder="Mumbai" className="input" />
                  </div>
                  <div className="form-group">
                    <label className="label">State <span className="text-primary">*</span></label>
                    <select value={form.gymState} onChange={e => update('gymState', e.target.value)} className="input">
                      {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="label">Gym Contact Number</label>
                  <div className="flex gap-2">
                    <div className="input w-16 text-center text-gray-400 cursor-default flex-shrink-0">+91</div>
                    <input pattern="[6-9]\d{9}" value={form.gymPhone} onChange={e => update('gymPhone', e.target.value)} placeholder="Gym number (optional)" className="input flex-1" maxLength={10} />
                  </div>
                </div>

                {/* Subscription Plan Selection */}
                <div>
                  <label className="form-label">Choose a Plan</label>
                  <div className="grid gap-2 mt-1">
                    {[
                      { name: 'basic',    label: 'Basic',      desc: '1 branch · 100 members · 5 staff',    price: '₹999/mo' },
                      { name: 'advanced', label: 'Advanced',   desc: '3 branches · 500 members · 20 staff', price: '₹2,499/mo' },
                      { name: 'enterprise', label: 'Enterprise', desc: 'Unlimited everything',              price: '₹5,999/mo' },
                    ].map(p => (
                      <label
                        key={p.name}
                        onClick={() => update('plan', p.name)}
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition text-sm ${
                          form.plan === p.name
                            ? 'border-primary bg-primary/10'
                            : 'border-gray-200 dark:border-dark-border hover:border-primary/50'
                        }`}
                      >
                        <div>
                          <span className="font-semibold text-dark dark:text-white">{p.label}</span>
                          <span className="text-gray-500 text-xs ml-2">{p.desc}</span>
                        </div>
                        <span className="text-primary font-semibold text-xs">{p.price}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="form-label">Billing Cycle</label>
                  <select value={form.billingCycle || 'monthly'} onChange={e => update('billingCycle', e.target.value)} className="input mt-1">
                    <option value="monthly">Monthly</option>
                    <option value="halfYearly">Half-Yearly (save ~10%)</option>
                    <option value="yearly">Yearly (save ~20%)</option>
                  </select>
                </div>

                {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5 text-sm text-red-400">{error}</div>}

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 py-2.5">Back</button>
                  <button type="submit" disabled={isLoading} className="btn-primary flex-1 flex items-center justify-center gap-2 py-2.5">
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : <>Register Gym 🚀</>}
                  </button>
                </div>
              </>
            )}
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already registered? <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
