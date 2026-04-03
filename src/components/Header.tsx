import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);

  const aboutHref = "/#about";
  const aboutActive = location.pathname === "/" && location.hash === "#about";

  const navLinkBase =
    "px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 text-white/70 hover:text-white hover:bg-white/10";
  const navLinkActive = "!text-white bg-white/10";

  return (
    <header className="relative z-100 mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
      {/* Logo — left */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <Link to="/">
          <img src="/logo-white.png" alt="Sledge logo" className="w-36" />
        </Link>
      </div>

      {/* Centered nav pill — desktop */}
      <nav className="hidden xl:flex items-center gap-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl px-2 py-1.5 shadow-[0_0_30px_rgba(255,255,255,0.03)]">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${navLinkBase} ${isActive ? navLinkActive : ""}`
          }
        >
          Home
        </NavLink>
        <Link
          to={aboutHref}
          className={`${navLinkBase} ${aboutActive ? navLinkActive : ""}`}
        >
          About
        </Link>
        <div className="relative group">
          <button className={`${navLinkBase} flex items-center gap-1.5`}>
            Programs <span className="text-[10px] opacity-60">▼</span>
          </button>
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col z-50 overflow-hidden py-1">
            <Link to="/mentorship" className="px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 transition">SLEDGE Mentorship</Link>
            <Link to="/plus" className="px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 transition">SLEDGE Plus</Link>
          </div>
        </div>
        <NavLink
          to={location.pathname.startsWith('/plus') ? "/plus/schedule" : "/schedule"}
          className={({ isActive }) =>
            `${navLinkBase} ${(isActive || (location.pathname === '/plus/schedule' && !isActive)) ? navLinkActive : ""}`
          }
        >
          Schedule
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `${navLinkBase} ${isActive ? navLinkActive : ""}`
          }
        >
          Contact
        </NavLink>
      </nav>

      {/* CTA — right */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <Link
          to={location.pathname.startsWith('/plus') ? "/plus/payment" : "/program"}
          className="hidden md:inline-flex items-center gap-2 rounded-full border border-white/10 premium-button shimmer-effect text-white shadow-lg font-medium px-5 py-2.5 text-sm transition-all duration-300"
        >
          <span className="relative z-10 text-[13px]">→</span>
          <span className="relative z-10">Apply Now</span>
        </Link>

        <button
          onClick={() => setMobileOpen(true)}
          aria-controls="mobile-menu"
          aria-expanded={mobileOpen}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-md bg-white/10 text-white"
        >
          ☰
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`md:hidden fixed inset-0 z-[9999] transition-transform duration-300 ${
          mobileOpen ? "translate-y-0" : "-translate-y-full"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="absolute inset-0 bg-black/85 backdrop-blur-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" onClick={() => setMobileOpen(false)}>
              <img src="/logo-white.png" alt="Sledge logo" className="w-28" />
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          <nav className="flex flex-col gap-4 mt-2 overflow-y-auto pb-6">
            <NavLink
              end
              to="/"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `text-lg font-medium ${isActive ? "text-white" : "text-white"}`
              }
            >
              Home
            </NavLink>
            <Link
              to={aboutHref}
              onClick={() => setMobileOpen(false)}
              className={`text-lg font-medium text-white ${aboutActive ? "underline" : ""}`}
            >
              About
            </Link>
            
            <div className="flex flex-col text-white">
              <button 
                onClick={() => setProgramsOpen(!programsOpen)} 
                className="text-lg font-medium flex items-center justify-between w-full text-left"
              >
                Programs
                <span className="text-sm">{programsOpen ? "▲" : "▼"}</span>
              </button>
              {programsOpen && (
                <div className="flex flex-col gap-3 pl-4 mt-3 border-l border-white/20 text-white/90">
                  <Link to="/mentorship" onClick={() => setMobileOpen(false)} className="text-base font-medium">SLEDGE Mentorship</Link>
                  <Link to="/plus" onClick={() => setMobileOpen(false)} className="text-base font-medium">SLEDGE Plus</Link>
                </div>
              )}
            </div>

            <NavLink to="/schedule" onClick={() => setMobileOpen(false)} className="text-lg font-medium text-white">Schedule</NavLink>
            <NavLink to="/program" onClick={() => setMobileOpen(false)} className="text-lg font-medium text-white">Apply</NavLink>
            <NavLink to="/contact" onClick={() => setMobileOpen(false)} className="text-lg font-medium text-white">Contact</NavLink>
          </nav>

          <div className="mt-auto flex flex-col gap-3">
            <Link
              to={location.pathname.startsWith('/plus') ? "/plus/payment" : "/program"}
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-b from-[#10d406] to-[#1d5a05] text-white shadow font-medium px-4 py-3"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
