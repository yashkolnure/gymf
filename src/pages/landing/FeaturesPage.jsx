import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Users, QrCode, TrendingUp, BarChart3, CreditCard, Package,
  GitBranch, Shield, Bell, Zap, CheckCircle2, ArrowRight,
  UserCheck, Calendar, Kanban, PieChart, Receipt, Archive,
  Building2, Lock, Clock, ChevronRight, Star
} from 'lucide-react';
import LandingNav from '../../components/landing/LandingNav';
import Footer from '../../components/landing/Footer';

function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.21, 0.68, 0.47, 0.98] }} className={className}>
      {children}
    </motion.div>
  );
}

const featureSections = [
  {
    id: 'members',
    icon: Users,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    badge: 'Member Management',
    title: 'Complete Member Lifecycle — Start to Expiry',
    desc: 'Every detail about your gym members in one place. From their emergency contact to their fitness goals, from QR code to membership history — GymPro India covers it all.',
    highlights: [
      { icon: UserCheck, text: 'Full member profiles with photo upload and member ID' },
      { icon: QrCode, text: 'QR code auto-generated per member for instant check-in' },
      { icon: Calendar, text: 'Membership lifecycle: Active → Expired → Frozen — auto-managed' },
      { icon: Bell, text: 'Automatic renewal reminders sent 7 days before expiry' },
      { icon: Users, text: 'Emergency contact, health info, fitness goals, notes' },
      { icon: TrendingUp, text: 'Full payment history and renewal audit trail' },
    ],
    details: [
      'Import existing members in bulk via CSV upload',
      'Soft-delete with full data retention (never lose history)',
      'Member search by name, phone, email, or member ID',
      'Renew memberships with one click — choose new plan, apply discounts',
      'Freeze memberships for medical/travel (days don\'t expire while frozen)',
      'Print or share membership cards with QR code embedded',
    ],
  },
  {
    id: 'attendance',
    icon: QrCode,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    badge: 'Attendance System',
    title: 'QR Attendance in Under 2 Seconds',
    desc: 'Replace clipboards and paper registers with a live digital attendance system. Members scan their QR code at the entrance — that\'s it.',
    highlights: [
      { icon: QrCode, text: 'QR scan check-in — no app install needed for members' },
      { icon: UserCheck, text: 'Manual check-in by phone number or member ID' },
      { icon: Calendar, text: 'Monthly calendar view showing each member\'s attendance pattern' },
      { icon: Users, text: 'Live attendance board — see who\'s in the gym right now' },
      { icon: Clock, text: 'Check-out tracking with total time spent per visit' },
      { icon: BarChart3, text: 'Daily, weekly, monthly attendance trend charts' },
    ],
    details: [
      'Works on any device — tablet at reception, phone in hand',
      'Detects duplicate check-ins — prevents same-day double entry',
      'Staff attendance with shift start/end tracking',
      'Export attendance report as CSV or PDF',
      'Auto-refreshes every 30 seconds on the live board',
      'Peak hour analysis to understand gym capacity usage',
    ],
  },
  {
    id: 'leads',
    icon: TrendingUp,
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
    badge: 'Lead CRM',
    title: '7-Stage Lead Pipeline from First Contact to Membership',
    desc: 'Never lose a potential member again. The built-in CRM gives you a visual Kanban board to track every prospect from the moment they walk in or call.',
    highlights: [
      { icon: Kanban, text: 'Kanban board with 7 stages: New → Contacted → Follow-up → Trial → Negotiation → Converted → Lost' },
      { icon: Bell, text: 'Follow-up reminders with notes attached to each lead' },
      { icon: UserCheck, text: 'One-click convert lead to member — data auto-fills' },
      { icon: PieChart, text: 'Conversion rate analytics and pipeline health score' },
      { icon: Users, text: 'Source tracking — walk-in, referral, Instagram, Google' },
      { icon: Calendar, text: 'Trial day scheduling and reminder system' },
    ],
    details: [
      'Drag and drop leads between pipeline stages',
      'List view or Kanban view — switch with one click',
      'Filter leads by stage, source, date, or assigned staff',
      'Lead history with all activities and notes in a timeline',
      'Bulk update lead stages for efficiency',
      'Monthly conversion funnel report with drop-off analysis',
    ],
  },
  {
    id: 'analytics',
    icon: BarChart3,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    badge: 'Dashboard Analytics',
    title: 'Know Your Numbers. Every Day.',
    desc: 'A real-time analytics dashboard that gives gym owners the KPIs they actually need — revenue, attendance, member churn, and lead flow — all at a glance.',
    highlights: [
      { icon: BarChart3, text: 'Revenue trend area chart — daily, weekly, monthly' },
      { icon: Users, text: 'Attendance bar chart with peak hour heatmap' },
      { icon: PieChart, text: 'Plan distribution pie chart — see which plans sell most' },
      { icon: TrendingUp, text: 'Lead funnel visualization with conversion rates' },
      { icon: Star, text: 'Top members leaderboard by visits and spend' },
      { icon: Bell, text: 'Expiring memberships widget — 7-day advance warning' },
    ],
    details: [
      'Dashboard auto-refreshes with React Query background sync',
      'All charts are interactive — hover for details, click to drill down',
      'Today\'s summary vs last month comparison (% change)',
      'Revenue breakdown by plan type and payment method',
      'New member growth chart month over month',
      'Export any chart as PNG or the full report as PDF',
    ],
  },
  {
    id: 'payments',
    icon: CreditCard,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    badge: 'Payments & GST',
    title: 'India-Compliant Billing with Razorpay',
    desc: 'Handle all your gym payments in one place — collect online via UPI/cards, generate GST invoices automatically, and track outstanding dues.',
    highlights: [
      { icon: CreditCard, text: 'Razorpay integration — UPI, cards, net banking, wallets' },
      { icon: Receipt, text: 'Auto-generate GST invoices with CGST + SGST breakdown' },
      { icon: TrendingUp, text: 'Track payment history per member — all in one timeline' },
      { icon: Bell, text: 'Overdue payment alerts for staff to follow up' },
      { icon: Archive, text: 'Membership plan pricing with offer dates and expiry' },
      { icon: BarChart3, text: 'Revenue reports: daily, monthly, plan-wise, mode-wise' },
    ],
    details: [
      'Support for cash, card, UPI, and online payment modes',
      'Discount and offer pricing per plan with date validity',
      'GST rates configurable per plan (0%, 5%, 18%)',
      'Bulk payment due report — export to Excel',
      'Payment receipt printable or shareable via WhatsApp',
      'Integration with Tally-compatible export formats (coming soon)',
    ],
  },
  {
    id: 'staff',
    icon: Shield,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    badge: 'Staff & Access Control',
    title: 'Role-Based Access for Your Entire Team',
    desc: 'Give each staff member access to exactly what they need — nothing more, nothing less. Protect sensitive financial data while empowering trainers and receptionists.',
    highlights: [
      { icon: Shield, text: '4 roles: Owner, Branch Manager, Receptionist, Trainer' },
      { icon: Lock, text: 'Granular permissions per module per role' },
      { icon: UserCheck, text: 'Staff profiles with designation and salary info' },
      { icon: Calendar, text: 'Staff attendance tracking with shift management' },
      { icon: BarChart3, text: 'Payroll summary and attendance-based calculations' },
      { icon: Archive, text: 'Full audit logs — every action traceable to a user' },
    ],
    details: [
      'Owner has full access to all modules and settings',
      'Branch Manager can manage their assigned branch only',
      'Receptionist can manage members, attendance, and leads',
      'Trainer sees only their assigned members\' profiles',
      'Permission matrix editor for custom role configurations',
      'Staff login with separate dashboard filtered by role',
    ],
  },
  {
    id: 'inventory',
    icon: Package,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    badge: 'Inventory & POS',
    title: 'Sell Supplements, Track Stock, Grow Revenue',
    desc: 'Turn your gym into a revenue machine. Track and sell supplements, merchandise, and equipment directly from the app with integrated POS.',
    highlights: [
      { icon: Archive, text: 'Categories: Supplements, Equipment, Merchandise, Accessories' },
      { icon: Bell, text: 'Low stock alerts — set threshold per item' },
      { icon: CreditCard, text: 'POS sell modal — sell with one click, log payment mode' },
      { icon: BarChart3, text: 'Revenue tracking per item and category over time' },
      { icon: Receipt, text: 'Sale receipt generated for every transaction' },
      { icon: TrendingUp, text: 'Best-selling items and profit margin analysis' },
    ],
    details: [
      'Add products with name, SKU, category, price, and supplier info',
      'Restock with purchase price tracking for margin calculation',
      'Stock history with every sale and restock logged',
      'Multi-unit support: pieces, kg, liters',
      'Supplier contact details stored per product',
      'Monthly inventory value report for accounting',
    ],
  },
  {
    id: 'branches',
    icon: GitBranch,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    badge: 'Branch Management',
    title: 'One Dashboard for All Your Branches',
    desc: 'Managing a gym chain? GymPro India scales with you. Add unlimited branches, assign staff and members, and see each branch\'s performance independently.',
    highlights: [
      { icon: Building2, text: 'Add unlimited branches (Professional & Enterprise plans)' },
      { icon: Users, text: 'Branch-wise member assignment — no data mix-up' },
      { icon: UserCheck, text: 'Staff assigned per branch with branch manager role' },
      { icon: Archive, text: 'Facilities tracking — pool, sauna, yoga room, parking' },
      { icon: Clock, text: 'Operating hours configuration per branch' },
      { icon: BarChart3, text: 'Branch-wise revenue and attendance comparison' },
    ],
    details: [
      'Each branch has its own member database and attendance system',
      'Branch managers can only see their branch\'s data',
      'Owner has consolidated view across all branches',
      'Transfer members between branches with history preserved',
      'Branch-wise plan pricing if different from main gym',
      'Branch-level notification settings for automation',
    ],
  },
  {
    id: 'automation',
    icon: Bell,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    badge: 'Automation',
    title: 'Your Gym Runs Itself While You Sleep',
    desc: 'The automation engine runs every morning at 6 AM IST — expiring memberships, sending reminders, flagging inactive members, and summarizing the day.',
    highlights: [
      { icon: Clock, text: 'Daily cron at 6 AM IST — automatic, no setup needed' },
      { icon: UserCheck, text: 'Auto-expire memberships — no manual status updates' },
      { icon: Bell, text: 'Renewal reminder emails sent 7 days before expiry' },
      { icon: Users, text: 'Inactive member detection — configurable threshold (days)' },
      { icon: BarChart3, text: 'Daily summary notification to gym owner' },
      { icon: Lock, text: 'Full automation log for every action taken by the engine' },
    ],
    details: [
      'Automated emails use your gym\'s branding and name',
      'Configure inactivity threshold (default: 30 days)',
      'Automation runs even if the app is closed — server-side cron',
      'SMS reminder support coming soon (Twilio integration)',
      'Webhook support for custom automation (Enterprise)',
      'Never miss a renewal — automation handles the follow-up loop',
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#100D0A] text-white overflow-x-hidden">
      <LandingNav />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-6">
            <Zap size={14} />
            All Features — Detailed
          </div>
          <h1 className="font-display font-bold text-5xl sm:text-6xl mb-5 tracking-tight">
            Every feature your gym<br />
            <span className="text-gradient">could ever need</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10">
            9 powerful modules. 100+ individual features. All included in your subscription.
            Here's a complete breakdown of what you get.
          </p>
          {/* Feature nav pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {featureSections.map(({ id, badge, color }) => (
              <a
                key={id}
                href={`#${id}`}
                className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all hover:scale-105 ${color} bg-white/5 border-white/10 hover:border-current`}
              >
                {badge}
              </a>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Feature Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-24">
        {featureSections.map(({ id, icon: Icon, color, bg, border, badge, title, desc, highlights, details }, idx) => (
          <section key={id} id={id}>
            <Reveal>
              <div className={`flex items-center gap-3 ${bg} ${border} border rounded-full px-4 py-2 w-fit mb-6`}>
                <Icon size={16} className={color} />
                <span className={`text-sm font-bold ${color}`}>{badge}</span>
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4 max-w-3xl">{title}</h2>
              <p className="text-gray-400 text-lg mb-10 max-w-2xl">{desc}</p>
            </Reveal>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Highlights */}
              <Reveal delay={0.1}>
                <div className="bg-[#1E1812] border border-white/5 rounded-2xl p-6">
                  <h3 className="font-bold text-white mb-5 text-sm uppercase tracking-wider text-gray-400">Key Capabilities</h3>
                  <div className="space-y-4">
                    {highlights.map(({ icon: HIcon, text }) => (
                      <div key={text} className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                          <HIcon size={15} className={color} />
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">{text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Details */}
              <Reveal delay={0.2}>
                <div className="bg-[#1E1812] border border-white/5 rounded-2xl p-6">
                  <h3 className="font-bold text-white mb-5 text-sm uppercase tracking-wider text-gray-400">In Detail</h3>
                  <ul className="space-y-3">
                    {details.map(d => (
                      <li key={d} className="flex items-start gap-2.5 text-sm text-gray-400">
                        <CheckCircle2 size={15} className={`${color} mt-0.5 flex-shrink-0`} />
                        {d}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 pt-5 border-t border-white/5">
                    <Link to="/docs" className={`flex items-center gap-1.5 text-sm font-semibold ${color} hover:underline`}>
                      View documentation for {badge.toLowerCase()}
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>

            {idx < featureSections.length - 1 && (
              <div className="mt-20 border-t border-white/5" />
            )}
          </section>
        ))}
      </div>

      {/* Bottom CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0B0906]">
        <Reveal className="max-w-3xl mx-auto text-center">
          <h2 className="font-display font-bold text-4xl mb-5">
            Seen enough? <span className="text-gradient">Start your free trial.</span>
          </h2>
          <p className="text-gray-400 mb-8 text-lg">14 days. All features. No card required.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="flex items-center gap-2 bg-primary hover:bg-primary-600 text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-xl shadow-primary/30 transition-all active:scale-95">
              <Zap size={20} />
              Get Started Free
            </Link>
            <Link to="/docs" className="flex items-center gap-2 text-gray-400 hover:text-white font-medium transition-colors">
              Read the docs <ChevronRight size={16} />
            </Link>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}