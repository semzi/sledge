import Header from "../components/Header";
import Footer from "../components/Footer";
import SEO from "../components/SEO";

export default function Community() {
  return (
    <div className="min-h-screen relative font-poppins bg-[#09090b] text-white">
      <SEO 
        title="Professional Community"
        description="Join our vibrant community of emerging professionals and industry veterans. Share insights, build networks, and grow together."
        keywords="mentorship community, professional network, tech ecosystem community"
      />
      <Header />
      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-10 min-h-[60vh]">
        <header className="pt-12 md:pt-20">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight gradient-text">
            Our Elite Community
          </h1>
          <p className="mt-4 text-lg text-white/70 max-w-3xl leading-relaxed">
            Join a vibrant ecosystem of peers and professionals dedicated to shaping the future of energy.
          </p>
        </header>
      </main>
      <Footer />
    </div>
  );
}
