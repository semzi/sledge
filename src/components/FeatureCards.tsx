import { ArrowRight } from "lucide-react";
import { useContent } from "../contexts/ContentContext";

export default function FeatureCards() {
  const { content, loading } = useContent();

  if (loading || !content) return null;
  const { futureForward } = content;

  return (
    <section className="px-6 md:px-12 relative z-10 w-full" >
      <div className="max-w-[85rem] mx-auto">
        <div className="text-center w-full max-w-3xl mx-auto mb-16 lg:mb-20">
          <div className="inline-block bg-green-500/10 text-green-400 border border-green-500/20 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide uppercase mb-6 backdrop-blur-md">
            {futureForward.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium leading-[1.15] mb-4 text-grad">
            {futureForward.title}
          </h2>
          <p className="text-base text-white/60 leading-relaxed max-w-2xl mx-auto">
            {futureForward.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {futureForward.items.map((card: any, i: number) => (
            <article
              key={card.title}
              className="group flex flex-col relative rounded-[2rem] bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.07] overflow-hidden transition-all duration-300"
              aria-labelledby={`feature-${i}`}
            >
              <div className="w-full h-48 relative overflow-hidden bg-[#050505]">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover filter contrast-[1.05] grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 opacity-80 group-hover:opacity-100"
                  loading="lazy"
                />
              </div>

              <div className="p-8 sm:p-10 flex-1 flex flex-col">
                <h4 id={`feature-${i}`} className="text-xl text-white font-semibold mb-3 tracking-tight group-hover:text-green-300 transition-colors duration-300">
                  {card.title}
                </h4>
                <p className="text-sm text-white/60 leading-relaxed mb-8 flex-1">
                  {card.description}
                </p>

                <div className="mt-auto">
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 text-sm text-white/50 font-medium hover:text-green-400 transition-colors duration-300 group/link"
                  >
                    Explore
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
