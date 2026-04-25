import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useAnimation } from 'framer-motion';
import {
  Zap, Users, BarChart3, QrCode, TrendingUp, Package, GitBranch,
  Shield, Bell, CreditCard, Star, ChevronRight, CheckCircle2,
  ArrowRight, Dumbbell, Clock, IndianRupee, Smartphone, Play,
  Award, Globe, Lock, MessageCircle
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
    const duration = 1800;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end]);

  return <span ref={ref}>{prefix}{count.toLocaleString('en-IN')}{suffix}</span>;
}

/* ─── Reveal wrapper ─── */
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.68, 0.47, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
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
  {
    icon: Users, color: 'from-blue-500/20 to-blue-600/5', iconColor: 'text-blue-400',
    title: 'Smart Member Management',
    desc: 'Full member profiles, QR codes, auto-expiry, freeze memberships, emergency contacts & fitness goals. Everything in one screen.',
  },
  {
    icon: QrCode, color: 'from-emerald-500/20 to-emerald-600/5', iconColor: 'text-emerald-400',
    title: 'QR Attendance System',
    desc: 'One scan check-in. Live attendance dashboard. Monthly calendar view per member. Staff attendance with shift tracking.',
  },
  {
    icon: TrendingUp, color: 'from-primary/20 to-primary/5', iconColor: 'text-primary',
    title: 'Lead CRM & Pipeline',
    desc: '7-stage Kanban pipeline from New to Converted. One-click lead-to-member conversion with full analytics.',
  },
  {
    icon: BarChart3, color: 'from-purple-500/20 to-purple-600/5', iconColor: 'text-purple-400',
    title: 'Real-time Analytics',
    desc: 'Revenue trends, daily attendance charts, plan distribution, lead funnel — all live on your dashboard.',
  },
  {
    icon: CreditCard, color: 'from-amber-500/20 to-amber-600/5', iconColor: 'text-amber-400',
    title: 'Payments & GST',
    desc: 'Razorpay integration, GST invoicing, plan-level pricing with offer dates. 100% India-compliant billing.',
  },
  {
    icon: Package, color: 'from-rose-500/20 to-rose-600/5', iconColor: 'text-rose-400',
    title: 'Inventory & POS',
    desc: 'Track supplements, equipment, merchandise. Low stock alerts. Sell from the app with revenue tracking.',
  },
  {
    icon: GitBranch, color: 'from-cyan-500/20 to-cyan-600/5', iconColor: 'text-cyan-400',
    title: 'Multi-Branch Management',
    desc: 'Unlimited branches per plan. Branch-wise member assignment, facilities, and operating hours configuration.',
  },
  {
    icon: Shield, color: 'from-indigo-500/20 to-indigo-600/5', iconColor: 'text-indigo-400',
    title: 'RBAC & Security',
    desc: 'Owner, Manager, Receptionist, Trainer roles with granular permissions. JWT auth, audit logs, and data isolation.',
  },
  {
    icon: Bell, color: 'from-orange-500/20 to-orange-600/5', iconColor: 'text-orange-400',
    title: 'Smart Automation',
    desc: 'Daily 6 AM cron: auto-expire memberships, send renewal reminders 7 days early, detect inactive members.',
  },
];

const plans = [
  {
    name: 'Trial', price: 'Free', period: '14 days', popular: false,
    desc: 'Perfect to evaluate GymPro with no commitment.',
    features: ['Up to 50 members', '1 branch', 'Basic attendance', 'Email support', 'Dashboard analytics'],
    cta: 'Start Free Trial', href: '/register', variant: 'outline',
  },
  {
    name: 'Basic', price: '₹999', period: '/month', popular: false,
    desc: 'Best for single-location gyms getting started.',
    features: ['Up to 500 members', '1 branch', 'QR attendance', 'Lead CRM', 'Inventory', 'Email & WhatsApp support', 'GST invoicing'],
    cta: 'Get Started', href: '/register', variant: 'outline',
  },
  {
    name: 'Professional', price: '₹2,499', period: '/month', popular: true,
    desc: 'For growing gyms with serious management needs.',
    features: ['Unlimited members', '5 branches', 'All Basic features', 'Staff management + RBAC', 'Advanced analytics', 'Audit logs', 'Razorpay integration', 'Priority support'],
    cta: 'Get Started', href: '/register', variant: 'primary',
  },
  {
    name: 'Enterprise', price: 'Custom', period: 'pricing', popular: false,
    desc: 'For gym chains and franchise operators.',
    features: ['Unlimited everything', 'Unlimited branches', 'Custom branding', 'Dedicated server', 'SLA guarantee', 'Custom integrations', 'Onboarding support', '24/7 phone support'],
    cta: 'Contact Sales', href: '/contact', variant: 'outline',
  },
];

const testimonials = [
  {
    name: 'Rahul Sharma', role: 'Owner, Iron Temple Gym', city: 'Mumbai',
    rating: 5, initials: 'RS', color: 'bg-blue-500',
    text: 'GymPro India transformed how we run our 3 branches. Attendance tracking and member renewals are now completely automated. We recovered ₹2.4L in pending payments in the first month!',
  },
  {
    name: 'Priya Menon', role: 'Owner, FitZone Fitness', city: 'Bangalore',
    rating: 5, initials: 'PM', color: 'bg-emerald-500',
    text: 'The lead CRM is a game changer. We used to lose track of prospects — now our conversion rate jumped from 18% to 41% in 3 months. The Kanban view makes follow-ups effortless.',
  },
  {
    name: 'Ajay Nair', role: 'Manager, Powerhouse Club', city: 'Pune',
    rating: 5, initials: 'AN', color: 'bg-primary',
    text: 'GST invoicing and Razorpay integration saved us 4 hours of manual billing every week. The support team is incredibly responsive. Best gym software for Indian businesses.',
  },
];

const howItWorks = [
  { step: '01', title: 'Register Your Gym', desc: 'Create your gym profile with logo, branding, and contact info. Takes under 5 minutes.' },
  { step: '02', title: 'Add Members & Plans', desc: 'Import existing members via CSV or add them manually. Set up flexible membership plans with GST.' },
  { step: '03', title: 'Start Tracking', desc: 'Enable QR attendance, manage leads, track payments. Everything updates in real-time.' },
  { step: '04', title: 'Scale & Grow', desc: 'Add branches, staff, inventory as you grow. Analytics help you make smarter decisions.' },
];

/* ─── Main Component ─── */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#100D0A] text-white overflow-x-hidden">
      <LandingNav />

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* BG glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/8 rounded-full blur-[120px]" />
          <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-emerald-500/4 rounded-full blur-[100px]" />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,120,60,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,120,60,0.4) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
          />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-8"
            >
              <Zap size={14} />
              Built for Indian Gym Businesses
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display font-bold text-5xl sm:text-6xl lg:text-6xl leading-[1.05] tracking-tight mb-6"
            >
              Run Your Gym{' '}
              <span className="text-gradient">Like a Pro.</span>
              <br />
              <span className="text-gray-300">Not on Paper.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-400 text-xl leading-relaxed mb-10 max-w-2xl mx-auto"
            >
              India's only gym management platform with QR attendance, lead CRM, GST billing,
              Razorpay payments, and AI-powered automation — all in one dashboard.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <Link
                to="/register"
                className="flex items-center gap-2 bg-primary hover:bg-primary-600 text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-200 active:scale-95 w-full sm:w-auto justify-center"
              >
                <Zap size={20} />
                Start Free 14-Day Trial
              </Link>
              <Link
                to="/features"
                className="flex items-center gap-2 border border-white/10 hover:border-white/20 text-white font-semibold px-8 py-4 rounded-2xl text-lg hover:bg-white/5 transition-all duration-200 w-full sm:w-auto justify-center"
              >
                <Play size={18} className="text-primary" />
                See All Features
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xs text-gray-600"
            >
              No credit card required · 14-day free trial · Cancel anytime
            </motion.p>
          </div>

          {/* Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.21, 0.68, 0.47, 0.98] }}
            className="mt-16 relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_120px_rgba(255,107,53,0.1)] bg-[#0B0906]">
              {/* Fake browser bar */}
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

              {/* Dashboard preview */}
              <div className="p-6 bg-[#100D0A]">
                {/* Stat cards row */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Total Members', value: '1,247', change: '+12%', color: 'text-emerald-400', icon: '👥' },
                    { label: "Today's Revenue", value: '₹18,400', change: '+8%', color: 'text-primary', icon: '💰' },
                    { label: 'Present Now', value: '43', change: 'live', color: 'text-blue-400', icon: '✅' },
                    { label: 'New Leads', value: '28', change: '+5 today', color: 'text-purple-400', icon: '🎯' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-[#1E1812] border border-white/5 rounded-xl p-4">
                      <div className="text-lg mb-1">{stat.icon}</div>
                      <div className="font-bold text-xl text-white">{stat.value}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
                      <div className={`text-xs font-semibold mt-1 ${stat.color}`}>{stat.change}</div>
                    </div>
                  ))}
                </div>

                {/* Charts row */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Revenue chart */}
                  <div className="col-span-2 bg-[#1E1812] border border-white/5 rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-3 font-semibold uppercase">Revenue Trend — Last 7 Days</div>
                    <div className="flex items-end gap-2 h-24">
                      {[40, 65, 45, 80, 55, 90, 72].map((h, i) => (
                        <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, background: i === 5 ? '#FF6B35' : 'rgba(255,107,53,0.2)' }} />
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] text-gray-600">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <span key={d}>{d}</span>)}
                    </div>
                  </div>

                  {/* Attendance live */}
                  <div className="bg-[#1E1812] border border-white/5 rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-3 font-semibold uppercase flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" /> Live Attendance
                    </div>
                    {[
                      { name: 'Rahul K.', time: '2 min ago', color: 'bg-primary' },
                      { name: 'Priya M.', time: '5 min ago', color: 'bg-blue-500' },
                      { name: 'Amit S.', time: '8 min ago', color: 'bg-emerald-500' },
                    ].map(m => (
                      <div key={m.name} className="flex items-center gap-2 mb-2.5">
                        <div className={`w-7 h-7 rounded-full ${m.color} flex items-center justify-center text-xs font-bold text-white`}>
                          {m.name[0]}
                        </div>
                        <div>
                          <div className="text-xs text-white font-medium">{m.name}</div>
                          <div className="text-[10px] text-gray-500">{m.time}</div>
                        </div>
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -left-6 top-1/3 hidden lg:block">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 backdrop-blur-sm"
              >
                <CheckCircle2 size={20} className="text-emerald-400 mb-1" />
                <div className="text-xs font-bold text-white">Auto Renewal</div>
                <div className="text-[10px] text-gray-500">Sent 47 reminders</div>
              </motion.div>
            </div>
            <div className="absolute -right-6 top-1/4 hidden lg:block">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="bg-primary/10 border border-primary/20 rounded-2xl p-4 backdrop-blur-sm"
              >
                <IndianRupee size={20} className="text-primary mb-1" />
                <div className="text-xs font-bold text-white">₹18,400</div>
                <div className="text-[10px] text-gray-500">Collected today</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="py-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ label, value, suffix, prefix, icon: Icon }, i) => (
              <Reveal key={label} delay={i * 0.1} className="text-center">
                <Icon size={22} className="text-primary mx-auto mb-3 opacity-80" />
                <div className="font-display font-bold text-4xl text-white mb-1">
                  <Counter end={value} suffix={suffix} prefix={prefix} />
                </div>
                <div className="text-sm text-gray-500">{label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
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
              GymPro India brings it all together.
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
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0B0906]">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl sm:text-5xl mb-4">
              Up and running in <span className="text-gradient">15 minutes</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              No technical setup. No consultants. Just sign up and start managing your gym like a pro.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connector line */}
            <div className="hidden lg:block absolute top-12 left-1/4 right-1/4 h-px bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />

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

      {/* ── INDIA-SPECIFIC ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
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
                Unlike generic gym software from the West, GymPro India is built specifically for Indian market requirements.
              </p>
              <div className="space-y-4">
                {[
                  { icon: IndianRupee, text: 'INR (₹) currency with GST-inclusive pricing and invoicing' },
                  { icon: Smartphone, text: 'Indian mobile number validation and +91 support' },
                  { icon: CreditCard, text: 'Razorpay payment gateway — UPI, cards, net banking' },
                  { icon: Globe, text: 'All Indian states dropdown for member profiles' },
                  { icon: MessageCircle, text: 'WhatsApp reminders for renewals (coming soon)' },
                  { icon: Lock, text: 'India-specific data privacy compliance (PDPB ready)' },
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
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-gray-500">Plan Name</span>
                    <span className="text-white font-medium">Premium 3 Months</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-gray-500">Base Amount</span>
                    <span className="text-white">₹2,380</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-gray-500">CGST (9%)</span>
                    <span className="text-white">₹214</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-gray-500">SGST (9%)</span>
                    <span className="text-white">₹214</span>
                  </div>
                  <div className="flex justify-between py-2 bg-primary/5 rounded-lg px-3">
                    <span className="text-white font-bold">Total (incl. GST)</span>
                    <span className="text-primary font-bold text-lg">₹2,808</span>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span className="text-sm text-emerald-300 font-medium">GST Invoice auto-emailed to member</span>
                </div>
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
            {plans.map(({ name, price, period, popular, desc, features: planFeatures, cta, href, variant }, i) => (
              <Reveal key={name} delay={i * 0.1}>
                <div className={`relative h-full flex flex-col rounded-2xl p-6 transition-all ${
                  popular
                    ? 'bg-primary/5 border-2 border-primary shadow-2xl shadow-primary/20 -mt-2'
                    : 'bg-[#1E1812] border border-white/5'
                }`}>
                  {popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                        ⭐ Most Popular
                      </span>
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
                    {planFeatures.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle2 size={14} className={popular ? 'text-primary' : 'text-emerald-500'} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={href}
                    className={`w-full text-center py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 ${
                      variant === 'primary'
                        ? 'bg-primary hover:bg-primary-600 text-white shadow-lg shadow-primary/30'
                        : 'border border-white/10 hover:border-white/20 text-white hover:bg-white/5'
                    }`}
                  >
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
                    {[...Array(rating)].map((_, i) => (
                      <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed flex-1 mb-6">"{text}"</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white font-bold text-sm`}>
                      {initials}
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{name}</div>
                      <div className="text-xs text-gray-500">{role} • {city}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="relative bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-3xl p-12 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent" />
              <div className="relative">
                <Award size={40} className="text-primary mx-auto mb-6" />
                <h2 className="font-display font-bold text-4xl sm:text-5xl mb-4">
                  Ready to transform your gym?
                </h2>
                <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
                  Join 1,200+ gyms across India who chose GymPro India to run their business smarter.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    to="/register"
                    className="flex items-center gap-2 bg-primary hover:bg-primary-600 text-white font-bold px-10 py-4 rounded-2xl text-lg shadow-2xl shadow-primary/40 transition-all active:scale-95"
                  >
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