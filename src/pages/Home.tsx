import Hero from "../components/Hero";
import About from "../components/About";
import Partners from "../components/PartnersSection"; // use the section here
import ProgramsCards from "../components/ProgramsCards";
import Founder from "../components/Founder";
import Quote from "../components/Quote";
import FeatureCards from "../components/FeatureCards";
import Testimonials from "../components/Testimonials";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import SEO from "../components/SEO";

export default function Home() {
  return (
    <>
      <SEO
        title="Find Your Place In The Global Professional Ecosystem"
        description="Join Sledge Mentorship to connect with industry experts, gain hands-on experience, and accelerate your journey in the global professional tech ecosystem. Start your transformation today."
        keywords="tech mentorship, professional tech career, career growth, coding mentorship, Sledge Mentorship"
      />
      <main id="main-content">
        <Hero />
        <div className="body-content flex flex-col gap-y-15">
          <About />
          <Partners />
          <ProgramsCards />
          <Founder />
          <Quote />
          <Testimonials />
          <FeatureCards />
          <Newsletter />
        </div>
      </main>
      <Footer />
    </>
  );
}
