import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  BookOpen, Users, QrCode, TrendingUp, BarChart3, CreditCard,
  Package, GitBranch, Shield, Bell, Settings, ChevronRight,
  Search, Zap, CheckCircle2, AlertCircle, Lightbulb,
  ArrowRight, UserCheck, Clock, Building2, Receipt,
  UserPlus, ScanLine, RefreshCw, IndianRupee, Star
} from 'lucide-react';
import LandingNav from '../../components/landing/LandingNav';
import Footer from '../../components/landing/Footer';

function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }} className={className}>
      {children}
    </motion.div>
  );
}

function Step({ number, title, children, tip }) {
  return (
    <div className="flex gap-4 mb-7">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm mt-0.5">
        {number}
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-white text-sm mb-1.5">{title}</h4>
        <div className="text-sm text-gray-400 leading-relaxed">{children}</div>
        {tip && (
          <div className="mt-2.5 flex items-start gap-2 bg-amber-500/8 border border-amber-500/20 rounded-lg px-3 py-2">
            <Lightbulb size={13} className="text-amber-400 mt-0.5 flex-shrink-0" />
            <span className="text-xs text-amber-300">{tip}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function Note({ type = 'info', children }) {
  const cfg = {
    info:    { bg: 'bg-blue-500/8',    border: 'border-blue-500/20',    Icon: AlertCircle, color: 'text-blue-400'    },
    tip:     { bg: 'bg-emerald-500/8', border: 'border-emerald-500/20', Icon: Lightbulb,   color: 'text-emerald-400' },
    warning: { bg: 'bg-amber-500/8',   border: 'border-amber-500/20',   Icon: AlertCircle, color: 'text-amber-400'   },
  };
  const { bg, border, Icon, color } = cfg[type];
  return (
    <div className={`${bg} ${border} border rounded-xl p-4 flex gap-3 my-4`}>
      <Icon size={15} className={`${color} mt-0.5 flex-shrink-0`} />
      <div className={`text-sm ${color} leading-relaxed`}>{children}</div>
    </div>
  );
}

function PathBar({ steps }) {
  return (
    <div className="bg-[#1E1812] border border-white/6 rounded-xl p-4 mb-6 flex items-center gap-2 flex-wrap">
      {steps.map((s, i) => (
        <span key={s} className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-lg font-mono text-xs font-medium ${
            i === steps.length - 1
              ? 'bg-primary/15 border border-primary/25 text-primary'
              : 'bg-white/6 text-gray-400'
          }`}>{s}</span>
          {i < steps.length - 1 && <ChevronRight size={13} className="text-gray-600" />}
        </span>
      ))}
    </div>
  );
}

const navSections = [
  { id: 'first-time',  label: 'First-Time Setup',   icon: Zap },
  { id: 'gym-profile', label: 'Gym Profile',         icon: Building2 },
  { id: 'plans',       label: 'Membership Plans',    icon: IndianRupee },
  { id: 'members',     label: 'Members',             icon: UserPlus },
  { id: 'attendance',  label: 'Attendance',          icon: ScanLine },
  { id: 'leads',       label: 'Lead CRM',            icon: TrendingUp },
  { id: 'payments',    label: 'Payments & GST',      icon: Receipt },
  { id: 'staff',       label: 'Staff & Roles',       icon: Shield },
  { id: 'branches',    label: 'Branches',            icon: GitBranch },
  { id: 'inventory',   label: 'Inventory',           icon: Package },
  { id: 'automation',  label: 'Automation & Alerts', icon: Bell },
  { id: 'reports',     label: 'Reports & Audit',     icon: BarChart3 },
  { id: 'settings',    label: 'Settings',            icon: Settings },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('first-time');
  const [search, setSearch] = useState('');

  return (
    <div className="min-h-screen bg-[#100D0A] text-white">
      <LandingNav />

      {/* Header */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 text-center border-b border-white/5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-5">
            <BookOpen size={14} />
            User Guide
          </div>
          <h1 className="font-display font-bold text-5xl mb-4">How to Use GymPro India</h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
            Simple, step-by-step guides for every feature — no technical knowledge needed.
          </p>
          <div className="max-w-md mx-auto relative">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search guides…"
              className="w-full bg-[#1E1812] border border-white/8 focus:border-primary/40 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 outline-none text-sm"
            />
          </div>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-10">

          {/* Sidebar */}
          <aside className="hidden lg:block w-52 flex-shrink-0 sticky top-24 self-start">
            <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest mb-3 px-3">Sections</p>
            <nav className="space-y-0.5">
              {navSections.map(({ id, label, icon: Icon }) => (
                <a key={id} href={`#${id}`} onClick={() => setActiveSection(id)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeSection === id ? 'bg-primary/12 text-primary border border-primary/20' : 'text-gray-500 hover:text-white hover:bg-white/4'
                  }`}>
                  <Icon size={14} />{label}
                </a>
              ))}
            </nav>
            <div className="mt-8 bg-primary/8 border border-primary/20 rounded-xl p-4">
              <p className="text-xs text-primary font-semibold mb-1">Need help?</p>
              <p className="text-xs text-gray-500 mb-3">Mon–Sat, 9 AM – 8 PM IST on WhatsApp & email.</p>
              <Link to="/support" className="text-xs text-primary hover:underline flex items-center gap-1">
                Visit Support <ArrowRight size={11} />
              </Link>
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0 space-y-20">

            {/* ── 1. FIRST-TIME SETUP ── */}
            <section id="first-time">
              <Reveal>
                <div className="flex items-center gap-3 mb-2">
                  <Zap size={22} className="text-primary" />
                  <h2 className="font-display font-bold text-2xl text-white">First-Time Setup</h2>
                </div>
                <p className="text-gray-400 text-sm mb-8">Follow these 5 steps when you log in for the first time. Takes about 10 minutes total.</p>

                <Step number="1" title="Register your gym account"
                  tip="Use a real email — invoices and renewal reminders will be sent from this address.">
                  Go to <Link to="/register" className="text-primary hover:underline">gymproindia.in/register</Link> and enter your name, gym name, email, and password. Click <strong className="text-white">Create Account</strong>.
                </Step>
                <Step number="2" title="Complete your Gym Profile"
                  tip="Adding your GST number here means it auto-appears on every invoice.">
                  After logging in, click <strong className="text-white">Settings</strong> in the left sidebar → <strong className="text-white">Gym Profile</strong>. Upload your logo, enter your address, phone, and GST number. Click <strong className="text-white">Save Changes</strong>.
                </Step>
                <Step number="3" title="Create your first Membership Plan">
                  Go to <strong className="text-white">Plans</strong> in the sidebar → <strong className="text-white">+ Create Plan</strong>. Enter a name (e.g., "Monthly ₹999"), duration of 30 days, and the price. You need at least one plan before adding members.
                </Step>
                <Step number="4" title="Add your first member">
                  Go to <strong className="text-white">Members → Add Member</strong>. Enter their name, mobile number, select the plan, and pick a start date. Click <strong className="text-white">Save</strong>.
                </Step>
                <Step number="5" title="Test attendance with the QR code">
                  Open the member's profile — you'll see their QR code. Go to <strong className="text-white">Attendance → Scan QR</strong> and point your camera at it. The check-in logs instantly.
                </Step>

                <Note type="tip">You can load sample data to explore the system before adding real members. Go to <strong>Settings → Demo Data</strong>.</Note>
              </Reveal>
            </section>

            {/* ── 2. GYM PROFILE ── */}
            <section id="gym-profile">
              <Reveal>
                <div className="flex items-center gap-3 mb-2">
                  <Building2 size={22} className="text-amber-400" />
                  <h2 className="font-display font-bold text-2xl text-white">Gym Profile Setup</h2>
                </div>
                <p className="text-gray-400 text-sm mb-8">Your gym profile controls what appears on invoices, member emails, and membership cards.</p>
                <PathBar steps={['Sidebar', 'Settings', 'Gym Profile']} />

                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { field: 'Gym Name',     desc: 'Appears on all invoices and member emails' },
                    { field: 'Logo',         desc: 'Upload PNG or JPG — shown on invoices and member cards' },
                    { field: 'Brand Color',  desc: 'Hex code for accent color in member communications' },
                    { field: 'GST Number',   desc: 'Your 15-digit GSTIN — auto-fills on every invoice' },
                    { field: 'Address',      desc: 'Shown on invoices and membership documents' },
                    { field: 'Tagline',      desc: 'Short motto shown under your gym name (optional)' },
                    { field: 'Contact Phone','desc': 'Main enquiry number shown in member emails' },
                    { field: 'Website URL',  desc: 'Link to your website or Instagram (optional)' },
                  ].map(({ field, desc }) => (
                    <div key={field} className="bg-[#1E1812] border border-white/6 rounded-xl p-4">
                      <div className="font-semibold text-white text-sm">{field}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
                    </div>
                  ))}
                </div>
                <Note type="info">Changes take effect immediately on new invoices. Existing invoices are not updated retroactively.</Note>
              </Reveal>
            </section>

            {/* ── 3. PLANS ── */}
            <section id="plans">
              <Reveal>
                <div className="flex items-center gap-3 mb-2">
                  <IndianRupee size={22} className="text-emerald-400" />
                  <h2 className="font-display font-bold text-2xl text-white">Membership Plans</h2>
                </div>
                <p className="text-gray-400 text-sm mb-8">Define the pricing and duration of memberships. Create as many as you need — monthly, quarterly, annual, day passes.</p>
                <PathBar steps={['Sidebar', 'Plans']} />

                <Step number="1" title="Click + Create Plan">
                  On the Plans page, click the <strong className="text-white">+ Create Plan</strong> button (top right).
                </Step>
                <Step number="2" title="Enter name, duration, and price">
                  Example: Name = <em className="text-gray-300">"3 Month Premium"</em>, Duration = 3 Months, Price = ₹2,499.
                </Step>
                <Step number="3" title="Set the GST rate"
                  tip="Fitness services in India typically attract 18% GST. If you're not GST-registered, set this to 0%.">
                  Select the GST percentage. CGST + SGST will be split automatically on the invoice.
                </Step>
                <Step number="4" title="Add an offer price (optional)">
                  Toggle <strong className="text-white">Enable Offer Price</strong>, enter the discounted amount and an expiry date. After that date, the plan auto-reverts to full price.
                </Step>
                <Step number="5" title="List plan features (optional)">
                  Add what's included — e.g., <em className="text-gray-300">"Steam room, 2 PT sessions, Supplement discount"</em>. This appears on invoices and membership cards.
                </Step>

                <Note type="warning">Can't delete a plan with active members on it. Use <strong>Archive Plan</strong> instead to hide it from the Add Member screen while keeping all history.</Note>
              </Reveal>
            </section>

            {/* ── 4. MEMBERS ── */}
            <section id="members">
              <Reveal>
                <div className="flex items-center gap-3 mb-2">
                  <UserPlus size={22} className="text-blue-400" />
                  <h2 className="font-display font-bold text-2xl text-white">Adding & Managing Members</h2>
                </div>
                <p className="text-gray-400 text-sm mb-8">Add members, renew and freeze memberships, view full history and QR codes.</p>
                <PathBar steps={['Sidebar', 'Members']} />

                <h3 className="font-bold text-white mb-4 text-base">Adding a new member</h3>
                <Step number="1" title="Click + Add Member (top right)">
                  <strong className="text-white">Required:</strong> Full name, mobile number, plan, start date.<br />
                  <strong className="text-white">Optional:</strong> Email, photo, DOB, gender, emergency contact, health notes, fitness goals.
                </Step>
                <Step number="2" title="Assign to a branch">
                  If you have multiple branches, select the member's home branch. They'll appear in that branch's lists.
                </Step>
                <Step number="3" title="Save and share the QR code"
                  tip="Use the Share button on the member's profile to send the QR code directly over WhatsApp.">
                  Click <strong className="text-white">Save Member</strong>. A unique QR code and Member ID are created automatically. Print the card or share the QR code.
                </Step>

                <h3 className="font-bold text-white mb-4 mt-8 text-base">Renewing a membership</h3>
                <Step number="1" title="Open the member's profile → click Renew">
                  Click any member row to open their detail page, then click the <strong className="text-white">Renew Membership</strong> button.
                </Step>
                <Step number="2" title="Select plan, date, and any discount">
                  A popup appears. Choose the new plan, set the start date, apply a discount if applicable.
                </Step>
                <Step number="3" title="Confirm — invoice emails automatically">
                  Click <strong className="text-white">Confirm Renewal</strong>. Dates update instantly and a GST invoice is emailed to the member.
                </Step>

                <h3 className="font-bold text-white mb-4 mt-8 text-base">Freezing a membership</h3>
                <p className="text-sm text-gray-400 mb-4">Use when a member travels or has a medical issue. The countdown pauses — days don't expire while frozen.</p>
                <Step number="1" title="Open profile → click Freeze Membership">
                  Confirm the freeze. The status badge changes to <span className="text-blue-400 font-semibold">Frozen</span>.
                </Step>
                <Step number="2" title="Click Unfreeze when they return">
                  The countdown resumes from exactly where it paused.
                </Step>

                <h3 className="font-bold text-white mb-3 mt-8 text-base">Member statuses</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { s: 'Active',  c: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', d: 'Membership is valid.' },
                    { s: 'Expired', c: 'text-red-400 bg-red-500/10 border-red-500/20',            d: 'Auto-set at 6 AM daily.' },
                    { s: 'Frozen',  c: 'text-blue-400 bg-blue-500/10 border-blue-500/20',         d: 'Manually paused.' },
                  ].map(({ s, c, d }) => (
                    <div key={s} className={`${c} border rounded-xl p-4`}>
                      <div className="font-bold text-sm mb-1">{s}</div>
                      <div className="text-xs opacity-80">{d}</div>
                    </div>
                  ))}
                </div>
                <Note type="info">Members are never permanently deleted. All history is retained. Contact support to restore a deleted member.</Note>
              </Reveal>
            </section>

            {/* ── 5. ATTENDANCE ── */}
            <section id="attendance">
              <Reveal>
                <div className="flex items-center gap-3 mb-2">
                  <ScanLine size={22} className="text-violet-400" />
                  <h2 className="font-display font-bold text-2xl text-white">Attendance Tracking</h2>
                </div>
                <p className="text-gray-400 text-sm mb-8">Track every member visit using QR scan or manual entry. See who's currently in the gym on the live board.</p>
                <PathBar steps={['Sidebar', 'Attendance']} />

                <h3 className="font-bold text-white mb-4 text-base">Setting up QR scanning at reception</h3>
                <Step number="1" title="Open Attendance on a tablet at the entrance"
                  tip="A dedicated low-cost Android tablet works perfectly as a permanent QR station.">
                  Log into GymPro India on the device and go to <strong className="text-white">Attendance</strong> in the sidebar.
                </Step>
                <Step number="2" title="Click 'Scan QR' and allow camera access">
                  Hit <strong className="text-white">Scan QR Code</strong>. Your browser will ask for camera permission — click Allow.
                </Step>
                <Step number="3" title="Member shows their QR code">
                  Members hold their QR code (on their printed card or WhatsApp message) up to the camera. Check-in registers in under 2 seconds.
                </Step>
                <Step number="4" title="Green = check-in successful, Red = membership expired">
                  A green screen confirms the check-in with the member's name and photo. A red alert means expired — check-in is blocked.
                </Step>

                <h3 className="font-bold text-white mb-4 mt-8 text-base">Manual check-in (no QR needed)</h3>
                <Step number="1" title="Click 'Manual Check-In'">
                  On the Attendance page, click <strong className="text-white">Manual Check-In</strong>.
                </Step>
                <Step number="2" title="Type phone number or Member ID">
                  The system finds the member and shows their photo and status.
                </Step>
                <Step number="3" title="Click Check In">
                  Visit is logged with the current timestamp.
                </Step>

                <h3 className="font-bold text-white mb-3 mt-8 text-base">Live Board & Monthly Calendar</h3>
                <p className="text-sm text-gray-400 mb-3">
                  The <strong className="text-white">Live Board</strong> shows everyone currently in the gym — auto-refreshes every 30 seconds. Great to keep on a screen at reception.
                </p>
                <p className="text-sm text-gray-400">
                  Open any member's profile → <strong className="text-white">Attendance tab</strong> to see a calendar of every visit this month with check-in and check-out times.
                </p>
              </Reveal>
            </section>

            {/* ── 6. LEADS ── */}
            <section id="leads">
              <Reveal>
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp size={22} className="text-primary" />
                  <h2 className="font-display font-bold text-2xl text-white">Lead CRM</h2>
                </div>
                <p className="text-gray-400 text-sm mb-8">Track every inquiry from first contact to paid membership using a visual Kanban pipeline.</p>
                <PathBar steps={['Sidebar', 'Leads & CRM']} />

                <h3 className="font-bold text-white mb-3 text-base">The 7 pipeline stages</h3>
                <div className="flex flex-wrap gap-2 mb-7">
                  {[
                    { s: 'New',         c: 'bg-gray-500/15 text-gray-300 border-gray-500/20' },
                    { s: 'Contacted',   c: 'bg-blue-500/15 text-blue-300 border-blue-500/20' },
                    { s: 'Follow-up',   c: 'bg-amber-500/15 text-amber-300 border-amber-500/20' },
                    { s: 'Trial',       c: 'bg-purple-500/15 text-purple-300 border-purple-500/20' },
                    { s: 'Negotiation', c: 'bg-orange-500/15 text-orange-300 border-orange-500/20' },
                    { s: 'Converted ✓', c: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20' },
                    { s: 'Lost',        c: 'bg-red-500/15 text-red-300 border-red-500/20' },
                  ].map(({ s, c }) => (
                    <span key={s} className={`${c} border rounded-full px-3 py-1 text-xs font-semibold`}>{s}</span>
                  ))}
                </div>

                <Step number="1" title="Click + Add Lead">
                  Enter name, phone, how they found you (walk-in, Instagram, referral…), and any initial notes. Click <strong className="text-white">Save</strong>.
                </Step>
                <Step number="2" title="Move them through stages">
                  Drag the card on the Kanban board, or open the lead and change the stage dropdown. Every change is timestamped.
                </Step>
                <Step number="3" title="Schedule a follow-up"
                  tip="Set a same-day follow-up on walk-ins so you never forget to call back.">
                  Inside a lead → <strong className="text-white">+ Add Follow-up</strong>. Pick date, time, add a note. Overdue follow-ups appear highlighted in red on the board.
                </Step>
                <Step number="4" title="Convert to Member in one click">
                  When they agree to join, click <strong className="text-white">Convert to Member</strong>. Their name and phone auto-fill in the Add Member form — just select a plan.
                </Step>

                <Note type="tip">Toggle between <strong>Kanban view</strong> and <strong>List view</strong> at the top right of the Leads page. List is faster for searching and bulk stage changes.</Note>
              </Reveal>
            </section>

            {/* ── 7. PAYMENTS ── */}
            <section id="payments">
              <Reveal>
                <div className="flex items-center gap-3 mb-2">
                  <Receipt size={22} className="text-amber-400" />
                  <h2 className="font-display font-bold text-2xl text-white">Payments & GST Invoicing</h2>
                </div>
                <p className="text-gray-400 text-sm mb-8">Record cash payments, collect online via Razorpay, and auto-generate GST invoices for every transaction.</p>
                <PathBar steps={['Sidebar', 'Payments']} />

                <h3 className="font-bold text-white mb-4 text-base">Enable online payments (Razorpay)</h3>
                <Step number="1" title="Create a free Razorpay account">
                  Visit <a href="https://razorpay.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">razorpay.com</a>, sign up, and complete the business KYC (required by RBI).
                </Step>
                <Step number="2" title="Copy your API keys">
                  In Razorpay Dashboard → <strong className="text-white">Settings → API Keys → Generate Key</strong>. Copy the Key ID and Secret.
                </Step>
                <Step number="3" title="Paste them in GymPro India">
                  Go to <strong className="text-white">Settings → Payment Gateway</strong>. Paste both keys and click <strong className="text-white">Save & Test Connection</strong>. Done — members can now pay online via UPI, cards, or net banking.
                </Step>

                <h3 className="font-bold text-white mb-4 mt-8 text-base">Recording a cash payment</h3>
                <Step number="1" title="Open member profile → Renew, or go to Payments → Record Payment">
                  Search for the member by name or phone.
                </Step>
                <Step number="2" title="Select 'Cash' as payment mode and enter amount">
                  Set the date of payment received.
                </Step>
                <Step number="3" title="Click Confirm Payment">
                  A GST invoice is instantly created and emailed to the member. You can also print or download it from the Payments page.
                </Step>

                <h3 className="font-bold text-white mb-4 mt-8 text-base">What's on a GST invoice</h3>
                <div className="bg-[#1E1812] border border-white/6 rounded-2xl p-5">
                  <div className="space-y-2">
                    {[
                      'Your gym name, logo, address, and GSTIN',
                      "Member's name and address",
                      'Plan name, duration, and dates',
                      'Base amount + CGST (9%) + SGST (9%) split',
                      'Total amount inclusive of GST',
                      'Payment mode and date received',
                      'Unique auto-incremented invoice number',
                    ].map(item => (
                      <div key={item} className="flex items-center gap-2.5 text-sm text-gray-400">
                        <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </section>

            {/* ── 8. STAFF ── */}
            <section id="staff">
              <Reveal>
                <div className="flex items-center gap-3 mb-2">
                  <Shield size={22} className="text-indigo-400" />
                  <h2 className="font-display font-bold text-2xl text-white">Staff & Roles</h2>
                </div>
                <p className="text-gray-400 text-sm mb-8">Add your team and control exactly what each person can see and do.</p>
                <PathBar steps={['Sidebar', 'Staff']} />

                <h3 className="font-bold text-white mb-3 text-base">The 4 roles</h3>
                <div className="space-y-3 mb-7">
                  {[
                    { r: 'Gym Owner',       c: 'text-primary',   d: 'Full access — settings, billing, staff, all reports. This is you.' },
                    { r: 'Branch Manager',  c: 'text-blue-400',  d: 'Manages their assigned branch only. No access to settings, billing, or other branches.' },
                    { r: 'Receptionist',    c: 'text-violet-400',d: 'Can add members, check attendance, manage leads. Cannot see financial reports or settings.' },
                    { r: 'Trainer',         c: 'text-emerald-400',d: 'Read-only view of their assigned members only.' },
                  ].map(({ r, c, d }) => (
                    <div key={r} className="flex gap-3 bg-[#1E1812] border border-white/6 rounded-xl p-4">
                      <div className={`font-bold text-sm w-32 flex-shrink-0 ${c}`}>{r}</div>
                      <div className="text-sm text-gray-400">{d}</div>
                    </div>
                  ))}
                </div>

                <Step number="1" title="Go to Staff → + Add Staff Member">
                  Enter name, email, phone, and designation (e.g., "Head Trainer").
                </Step>
                <Step number="2" title="Select their role">
                  Their dashboard will be filtered to match the role they're assigned.
                </Step>
                <Step number="3" title="Assign to a branch">
                  Branch Managers and Receptionists will only see data for their assigned branch.
                </Step>
                <Step number="4" title="They receive a login invite email"
                  tip="Ask staff to check their spam folder if the invite doesn't arrive.">
                  A temporary password is emailed. On first login, they'll set a new password.
                </Step>
              </Reveal>
            </section>

            {/* ── 9. BRANCHES ── */}
            <section id="branches">
              <Reveal>
                <div className="flex items-center gap-3 mb-2">
                  <GitBranch size={22} className="text-cyan-400" />
                  <h2 className="font-display font-bold text-2xl text-white">Branch Management</h2>
                </div>
                <p className="text-gray-400 text-sm mb-8">Run multiple locations from one account. Each branch has its own members, staff, and attendance.</p>
                <PathBar steps={['Sidebar', 'Branches']} />

                <Step number="1" title="Click + Add Branch">
                  Enter the branch name (e.g., "Andheri West"), full address, phone number, and operating hours.
                </Step>
                <Step number="2" title="Select available facilities">
                  Check the facilities at this location — pool, steam room, yoga studio, parking, café, etc.
                </Step>
                <Step number="3" title="Assign staff to this branch">
                  Go to <strong className="text-white">Staff</strong> and edit each person — assign them to the new branch.
                </Step>
                <Step number="4" title="Members can be assigned to branches when added">
                  When adding or editing a member, select their home branch. Attendance is tracked branch-wise.
                </Step>

                <Note type="info">As Gym Owner, your dashboard shows a <strong>combined view</strong> across all branches. Use the branch filter dropdown at the top of any page to view one branch at a time.</Note>
              </Reveal>
            </section>

            {/* ── 10. INVENTORY ── */}
            <section id="inventory">
              <Reveal>
                <div className="flex items-center gap-3 mb-2">
                  <Package size={22} className="text-rose-400" />
                  <h2 className="font-display font-bold text-2xl text-white">Inventory & Sales</h2>
                </div>
                <p className="text-gray-400 text-sm mb-8">Track and sell supplements, merchandise, and equipment. Every sale logged, every restock recorded.</p>
                <PathBar steps={['Sidebar', 'Inventory']} />

                <Step number="1" title="Click + Add Product">
                  Enter product name, category (Supplement / Equipment / Merchandise), selling price, and opening stock quantity.
                </Step>
                <Step number="2" title="Set a low-stock alert"
                  tip="For fast-moving supplements, set the alert to 5 units so you reorder before running out.">
                  Enter a number in the <strong className="text-white">Alert when stock below</strong> field. You'll see a red badge on the Inventory page and in your daily summary email when stock drops below this.
                </Step>
                <Step number="3" title="Selling an item (POS)">
                  Find the product → click <strong className="text-white">Sell</strong>. Enter the quantity, select payment mode (Cash / UPI / Card). Stock reduces automatically and a sale receipt is generated.
                </Step>
                <Step number="4" title="Restocking">
                  When new stock arrives, click <strong className="text-white">Restock</strong> on the product. Enter quantity received. Stock count updates and a restock log entry is added.
                </Step>
              </Reveal>
            </section>

            {/* ── 11. AUTOMATION ── */}
            <section id="automation">
              <Reveal>
                <div className="flex items-center gap-3 mb-2">
                  <Bell size={22} className="text-orange-400" />
                  <h2 className="font-display font-bold text-2xl text-white">Automation & Alerts</h2>
                </div>
                <p className="text-gray-400 text-sm mb-8">GymPro India runs an automation engine every morning at 6 AM. Set it up once — it runs on autopilot forever.</p>

                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {[
                    { icon: RefreshCw,  title: 'Auto-expire memberships',     desc: 'Any membership past its end date is marked Expired automatically at 6 AM. No manual updates.' },
                    { icon: Bell,       title: 'Renewal reminder emails',      desc: 'Members get a reminder email 7 days before expiry — with your gym name and branding.' },
                    { icon: UserCheck,  title: 'Inactive member detection',    desc: 'Members who haven\'t visited in X days are flagged. You get a list every morning to follow up.' },
                    { icon: BarChart3,  title: 'Daily summary to owner',       desc: 'Every morning: new members, expired memberships, today\'s revenue, and attendance — in one email.' },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="bg-[#1E1812] border border-white/6 rounded-xl p-5">
                      <Icon size={18} className="text-orange-400 mb-3" />
                      <div className="font-bold text-white text-sm mb-1">{title}</div>
                      <div className="text-xs text-gray-500 leading-relaxed">{desc}</div>
                    </div>
                  ))}
                </div>

                <h3 className="font-bold text-white mb-4 text-base">Configuring automation</h3>
                <PathBar steps={['Sidebar', 'Settings', 'Automation']} />
                <Step number="1" title="Set inactivity threshold">
                  Default is 30 days. Change to 14 or 21 days if you want earlier alerts for missing members.
                </Step>
                <Step number="2" title="Toggle which emails are sent">
                  Turn on/off renewal reminders, expiry alerts, and the owner daily summary independently.
                </Step>
                <Step number="3" title="Add recipient emails for the owner summary">
                  Add multiple email addresses to receive the daily summary (e.g., you and a business partner).
                </Step>

                <Note type="info">Automation runs on our servers at 6 AM IST every day — even when the app is closed and no one is logged in.</Note>
              </Reveal>
            </section>

            {/* ── 12. REPORTS ── */}
            <section id="reports">
              <Reveal>
                <div className="flex items-center gap-3 mb-2">
                  <BarChart3 size={22} className="text-purple-400" />
                  <h2 className="font-display font-bold text-2xl text-white">Reports & Audit Logs</h2>
                </div>
                <p className="text-gray-400 text-sm mb-8">Understand your gym's performance and maintain a complete record of every action.</p>
                <PathBar steps={['Sidebar', 'Reports']} />

                <div className="space-y-3 mb-6">
                  {[
                    { name: 'Revenue Report',    desc: 'Total revenue by day/week/month. Breakdown by plan and payment mode. Export to PDF or Excel.' },
                    { name: 'Attendance Report', desc: 'Daily counts, peak hours, most regular members, branch comparison.' },
                    { name: 'Member Report',     desc: 'New member growth, churn rate, expiring this week/month, active vs expired breakdown.' },
                    { name: 'Lead Report',       desc: 'Conversion rate, average time per pipeline stage, source analysis (walk-in vs Instagram vs referral).' },
                    { name: 'Inventory Report',  desc: 'Best-sellers, revenue per category, stock value, low-stock summary.' },
                    { name: 'Audit Logs',        desc: 'Every action logged — who deleted a member, who changed a price, who updated a payment. Permanent, tamper-proof.' },
                  ].map(({ name, desc }) => (
                    <div key={name} className="flex gap-4 bg-[#1E1812] border border-white/6 rounded-xl p-4">
                      <CheckCircle2 size={15} className="text-purple-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-white text-sm">{name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <Note type="info">Audit Logs are available on Professional and Enterprise plans. They cannot be edited or deleted — they are a permanent record.</Note>
              </Reveal>
            </section>

            {/* ── 13. SETTINGS ── */}
            <section id="settings">
              <Reveal>
                <div className="flex items-center gap-3 mb-2">
                  <Settings size={22} className="text-gray-400" />
                  <h2 className="font-display font-bold text-2xl text-white">Settings</h2>
                </div>
                <p className="text-gray-400 text-sm mb-8">All configuration is organised into tabs inside the Settings page.</p>
                <PathBar steps={['Sidebar', 'Settings']} />

                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { tab: 'Gym Profile',      desc: 'Name, logo, tagline, address, GST number, brand color' },
                    { tab: 'Payment Gateway',  desc: 'Razorpay API keys for online payment collection' },
                    { tab: 'Email / SMTP',     desc: 'Configure the email address used to send member notifications and invoices' },
                    { tab: 'Automation',       desc: 'Inactivity threshold, reminder timing, toggle each notification on/off' },
                    { tab: 'Subscription',     desc: 'Your current GymPro India plan, billing history, upgrade or downgrade' },
                    { tab: 'Security',         desc: 'Change owner password, view active login sessions' },
                    { tab: 'Data & Export',    desc: 'Download all your data as CSV or JSON, request account deletion' },
                    { tab: 'Branding',         desc: 'Customize colors and copy on member-facing emails and membership cards' },
                  ].map(({ tab, desc }) => (
                    <div key={tab} className="bg-[#1E1812] border border-white/6 rounded-xl p-4">
                      <div className="font-semibold text-white text-sm mb-1">{tab}</div>
                      <div className="text-xs text-gray-500">{desc}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </section>

          </main>
        </div>
      </div>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0B0906] border-t border-white/5">
        <Reveal className="max-w-2xl mx-auto text-center">
          <Star size={28} className="text-primary mx-auto mb-4" />
          <h2 className="font-display font-bold text-3xl mb-3">Still have questions?</h2>
          <p className="text-gray-400 mb-8">Our team is available Mon–Sat on WhatsApp and email. We respond fast.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/support" className="flex items-center gap-2 bg-primary hover:bg-primary-600 text-white font-bold px-7 py-3.5 rounded-xl transition-all active:scale-95">
              <Zap size={17} /> Visit Support Centre
            </Link>
            <Link to="/contact" className="flex items-center gap-2 border border-white/10 hover:border-white/20 text-white font-semibold px-7 py-3.5 rounded-xl transition-all hover:bg-white/4">
              Contact Us
            </Link>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}