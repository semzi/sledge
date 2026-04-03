import React from 'react';

const Partners: React.FC = () => {
  return (
    <div id="partners" className="mb-5">
      <p className="text-gray-300 text-center"> Sledge Mentorship Program Partners</p>
      <div className="w-full overflow-hidden py-3">
        <style>{`
          .marquee { overflow: hidden; }
          .marquee-track {
            display: flex;
            gap: 2.5rem;
            align-items: center;
            will-change: transform;
            animation: marquee 20s linear infinite;
          }
          .marquee-track:hover { animation-play-state: paused; }
          .marquee-track .logo-wrap { flex: 0 0 auto; }

          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>

        <div className="marquee" aria-hidden="false">
          <div className="marquee-track" aria-hidden="true">
            {/* first sequence */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={`logo-a-${i}`} className="logo-wrap flex items-center">
                <img
                  src="/hydrogem.png"
                  alt="Hydrogem Logo"
                  loading="lazy"
                  className="h-12 opacity-90 block"
                  draggable={false}
                />
                <img
                  src="/ahf.png"
                  alt="AHF Logo"
                  loading="lazy"
                  className="h-12 opacity-90 block"
                  draggable={false}
                />
                <img
                  src="/brave.png"
                  alt="Brave Logo"
                  loading="lazy"
                  className="h-12 opacity-90 block"
                  draggable={false}
                />
              </div>
            ))}

            {/* duplicate sequence for seamless loop */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={`logo-b-${i}`} className="logo-wrap flex items-center">
                <img
                  src="/ahf.png"
                  alt="AHF Logo"
                  loading="lazy"
                  className="h-12 opacity-90 block"
                  draggable={false}
                />
                <img
                  src="/hydrogem.png"
                  alt="Hydrogem Logo"
                  loading="lazy"
                  className="h-12 opacity-90 block"
                  draggable={false}
                />
                <img
                  src="/brave.png"
                  alt="Brave Logo"
                  loading="lazy"
                  className="h-12 opacity-90 block"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partners;
