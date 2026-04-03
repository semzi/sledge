import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Calendar, Clock, Mail, Home, HeadphonesIcon, ExternalLink, Download } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import { apiUrl } from "../lib/api";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const rid = searchParams.get("rid");
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [paymentType, setPaymentType] = useState<"registration" | "session" | null>(null);
  const [sessionData, setSessionData] = useState<any>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    const verify = async () => {
      if (!sessionId && !rid) { setStatus("error"); return; }
      try {
        const endpoint = (!rid && sessionId) ? "/verify-session-stripe.php" : "/verify-payment.php";
        const url = new URL(apiUrl(endpoint));
        if (sessionId) url.searchParams.set("session_id", sessionId);
        if (rid) url.searchParams.set("rid", rid);

        const res = await fetch(url.toString());
        const data = await res.json().catch(() => ({}));

        if (res.ok && data.success) {
          setStatus("success");
          setPaymentType(data.type ?? "registration");
          if (data.type === "session" && data.session_data) {
            setSessionData({ ...data.session_data, dateObj: new Date(data.session_data.session_date) });
          }
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    };
    verify();
  }, [rid, sessionId]);

  const isSession = status === "success" && paymentType === "session" && sessionData;
  const dateStr = sessionData?.dateObj?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const shortDate = sessionData?.dateObj?.toISOString?.() ?? "";

  const calendarLinks = {
    google: `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Mentorship Session")}&details=${encodeURIComponent(sessionData?.purpose || "Mentorship session with Sledge")}&location=${encodeURIComponent("Google Meet")}&dates=${shortDate.replace(/-|:|\.\d\d\d/g, "")}/${shortDate.replace(/-|:|\.\d\d\d/g, "")}`,
    outlook: `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent("Mentorship Session")}&body=${encodeURIComponent(sessionData?.purpose || "Mentorship session with Sledge")}&startdt=${shortDate}&enddt=${shortDate}`,
  };

  const downloadIcs = () => {
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:Mentorship Session\nDTSTART:${shortDate.replace(/-|:|\.\d\d\d/g, "")}\nDESCRIPTION:${sessionData?.purpose || "Mentorship session with Sledge"}\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([ics], { type: "text/calendar" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "session.ics";
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-400/4 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }}
        />
      </div>

      <div className="relative z-10">
        <Header />
      </div>

      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {/* ── LOADING ── */}
            {status === "loading" && (
              <motion.div key="loading" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center gap-8 text-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center">
                    <img src="/logo2.png" alt="Sledge" className="w-12 h-12 animate-pulse" />
                  </div>
                  <svg className="absolute inset-0 w-24 h-24 animate-spin" viewBox="0 0 96 96">
                    <circle cx="48" cy="48" r="44" fill="none" stroke="url(#spin-grad)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="180 100" />
                    <defs>
                      <linearGradient id="spin-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity="0" />
                        <stop offset="100%" stopColor="#22c55e" stopOpacity="1" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white mb-2">Verifying your payment</h1>
                  <p className="text-sm text-white/40">This only takes a moment…</p>
                </div>
                <div className="flex gap-1.5">
                  {[0, 0.15, 0.3].map((d, i) => (
                    <motion.div key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.2, delay: d, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── SESSION CONFIRMED ── */}
            {status === "success" && isSession && (
              <motion.div key="session-success" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="flex flex-col gap-5">
                {/* Success badge */}
                <div className="flex flex-col items-center gap-4 py-2">
                  <motion.div initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 300, damping: 22, delay: 0.1 }}
                    className="relative">
                    <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center shadow-[0_0_60px_rgba(34,197,94,0.2)]">
                      <CheckCircle2 className="w-9 h-9 text-green-400" />
                    </div>
                    <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }} transition={{ duration: 2.5, repeat: Infinity }}
                      className="absolute inset-0 rounded-full border border-green-500/30" />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="text-center">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-green-400/70 mb-1">Booking Confirmed</p>
                    <h1 className="text-2xl font-bold text-white">You're all set!</h1>
                    <p className="text-sm text-white/45 mt-1 max-w-xs">
                      {sessionData.name?.split(" ")[0]}, your mentorship session has been booked and confirmed.
                    </p>
                  </motion.div>
                </div>

                {/* Session details card */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                  className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-white/8">
                    <p className="text-[10px] uppercase tracking-widest text-white/35 font-semibold">Session Details</p>
                  </div>
                  <div className="px-5 py-4 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <p className="text-[10px] text-white/35 uppercase tracking-wider">Date</p>
                        <p className="text-sm font-medium text-white">{dateStr}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <p className="text-[10px] text-white/35 uppercase tracking-wider">Time</p>
                        <p className="text-sm font-medium text-white">{sessionData.session_time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <p className="text-[10px] text-white/35 uppercase tracking-wider">Confirmation sent to</p>
                        <p className="text-sm font-medium text-white">{sessionData.email}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Calendar section */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                  className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden">
                  <button onClick={() => setShowCalendar(!showCalendar)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.03] transition-colors">
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-white/50" />
                      <span className="text-sm font-medium text-white/70">Add to Calendar</span>
                    </div>
                    <motion.span animate={{ rotate: showCalendar ? 180 : 0 }} transition={{ duration: 0.2 }}
                      className="text-white/30 text-xs">▼</motion.span>
                  </button>
                  <AnimatePresence>
                    {showCalendar && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }} className="overflow-hidden border-t border-white/8">
                        <div className="p-4 grid grid-cols-3 gap-2">
                          {[
                            { label: "Google", href: calendarLinks.google, color: "#4285F4",
                              icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-2 .9-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/></svg> },
                            { label: "Outlook", href: calendarLinks.outlook, color: "#0078d4",
                              icon: <svg viewBox="0 0 23 23" fill="currentColor" className="w-5 h-5"><path d="M0 0h11v11H0zm12 0h11v11H12zM0 12h11v11H0zm12 0h11v11H12z"/></svg> },
                          ].map(cal => (
                            <a key={cal.label} href={cal.href} target="_blank" rel="noopener noreferrer"
                              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/15 transition-all group">
                              <span className="group-hover:scale-110 transition-transform" style={{ color: cal.color }}>{cal.icon}</span>
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] text-white/50 group-hover:text-white/70 transition-colors">{cal.label}</span>
                                <ExternalLink className="w-2.5 h-2.5 text-white/25 group-hover:text-white/50 transition-colors" />
                              </div>
                            </a>
                          ))}
                          <button onClick={downloadIcs}
                            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/15 transition-all group">
                            <Download className="w-5 h-5 text-white/40 group-hover:text-white/70 group-hover:scale-110 transition-all" />
                            <span className="text-[10px] text-white/50 group-hover:text-white/70 transition-colors">Apple / ICS</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Footer actions */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
                  className="flex gap-2 pt-1">
                  <Link to="/" className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium bg-green-500 hover:bg-green-400 text-black transition-colors shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                    <Home className="w-4 h-4" />
                    Go Home
                  </Link>
                  <Link to="/contact" className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-white/[0.05] border border-white/10 hover:bg-white/10 text-white/60 hover:text-white transition-all">
                    <HeadphonesIcon className="w-4 h-4" />
                    Support
                  </Link>
                </motion.div>
              </motion.div>
            )}

            {/* ── REGISTRATION SUCCESS ── */}
            {status === "success" && !isSession && (
              <motion.div key="reg-success" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="flex flex-col items-center gap-6 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 280, damping: 20 }}
                  className="relative">
                  <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center shadow-[0_0_60px_rgba(34,197,94,0.2)]">
                    <CheckCircle2 className="w-9 h-9 text-green-400" />
                  </div>
                  <motion.div animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }} transition={{ duration: 2.5, repeat: Infinity }}
                    className="absolute inset-0 rounded-full border border-green-500/30" />
                </motion.div>

                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-green-400/70 font-semibold mb-2">Payment Verified</p>
                  <h1 className="text-2xl font-bold text-white mb-2">Registration Confirmed!</h1>
                  <p className="text-sm text-white/40 max-w-xs mx-auto">Your payment has been verified and your spot has been secured. Check your inbox for details.</p>
                </div>

                <div className="flex flex-col gap-2 w-full">
                  {rid && (
                    <Link to={`/payment-receipt?rid=${encodeURIComponent(rid)}`}
                      className="w-full py-3 rounded-xl text-sm font-semibold bg-green-500 hover:bg-green-400 text-black transition-colors shadow-[0_0_20px_rgba(34,197,94,0.2)] flex items-center justify-center gap-2">
                      View Receipt
                    </Link>
                  )}
                  <div className="flex gap-2">
                    <Link to="/" className="flex-1 py-3 rounded-xl text-sm font-medium bg-white/[0.05] border border-white/10 hover:bg-white/10 text-white/60 hover:text-white transition-all flex items-center justify-center gap-2">
                      <Home className="w-4 h-4" /> Home
                    </Link>
                    <Link to="/contact" className="flex-1 py-3 rounded-xl text-sm font-medium bg-white/[0.05] border border-white/10 hover:bg-white/10 text-white/60 hover:text-white transition-all flex items-center justify-center gap-2">
                      <HeadphonesIcon className="w-4 h-4" /> Support
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── ERROR ── */}
            {status === "error" && (
              <motion.div key="error" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="flex flex-col items-center gap-6 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 280, damping: 20 }}>
                  <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <XCircle className="w-9 h-9 text-red-400" />
                  </div>
                </motion.div>

                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-red-400/70 font-semibold mb-2">Verification Failed</p>
                  <h1 className="text-2xl font-bold text-white mb-2">Payment Not Verified</h1>
                  <p className="text-sm text-white/40 max-w-xs mx-auto">We couldn't verify your payment. If you were charged, please reach out to support immediately.</p>
                </div>

                <div className="bg-red-500/8 border border-red-500/15 rounded-xl p-4 w-full text-left">
                  <p className="text-xs text-red-400/80 font-medium mb-1">What to do next</p>
                  <ul className="text-xs text-white/40 space-y-1 list-disc list-inside">
                    <li>Take a screenshot of this page</li>
                    <li>Check your email for a payment confirmation</li>
                    <li>Contact support with your payment reference</li>
                  </ul>
                </div>

                <div className="flex gap-2 w-full">
                  <Link to="/" className="flex-1 py-3 rounded-xl text-sm font-medium bg-white/[0.05] border border-white/10 hover:bg-white/10 text-white/60 hover:text-white transition-all flex items-center justify-center gap-2">
                    <Home className="w-4 h-4" /> Home
                  </Link>
                  <Link to="/contact" className="flex-1 py-3 rounded-xl text-sm font-semibold bg-red-500 hover:bg-red-400 text-white transition-colors flex items-center justify-center gap-2">
                    <HeadphonesIcon className="w-4 h-4" /> Contact Support
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
