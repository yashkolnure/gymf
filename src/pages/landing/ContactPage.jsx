import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  HelpCircle, ChevronDown, MessageCircle, Mail, Phone,
  Zap, Search, BookOpen, AlertCircle, CheckCircle2,
  Users, QrCode, CreditCard, Shield, Settings, ArrowRight
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

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${open ? 'border-primary/30 bg-primary/5' : 'border-white/5 bg-[#1E1812]'}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
      >
        <span className="font-semibold text-white text-sm leading-snug">{question}</span>
        <ChevronDown
          size={18}
          className={`text-gray-500 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180 text-primary' : ''}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="px-5 pb-4 text-sm text-gray-400 leading-relaxed border-t border-white/5 pt-3">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const faqCategories = [
  {
    icon: Zap, label: 'Getting Started', color: 'text-primary',
    faqs: [
      {
        question: 'How do I start a free trial?',
        answer: 'Click "Start Free Trial" on the home page and fill in your gym details. No credit card is required. You get 14 days of full access to all features. At the end of the trial, you can choose a paid plan or your account will be suspended (not deleted — your data is safe for 30 days).',
      },
      {
        question: 'Do I need technical knowledge to set up GymPro India?',
        answer: 'Not at all. The cloud version requires zero setup — just register and start adding members. If you\'re self-hosting (for Enterprise clients), basic Linux knowledge is needed for Docker deployment, but our team can assist.',
      },
      {
        question: 'Can I import my existing member data?',
        answer: 'Yes! Go to Members → Import and download the CSV template. Fill in your existing members\' details (name, phone, plan, start date) and upload. The system will validate and import all records. We also offer a free data migration service for Enterprise clients.',
      },
      {
        question: 'Is there a demo I can try before signing up?',
        answer: 'Yes. Use the demo credentials: demo@gymproindia.com / Demo@12345 on the login page. This gives you access to a demo gym (PowerZone Fitness) with sample data to explore all features.',
      },
    ],
  },
  {
    icon: Users, label: 'Members & Attendance', color: 'text-blue-400',
    faqs: [
      {
        question: 'How does QR code attendance work?',
        answer: 'Each member gets a unique QR code generated automatically when you add them. Place a tablet or phone at your gym entrance with the GymPro Attendance scanner open. Members scan their QR code and the check-in is logged instantly. No app install required for members.',
      },
      {
        question: 'What happens when a membership expires?',
        answer: 'At 6 AM every morning, the automation engine checks all memberships. Expired ones are automatically marked as "Expired" status. The member won\'t be able to check in (QR scan returns an error). The gym owner gets a daily summary of all expired memberships.',
      },
      {
        question: 'Can I freeze a membership for a member who is travelling?',
        answer: 'Yes. Open the member\'s profile and click "Freeze Membership". Set the start date of the freeze. The membership timer pauses — days don\'t expire while frozen. When the member returns, click "Unfreeze" and the remaining days resume.',
      },
      {
        question: 'How do I track which trainer is working with which member?',
        answer: 'In the member\'s profile, you can assign one or more trainers. Trainers who log in see only their assigned members\' profiles. You can also add trainer notes and session logs in the member\'s detail page.',
      },
    ],
  },
  {
    icon: CreditCard, label: 'Payments & Billing', color: 'text-amber-400',
    faqs: [
      {
        question: 'Does GymPro India support GST invoicing?',
        answer: 'Yes, absolutely. All membership plans can have a GST rate configured (typically 18% for fitness services). Every payment automatically generates a GST invoice showing CGST and SGST split. The invoice is emailed to the member and available to download as PDF.',
      },
      {
        question: 'How does Razorpay integration work?',
        answer: 'Go to Settings → Payment Gateway and add your Razorpay API key and secret. Once configured, you can collect payments online via UPI, debit/credit cards, net banking, and wallets. Payment status is synced automatically back to the member\'s account.',
      },
      {
        question: 'Can members pay in cash? How do I record it?',
        answer: 'Yes. When renewing a membership or recording a payment, select "Cash" as the payment mode. The transaction is logged with the mode, amount, date, and staff who recorded it. The receipt can be printed or shared via WhatsApp.',
      },
      {
        question: 'Do you charge a transaction fee on payments?',
        answer: 'No — GymPro India doesn\'t charge any transaction fees. Razorpay\'s standard rate of ~2% applies directly between you and Razorpay. We never touch your payment revenue.',
      },
    ],
  },
  {
    icon: Shield, label: 'Security & Data', color: 'text-indigo-400',
    faqs: [
      {
        question: 'Is my gym\'s data isolated from other gyms?',
        answer: 'Yes, completely. GymPro India uses a multi-tenant architecture where every API query is filtered by your gym\'s unique tenantId. Even if you\'re on a shared server, there is zero possibility of data cross-contamination between gyms.',
      },
      {
        question: 'Where is my data stored?',
        answer: 'On the cloud version, data is stored on MongoDB Atlas servers in India (ap-south-1 / Mumbai region). For Enterprise self-hosted, you control where your data lives. We never sell or share your data with third parties.',
      },
      {
        question: 'What happens to my data if I cancel my subscription?',
        answer: 'Your account is suspended (not deleted) immediately. All data is retained for 30 days. You can request a full data export (JSON/CSV) at any time before deletion. After 30 days, data is permanently and irreversibly deleted.',
      },
      {
        question: 'Is there an audit log to track staff actions?',
        answer: 'Yes. Every critical action (member deletion, payment recording, role change, settings update) is logged in the Audit Log with the timestamp, user, and details. Access it from Reports → Audit Logs. Available on Professional and Enterprise plans.',
      },
    ],
  },
  {
    icon: Settings, label: 'Settings & Configuration', color: 'text-emerald-400',
    faqs: [
      {
        question: 'Can I customize the gym branding (logo, colors)?',
        answer: 'Yes. Go to Settings → Gym Profile to upload your logo, set your brand color, tagline, and contact info. These appear on member cards, invoices, and email notifications sent to your members.',
      },
      {
        question: 'Can I set different pricing for different branches?',
        answer: 'Currently, plans are shared across all branches. Branch-specific pricing is on our roadmap for Q2 2025. For now, you can create separate plans (e.g., "Monthly - Andheri Branch") and use those selectively.',
      },
      {
        question: 'How do I configure the inactivity detection threshold?',
        answer: 'Go to Settings → Automation. Set the "Inactive Member Threshold" in days (default: 30). Members who haven\'t checked in within this period will be flagged in the dashboard and you\'ll receive a daily notification listing them.',
      },
      {
        question: 'Can I change the automation email templates?',
        answer: 'Custom email templates are available on the Enterprise plan. On Basic and Professional, we use our professionally designed templates that include your gym name and logo but cannot be fully customized yet.',
      },
    ],
  },
];

const troubleshooting = [
  {
    problem: 'QR code scan shows "Member Not Found"',
    causes: ['The QR code is from a different gym branch', 'Member was deleted (soft delete — check archived members)'],
    fix: 'Go to Members, search by phone number. If the member exists but was deleted, contact support to restore them. If they\'re in a different branch, check your branch filter at the top.',
  },
  {
    problem: 'Member shows as Expired but paid recently',
    causes: ['Payment was recorded but membership wasn\'t renewed', 'Date conflict in manual entry'],
    fix: 'Open the member profile → click "Renew Membership" and set the correct start date. The automation runs at 6 AM daily — if you renewed after 6 AM today, status updates tomorrow morning. You can manually trigger a status refresh from the member\'s profile.',
  },
  {
    problem: 'Automation emails not being sent',
    causes: ['SMTP credentials not configured', 'Gmail blocking login from the server'],
    fix: 'Go to Settings → Email Configuration. Verify your SMTP host, port, and credentials. For Gmail, use App Passwords (not your account password) under Google Account → Security → 2FA → App Passwords. Test the connection using the "Send Test Email" button.',
  },
  {
    problem: 'Can\'t log in — "Invalid credentials"',
    causes: ['Caps Lock is on', 'Password was changed by another staff member'],
    fix: 'Click "Forgot Password" on the login page to reset via email. If you\'re a staff member without an email address registered, ask your gym owner to reset your password from the Staff management page.',
  },
];

export default function SupportPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  const filteredFaqs = faqCategories.map(cat => ({
    ...cat,
    faqs: cat.faqs.filter(f =>
      !search || f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => !search || cat.faqs.length > 0);

  return (
    <div className="min-h-screen bg-[#100D0A] text-white">
      <LandingNav />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-5">
            <HelpCircle size={14} />
            Help & Support
          </div>
          <h1 className="font-display font-bold text-5xl sm:text-6xl mb-4">
            How can we <span className="text-gradient">help you?</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-lg mx-auto mb-8">
            Browse frequently asked questions, troubleshooting guides, or reach out to our support team.
          </p>
          <div className="max-w-md mx-auto relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search for answers..."
              className="w-full bg-[#1E1812] border border-white/10 focus:border-primary/40 rounded-xl pl-10 pr-4 py-3.5 text-white placeholder-gray-600 outline-none text-sm"
            />
          </div>
        </motion.div>
      </section>

      {/* Quick Links */}
      <section className="pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: BookOpen, label: 'Read the Docs', desc: 'Step-by-step feature guides', href: '/docs', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
              { icon: MessageCircle, label: 'WhatsApp Support', desc: '+91 98765 43210', href: 'https://wa.me/918767640530', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
              { icon: Mail, label: 'Email Support', desc: 'admin@avenirya.com', href: '/contact', color: 'text-primary bg-primary/10 border-primary/20' },
            ].map(({ icon: Icon, label, desc, href, color }) => (
              <Reveal key={label}>
                <Link
                  to={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  className={`flex items-center gap-4 ${color} border rounded-2xl p-5 hover:scale-[1.02] transition-all duration-200`}
                >
                  <div className="w-10 h-10 rounded-xl bg-current/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{label}</div>
                    <div className="text-xs opacity-70 mt-0.5">{desc}</div>
                  </div>
                  <ArrowRight size={14} className="ml-auto opacity-50" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Reveal className="mb-10 text-center">
            <h2 className="font-display font-bold text-3xl sm:text-4xl">Frequently Asked Questions</h2>
          </Reveal>

          <div className="space-y-12">
            {filteredFaqs.map(({ icon: Icon, label, color, faqs }) => (
              faqs.length > 0 && (
                <Reveal key={label}>
                  <div className="flex items-center gap-2.5 mb-5">
                    <Icon size={20} className={color} />
                    <h3 className={`font-bold text-lg ${color}`}>{label}</h3>
                  </div>
                  <div className="space-y-2">
                    {faqs.map(faq => <FaqItem key={faq.question} {...faq} />)}
                  </div>
                </Reveal>
              )
            ))}
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0B0906]">
        <div className="max-w-4xl mx-auto">
          <Reveal className="mb-10">
            <h2 className="font-display font-bold text-3xl text-white mb-2">Troubleshooting Guide</h2>
            <p className="text-gray-400">Common issues and step-by-step fixes.</p>
          </Reveal>

          <div className="space-y-5">
            {troubleshooting.map(({ problem, causes, fix }) => (
              <Reveal key={problem}>
                <div className="bg-[#1E1812] border border-white/5 rounded-2xl p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <AlertCircle size={18} className="text-amber-400 mt-0.5 flex-shrink-0" />
                    <h4 className="font-bold text-white">{problem}</h4>
                  </div>
                  <div className="ml-7">
                    <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-2">Possible Causes</p>
                    <ul className="mb-4 space-y-1">
                      {causes.map(c => (
                        <li key={c} className="text-sm text-gray-400 flex items-start gap-2">
                          <span className="text-gray-600 mt-1">•</span> {c}
                        </li>
                      ))}
                    </ul>
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 flex gap-2.5">
                      <CheckCircle2 size={15} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-300">{fix}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
            Still need help? <span className="text-gradient">We've got you.</span>
          </h2>
          <p className="text-gray-400 mb-8">Our support team typically responds within 2 hours on WhatsApp and 24 hours via email.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.me/918767640530"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-3.5 rounded-xl transition-all active:scale-95 w-full sm:w-auto justify-center"
            >
              <MessageCircle size={18} />
              Chat on WhatsApp
            </a>
            <Link to="/contact" className="flex items-center gap-2 border border-white/10 hover:border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl transition-all hover:bg-white/5 w-full sm:w-auto justify-center">
              <Mail size={18} />
              Send an Email
            </Link>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}