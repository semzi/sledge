import { Users } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import StaggerChildren from "../staggerChildren";
import Header from "./Header";

export default function Program() {
  return (
    <div className="min-h-screen relative font-poppins bg-[#09090b] text-white">
      <Header />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-10">
        <div className="pt-6 md:pt-10">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Fees & Program Details
          </h1>
          <p className="mt-3 text-white/70 max-w-3xl">
            All fees and a quick overview of the upcoming cohort.
          </p>
        </div>

        <section className="mt-8">
          <StaggerChildren className="px-0" >
            <div id="fees" className="relative flex gap-x-10 flex-col md:flex-row w-full m rounded-2xl bg-dark-v2 p-6 border border-white/10 shadow-lg overflow-hidden">
              <StaggerChildren className="flex flex-1 flex-col">
                <span className="absolute top-0 left-0 w-32 h-32 bg-green-400/20 blur-2xl rounded-full z-0 pointer-events-none"></span>

                <div className="w-6 h-6 rounded-md bg-green-400/30 backdrop-blur-sm flex items-center justify-center mb-4"></div>

                <span className="flex mt-5 mb-3 gap-x-2 items-baseline ">
                  <h1 className="text-7xl font-bold green-text mt-1">$30</h1>
                  <h3 className="text-sm text-gray-300">per perticipant</h3>
                </span>

                <p className="text-gray-300 text-sm mt-2 leading-relaxed">
                  Over three years, The{" "}
                  <span className="text-white font-bold">Sledge</span> is expected
                  to mentor 450+ emerging energy professionals, building a strong,
                  empowered alumni community contributing to Africa’s and the
                  world’s clean energy transition.
                </p>

                <Link
                  to="/payment"
                  className="inline-flex justify-between my-6 w-full fade-in items-center rounded-full bg-gradient-to-b from-[#10d406] to-[#1d5a05] text-white shadow font-medium overflow-hidden px-1 fade-in-delay-200"
                >
                  <span className="pl-4 pr-3 py-3 inline-flex items-center">
                    Register Now!
                  </span>
                  <span className="w-10 h-10 rounded-full bg-white text-black inline-flex items-center justify-center">
                    <Users className="w-5" />
                  </span>
                </Link>
              </StaggerChildren>

              <div className="block md:hidden relative my-5">
                <div className="border-t border-white/10"></div>
              </div>

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

                <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
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
                </StaggerChildren>
              </div>
            </div>
          </StaggerChildren>
        </section>
      </main>

      <Footer />
    </div>
  );
}
