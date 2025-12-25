import { ArrowUpRight, Navigation, Settings } from "lucide-react";
import ScrollToTopButton from "@/lib/scroll";
import { Link } from "react-router-dom"; // Import Link
import Footer from "./Footer";
import FeatureCards from "./FeatureCards";
import StaggerChildren from "../staggerChildren";
import Header from "./Header";

export default function Home() {
  const bgUrl = "/hero.png";

  return (
    <>
      <div className="min-h-screen relative font-poppins">
        {/* Background image + overlay */}
        <div
          className="absolute left-0 right-0 top-0 h-[95vh] max-h-[700px] bg-cover bg-center"
          style={{ backgroundImage: `url(${bgUrl})` }}
          aria-hidden
        />
        <div className="absolute left-0 right-0 top-0 h-[95vh] bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        {/* bottom fade so the hero image fades into the page background */}
        <div
          className="absolute left-0 right-0 h-[95vh] hero-fade2"
          style={{ zIndex: 5 }}
        >
          <div
            className="absolute left-0 right-0 bottom-0 h-30 hero-fade"
            style={{ zIndex: 5 }}
          ></div>
        </div>

        <ScrollToTopButton />

        <Header />

        {/* Hero content */}
        <main className="relative z-10 mx-auto px-6 md:px-12 pt-10 pb-0">
          <div className="max-w-3xl text-white">
            <p className="text-sm text-white/80 mb-4">New Cohort • 2026 ⚡</p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-7xl font-extrabold leading- tracking-tight mb-6 drop-shadow-xl fade-in">
              Find Your Place in the
              <br />
              <span className=" ">energy</span> Ecosystem
            </h1>
            <p className="text-lg text-white/85 mb-8 fade-in fade-in-delay-400">
              Unlocking Careers. Building Leaders. Shaping the Energy Future.
            </p>

            <div className="flex items-center gap-4">
              <Link
                to="/program"
                className="inline-flex fade-in items-center rounded-full bg-white text-black shadow font-medium overflow-hidden px-1  fade-in-delay-200"
              >
                <span className="pl-4 pr-3 py-3 inline-flex items-center">
                  Apply Now
                </span>
                <span className="w-10 h-10 rounded-full bg-black text-white inline-flex items-center justify-center">
                  <ArrowUpRight className="w-5" />
                </span>
              </Link>
              <a
                href="#"
                className="inline-flex items-center gap-2 text-white/90 px-4 py-3 rounded-full border backdrop-blur-md border-white/20 fade-in fade-in-delay-300"
              >
                Learn More
              </a>
            </div>
          </div>
        </main>
      </div>
      <div className="body-content flex flex-col gap-y-15">
        <section id="about" className="relative flex flex-col-reverse md:flex-row z-10 mx-auto px-6 md:px-12 gap-8 items-center">
          {/* Left column: heading and features */}
          <div className="order-2 flex-4 md:order-1 text-gray-300">
            <div className="inline-block bg-dark-v2 text-white border  rounded-full px-3 py-1 text-sm mb-6">
              Who are we?
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-5xl font-bold  leading-[1.03] mb-6 gradient-text">
              Why this Program
              <br />
              Exists.
            </h2>

            <StaggerChildren className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex  items-start gap-4 reveal">
                <div className="w-10 h-10 px-2.5 border border-gray-300/30 rounded-full bg-white/10 flex items-center justify-center text-white">
                  <Navigation className="w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg ">
                    Career Clarity
                  </h3>
                  <p className="text-sm ">
                    Many young professionals struggle to find clear direction in
                    the evolving energy space, and this program provides the
                    guidance needed to choose a purposeful path.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 fade-in fade-in-delay-400">
                <div className="w-10 h-10 px-2.5 border border-gray-300/30 rounded-full bg-white/10 flex items-center justify-center text-white">
                  <Settings className="w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white ">
                    Skill Alignment
                  </h3>
                  <p className="text-sm ">
                    Emerging talents often lack the right mix of technical and
                    soft skills, and this program bridges that gap with focused
                    learning and mentorship.
                  </p>
                </div>
              </div>
            </StaggerChildren>
          </div>

          {/* Right column: world-map image */}
          <div className="order-1 flex-2 md:order-2 flex items-center fade-in justify-center">
            <div className="relative w-full max-w-xl">
              <img
                src="/ayo.png"
                alt="Ayodeji Stephen"
                className="w-full rounded h-auto"
              />
              <div
                className="absolute left-0 right-0 bottom-0 h-50 hero-fade"
                style={{ zIndex: 5 }}
              >
                <div className="absolute w-full gap-15 bottom-9 left-4 flex items-center">
                  <div className="pl-5">
                    <h3 className="font-medium text-sm text-white ">
                      Ayodeji Stephen
                    </h3>
                    <p className="text-xs font-light text-white/70 ">
                      Founder & Coordinator, Sledge Mentorship Program
                    </p>
                  </div>
                  <div className="flex gap-3">
                    {/* <button
                  className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-xs transition transform duration-200 hover:scale-110 hover:shadow-md hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  <Linkedin className="w-3 h-3" />
                </button>
                    <button
                  className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-xs transition transform duration-200 hover:scale-110 hover:shadow-md hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  <Mail className="w-3 h-3" />
                </button> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* <button className="relative px-6 py-2 rounded-lg  text-white bg-black hover:bg-neutral-900 transition">
        <span className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-green-400/80 via-purple-300/60 to-red-400/80 blur-xl"></span>
        Ask Genius
      </button> */}

        
        {/* Brand logo horizontal slider (infinite scroll) */}
        <div>
          <p className="text-gray-300 text-center">
            {" "}
            Sledge Mentorship Program Partners
          </p>
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

            /* The track contains two identical sequences of logos.
               Translating -50% moves exactly one sequence out of view,
               creating a seamless infinite loop. */
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}</style>

            <div className="marquee" aria-hidden="false">
              <div className="marquee-track" aria-hidden="true">
                {/* first sequence */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={`logo-a-${i}`}
                    className="logo-wrap flex items-center"
                  >
                    <img
                      src="/hydrogem.png"
                      alt="Brand logo"
                      className="h-12 opacity-90 block"
                      draggable={false}
                    />
                    <img
                      src="/ahf.png"
                      alt="Brand logo"
                      className="h-12 opacity-90 block"
                      draggable={false}
                    />
                    <img
                      src="/brave.png"
                      alt="Brand logo"
                      className="h-12 opacity-90 block"
                      draggable={false}
                    />
                  </div>
                ))}

                {/* duplicate sequence for seamless loop */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={`logo-b-${i}`}
                    className="logo-wrap flex items-center"
                  >
                    <img
                      src="/ahf.png"
                      alt=""
                      className="h-12 opacity-90 block"
                      aria-hidden="true"
                      draggable={false}
                    />
                    <img
                      src="/hydrogem.png"
                      alt=""
                      className="h-12 opacity-90 block"
                      aria-hidden="true"
                      draggable={false}
                    />
                    <img
                      src="/brave.png"
                      alt=""
                      className="h-12 opacity-90 block"
                      aria-hidden="true"
                      draggable={false}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quote + download section */}
        <div className="px-6 md:px-12 gap-10 flex flex-col-reverse text-gray-300 md:flex-row items-center">
          <StaggerChildren className="flex-1 flex flex-col">
            <p>
              {" "}
              Get a quick look at how the 6-week journey is structured. Each
              week is intentionally designed to build your clarity, skills, and
              confidence as you navigate your path in the energy sector. From
              understanding the energy landscape to developing personal
              visibility, every session delivers practical guidance, real-world
              insights, and mentorship that helps you grow with purpose.{" "}
            </p>
            <Link
              to="/schedule"
              className="inline-flex fade-in w-fit mt-7 items-center rounded-full bg-white text-black shadow font-medium overflow-hidden px-1  fade-in-delay-200"
            >
              <span className="pl-4 pr-3 py-3 inline-flex items-center">
                View Schedule
              </span>
              <span className="w-10 h-10 rounded-full bg-black text-white inline-flex items-center justify-center">
                ↗
              </span>
            </Link>
          </StaggerChildren>
          <div className="flex flex-col flex-1">
            <p className="cursive-font gradient-text font-extrabold text-7xl">
              “The future belongs to those who prepare for it today.”
            </p>
            <p className="text-end mt-4">~ Malcolm X</p>
          </div>
        </div>

        {/* Feature cards section (three dark panels) */}
        <FeatureCards />
      </div>

      <Footer />
    </>
  );
}
