import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Zap, Users, BarChart3, QrCode, TrendingUp, Package, GitBranch,
  Shield, Bell, CreditCard, Star, ChevronRight, CheckCircle2,
  ArrowRight, Dumbbell, IndianRupee, Smartphone, Play,
  Award, Globe, Lock, MessageCircle, Target, Timer, Flame
} from 'lucide-react';
import LandingNav from '../../components/landing/LandingNav';
import Footer from '../../components/landing/Footer';

/* ─── Animated counter ─── */
function Counter({ end, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(end / (1800 / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end]);
  return <span ref={ref}>{prefix}{count.toLocaleString('en-IN')}{suffix}</span>;
}

function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.68, 0.47, 0.98] }}
      className={className}>
      {children}
    </motion.div>
  );
}

/* ─── SVG Gym Equipment Illustration ─── */
function DumbbellIllustration() {
  return (
    <svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full opacity-60">
      <rect x="0" y="12" width="18" height="16" rx="3" fill="rgba(255,107,53,0.3)" stroke="rgba(255,107,53,0.6)" strokeWidth="1.5"/>
      <rect x="5" y="8" width="8" height="24" rx="2" fill="rgba(255,107,53,0.2)" stroke="rgba(255,107,53,0.5)" strokeWidth="1.5"/>
      <rect x="18" y="17" width="84" height="6" rx="3" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
      <rect x="94" y="12" width="18" height="16" rx="3" fill="rgba(255,107,53,0.3)" stroke="rgba(255,107,53,0.6)" strokeWidth="1.5"/>
      <rect x="107" y="8" width="8" height="24" rx="2" fill="rgba(255,107,53,0.2)" stroke="rgba(255,107,53,0.5)" strokeWidth="1.5"/>
    </svg>
  );
}

/* ─── SVG Barbell ─── */
function BarbellSVG({ className = '' }) {
  return (
    <svg viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="2" y="18" width="28" height="24" rx="4" fill="rgba(255,107,53,0.15)" stroke="rgba(255,107,53,0.4)" strokeWidth="1.5"/>
      <rect x="10" y="12" width="12" height="36" rx="3" fill="rgba(255,107,53,0.1)" stroke="rgba(255,107,53,0.3)" strokeWidth="1.5"/>
      <rect x="30" y="26" width="140" height="8" rx="4" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
      <rect x="170" y="18" width="28" height="24" rx="4" fill="rgba(255,107,53,0.15)" stroke="rgba(255,107,53,0.4)" strokeWidth="1.5"/>
      <rect x="178" y="12" width="12" height="36" rx="3" fill="rgba(255,107,53,0.1)" stroke="rgba(255,107,53,0.3)" strokeWidth="1.5"/>
    </svg>
  );
}

/* ─── SVG Kettlebell ─── */
function KettlebellSVG({ className = '' }) {
  return (
    <svg viewBox="0 0 80 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M40 10 C28 10 22 18 22 25 C22 30 25 34 30 37 L25 55 C23 62 28 75 40 75 C52 75 57 62 55 55 L50 37 C55 34 58 30 58 25 C58 18 52 10 40 10Z" fill="rgba(255,107,53,0.12)" stroke="rgba(255,107,53,0.4)" strokeWidth="1.5"/>
      <path d="M34 10 C34 6 36 4 40 4 C44 4 46 6 46 10" stroke="rgba(255,107,53,0.5)" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <ellipse cx="40" cy="58" rx="14" ry="16" fill="rgba(255,107,53,0.08)" stroke="rgba(255,107,53,0.3)" strokeWidth="1"/>
    </svg>
  );
}

/* ─── Gym Photo Card ─── */
function GymPhotoCard({ src, alt, label, delay = 0, className = '' }) {
  return (
    <Reveal delay={delay} className={className}>
      <div className="relative rounded-2xl overflow-hidden group">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {label && (
          <div className="absolute bottom-3 left-3">
            <span className="text-xs font-bold text-white bg-primary/80 backdrop-blur-sm px-2.5 py-1 rounded-full">
              {label}
            </span>
          </div>
        )}
      </div>
    </Reveal>
  );
}

/* ─── Data ─── */
const stats = [
  { label: 'Gyms Managed', value: 1200, suffix: '+', icon: Dumbbell },
  { label: 'Active Members', value: 250000, suffix: '+', icon: Users },
  { label: 'Revenue Processed', value: 45, prefix: '₹', suffix: 'Cr+', icon: IndianRupee },
  { label: 'Cities Covered', value: 180, suffix: '+', icon: Globe },
];

const features = [
  { icon: Users, color: 'from-blue-500/20 to-blue-600/5', iconColor: 'text-blue-400', title: 'Smart Member Management', desc: 'Full profiles, QR codes, auto-expiry, freeze memberships, emergency contacts & fitness goals.' },
  { icon: QrCode, color: 'from-emerald-500/20 to-emerald-600/5', iconColor: 'text-emerald-400', title: 'QR Attendance System', desc: 'One scan check-in. Live attendance dashboard. Monthly calendar view per member.' },
  { icon: TrendingUp, color: 'from-primary/20 to-primary/5', iconColor: 'text-primary', title: 'Lead CRM & Pipeline', desc: '7-stage Kanban pipeline from New to Converted. One-click lead-to-member conversion.' },
  { icon: BarChart3, color: 'from-purple-500/20 to-purple-600/5', iconColor: 'text-purple-400', title: 'Real-time Analytics', desc: 'Revenue trends, attendance charts, plan distribution, lead funnel — all live.' },
  { icon: CreditCard, color: 'from-amber-500/20 to-amber-600/5', iconColor: 'text-amber-400', title: 'Payments & GST', desc: 'Razorpay integration, GST invoicing, plan-level pricing. 100% India-compliant billing.' },
  { icon: Package, color: 'from-rose-500/20 to-rose-600/5', iconColor: 'text-rose-400', title: 'Inventory & POS', desc: 'Track supplements, equipment, merchandise. Low stock alerts. Sell from the app.' },
  { icon: GitBranch, color: 'from-cyan-500/20 to-cyan-600/5', iconColor: 'text-cyan-400', title: 'Multi-Branch Management', desc: 'Unlimited branches. Branch-wise member assignment, facilities, and hours config.' },
  { icon: Shield, color: 'from-indigo-500/20 to-indigo-600/5', iconColor: 'text-indigo-400', title: 'RBAC & Security', desc: 'Owner, Manager, Receptionist, Trainer roles. JWT auth, audit logs, data isolation.' },
  { icon: Bell, color: 'from-orange-500/20 to-orange-600/5', iconColor: 'text-orange-400', title: 'Smart Automation', desc: 'Daily 6 AM cron: auto-expire memberships, send renewal reminders, detect inactivity.' },
];

const plans = [
  { name: 'Trial', price: 'Free', period: '14 days', popular: false, desc: 'Evaluate GymPro with no commitment.', features: ['Up to 50 members', '1 branch', 'Basic attendance', 'Email support', 'Dashboard analytics'], cta: 'Start Free Trial', href: '/register', variant: 'outline' },
  { name: 'Basic', price: '₹999', period: '/month', popular: false, desc: 'Best for single-location gyms.', features: ['Up to 500 members', '1 branch', 'QR attendance', 'Lead CRM', 'Inventory', 'Email & WhatsApp support', 'GST invoicing'], cta: 'Get Started', href: '/register', variant: 'outline' },
  { name: 'Professional', price: '₹2,499', period: '/month', popular: true, desc: 'For growing gyms with serious needs.', features: ['Unlimited members', '5 branches', 'All Basic features', 'Staff management + RBAC', 'Advanced analytics', 'Audit logs', 'Razorpay integration', 'Priority support'], cta: 'Get Started', href: '/register', variant: 'primary' },
  { name: 'Enterprise', price: 'Custom', period: 'pricing', popular: false, desc: 'For chains and franchise operators.', features: ['Unlimited everything', 'Unlimited branches', 'Custom branding', 'Dedicated server', 'SLA guarantee', 'Custom integrations', 'Onboarding support', '24/7 phone support'], cta: 'Contact Sales', href: '/contact', variant: 'outline' },
];

const testimonials = [
  { name: 'Rahul Sharma', role: 'Owner, Iron Temple Gym', city: 'Mumbai', rating: 5, initials: 'RS', color: 'bg-blue-500', text: 'GymPro India transformed how we run our 3 branches. Renewals are now automated. We recovered ₹2.4L in pending payments in the first month!' },
  { name: 'Priya Menon', role: 'Owner, FitZone Fitness', city: 'Bangalore', rating: 5, initials: 'PM', color: 'bg-emerald-500', text: 'The lead CRM is a game changer. Our conversion rate jumped from 18% to 41% in 3 months. The Kanban view makes follow-ups effortless.' },
  { name: 'Ajay Nair', role: 'Manager, Powerhouse Club', city: 'Pune', rating: 5, initials: 'AN', color: 'bg-primary', text: 'GST invoicing and Razorpay integration saved us 4 hours of manual billing every week. Best gym software for Indian businesses.' },
];

const howItWorks = [
  { step: '01', title: 'Register Your Gym', desc: 'Create your gym profile with logo, branding, and contact info. Takes under 5 minutes.' },
  { step: '02', title: 'Add Members & Plans', desc: 'Import existing members via CSV or add manually. Set up flexible plans with GST.' },
  { step: '03', title: 'Start Tracking', desc: 'Enable QR attendance, manage leads, track payments. Everything updates in real-time.' },
  { step: '04', title: 'Scale & Grow', desc: 'Add branches, staff, inventory as you grow. Analytics help you decide smarter.' },
];

/* ─── Photo strip images (Unsplash — gym/fitness, free to use) ─── */
const gymPhotos = [
  { src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80', alt: 'Gym interior', label: 'Member Management' },
  { src: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80', alt: 'Personal trainer', label: 'Staff & Trainers' },
  { src: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80', alt: 'Weight training', label: 'Attendance Tracking' },
  { src: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80', alt: 'Gym equipment', label: 'Inventory & POS' },
];

const proofPhotos = [
  { src: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&q=80', alt: 'Gym floor', label: '' },
  { src: 'https://images.unsplash.com/photo-1544216717-3bbf52512659?w=400&q=80', alt: 'Trainer coaching', label: '' },
  { src: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&q=80', alt: 'Weights rack', label: '' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#100D0A] text-white overflow-x-hidden">
      <LandingNav />

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-primary/8 rounded-full blur-[140px]" />
          <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-orange-900/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[350px] h-[300px] bg-amber-900/8 rounded-full blur-[100px]" />
          <div className="absolute inset-0 opacity-[0.022]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,120,60,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,120,60,0.4) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Hero text */}
          <div className="text-center max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-8">
              <Zap size={14} />
              Built for Indian Gym Businesses
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display font-bold text-5xl sm:text-6xl lg:text-6xl leading-[1.05] tracking-tight mb-6">
              Run Your Gym{' '}
              <span className="text-gradient">Like a Pro.</span>
              <br />
              <span className="text-gray-300">Not on Paper.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-400 text-m leading-relaxed mb-10 max-w-2xl mx-auto">
              India's only gym management platform with QR attendance, lead CRM, GST billing,
              Razorpay payments, and smart automation — all in one dashboard.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link to="/register"
                className="flex items-center gap-2 bg-primary hover:bg-orange-500 text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-200 active:scale-95 w-full sm:w-auto justify-center">
                <Zap size={20} />
                Start Free 14-Day Trial
              </Link>
              <Link to="/features"
                className="flex items-center gap-2 border border-white/10 hover:border-white/20 text-white font-semibold px-8 py-4 rounded-2xl text-lg hover:bg-white/5 transition-all duration-200 w-full sm:w-auto justify-center">
                <Play size={18} className="text-primary" />
                See All Features
              </Link>
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="text-xs text-gray-600">
              No credit card required · 14-day free trial · Cancel anytime
            </motion.p>
          </div>

          {/* ── HERO VISUAL: Dashboard mockup + gym photo collage ── */}
          <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.21, 0.68, 0.47, 0.98] }}
            className="mt-16 grid lg:grid-cols-5 gap-4 items-start">

            {/* Left gym photos column */}
            <div className="hidden lg:flex flex-col gap-4 lg:col-span-1">
              <div className="relative rounded-2xl overflow-hidden h-44">
                <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80"
                  alt="Gym interior" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute bottom-3 left-3 bg-emerald-500/90 backdrop-blur-sm rounded-xl px-2.5 py-1.5">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 size={11} /> 43 members in
                  </div>
                </motion.div>
              </div>
              <div className="relative rounded-2xl overflow-hidden h-32">
                <img src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80"
                  alt="Gym equipment" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-2.5">
                  <span className="text-[10px] font-bold text-white bg-primary/80 px-2 py-0.5 rounded-full">Inventory ✓</span>
                </div>
              </div>
              {/* Equipment illustration */}
              <div className="bg-[#1E1812] border border-white/6 rounded-2xl p-4">
                <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-3 font-semibold">Equipment tracked</p>
                <KettlebellSVG className="w-12 h-14 mx-auto" />
                <p className="text-xs text-center text-gray-500 mt-2">Supplements · Equipment<br/>Merchandise</p>
              </div>
            </div>

            {/* Center dashboard mockup */}
            <div className="lg:col-span-3 relative">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_120px_rgba(255,107,53,0.12)] bg-[#0B0906]">
                {/* Browser bar */}
                <div className="bg-[#141009] border-b border-white/5 px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                  </div>
                  <div className="flex-1 mx-4 bg-white/5 rounded-lg py-1.5 px-4 text-xs text-gray-500 text-center">
                    app.gymproindia.in/dashboard
                  </div>
                </div>
                {/* Dashboard */}
                <div className="p-5 bg-[#100D0A]">
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {[
                      { label: 'Total Members', value: '1,247', change: '+12%', color: 'text-emerald-400', icon: '👥' },
                      { label: "Today's Revenue", value: '₹18,400', change: '+8%', color: 'text-primary', icon: '💰' },
                      { label: 'Present Now', value: '43', change: 'live', color: 'text-blue-400', icon: '✅' },
                      { label: 'New Leads', value: '28', change: '+5', color: 'text-purple-400', icon: '🎯' },
                    ].map(stat => (
                      <div key={stat.label} className="bg-[#1E1812] border border-white/5 rounded-xl p-3">
                        <div className="text-base mb-1">{stat.icon}</div>
                        <div className="font-bold text-lg text-white">{stat.value}</div>
                        <div className="text-[10px] text-gray-500">{stat.label}</div>
                        <div className={`text-[10px] font-bold mt-0.5 ${stat.color}`}>{stat.change}</div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2 bg-[#1E1812] border border-white/5 rounded-xl p-3">
                      <div className="text-[10px] text-gray-500 mb-2 font-semibold uppercase">Revenue — Last 7 Days</div>
                      <div className="flex items-end gap-1.5 h-20">
                        {[40, 65, 45, 80, 55, 90, 72].map((h, i) => (
                          <div key={i} className="flex-1 rounded-t-sm transition-all" style={{ height: `${h}%`, background: i === 5 ? '#FF6B35' : 'rgba(255,107,53,0.2)' }} />
                        ))}
                      </div>
                      <div className="flex justify-between mt-1.5 text-[9px] text-gray-600">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <span key={d}>{d}</span>)}
                      </div>
                    </div>
                    <div className="bg-[#1E1812] border border-white/5 rounded-xl p-3">
                      <div className="text-[10px] text-gray-500 mb-2 font-semibold uppercase flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" /> Live
                      </div>
                      {[{ name: 'Rahul K.', c: 'bg-primary' }, { name: 'Priya M.', c: 'bg-blue-500' }, { name: 'Amit S.', c: 'bg-emerald-500' }].map(m => (
                        <div key={m.name} className="flex items-center gap-1.5 mb-2">
                          <div className={`w-5 h-5 rounded-full ${m.c} flex items-center justify-center text-[9px] font-bold text-white`}>{m.name[0]}</div>
                          <div className="text-[10px] text-white font-medium">{m.name}</div>
                          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -left-5 top-1/3 hidden lg:block bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3.5 backdrop-blur-sm shadow-xl">
                <CheckCircle2 size={18} className="text-emerald-400 mb-1" />
                <div className="text-xs font-bold text-white">Auto Renewal</div>
                <div className="text-[10px] text-gray-500">Sent 47 reminders</div>
              </motion.div>
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -right-5 top-1/4 hidden lg:block bg-primary/10 border border-primary/20 rounded-2xl p-3.5 backdrop-blur-sm shadow-xl">
                <IndianRupee size={18} className="text-primary mb-1" />
                <div className="text-xs font-bold text-white">₹18,400</div>
                <div className="text-[10px] text-gray-500">Collected today</div>
              </motion.div>
            </div>

            {/* Right gym photos column */}
            <div className="hidden lg:flex flex-col gap-4 lg:col-span-1">
              <div className="relative rounded-2xl overflow-hidden h-32">
                <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80"
                  alt="Personal trainer" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-2.5">
                  <span className="text-[10px] font-bold text-white bg-indigo-500/80 px-2 py-0.5 rounded-full">Trainer Portal</span>
                </div>
              </div>
              {/* QR scan visual */}
              <div className="bg-[#1E1812] border border-white/6 rounded-2xl p-4 text-center">
                <div className="w-16 h-16 mx-auto mb-2 relative">
                  <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
                    <rect x="4" y="4" width="24" height="24" rx="3" stroke="rgba(255,107,53,0.7)" strokeWidth="2" fill="rgba(255,107,53,0.05)"/>
                    <rect x="10" y="10" width="12" height="12" rx="1" fill="rgba(255,107,53,0.4)"/>
                    <rect x="36" y="4" width="24" height="24" rx="3" stroke="rgba(255,107,53,0.7)" strokeWidth="2" fill="rgba(255,107,53,0.05)"/>
                    <rect x="42" y="10" width="12" height="12" rx="1" fill="rgba(255,107,53,0.4)"/>
                    <rect x="4" y="36" width="24" height="24" rx="3" stroke="rgba(255,107,53,0.7)" strokeWidth="2" fill="rgba(255,107,53,0.05)"/>
                    <rect x="10" y="42" width="12" height="12" rx="1" fill="rgba(255,107,53,0.4)"/>
                    <rect x="36" y="36" width="6" height="6" fill="rgba(255,107,53,0.5)"/>
                    <rect x="46" y="36" width="6" height="6" fill="rgba(255,107,53,0.5)"/>
                    <rect x="56" y="36" width="4" height="6" fill="rgba(255,107,53,0.5)"/>
                    <rect x="36" y="46" width="6" height="4" fill="rgba(255,107,53,0.5)"/>
                    <rect x="46" y="50" width="14" height="4" fill="rgba(255,107,53,0.5)"/>
                    <rect x="56" y="44" width="4" height="6" fill="rgba(255,107,53,0.5)"/>
                  </svg>
                  <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -inset-1 rounded-xl border border-primary/30" />
                </div>
                <p className="text-xs font-bold text-white">QR Check-In</p>
                <p className="text-[10px] text-gray-500 mt-0.5">2 sec per member</p>
              </div>
              <div className="relative rounded-2xl overflow-hidden h-44">
                <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80"
                  alt="Weight training" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 2.5, repeat: Infinity }}
                  className="absolute top-2.5 right-2.5 bg-primary/90 backdrop-blur-sm rounded-xl px-2.5 py-1.5">
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    <Flame size={10} /> 1,247 active
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="py-16 border-y border-white/5 bg-[#0D0A07]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ label, value, suffix, prefix, icon: Icon }, i) => (
              <Reveal key={label} delay={i * 0.1} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3">
                  <Icon size={22} className="text-primary" />
                </div>
                <div className="font-display font-bold text-4xl text-white mb-1">
                  <Counter end={value} suffix={suffix} prefix={prefix} />
                </div>
                <div className="text-sm text-gray-500">{label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── GYM PHOTO STRIP ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-10">
            <p className="text-gray-500 text-sm uppercase tracking-widest font-semibold mb-3">Trusted by gym owners across India</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl">
              Every type of gym. <span className="text-gradient">One platform.</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {gymPhotos.map((photo, i) => (
              <GymPhotoCard key={photo.alt} {...photo} delay={i * 0.1}
                className={`${i === 0 ? 'h-64' : i === 3 ? 'h-64' : 'h-52'}`} />
            ))}
          </div>
          {/* Gym type tags */}
          <Reveal className="flex flex-wrap justify-center gap-2 mt-8">
            {['🏋️ Weight Training Gyms', '🧘 Yoga Studios', '🥊 CrossFit Boxes', '🏊 Fitness Centres', '💪 Personal Training Studios', '🏃 Cardio Clubs'].map(tag => (
              <span key={tag} className="text-xs font-medium text-gray-400 bg-white/5 border border-white/8 px-3.5 py-1.5 rounded-full hover:border-primary/30 hover:text-primary transition-colors cursor-default">
                {tag}
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0B0906]">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold px-4 py-2 rounded-full mb-6">
              <Zap size={14} />
              Everything You Need
            </div>
            <h2 className="font-display font-bold text-4xl sm:text-5xl mb-4">
              One platform. <span className="text-gradient">Every feature.</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              No more juggling between spreadsheets, WhatsApp reminders, and paper registers.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, color, iconColor, title, desc }, i) => (
              <Reveal key={title} delay={(i % 3) * 0.1}>
                <div className="group relative bg-[#1E1812] border border-white/5 hover:border-primary/20 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 cursor-default">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
                    <Icon size={22} className={iconColor} />
                  </div>
                  <h3 className="font-display font-bold text-lg text-white mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                  <Link to="/features" className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ArrowRight size={12} />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="text-center mt-12">
            <Link to="/features" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
              View all features in detail <ChevronRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl sm:text-5xl mb-4">
              Up and running in <span className="text-gradient">15 minutes</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              No technical setup. No consultants. Just sign up and start managing your gym.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map(({ step, title, desc }, i) => (
              <Reveal key={step} delay={i * 0.12}>
                <div className="relative bg-[#1E1812] border border-white/5 rounded-2xl p-6">
                  <div className="text-5xl font-display font-bold text-primary/20 mb-4">{step}</div>
                  <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── INDIA-SPECIFIC + BARBELL VISUAL ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0B0906]">
        <div className="max-w-7xl mx-auto">
          {/* Decorative barbell */}
          <Reveal className="mb-16 max-w-md mx-auto opacity-40">
            <BarbellSVG className="w-full" />
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-semibold px-4 py-2 rounded-full mb-6">
                🇮🇳 Made for India
              </div>
              <h2 className="font-display font-bold text-4xl sm:text-5xl mb-6">
                Built from the ground up for{' '}
                <span className="text-gradient">Indian gyms</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Unlike generic gym software from the West, GymPro India is built specifically for Indian market requirements — GST, UPI, Razorpay, and Indian mobile numbers.
              </p>
              <div className="space-y-4">
                {[
                  { icon: IndianRupee, text: 'INR (₹) currency with GST-inclusive pricing and invoicing' },
                  { icon: Smartphone, text: 'Indian mobile number validation and +91 support' },
                  { icon: CreditCard, text: 'Razorpay — UPI, cards, net banking, wallets' },
                  { icon: Globe, text: 'All Indian states dropdown for member profiles' },
                  { icon: MessageCircle, text: 'WhatsApp renewal reminders (coming soon)' },
                  { icon: Lock, text: 'India data privacy compliance (PDPB ready)' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon size={16} className="text-primary" />
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="bg-[#1E1812] border border-white/5 rounded-2xl p-8">
                <div className="text-center mb-8">
                  <div className="text-4xl mb-3">🏋️</div>
                  <h3 className="font-bold text-white text-xl">GST Invoice Preview</h3>
                  <p className="text-sm text-gray-500 mt-1">Auto-generated for every payment</p>
                </div>
                <div className="space-y-3 text-sm">
                  {[
                    { k: 'Plan Name', v: 'Premium 3 Months' },
                    { k: 'Base Amount', v: '₹2,380' },
                    { k: 'CGST (9%)', v: '₹214' },
                    { k: 'SGST (9%)', v: '₹214' },
                  ].map(({ k, v }) => (
                    <div key={k} className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-gray-500">{k}</span>
                      <span className="text-white font-medium">{v}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-2 bg-primary/5 rounded-lg px-3">
                    <span className="text-white font-bold">Total (incl. GST)</span>
                    <span className="text-primary font-bold text-lg">₹2,808</span>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span className="text-sm text-emerald-300 font-medium">Auto-emailed to member instantly</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF PHOTO WALL ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Photo collage */}
            <Reveal className="grid grid-cols-2 gap-3 h-[420px]">
              <div className="flex flex-col gap-3">
                <div className="relative rounded-2xl overflow-hidden flex-1">
                  <img src="https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600&q=80"
                    alt="Gym floor" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="relative rounded-2xl overflow-hidden h-36">
                  <img src="https://images.unsplash.com/photo-1544216717-3bbf52512659?w=400&q=80"
                    alt="Trainer coaching" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="relative rounded-2xl overflow-hidden h-40">
                  <img src="https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&q=80"
                    alt="Weights" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="relative rounded-2xl overflow-hidden flex-1">
                  <img src="https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400&q=80"
                    alt="Gym members" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}
                    className="absolute bottom-3 left-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1.5">
                        {['bg-primary', 'bg-blue-500', 'bg-emerald-500'].map((c, i) => (
                          <div key={i} className={`w-6 h-6 rounded-full ${c} border-2 border-black/40 flex items-center justify-center text-[9px] font-bold text-white`}>
                            {['R', 'P', 'A'][i]}
                          </div>
                        ))}
                      </div>
                      <div>
                        <div className="text-white text-[10px] font-bold">1,200+ gyms trust us</div>
                        <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} size={8} className="text-amber-400 fill-amber-400" />)}</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </Reveal>

            {/* Text content */}
            <Reveal delay={0.2}>
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-6">
                  <Target size={14} />
                  Built for Results
                </div>
                <h2 className="font-display font-bold text-4xl sm:text-5xl mb-6">
                  Stop managing your gym<br />
                  <span className="text-gradient">with pen and paper</span>
                </h2>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                  Most Indian gym owners spend 3–4 hours daily on manual work — tracking attendance, chasing renewals, updating spreadsheets. GymPro India automates all of it.
                </p>
                <div className="space-y-4 mb-8">
                  {[
                    { icon: Timer, label: '3 hrs saved daily', desc: 'on manual member tracking and billing' },
                    { icon: TrendingUp, label: '2× lead conversion', desc: 'with the built-in CRM and follow-up system' },
                    { icon: IndianRupee, label: '₹45 Cr+ processed', desc: 'in membership payments across India' },
                  ].map(({ icon: Icon, label, desc }) => (
                    <div key={label} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                        <Icon size={18} className="text-primary" />
                      </div>
                      <div>
                        <span className="text-white font-bold">{label}</span>
                        <span className="text-gray-400 text-sm"> — {desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/register"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-orange-500 text-white font-bold px-8 py-4 rounded-2xl text-base shadow-xl shadow-primary/30 transition-all active:scale-95">
                  <Zap size={18} />
                  Start Free Trial
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0B0906]">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl sm:text-5xl mb-4">
              Simple, transparent <span className="text-gradient">pricing</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Start free, scale as you grow. No hidden fees. Cancel anytime.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {plans.map(({ name, price, period, popular, desc, features: pf, cta, href, variant }, i) => (
              <Reveal key={name} delay={i * 0.1}>
                <div className={`relative h-full flex flex-col rounded-2xl p-6 transition-all ${popular ? 'bg-primary/5 border-2 border-primary shadow-2xl shadow-primary/20 -mt-2' : 'bg-[#1E1812] border border-white/5'}`}>
                  {popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">⭐ Most Popular</span>
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="font-display font-bold text-xl text-white mb-1">{name}</h3>
                    <p className="text-xs text-gray-500 mb-4">{desc}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display font-bold text-4xl text-white">{price}</span>
                      <span className="text-gray-500 text-sm">{period}</span>
                    </div>
                  </div>
                  <ul className="space-y-2.5 flex-1 mb-8">
                    {pf.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle2 size={14} className={popular ? 'text-primary' : 'text-emerald-500'} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to={href}
                    className={`w-full text-center py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 ${variant === 'primary' ? 'bg-primary hover:bg-orange-500 text-white shadow-lg shadow-primary/30' : 'border border-white/10 hover:border-white/20 text-white hover:bg-white/5'}`}>
                    {cta}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="text-center mt-10">
            <p className="text-sm text-gray-600">
              All prices + GST (18%). Annual plans save 20%.{' '}
              <Link to="/contact" className="text-primary hover:underline">Need a custom quote?</Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl sm:text-5xl mb-4">
              Loved by gym owners <span className="text-gradient">across India</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, city, rating, initials, color, text }, i) => (
              <Reveal key={name} delay={i * 0.12}>
                <div className="bg-[#1E1812] border border-white/5 rounded-2xl p-6 h-full flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {[...Array(rating)].map((_, j) => <Star key={j} size={14} className="text-amber-400 fill-amber-400" />)}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed flex-1 mb-6">"{text}"</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white font-bold text-sm`}>
                      {initials}
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{name}</div>
                      <div className="text-xs text-gray-500">{role} · {city}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0B0906]">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="relative rounded-3xl overflow-hidden">
              {/* Background gym photo */}
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80"
                alt="Gym"
                className="absolute inset-0 w-full h-full object-cover opacity-15"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-black/60 to-black/80" />
              <div className="relative p-12 sm:p-16 text-center">
                <Award size={40} className="text-primary mx-auto mb-6" />
                <h2 className="font-display font-bold text-4xl sm:text-5xl mb-4">
                  Ready to transform your gym?
                </h2>
                <p className="text-gray-300 text-lg mb-10 max-w-xl mx-auto">
                  Join 1,200+ gyms across India who chose GymPro India to run their business smarter.
                </p>
                {/* Dumbbell illustration */}
                <div className="max-w-xs mx-auto mb-8 opacity-50">
                  <DumbbellIllustration />
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/register"
                    className="flex items-center gap-2 bg-primary hover:bg-orange-500 text-white font-bold px-10 py-4 rounded-2xl text-lg shadow-2xl shadow-primary/40 transition-all active:scale-95">
                    <Zap size={20} />
                    Start Free Trial — No Card Needed
                  </Link>
                  <Link to="/contact" className="text-gray-400 hover:text-white transition-colors font-medium">
                    Talk to Sales →
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}