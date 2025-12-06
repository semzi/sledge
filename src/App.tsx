import { DownloadIcon } from "lucide-react";
import Footer from "./components/Footer";
import FeatureCards from "./components/FeatureCards";

export default function App() {
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

        {/* Top navigation */}
        <header className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo-white.png" alt="Sledge logo" className="w-30 " />
          </div>

          <nav className="hidden md:flex items-center gap-8 text-white font-medium">
            <a className="hover:underline" href="#">
              Home
            </a>
            <a className="hover:underline" href="#">
              Product
            </a>
            <a className="hover:underline" href="#">
              Maintenance
            </a>
            <a className="hover:underline" href="#">
              About Us
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#"
              className="inline-flex items-center rounded-full border border-white text-white shadow font-medium overflow-hidden px-1"
            >
              <span className="pl-4 pr-3 text-sm py-2 inline-flex items-center">
                Contact Us
              </span>
              <span className="w-7 h-7 rounded-full bg-white text-black inline-flex items-center justify-center">
                ↗
              </span>
            </a>
            <button className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-md bg-white/10 text-white">
              ☰
            </button>
          </div>
        </header>

        {/* Hero content */}
        <main className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-0">
          <div className="max-w-3xl text-white">
            <p className="text-sm text-white/80 mb-4">New Cohort • 2026 ⚡</p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-7xl font-extrabold leading- tracking-tight mb-6 drop-shadow-xl fade-in">
              Find Your Place in the
              <br />
              <span className=" ">energy</span> Ecosystem
            </h1>
            <p className="text-lg text-white/85 mb-8 fade-in fade-in-delay-400">
              Discover renewable energy with our cutting-edge solar panels.
              Designed for sustainability and cost-efficiency.
            </p>

            <div className="flex items-center gap-4">
              <a
                href="#"
                className="inline-flex fade-in items-center rounded-full bg-white text-black shadow font-medium overflow-hidden px-1  fade-in-delay-200"
              >
                <span className="pl-4 pr-3 py-3 inline-flex items-center">
                  Apply Now
                </span>
                <span className="w-10 h-10 rounded-full bg-black text-white inline-flex items-center justify-center">
                  ↗
                </span>
              </a>
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
        <section className="relative flex flex-col-reverse md:flex-row z-10 mx-auto px-6 md:px-12 gap-8 items-center">
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

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex  items-start gap-4 reveal">
                <div>
                  <h3 className="font-semibold text-white text-lg ">
                    Environmentally Friendly
                  </h3>
                  <p className="text-sm ">
                    Solar energy reduces greenhouse gases and air pollutants,
                    helping combat climate change.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 fade-in fade-in-delay-400">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="4"
                      y="4"
                      width="16"
                      height="16"
                      rx="3"
                      stroke="white"
                      strokeOpacity="0.9"
                      strokeWidth="1.2"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white ">
                    Low Maintenance
                  </h3>
                  <p className="text-sm ">
                    Solar panels are durable, with low maintenance costs,
                    requiring only occasional cleaning and minimal upkeep.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: world-map image */}
          <div className="order-1 flex-2 md:order-2 flex items-center justify-center">
            <div className="relative w-full max-w-xl">
              <img
                src="/ayo.png"
                alt="Ayodeji Stephen"
                className="w-full rounded h-auto"
              />
              <div
                className="absolute left-0 right-0 bottom-0 h-100 hero-fade"
                style={{ zIndex: 5 }}
              >
                hi
              </div>
            </div>
          </div>
        </section>

        {/* <button className="relative px-6 py-2 rounded-lg  text-white bg-black hover:bg-neutral-900 transition">
        <span className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-green-400/80 via-purple-300/60 to-red-400/80 blur-xl"></span>
        Ask Genius
      </button> */}

        <div className="px-6 md:px-12">
          <div className="relative flex gap-x-10 flex-col md:flex-row w-full m rounded-2xl bg-dark-v2 p-6 border border-white/10 shadow-lg overflow-hidden">
            <div className="flex flex-1 flex-col">
              {/* Subtle green glow in corner */}
              <span className="absolute top-0 left-0 w-32 h-32 bg-green-400/20 blur-2xl rounded-full z-0 pointer-events-none"></span>

              {/* Top Icon */}
              <div className="w-6 h-6 rounded-md bg-green-400/30 backdrop-blur-sm flex items-center justify-center mb-4"></div>

              {/* Title */}
              <span className="flex mt-5 mb-3 gap-x-2 items-baseline ">
                <h1 className="text-7xl font-bold green-text mt-1">$30</h1>
                <h3 className="text-sm text-gray-300">per perticipant</h3>
              </span>

              {/* Subtitle */}
              <p className="text-gray-300 text-sm mt-2 leading-relaxed">
                Over three years, The{" "}
                <span className="text-white font-bold">Sledge</span> is expected
                to mentor 450+ emerging energy professionals, building a strong,
                empowered alumni community contributing to Africa’s and the
                world’s clean energy transition.
              </p>

              {/* Button */}
              <a
                href="#"
                className="inline-flex justify-between my-6 w-full fade-in items-center rounded-full bg-gray-200 text-black shadow font-medium overflow-hidden px-1  fade-in-delay-200"
              >
                <span className="pl-4 pr-3 py-3 inline-flex items-center">
                  Apply Now
                </span>
                <span className="w-10 h-10 rounded-full bg-black text-white inline-flex items-center justify-center">
                  ↗
                </span>
              </a>
            </div>

            {/* Divider */}
            <div className="block md:hidden relative my-5">
              <div className="border-t border-white/10"></div>
            </div>

            {/* Feature List */}
            <div className="flex flex-1 flex-col">
              <div>
                <h4 className="text-white font-semibold text-lg">
                  Program Details
                </h4>
                <p className="text-sm text-gray-400">
                  Quick overview of the upcoming cohort
                </p>
                <div className="mb-5"></div>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <li className="flex items-start gap-3 text-gray-300">
                  <span className="w-3 h-3 rounded-full bg-green-400 mt-[6px] flex-shrink-0" />
                  <div>
                    <div className="text-white font-medium">Duration</div>
                    <div className="text-gray-300">6 weeks</div>
                  </div>
                </li>

                <li className="flex items-start gap-3 text-gray-300">
                  <span className="w-3 h-3 rounded-full bg-green-400 mt-[6px] flex-shrink-0" />
                  <div>
                    <div className="text-white font-medium">Cost</div>
                    <div className="text-gray-300">$30 per participant</div>
                  </div>
                </li>

                <li className="flex items-start gap-3 text-gray-300">
                  <span className="w-3 h-3 rounded-full bg-green-400 mt-[6px] flex-shrink-0" />
                  <div>
                    <div className="text-white font-medium">Cohort Size</div>
                    <div className="text-gray-300">50 participants</div>
                  </div>
                </li>

                <li className="flex items-start gap-3 text-gray-300">
                  <span className="w-3 h-3 rounded-full bg-green-400 mt-[6px] flex-shrink-0" />
                  <div>
                    <div className="text-white font-medium">Frequency</div>
                    <div className="text-gray-300">3 cohorts per year</div>
                  </div>
                </li>

                <li className="flex items-start gap-3 text-gray-300">
                  <span className="w-3 h-3 rounded-full bg-green-400 mt-[6px] flex-shrink-0" />
                  <div>
                    <div className="text-white font-medium">Mode</div>
                    <div className="text-gray-300">
                      Virtual (via Google Meet)
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-3 text-gray-300">
                  <span className="w-3 h-3 rounded-full bg-green-400 mt-[6px] flex-shrink-0" />
                  <div>
                    <div className="text-white font-medium">Mentor</div>
                    <div className="text-gray-300">
                      Ayodeji Stephen and a host of other seasoned Energy
                      Professionals
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-3 text-gray-300 sm:col-span-2">
                  <span className="w-3 h-3 rounded-full bg-green-400 mt-[6px] flex-shrink-0" />
                  <div>
                    <div className="text-white font-medium">Outcome</div>
                    <div className="text-gray-300">
                      Certificate of Completion + One-on-one mentorship session
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Brand logo horizontal slider (infinite scroll) */}
        <div>
         <p className="text-gray-300 text-center">  Sledge Mentorship Program Partners</p>
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
          <div key={`logo-a-${i}`} className="logo-wrap flex items-center">
            <img
              src="/logo-white.png"
              alt="Brand logo"
              className="h-12 opacity-90 block"
              draggable={false}
            />
          </div>
              ))}

              {/* duplicate sequence for seamless loop */}
              {Array.from({ length: 8 }).map((_, i) => (
          <div key={`logo-b-${i}`} className="logo-wrap flex items-center">
            <img
              src="/logo-white.png"
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
          <div className="flex-1 flex flex-col">
           <p> Get a quick look at how the 6-week journey is structured. Each week
            is intentionally designed to build your clarity, skills, and
            confidence as you navigate your path in the energy sector. From
            understanding the energy landscape to developing personal
            visibility, every session delivers practical guidance, real-world
            insights, and mentorship that helps you grow with purpose. </p>
             <a
                href="#"
                 className="inline-flex fade-in w-fit mt-7 items-center rounded-full bg-white text-black shadow font-medium overflow-hidden px-1  fade-in-delay-200"
              >
                <span className="pl-4 pr-3 py-3 inline-flex items-center">
                  Download
                </span>
                <span className="w-10 h-10 rounded-full bg-black text-white inline-flex items-center justify-center">
                  <DownloadIcon className="w-5" />
                </span>
              </a>
          </div>
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
