import {
  Clock,
  CheckCircle2,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollToTopButton from "@/lib/scroll";
import { useContent } from "../contexts/ContentContext";
import SEO from "../components/SEO";

export default function SledgePlus() {
  const { content, loading } = useContent();

  if (loading || !content) return null;
  const { plus } = content.programs;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "SLEDGE Plus",
    "description": plus.heroDesc,
    "provider": {
      "@type": "Organization",
      "name": "Sledge Mentorship",
      "sameAs": "https://sledgementorship.com"
    }
  };

  return (
    <div className="relative min-h-[100svh] font-poppins bg-[#050505] overflow-x-hidden flex flex-col pb-0 text-white">
      <SEO
        title="SLEDGE+ Advanced Impact"
        description="Elevate your impact with SLEDGE+. Exclusive resources, advanced mentorship, and a premium professional network."
        keywords="SLEDGE Plus, advanced mentorship, professional impact, premium tech network"
        schemaData={schemaData}
      />
      <ScrollToTopButton />

      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vh] bg-green-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[40vw] h-[60vh] bg-green-600/5 blur-[150px] rounded-full"></div>
      </div>

      <div className="relative z-50 w-full flex-shrink-0">
        <Header />
      </div>

      <main className="relative z-10 flex-grow w-full">

        {/* Hero Section */}
        <section className="px-6 md:px-10 pt-8 pb-16 md:pt-16 md:pb-24">
          <div className=" mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-10">
            <div className="flex-1 text-left fade-in">
              <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full px-3 py-1 text-[10px] font-semibold tracking-widest uppercase mb-6">
                <Sparkles className="w-3 h-3 fill-current" />
                {plus.subtitle}
              </div>
              <h1 className="text-4xl text-grad sm:text-5xl lg:text-7xl leading-[1.1] mb-6 tracking-tight">
                Elevate Your Impact with <span className="text-green-500 font-bold">SLEDGE+</span>
              </h1>
              <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-xl mb-10 font-normal">
                {plus.heroDesc}
              </p>

              {/* Image-style List - Left aligned on mobile */}
              <ul className="space-y-4 mb-10 flex flex-col items-start">
                {plus.features.map((benefit: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-4 text-white/80 text-base font-medium">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-950 flex items-center justify-center border border-green-500/30">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                    </div>
                    {benefit}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center gap-3 justify-start">
                <Link
                  to="/plus/schedule"
                  className="px-5 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-2 text-white/80 text-sm"
                >
                  View Schedule <ChevronRight className="w-4 h-4" />
                </Link>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-green-500/10 bg-green-500/5 text-green-500/60 text-[10px] font-medium uppercase tracking-tighter">
                  <Clock className="w-3.5 h-3.5" />
                  {plus.intensity}
                </div>
              </div>
            </div>

            {/* Price Card - 50% Width on Desktop */}
            <div className="w-full lg:w-2/5 relative fade-in fade-in-delay-100">
              <div className="w-full relative z-10 bg-white/[0.03] backdrop-blur-md rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl group transition-all hover:border-green-500/30">
                <div className="p-10 md:p-16 text-center relative">
                  <div className="relative z-10">
                    <span className="text-xs font-bold mb-8 text-white/30 uppercase tracking-[0.4em] block">Membership Investment</span>

                    <div className="flex flex-col items-center mb-10">
                      <div className="flex items-baseline gap-2">
                        <span className="text-7xl md:text-8xl font-semibold text-grad tracking-tighter">${plus.priceUsd || plus.price}</span>
                        <span className="text-white/40 text-lg font-medium italic">{plus.priceUnit}</span>
                      </div>
                      <div className="text-white/30 text-sm font-medium mt-1">
                        or <span className="text-green-500/80">₦{(plus.priceNgn || 0).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="space-y-6 max-w-sm mx-auto">
                      <Link
                        to="/plus/payment"
                        className="relative w-full flex items-center justify-center py-5 rounded-2xl text-white font-bold text-xl bg-green-600 hover:bg-green-500 transition-all shadow-[0_15px_30_rgba(22,101,52,0.4)] hover:scale-[1.02]"
                      >
                        {plus.ctaText}
                      </Link>
                      <p className="text-white/20 text-xs mt-8 max-w-[240px] mx-auto leading-relaxed tracking-tight font-light">
                        Limited slots available. Applications are reviewed on a rolling basis.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Minimalist glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-500/10 blur-[120px] rounded-full pointer-events-none"></div>
            </div>
          </div>
        </section>

      </main>

      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  );
}
