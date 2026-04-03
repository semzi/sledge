import Header from "../components/Header";
import Footer from "../components/Footer";
import SEO from "../components/SEO";

export default function Mentors() {
  return (
    <div className="min-h-screen relative font-poppins bg-[#09090b] text-white">
      <SEO 
        title="Our Expert Mentors"
        description="Meet the industry leaders and visionaries guiding the next generation of professional talent in the global ecosystem."
        keywords="tech mentors, energy industry experts, career coaches"
      />
      <Header />
      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-10 min-h-[60vh]">
        <header className="pt-12 md:pt-20 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight gradient-text">
            Meet Our Mentors
          </h1>
          <p className="mt-4 text-lg text-white/70 max-w-3xl leading-relaxed mx-auto">
            Connect with industry experts and visionaries who are here to guide you through your journey in the energy ecosystem.
          </p>
        </header>
      </main>
      <Footer />
    </div>
  );
}
