import React from 'react';
import { Linkedin, Twitter, Mail } from 'lucide-react';

const Founder: React.FC = () => {
  return (
    <section className="relative z-10 mx-auto px-6 md:px-10 mb-5 lg:mb-5">
      <div className="flex flex-col lg:flex-row bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)] relative">
        {/* Ambient Background Glow inside card */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-green-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        {/* Text Side */}
        <div className="flex-1 p-8 sm:p-12 md:p-16 order-2 lg:order-1 flex flex-col justify-center relative z-10 w-full lg:w-[55%]">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide uppercase mb-8 w-fit backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Meet The Founder
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] text-grad mb-4 tracking-tight leading-[1.1]">
            Ayodeji
            <br className="hidden sm:block" /> Adekanbi Stephen
          </h2>
          <p className="text-green-400 font-medium mb-8 text-xl tracking-wide flex items-center gap-3">
            Founder & Coordinator, SLEDGE
          </p>

          <div className="space-y-6 text-white/70 leading-relaxed text-sm lg:text-base mb-10">
            <p>
              Ayodeji is an energy policy researcher, mentor, and thought leader passionate about
              developing the next generation of professional talent.
            </p>
            <p>
              Through the <strong className="text-white font-semibold flex-inline">SLEDGE Mentorship Program</strong>, he provides intensive career guidance and leadership development opportunities for students and early-career professionals across the world.
            </p>
            <p>
              His vision is to build a mentorship ecosystem that bridges the gap between raw talent
              and the concrete networks required to succeed.
            </p>
          </div>

          {/* Minimalist Social Icons */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/60 hover:text-green-400 hover:border-green-400/30 hover:bg-green-400/10 transition-all duration-300 group"
            >
              <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </a>
            <a
              href="#"
              className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/60 hover:text-green-400 hover:border-green-400/30 hover:bg-green-400/10 transition-all duration-300 group"
            >
              <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform duration-300 fill-current" />
            </a>
            <a
              href="#"
              className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/60 hover:text-green-400 hover:border-green-400/30 hover:bg-green-400/10 transition-all duration-300 group"
            >
              <Mail className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </a>
          </div>
        </div>

        {/* Image Side */}
        <div className="flex-1 relative order-1 lg:order-2 min-h-[400px] lg:min-h-[600px] w-full lg:w-[45%]">
          <img
            src="/ayo.png"
            alt="Ayodeji Adekanbi Stephen"
            className="absolute inset-0 w-full h-full object-cover object-top filter grayscale-[20%] contrast-[1.1] brightness-[0.9]"
          />
          {/* Premium Gradients to blend image into background */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent lg:bg-gradient-to-l lg:from-transparent lg:via-[#0a0a0a]/50 lg:to-[#0a0a0a]"></div>
          {/* Green tint overlay for aesthetic cohesion */}
          <div className="absolute inset-0 bg-green-900/10 mix-blend-color"></div>
        </div>
      </div>
    </section>
  );
};

export default Founder;
