import Hero from "../components/Hero";
import About from "../components/About";
import Partners from "./Partners"; // Partners is in pages
import ProgramsCards from "../components/ProgramsCards";
import Founder from "../components/Founder";
import Quote from "../components/Quote";
import FeatureCards from "../components/FeatureCards";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import SEO from "../components/SEO";

export default function Home() {
  return (
    <>
      <SEO
        title="Accelerate Your Tech Career"
        description="Join Sledge Mentorship to connect with industry experts, gain hands-on experience, and accelerate your journey in the global professional tech ecosystem."
        keywords="tech mentorship, career growth, coding bootcamp, professional development, Sledge Mentorship"
      />
      <main id="main-content">
        <Hero />
        <div className="body-content flex flex-col gap-y-15">
          <About />
          <Partners />
          <ProgramsCards />
          <Founder />
          <Quote />
          <FeatureCards />
          <Newsletter />
        </div>
      </main>
      <Footer />
    </>
  );
}
