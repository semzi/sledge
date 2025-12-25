import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const aboutHref = "/#about";
  const aboutActive = location.pathname === "/" && location.hash === "#about";

  const navLinkBase = "font-medium";
  const navLinkActive = "underline";

  return (
    <header className="relative z-100 mx-auto px-6 py-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link to="/">
          <img src="/logo-white.png" alt="Sledge logo" className="w-40" />
        </Link>
      </div>

      <nav className="hidden md:flex items-center gap-8 text-white font-medium">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${navLinkBase} hover:underline ${isActive ? navLinkActive : ""}`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/program"
          className={({ isActive }) =>
            `${navLinkBase} hover:underline ${isActive ? navLinkActive : ""}`
          }
        >
          Fee
        </NavLink>
        <NavLink
          to="/schedule"
          className={({ isActive }) =>
            `${navLinkBase} hover:underline ${isActive ? navLinkActive : ""}`
          }
        >
          Schedule
        </NavLink>
        <Link
          to={aboutHref}
          className={`${navLinkBase} hover:underline ${aboutActive ? navLinkActive : ""}`}
          onClick={() => setMobileOpen(false)}
        >
          About Us
        </Link>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `${navLinkBase} hover:underline ${isActive ? navLinkActive : ""}`
          }
        >
          Contact Us
        </NavLink>
      </nav>

      <div className="flex items-center gap-3">
        <Link
          to="/program"
          className="hidden md:inline-flex items-center rounded-full bg-gradient-to-b from-[#10d406] to-[#1d5a05] text-white shadow font-medium overflow-hidden px-1"
        >
          <span className="pl-4 pr-3 text-sm py-2 inline-flex items-center">
            Apply Now
          </span>
          <span className="w-7 h-7 rounded-full bg-white text-black inline-flex items-center justify-center">
            ↗
          </span>
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

          <nav className="flex flex-col gap-4 mt-2">
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
            <NavLink
              to="/program"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `text-lg font-medium ${isActive ? "text-white" : "text-white"}`
              }
            >
              Fee
            </NavLink>
            <NavLink
              to="/schedule"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `text-lg font-medium ${isActive ? "text-white" : "text-white"}`
              }
            >
              Schedule
            </NavLink>
            <Link
              to={aboutHref}
              onClick={() => setMobileOpen(false)}
              className={`text-white text-lg font-medium ${
                aboutActive ? "underline" : ""
              }`}
            >
              About Us
            </Link>
            <NavLink
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `text-lg font-medium ${isActive ? "text-white" : "text-white"}`
              }
            >
              Contact Us
            </NavLink>
          </nav>

          <div className="mt-auto flex flex-col gap-3">
            <Link
              to="/program"
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
