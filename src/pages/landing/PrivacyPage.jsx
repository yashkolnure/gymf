import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Shield, Lock, Eye, Database, Mail, Phone, FileText, ChevronRight } from 'lucide-react';
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

function Section({ id, title, children }) {
  return (
    <Reveal>
      <section id={id} className="mb-14">
        <h2 className="font-display font-bold text-2xl text-white mb-4 pb-3 border-b border-white/5">{title}</h2>
        <div className="text-gray-400 text-sm leading-relaxed space-y-4">{children}</div>
      </section>
    </Reveal>
  );
}

const tocItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'data-collected', label: 'Data We Collect' },
  { id: 'how-used', label: 'How We Use Your Data' },
  { id: 'data-sharing', label: 'Data Sharing' },
  { id: 'data-security', label: 'Data Security' },
  { id: 'retention', label: 'Data Retention' },
  { id: 'rights', label: 'Your Rights' },
  { id: 'cookies', label: 'Cookies' },
  { id: 'children', label: 'Children\'s Privacy' },
  { id: 'terms', label: 'Terms of Service' },
  { id: 'refund', label: 'Refund Policy' },
  { id: 'contact', label: 'Contact Us' },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#100D0A] text-white">
      <LandingNav />

      {/* Header */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 text-center border-b border-white/5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold px-4 py-2 rounded-full mb-5">
            <Shield size={14} />
            Legal
          </div>
          <h1 className="font-display font-bold text-5xl mb-4">Privacy Policy</h1>
          <p className="text-gray-500 text-sm">Last updated: January 1, 2025 · Effective: January 1, 2025</p>

          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {[
              { icon: Lock, label: 'End-to-End Encrypted', color: 'text-emerald-400' },
              { icon: Database, label: 'India Servers', color: 'text-blue-400' },
              { icon: Eye, label: 'No Data Selling', color: 'text-primary' },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className={`flex items-center gap-2 ${color} text-sm font-medium bg-white/5 px-4 py-2 rounded-full`}>
                <Icon size={14} />
                {label}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex gap-12">

          {/* Sidebar TOC */}
          <aside className="hidden lg:block w-52 flex-shrink-0 sticky top-24 self-start">
            <p className="text-xs text-gray-600 uppercase font-semibold tracking-wider mb-3">On This Page</p>
            <nav className="space-y-0.5">
              {tocItems.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-white hover:bg-white/5 transition-all"
                >
                  <ChevronRight size={12} />
                  {label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0 max-w-3xl">

            <Section id="overview" title="Overview">
              <p>
                GymPro India ("we", "our", "us") is committed to protecting the privacy and security of your personal data.
                This Privacy Policy explains how we collect, use, store, and protect information when you use the GymPro India
                platform — including our web application, APIs, and related services.
              </p>
              <p>
                By using GymPro India, you agree to the practices described in this policy. If you do not agree, please do not
                use our services. This policy applies to gym owners, staff members, and the end-member data that gyms store using our platform.
              </p>
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                <p className="text-blue-300">
                  <strong>Gym Owners:</strong> You are the "Data Controller" for your members' personal data. GymPro India acts as a
                  "Data Processor" on your behalf. You are responsible for ensuring your use of our platform complies with applicable
                  Indian data protection laws.
                </p>
              </div>
            </Section>

            <Section id="data-collected" title="Data We Collect">
              <p><strong className="text-white">Account & Gym Information:</strong></p>
              <ul className="list-none space-y-1 ml-4">
                {[
                  'Gym owner name, email address, and password (bcrypt-hashed)',
                  'Gym name, address, logo, GST number, and contact details',
                  'Subscription plan and billing information (payment processed by Razorpay)',
                  'IP address and device information for security logging',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-primary mt-1.5 text-xs">•</span>
                    {item}
                  </li>
                ))}
              </ul>

              <p className="mt-4"><strong className="text-white">Member Data (stored on behalf of gyms):</strong></p>
              <ul className="list-none space-y-1 ml-4">
                {[
                  'Member name, phone number, email address, profile photo',
                  'Membership plan, start/end dates, payment history',
                  'Emergency contact name and phone number',
                  'Health notes and fitness goals (entered voluntarily by member or gym staff)',
                  'Attendance check-in and check-out timestamps',
                  'QR code identifier',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-primary mt-1.5 text-xs">•</span>
                    {item}
                  </li>
                ))}
              </ul>

              <p className="mt-4"><strong className="text-white">Usage Data (automatically collected):</strong></p>
              <ul className="list-none space-y-1 ml-4">
                {[
                  'Pages visited, features used, and time spent (anonymized analytics)',
                  'Browser type, OS, and screen resolution for compatibility purposes',
                  'Error logs for debugging (no personal data included)',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-primary mt-1.5 text-xs">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Section>

            <Section id="how-used" title="How We Use Your Data">
              {[
                { title: 'Service Delivery', desc: 'To operate the GymPro India platform — managing members, attendance, payments, and all core features.' },
                { title: 'Automated Notifications', desc: 'Sending membership expiry reminders, renewal confirmations, and GST invoices to your gym members via email.' },
                { title: 'Account Management', desc: 'Authenticating logins, managing user roles, and maintaining security across your tenant.' },
                { title: 'Support', desc: 'Diagnosing and resolving technical issues. Our support team may access your account data only with your explicit permission.' },
                { title: 'Product Improvement', desc: 'Aggregated, anonymized usage data helps us improve features and performance. We never use individual gym data for this.' },
                { title: 'Legal Compliance', desc: 'Retaining records as required by Indian tax laws (GST records must be kept for 6 years).' },
              ].map(({ title, desc }) => (
                <div key={title} className="flex gap-3 py-3 border-b border-white/5 last:border-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-white">{title}: </span>
                    {desc}
                  </div>
                </div>
              ))}
            </Section>

            <Section id="data-sharing" title="Data Sharing">
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5 mb-5">
                <p className="text-emerald-300 font-semibold">We do NOT sell your data or your members' data. Ever.</p>
              </div>
              <p>We share data only with the following trusted sub-processors who are contractually bound to protect it:</p>
              <div className="grid sm:grid-cols-2 gap-3 mt-4">
                {[
                  { name: 'MongoDB Atlas', purpose: 'Database hosting (Mumbai region)', link: 'mongodb.com/legal/privacy-policy' },
                  { name: 'Razorpay', purpose: 'Payment processing (PCI DSS compliant)', link: 'razorpay.com/privacy' },
                  { name: 'Google SMTP', purpose: 'Transactional email delivery', link: 'policies.google.com/privacy' },
                  { name: 'Redis Labs', purpose: 'Session caching (no PII stored)', link: 'redis.com/legal/privacy-policy' },
                ].map(({ name, purpose, link }) => (
                  <div key={name} className="bg-[#1E1812] border border-white/5 rounded-xl p-4">
                    <div className="font-semibold text-white text-sm">{name}</div>
                    <div className="text-xs text-gray-500 mt-0.5 mb-2">{purpose}</div>
                    <a href={`https://${link}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">{link}</a>
                  </div>
                ))}
              </div>
              <p className="mt-5">
                We may also disclose data if required by Indian law enforcement or court orders, or to protect the safety and rights of our users.
                In such cases, we will notify affected users unless legally prohibited from doing so.
              </p>
            </Section>

            <Section id="data-security" title="Data Security">
              <p>We implement industry-standard security measures to protect your data:</p>
              <div className="grid sm:grid-cols-2 gap-3 mt-4">
                {[
                  'JWT + Refresh Token rotation (short-lived access tokens)',
                  'bcrypt password hashing (12 salt rounds)',
                  'HTTPS/TLS encryption for all data in transit',
                  'MongoDB encryption at rest (Atlas)',
                  'Helmet.js security headers on all API responses',
                  'Rate limiting: 30 req/min global, 5 req/min for auth',
                  'MongoDB query sanitization (prevents injection)',
                  'Per-tenant data isolation at the query level',
                ].map(item => (
                  <div key={item} className="flex items-start gap-2.5 text-sm">
                    <Lock size={13} className="text-primary mt-0.5 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <p className="mt-5">
                Despite our best efforts, no system is 100% secure. If you discover a security vulnerability, please report it
                responsibly to <a href="mailto:security@gymproindia.in" className="text-primary hover:underline">security@gymproindia.in</a> before
                public disclosure. We aim to respond within 48 hours.
              </p>
            </Section>

            <Section id="retention" title="Data Retention">
              <div className="space-y-3">
                {[
                  { period: 'Active account', desc: 'All data retained for the duration of your subscription.' },
                  { period: 'After cancellation', desc: 'Data retained for 30 days. You can request a full export at any time during this period.' },
                  { period: 'After 30 days', desc: 'All gym data is permanently and irreversibly deleted from our servers.' },
                  { period: 'GST/Financial records', desc: 'Retained for 6 years as required by Indian GST law, even after account deletion.' },
                  { period: 'Audit logs', desc: 'Retained for 2 years for security and compliance purposes.' },
                ].map(({ period, desc }) => (
                  <div key={period} className="flex gap-4 py-3 border-b border-white/5 last:border-0">
                    <span className="text-white font-semibold text-sm w-40 flex-shrink-0">{period}</span>
                    <span className="text-sm">{desc}</span>
                  </div>
                ))}
              </div>
            </Section>

            <Section id="rights" title="Your Rights">
              <p>As a GymPro India account holder, you have the following rights regarding your personal data:</p>
              <div className="space-y-3 mt-4">
                {[
                  { right: 'Access', desc: 'Request a copy of all personal data we hold about you.' },
                  { right: 'Rectification', desc: 'Update or correct inaccurate information at any time from your Settings page.' },
                  { right: 'Erasure', desc: 'Request deletion of your account and all associated data (subject to legal retention requirements).' },
                  { right: 'Portability', desc: 'Request a full data export in JSON or CSV format.' },
                  { right: 'Objection', desc: 'Opt out of non-essential communications at any time.' },
                ].map(({ right, desc }) => (
                  <div key={right} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                      <Shield size={14} className="text-indigo-400" />
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold text-white">{right}: </span>
                      {desc}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-5">To exercise any of these rights, email <a href="mailto:privacy@gymproindia.in" className="text-primary hover:underline">privacy@gymproindia.in</a>. We respond within 30 days.</p>
            </Section>

            <Section id="cookies" title="Cookies">
              <p>We use minimal, essential cookies only:</p>
              <div className="mt-4 space-y-2">
                {[
                  { name: 'auth_token', purpose: 'JWT authentication token (HttpOnly, Secure)', type: 'Essential', duration: 'Session' },
                  { name: 'refresh_token', purpose: 'JWT refresh token for staying logged in', type: 'Essential', duration: '30 days' },
                ].map(({ name, purpose, type, duration }) => (
                  <div key={name} className="bg-[#1E1812] border border-white/5 rounded-xl p-4 grid grid-cols-4 gap-4 text-sm">
                    <div><div className="text-xs text-gray-500 mb-1">Name</div><code className="text-primary text-xs">{name}</code></div>
                    <div className="col-span-2"><div className="text-xs text-gray-500 mb-1">Purpose</div><span className="text-gray-300">{purpose}</span></div>
                    <div><div className="text-xs text-gray-500 mb-1">Duration</div><span className="text-gray-300">{duration}</span></div>
                  </div>
                ))}
              </div>
              <p className="mt-4">We do not use advertising cookies, tracking pixels, or third-party analytics that identify individual users.</p>
            </Section>

            <Section id="children" title="Children's Privacy">
              <p>
                GymPro India is a business management platform intended for use by gym owners and staff (18 years and older).
                We do not knowingly collect personal information directly from individuals under 18.
              </p>
              <p>
                Gyms may register members who are under 18 (e.g., for junior fitness programs). In such cases, the gym (as Data Controller)
                is responsible for obtaining appropriate parental or guardian consent before storing the minor's data in our platform.
              </p>
            </Section>

            <Section id="terms" title="Terms of Service">
              <p>By registering for GymPro India, you agree to the following terms:</p>
              <ul className="space-y-2 ml-4">
                {[
                  'You are at least 18 years old and authorized to enter into this agreement on behalf of your gym.',
                  'You will not use GymPro India for any illegal purpose or to store data you do not have the right to process.',
                  'You are responsible for maintaining the confidentiality of your login credentials.',
                  'You will not attempt to reverse engineer, scrape, or exploit the platform.',
                  'Subscription fees are charged monthly/annually in advance and are non-refundable except as stated in our Refund Policy.',
                  'We reserve the right to terminate accounts that violate these terms, with or without notice.',
                  'We may update these terms with 30 days notice via email. Continued use constitutes acceptance.',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-1.5 text-xs flex-shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Section>

            <Section id="refund" title="Refund Policy">
              <div className="space-y-5">
                {[
                  {
                    title: 'Free Trial',
                    desc: 'The 14-day free trial requires no payment. No refund is applicable.',
                    color: 'border-blue-500/20 bg-blue-500/5 text-blue-300',
                  },
                  {
                    title: 'Monthly Plans',
                    desc: 'Monthly subscriptions are non-refundable once the billing period has started. You may cancel at any time to prevent the next charge.',
                    color: 'border-amber-500/20 bg-amber-500/5 text-amber-300',
                  },
                  {
                    title: 'Annual Plans',
                    desc: 'Annual plans are eligible for a prorated refund within the first 30 days if you are not satisfied. After 30 days, no refunds are issued.',
                    color: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300',
                  },
                  {
                    title: 'Service Outage Credit',
                    desc: 'If GymPro India experiences downtime exceeding 24 consecutive hours, affected customers will receive a prorated credit for the days affected. SLA guarantee available on Enterprise plans.',
                    color: 'border-primary/20 bg-primary/5 text-orange-300',
                  },
                ].map(({ title, desc, color }) => (
                  <div key={title} className={`border ${color} rounded-xl p-5`}>
                    <div className="font-bold mb-1 text-sm">{title}</div>
                    <div className="text-sm opacity-80">{desc}</div>
                  </div>
                ))}
              </div>
              <p className="mt-5">To request a refund, email <a href="mailto:billing@gymproindia.in" className="text-primary hover:underline">billing@gymproindia.in</a> with your gym name and reason.</p>
            </Section>

            <Section id="contact" title="Contact Us">
              <p>For privacy-related questions, data requests, or legal notices:</p>
              <div className="mt-4 space-y-3">
                {[
                  { icon: Mail, label: 'Privacy inquiries', value: 'privacy@gymproindia.in', href: 'mailto:privacy@gymproindia.in' },
                  { icon: Mail, label: 'Billing & refunds', value: 'billing@gymproindia.in', href: 'mailto:billing@gymproindia.in' },
                  { icon: Mail, label: 'Security reports', value: 'security@gymproindia.in', href: 'mailto:security@gymproindia.in' },
                  { icon: Phone, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-center gap-3 text-sm">
                    <Icon size={15} className="text-primary flex-shrink-0" />
                    <span className="text-gray-500 w-28">{label}:</span>
                    <a href={href} className="text-white hover:text-primary transition-colors">{value}</a>
                  </div>
                ))}
              </div>
            </Section>

          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}