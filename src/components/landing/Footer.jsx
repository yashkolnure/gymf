import { Link } from 'react-router-dom';
import { Dumbbell, Twitter, Linkedin, Youtube, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Documentation', href: '/docs' },
    { label: 'API Reference', href: '/docs#api' },
    { label: 'Changelog', href: '/support#changelog' },
  ],
  Company: [
    { label: 'About Us', href: '/contact' },
    { label: 'Contact', href: '/contact' },
    { label: 'Support', href: '/support' },
    { label: 'Blog', href: '/support' },
    { label: 'Careers', href: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/privacy#terms' },
    { label: 'Cookie Policy', href: '/privacy#cookies' },
    { label: 'Refund Policy', href: '/privacy#refund' },
    { label: 'GST Invoice', href: '/support' },
  ],
};

const socialLinks = [
  { Icon: Twitter, href: '#', label: 'Twitter' },
  { Icon: Linkedin, href: '#', label: 'LinkedIn' },
  { Icon: Youtube, href: '#', label: 'YouTube' },
  { Icon: MessageCircle, href: '#', label: 'WhatsApp' },
];

export default function Footer() {
  return (
    <footer className="bg-[#090705] border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-14">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                <Dumbbell size={20} className="text-white" strokeWidth={2.5} />
              </div>
              <div>
                <span className="font-display font-bold text-white text-xl">GymPro</span>
                <span className="text-primary font-bold text-xl"> India</span>
              </div>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs">
              India's most powerful gym management platform — built for gym owners who want to scale, not struggle.
            </p>
            {/* Contact info */}
            <div className="space-y-2.5 mb-6">
              <a href="mailto:support@gymproindia.in" className="flex items-center gap-2.5 text-sm text-gray-500 hover:text-primary transition-colors">
                <Mail size={14} />
                support@gymproindia.in
              </a>
              <a href="tel:+919876543210" className="flex items-center gap-2.5 text-sm text-gray-500 hover:text-primary transition-colors">
                <Phone size={14} />
                +91 98765 43210
              </a>
              <div className="flex items-center gap-2.5 text-sm text-gray-500">
                <MapPin size={14} />
                Mumbai, Maharashtra, India
              </div>
            </div>
            {/* Socials */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-primary/20 hover:text-primary text-gray-500 flex items-center justify-center transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link to={href} className="text-sm text-gray-500 hover:text-gray-200 transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} GymPro India. All rights reserved. Made with ❤️ for Indian gym owners.
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}