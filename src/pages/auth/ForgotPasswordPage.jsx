import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, ArrowLeft, Loader2 } from 'lucide-react';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
      toast.success('Reset link sent!');
    } catch (err) {
      toast.error(err.message || 'Failed to send reset link');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center p-4 bg-mesh">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary shadow-xl shadow-primary/30 mb-4">
            <Dumbbell size={26} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Reset Password</h1>
          <p className="text-gray-500 text-sm mt-1">We'll send a link to your email</p>
        </div>
        <div className="card p-6">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📧</span>
              </div>
              <p className="text-white font-semibold mb-1">Check your inbox!</p>
              <p className="text-gray-400 text-sm">Reset link sent to <strong>{email}</strong></p>
              <Link to="/login" className="btn-primary inline-block mt-4 px-6">Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="label">Email Address</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="input" autoFocus />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-2.5">
                {loading ? <Loader2 size={16} className="animate-spin" /> : 'Send Reset Link'}
              </button>
              <Link to="/login" className="flex items-center gap-1 text-sm text-gray-400 hover:text-white justify-center mt-2">
                <ArrowLeft size={14} /> Back to login
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
