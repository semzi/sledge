import { useState } from "react";
import { Calendar, Clock, Target, TrendingUp, Briefcase, Lightbulb, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollToTopButton from "@/lib/scroll";
import SessionBookingStepper from "../components/SessionBookingStepper";
import { useContent } from "../contexts/ContentContext";
import SEO from "../components/SEO";

export default function BookSession() {
  const { content, loading } = useContent();
  const [showStepper, setShowStepper] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (loading || !content) return null;
  const { oneOnOne } = content.programs;
  const benefits = [
    { icon: <Target className="w-5 h-5 text-green-400" />, text: "Career Strategy" },
    { icon: <TrendingUp className="w-5 h-5 text-green-400" />, text: "Leadership Development" },
    { icon: <Briefcase className="w-5 h-5 text-green-400" />, text: "Professional Growth" },
    { icon: <Lightbulb className="w-5 h-5 text-green-400" />, text: "Entrepreneurship Guidance" },
  ];

  return (
    <div className="relative min-h-[100svh] font-poppins bg-[#050505] overflow-x-hidden flex flex-col text-white">
      <SEO 
        title="Book a Private Session"
        description="Schedule a personalized one-on-one mentorship session with industry experts to discuss your career strategy and professional goals."
        keywords="book session, one-on-one mentorship, career coaching, Sledge Mentorship"
      />
      <ScrollToTopButton />

      {/* Background glows */}
      <div className="absolute top-0 left-[-10%] w-[50vw] h-[50vh] bg-green-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[50vh] bg-green-600/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="relative z-50 flex-shrink-0">
        <Header />
      </div>

      {/* ── Stepper overlay (fixed 100vh) ── */}
      <AnimatePresence>
        {showStepper && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            {/* Glows behind modal */}
            <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vh] bg-green-500/8 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vh] bg-green-600/8 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
              initial={{ scale: 0.96, y: 16, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: 16, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative w-full max-w-lg bg-[#080808] border border-white/10 rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.7)] flex flex-col min-h-0 h-fit max-h-[85vh] sm:max-h-[90vh] overflow-hidden"
            >
              {/* Decorative corner glows */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-green-500/6 blur-[80px] rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-500/4 blur-[80px] rounded-full pointer-events-none" />

              {/* Modal header bar — always visible */}
              <div className="flex-shrink-0 flex items-center justify-between px-6 pt-5 pb-0">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-green-500/70">One-on-One Mentorship</p>
                  <h2 className="text-base font-semibold text-white mt-0.5">
                    {isConfirmed ? 'Booking Confirmed 🎉' : 'Book a Session'}
                  </h2>
                </div>
                <button
                  onClick={() => { setShowStepper(false); setIsConfirmed(false); }}
                  title="Close"
                  className="w-9 h-9 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center text-green-400 hover:bg-green-500/25 hover:border-green-500/50 hover:text-green-300 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Stepper container — enforced height constraint for children */}
              <div className="flex-1 min-h-0 px-4 sm:px-6 py-4 sm:py-5 flex flex-col overflow-hidden">
                <SessionBookingStepper
                  onCancel={() => { setShowStepper(false); setIsConfirmed(false); }}
                  onConfirmed={() => setIsConfirmed(true)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Page content ── */}
      <main className="relative z-10 flex-grow px-6 md:px-10 pt-12 md:pt-20 pb-32 flex flex-col items-center w-full">

        <div className="text-center w-full max-w-3xl mx-auto mb-16 lg:mb-20 fade-in">
          <div className="inline-block bg-green-500/10 text-green-400 border border-green-500/20 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide uppercase mb-6">
            One-On-One Mentorship
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight mb-4 text-grad">
            Book a Private Mentorship Session
          </h2>
          <p className="text-white/60 text-lg">
            Individuals seeking deeper career guidance can schedule a private one-on-one mentorship session with{" "}
            <span className="text-white font-medium">Ayodeji Adekanbi Stephen</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mx-auto">

          {/* Left Column */}
          <div className="flex flex-col space-y-8 fade-in fade-in-delay-100 order-2 lg:order-1">
            <div>
              <h3 className="text-2xl font-semibold text-white mb-3">Personalized Support</h3>
              <p className="text-white/70 text-base leading-relaxed">
                These sessions are tailored directly to your career context and goals. You'll work closely to unlock the next level of your professional journey with actionable steps.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 mt-2">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 transition-all duration-300 hover:bg-white/10 hover:border-green-500/30">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0 border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                    {benefit.icon}
                  </div>
                  <span className="text-white/80 font-medium">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Pricing Card */}
          <div className="relative fade-in fade-in-delay-200 w-full order-1 lg:order-2 mb-10 lg:mb-0">
            <div className="absolute inset-0 bg-gradient-to-b from-green-500/20 to-transparent rounded-[2.5rem] blur-xl opacity-50 pointer-events-none" />
            <div className="relative bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 blur-[100px] rounded-full pointer-events-none" />
              <div className="flex flex-col relative z-10 w-full">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white mb-1">Session Details</h2>
                  <p className="text-white/50 text-sm">Everything you need to know.</p>
                </div>
                <div className="border-t border-white/10 pt-6 mt-2 mb-8">
                  <span className="flex mt-2 mb-3 gap-x-3 items-baseline">
                    <h1 className="text-6xl sm:text-7xl font-bold green-text mt-1 tracking-tight">${oneOnOne.priceUsd || 5}</h1>
                    <h3 className="text-sm text-gray-300 flex flex-col justify-end pb-2">
                      <span>or ₦{(oneOnOne.priceNgn || 5000).toLocaleString()}</span>
                    </h3>
                  </span>
                  <div className="flex items-center gap-3 mt-4">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-300 text-sm font-medium">2 Hours Duration</span>
                  </div>
                </div>
                <div className="space-y-4 border-t border-white/10 pt-8">
                  <style>{`
                    @keyframes shimmerBtn {
                      0% { background-position: -200% 0; }
                      100% { background-position: 200% 0; }
                    }
                  `}</style>
                  <button
                    onClick={() => setShowStepper(true)}
                    className="relative w-full flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-8 py-3.5 sm:py-4 rounded-full text-white font-semibold flex-shrink-0 tracking-wide transition-all duration-300 hover:scale-[1.02] shadow-2xl overflow-hidden group"
                    style={{ background: 'linear-gradient(135deg, #052e16 0%, #14532d 30%, #166534 50%, #14532d 70%, #052e16 100%)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -1px 2px rgba(0,0,0,0.4), 0 5px 20px rgba(22,101,52,0.5)' }}
                  >
                    <span className="absolute inset-0 rounded-full pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 40%, transparent 50%, rgba(0,0,0,0.15) 100%)' }} />
                    <span className="absolute inset-0 rounded-full pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0) 70%, transparent 100%)', backgroundSize: '200% 100%', animation: 'shimmerBtn 2.5s ease-in-out infinite' }} />
                    <Calendar className="w-5 h-5 relative z-10 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                    <span className="relative z-10 drop-shadow-sm text-base sm:text-lg">Book a Session</span>
                  </button>
                  <p className="text-white/40 text-[11px] sm:text-xs text-center mt-4">
                    Schedule your session seamlessly with our guided booking process.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  );
}
