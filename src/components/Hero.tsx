import { Link } from 'react-router-dom';
import Header from './Header';
import ScrollToTopButton from '@/lib/scroll';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-[100svh] font-poppins bg-[#050505] overflow-x-hidden flex flex-col pb-0">
      {/* Glow Effects (Animated) */}
      <div
        className="absolute top-0 left-0 w-[50vw] h-[70vh] bg-green-500/25 blur-[150px] rounded-full pointer-events-none border-none"
        style={{ animation: 'glowDrift1 4s ease-in-out infinite' }}
      ></div>
      <div
        className="absolute top-40 right-0 w-[40vw] h-[60vh] bg-green-500/20 blur-[120px] rounded-full pointer-events-none"
        style={{ animation: 'glowDrift2 5s ease-in-out infinite' }}
      ></div>
      <div
        className="absolute top-[30%] left-1/2 w-[45vw] h-[55vh] blur-[130px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(20,184,166,0.30) 0%, transparent 70%)',
          animation: 'glowDrift3 6s ease-in-out infinite',
        }}
      ></div>

      {/* Geometric sides */}
      <div className="absolute top-32 -left-[15%] w-[40vw] h-[60vh] border-r border-t border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent rotate-45 transform origin-bottom-right pointer-events-none fade-in hidden lg:block text-xs"></div>
      <div className="absolute top-32 -right-[15%] w-[40vw] h-[60vh] border-l border-t border-green-500/20 bg-gradient-to-bl from-green-500/5 to-transparent -rotate-45 transform origin-bottom-left pointer-events-none fade-in hidden lg:block text-xs"></div>

      <ScrollToTopButton />
      <div className="relative z-50 w-full flex-shrink-0">
        <Header />
      </div>

      {/* Hero content */}
      <section id="hero" className="relative z-10 mx-auto px-6 md:px-12 flex flex-col items-center text-center mt-6 md:mt-10 w-full max-w-5xl fade-in flex-shrink-0">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6 shadow-[0_0_30px_rgba(34,197,94,0.1)] scale-90 md:scale-100">
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-green-950 border border-green-500/50 flex items-center justify-center text-[10px] text-green-300 font-bold z-30">
              S
            </div>
            <div className="w-6 h-6 rounded-full bg-neutral-900 border border-white/30 flex items-center justify-center text-[10px] z-20 text-white font-bold">
              M
            </div>
            <div className="w-6 h-6 rounded-full bg-green-950 border border-green-500/50 flex items-center justify-center text-[10px] text-green-300 font-bold z-10">
              P
            </div>
          </div>
          <span className="text-xs md:text-sm text-white/80 font-medium pr-2 tracking-wide">
            New Cohort • 2026 ⚡
          </span>
        </div>

        {/* Heading */}
        <h1 className="font-semibold text-grad text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] font-extrabold tracking-tight mb-5 drop-shadow-xl leading-[1.1]">
          Find <span className="text-white bg-reveal-ltr px-2">Your</span> Place In The Global{' '}
          <span className="text-white bg-reveal-ltr pl-2" style={{ animationDelay: '550ms' }}>
            Profession
          </span>
          al Ecosystem
        </h1>

        {/* Subheadline */}
        <p className="text-sm sm:text-base md:text-lg text-white/50 max-w-xl leading-relaxed mb-10 font-light text-center">
          Unlocking Careers. Building Leaders. Shaping Your Future.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full px-2 sm:px-0 sm:w-auto z-20">
          <style>{`
            @keyframes shimmer {
              0% { background-position: -200% 0; }
              100% { background-position: 200% 0; }
            }
          `}</style>
          <Link
            to="/program"
            className="relative flex items-center justify-center gap-2 px-8 py-3.5 sm:px-7 sm:py-3 rounded-full text-white font-semibold tracking-wide transition-all duration-300 hover:scale-[1.03] w-full sm:w-auto text-sm sm:text-base overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, #052e16 0%, #14532d 30%, #166534 50%, #14532d 70%, #052e16 100%)',
              boxShadow:
                'inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -1px 2px rgba(0,0,0,0.4), 0 2px 20px rgba(22,101,52,0.5)',
            }}
          >
            <span
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 40%, transparent 50%, rgba(0,0,0,0.15) 100%)',
              }}
            ></span>
            <span
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0) 70%, transparent 100%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 2.5s ease-in-out infinite',
              }}
            ></span>
            <span className="relative z-10 drop-shadow-sm whitespace-nowrap">Apply Now</span>
            <span className="relative z-10 drop-shadow-sm">→</span>
          </Link>

          <Link
            to="/book-a-session"
            className="flex items-center justify-center gap-2 px-8 py-3.5 sm:px-8 sm:py-3 bg-white/5 backdrop-blur-md rounded-full border border-white/20 text-white font-medium tracking-wide transition-all hover:bg-white/10 hover:border-white/30 w-full sm:w-auto text-sm sm:text-base whitespace-nowrap"
          >
            Book a Session
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Hero;
