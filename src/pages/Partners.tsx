import Header from "../components/Header";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import PartnersSection from "../components/PartnersSection";

export default function Partners() {
  return (
    <div className="min-h-screen relative font-poppins bg-[#050505] text-white flex flex-col">
      <SEO 
        title="Our Strategic Partners"
        description="Collaborating with industry leaders to shape the future of energy and mentorship globally."
        keywords="mentorship partners, Sledge partners, industry collaboration"
      />
      
      <div className="relative z-50 w-full flex-shrink-0">
        <Header />
      </div>

      <main className="relative z-10 flex-grow pt-24 md:pt-32 pb-20">
        <header className="max-w-7xl mx-auto px-6 mb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight gradient-text mb-6">
            Our Strategic Partners
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-white/60 leading-relaxed">
            We collaborate with industry visionaries and organizations globally to provide high-impact mentorship and professional career growth.
          </p>
        </header>
        
        <PartnersSection />
      </main>

      <Footer />
    </div>
  );
}
