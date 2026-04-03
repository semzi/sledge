import { Instagram, Linkedin, Twitter, Github } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full relative z-10 block">
      <div className="w-full bg-[#050505] border-t border-white/10 pt-16 md:pt-24 pb-8 px-6 md:px-12 overflow-hidden relative">
        <div className="max-w-[85rem] mx-auto relative">
          {/* Soft background glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-green-500/5 blur-[120px] rounded-full pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row justify-between gap-16 mb-20 relative z-10">
            {/* Left: Logo, Description, Socials */}
            <div className="lg:max-w-sm">
              <div className="mb-6 flex items-center gap-3">
                <img src="/logo-white.png" alt="Sledge logo" className="w-32 object-contain" />
              </div>
              <p className="text-white/50 text-sm leading-relaxed mb-8">
                The Sledge empowers teams and students to discover and pursue their professional purpose in the energy and climate sector, transforming raw talent into global leadership.
              </p>
              <div className="flex gap-4">
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-white/40 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="https://www.instagram.com/thesledgementorshipprogram_?igsh=MWsxbWRqaXVnbDYyNg%3D%3D&utm_source=qr" target="_blank" rel="noreferrer" className="text-white/40 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://www.linkedin.com/company/the-sledge-mentorship-program/" target="_blank" rel="noreferrer" className="text-white/40 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="text-white/40 hover:text-white transition-colors">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Right: Links layout */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-20">
              <div>
                <h4 className="text-white font-semibold mb-6 text-sm">Programs</h4>
                <ul className="space-y-4 text-sm text-white/50">
                  <li><Link to="/mentorship" className="hover:text-white transition-colors">SLEDGE Mentorship</Link></li>
                  <li><Link to="/plus" className="hover:text-white transition-colors">SLEDGE Plus</Link></li>
                  <li><Link to="/schedule" className="hover:text-white transition-colors">Schedule</Link></li>
                  <li><Link to="/program" className="hover:text-white transition-colors">Apply Now</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-6 text-sm">Resources</h4>
                <ul className="space-y-4 text-sm text-white/50">
                  <li><Link to="/#about" className="hover:text-white transition-colors">About Us</Link></li>
                  <li><Link to="/mentors" className="hover:text-white transition-colors">Our Mentors</Link></li>
                  <li><Link to="/community" className="hover:text-white transition-colors">Community</Link></li>
                  <li><Link to="/partners" className="hover:text-white transition-colors">Partners</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-6 text-sm">Company</h4>
                <ul className="space-y-4 text-sm text-white/50">
                  <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                  <li><Link to="/book-a-session" className="hover:text-white transition-colors">Book a Session</Link></li>
                  <li><a href="mailto:info@sledgementorship.com" className="hover:text-white transition-colors">info@sledge.com</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Row: Legal, Payments, Copyright */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10 w-full">
            <p className="text-white/40 text-[13px] order-3 md:order-1">
              © 2026 SLEDGE. All rights reserved.
            </p>

            <div className="flex items-center gap-3 order-1 md:order-2">
              {/* Visa */}
              <div className="h-8 w-12 bg-white/5 rounded flex items-center justify-center border border-white/10 shadow-sm">
                <span className="text-[11px] font-extrabold text-[#1434CB] italic tracking-tighter">VISA</span>
              </div>
              {/* Mastercard SVG */}
              <div className="h-8 w-12 bg-white/5 rounded flex items-center justify-center border border-white/10 shadow-sm overflow-hidden">
                <svg viewBox="0 0 24 24" className="h-5 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="9" cy="12" r="6" fill="#EA001B"/>
                  <circle cx="15" cy="12" r="6" fill="#F79E1B" fillOpacity="0.8"/>
                </svg>
              </div>
              {/* Stripe */}
              <div className="h-8 w-12 bg-white/5 rounded flex items-center justify-center border border-white/10 shadow-sm">
                <span className="text-[11px] font-bold text-[#635BFF] tracking-tighter">stripe</span>
              </div>
            </div>

            <div className="flex gap-6 text-[13px] text-white/40 order-2 md:order-3">
              <Link to="/privacy" className="hover:text-white transition-colors underline decoration-white/20 underline-offset-4">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors underline decoration-white/20 underline-offset-4">Terms of Service</Link>
              <Link to="/license" className="hover:text-white transition-colors underline decoration-white/20 underline-offset-4">License</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
