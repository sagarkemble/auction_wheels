import { Link } from 'react-router-dom';
import { Car, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border">

      {/* Main footer grid */}
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Column 1 — Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Car className="h-6 w-6 text-primary" />
              <span className="text-xl font-display font-bold">
                Auction{' '}
                <span className="text-gradient-gold">Wheels</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-[220px]">
              India's most trusted vehicle auction marketplace. Browse, register, attend, and drive away.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {[
                { label: 'Instagram', href: '#' },
                { label: 'Twitter', href: '#' },
                { label: 'Facebook', href: '#' },
                { label: 'YouTube', href: '#' },
              ].map(({ label, href }) => (
                <a key={label} href={href}
                  className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-all duration-200 text-muted-foreground"
                  aria-label={label}>
                  <span className="text-xs font-semibold">{label.charAt(0)}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Browse Auctions', to: '/auctions' },
                { label: 'All Vehicles', to: '/vehicles' },
                { label: 'Register as Buyer', to: '/register' },
                { label: 'Become a Seller', to: '/register' },
                { label: 'Host an Auction', to: '/register' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-150 flex items-center gap-1.5 group">
                    <span className="w-0 group-hover:w-3 h-px bg-primary transition-all duration-200 inline-block" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Platform */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'How It Works', to: '/' },
                { label: 'Vendor Directory', to: '/' },
                { label: 'Login', to: '/login' },
                { label: 'Create Account', to: '/register' },
                { label: 'Contact Support', to: '/' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-150 flex items-center gap-1.5 group">
                    <span className="w-0 group-hover:w-3 h-px bg-primary transition-all duration-200 inline-block" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground leading-relaxed">
                  123 Auction Plaza, Sector 44, Gurugram, Haryana 122003
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                </div>
                <a href="tel:+911234567890"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  +91 123 456 7890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                </div>
                <a href="mailto:support@auctionwheels.com"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  support@auctionwheels.com
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Auction Wheels. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {[
              'Privacy Policy',
              'Terms of Service',
              'Refund Policy',
            ].map((item) => (
              <a key={item} href="#"
                className="text-xs text-muted-foreground hover:text-primary transition-colors">
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">
              Payments secured by
            </span>
            <span className="text-xs font-bold text-primary font-display">
              Razorpay
            </span>
          </div>
        </div>
      </div>

    </footer>
  );
}
