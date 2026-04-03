import { Mail, ArrowRight } from "lucide-react";

export default function Newsletter() {
  return (
    <section className="relative z-10 w-full px-6 md:px-12 mb-20 lg:mb-24">
      <div className="bg-gradient-to-br from-[#052e16] via-[#14532d] to-[#064e3b] rounded-[3rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(22,101,52,0.5)] border border-green-400/20 relative">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-400/20 blur-[100px] rounded-full pointer-events-none mix-blend-screen"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/20 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 p-10 sm:p-14 lg:p-20 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center justify-between">
          
          <div className="flex-1 w-full text-left">
            <div className="inline-flex items-center gap-2 bg-black/20 text-green-200 border border-white/10 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide uppercase mb-6 backdrop-blur-md">
              <Mail className="w-4 h-4" />
              Newsletter
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-white mb-6 leading-[1.1] tracking-tight">
              Stay Connected <br className="hidden sm:block" /> with the SLEDGE Community.
            </h2>
            
            <p className="text-green-100/90 text-lg mb-8 max-w-xl leading-relaxed">
              Join our network and receive exclusive updates straight to your inbox about:
            </p>
            
            <ul className="space-y-4 mb-4">
              {[
                "Mentorship opportunities",
                "Training programs",
                "Global career opportunities",
                "Upcoming events"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-green-50 font-medium">
                  <div className="w-6 h-6 rounded-full bg-green-500/30 flex items-center justify-center shrink-0 border border-green-500/30">
                    <div className="w-1.5 h-1.5 bg-green-300 rounded-full"></div>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full lg:w-[450px] shrink-0 bg-[#0a0a0a]/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl">
            <h3 className="text-white font-semibold text-xl mb-3">Join the Network</h3>
            <p className="text-white/60 mb-8 text-sm leading-relaxed">Enter your email address to join our network and never miss an update.</p>
            
            <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="hello@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-white/30 outline-none focus:border-green-400/50 focus:bg-white/10 transition-all font-medium"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-green-500 hover:bg-green-400 text-black font-bold text-base py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors duration-300"
              >
                Subscribe Now
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
            <p className="text-white/40 text-[11px] mt-4 text-center">We respect your privacy. Unsubscribe at any time.</p>
          </div>

        </div>
      </div>
    </section>
  );
}
