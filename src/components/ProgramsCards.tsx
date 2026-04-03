import { Check, Star, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useContent } from "../contexts/ContentContext";

export default function ProgramsCards() {
  const { content, loading } = useContent();

  if (loading || !content) return null;

  const cards = [
    {
      ...content.programs.mentorship,
      icon: <Star className="w-5 h-5 text-green-400" />
    },
    {
      ...content.programs.oneOnOne,
      icon: <Sparkles className="w-5 h-5 text-white" />
    },
    {
      ...content.programs.plus,
      icon: <Star className="w-5 h-5 text-green-400" />
    }
  ];

  return (
    <section className="relative z-10 w-full">
      <div className="mx-auto px-6 md:px-12">
        <div className="text-center w-full max-w-3xl mx-auto mb-16 lg:mb-24">
          <div className="inline-block bg-green-500/10 text-green-400 border border-green-500/20 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide uppercase mb-6">
            Our Programs
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight mb-4 text-grad">
            Find the Right Path for Your Growth.
          </h2>
          <p className="text-white/60 text-lg">
            Choose from our structured cohort, private one-on-one sessions, or our advanced Plus track uniquely tailored for emerging leaders.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-8 lg:gap-6">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className={`flex-1 flex flex-col relative rounded-[2.5rem] p-8 sm:p-10 transition-all duration-500 hover:-translate-y-2
                ${card.isPopular 
                  ? 'bg-gradient-to-b from-[#16161a] to-[#0a0a0a] border-2 border-white/50 shadow-[0_0_60px_rgba(255,255,255,0.1)] lg:-mt-8 lg:mb-8' 
                  : 'bg-[#111113] border border-white/5 shadow-2xl hover:border-white/10'
                }
              `}
            >
              {/* Optional ambient inner glow for middle card */}
              {card.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-white/5 blur-[50px] rounded-full pointer-events-none"></div>
              )}

              {/* Header Box */}
              <div className="mb-8 relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${card.isPopular ? 'bg-white/10 border-white/20' : 'bg-green-500/10 border-green-500/20'}`}>
                    {card.icon}
                  </div>
                  {card.isNew && (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${card.isPopular ? 'bg-white text-black' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
                      New
                    </span>
                  )}
                </div>
                
                <h3 className="text-2xl font-semibold text-grad tracking-tight mb-2">
                  {card.title}
                </h3>
                {card.subtitle && (
                  <h4 className={`text-base font-semibold mb-4 ${card.isPopular ? 'text-gray-300' : 'text-green-400'}`}>
                    {card.subtitle}
                  </h4>
                )}
                <div className="space-y-4 text-sm text-white/60 leading-relaxed font-light mt-4">
                  <p>{card.desc1}</p>
                  {card.desc2 && <p>{card.desc2}</p>}
                </div>
              </div>

              {/* Features List */}
              <div className="flex-1 relative z-10 space-y-4 mb-10">
                <p className={`font-semibold text-sm ${card.isPopular ? 'text-white' : 'text-white/80'}`}>{card.featuresLabel}</p>
                <ul className="space-y-3">
                  {card.features.map((feature: string, fIdx: number) => (
                    <li key={fIdx} className="flex items-start gap-3">
                      <div className={`mt-0.5 shrink-0 flex items-center justify-center w-5 h-5 rounded-full ${card.isPopular ? 'bg-white text-black' : 'bg-green-500/20 text-green-400'}`}>
                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                      </div>
                      <span className="text-sm text-white/70 leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Call to Action Container at Bottom */}
              <div className="pt-2 mt-auto relative z-10">
                {card.isPopular ? (
                  <Link
                    to={card.ctaLink}
                    className="relative flex items-center justify-center gap-2 px-8 py-3.5 sm:py-4 rounded-full text-white font-semibold tracking-wide transition-all duration-300 hover:scale-[1.03] w-full text-sm sm:text-base overflow-hidden group"
                    style={{
                      background: 'linear-gradient(135deg, #052e16 0%, #14532d 30%, #166534 50%, #14532d 70%, #052e16 100%)',
                      boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -1px 2px rgba(0,0,0,0.4), 0 2px 20px rgba(22,101,52,0.5)',
                    }}
                  >
                    {/* Glossy highlight */}
                    <span className="absolute inset-0 rounded-full pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 40%, transparent 50%, rgba(0,0,0,0.15) 100%)' }}></span>
                    {/* Shimmer sweep */}
                    <span
                      className="absolute inset-0 rounded-full pointer-events-none"
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0) 70%, transparent 100%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 2.5s ease-in-out infinite',
                      }}
                    ></span>
                    <span className="relative z-10 drop-shadow-sm whitespace-nowrap">{card.ctaText}</span>
                    <span className="relative z-10 drop-shadow-sm group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                ) : (
                  <Link
                    to={card.ctaLink}
                    className="w-full py-4 px-6 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2 group bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20"
                  >
                    {card.ctaText}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
