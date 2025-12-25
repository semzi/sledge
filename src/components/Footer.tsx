import { Instagram, Linkedin } from "lucide-react";
export default function Footer() {
  return (
    <footer className="mt-10">
      <div className="mx-auto rounded-t-4xl bg-black text-white  p-10 md:p-14 overflow-hidden">
        <div className="flex flex-col md:flex-row gap-20">
          {/* Left column */}
          <div className=" flex-1 h-full md:flex md:flex-col md:justify-between">
            <div className="flex flex-col gap-4">
              <img src="/logo-white.png" alt="Solix logo" className="w-50" />
              <p className="text-sm text-white/70 max-w-sm mb-10 md:mb-0">
                The Sledge is a six-week mentorship and capacity-building
                program designed to help young energy enthusiasts discover and
                pursue their professional purpose in the energy and climate
                sector.
              </p>
            </div>

          </div>

          {/* Right column - email + address + social */}
          <div className=" flex-2 space-y-6">
            <div>
              <label className="block text-sm mb-3">Enter Your Email</label>
              <div className="flex items-center gap-4">
                <input
                  aria-label="email"
                  placeholder="you@company.com"
                  className="flex-1 bg-transparent border-b border-white/30 py-2 text-white placeholder-white/50 focus:outline-none transition-colors duration-200 focus:border-white"
                />
                <button className="w-10 h-10 rounded-full bg-white text-black inline-flex items-center justify-center transition-transform duration-200 ease-out hover:scale-110 hover:shadow-lg hover:bg-white/95 focus:outline-none focus:ring-2 focus:ring-white/30">
                  ↗
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-white/80">
              <div>
                <a href="/contact" target="_blank"><h5 className="font-medium mb-2">Contact</h5></a>  
                <ul className="space-y-2">
                  <a href="/schedule" target="_blank"><li>Schedule</li></a>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">Email</h5>
                <p className="text-sm text-white/70">
                  <a href="mailto:info@sledgementorship.com">info@sledgementorship.com</a>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-start gap-3">
              {/* social icons as small circles */}
              {[
                { Icon: Instagram, label: "Instagram", href: "https://www.instagram.com/thesledgementorshipprogram_?igsh=MWsxbWRqaXVnbDYyNg%3D%3D&utm_source=qr" },
                { Icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/the-sledge-mentorship-program/" },
              ].map(({ Icon, label, href }, i) => (
                <a
                  key={i}
                  aria-label={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-xs transition transform duration-200 hover:scale-110 hover:shadow-md hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
