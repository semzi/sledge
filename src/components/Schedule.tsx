import Header from "./Header";
import Footer from "./Footer";

type ScheduleItem = {
  week: string;
  theme: string;
  keyLearningFocus: string;
  facilitator: string;
  tentativeDates: string;
};

const SCHEDULE: ScheduleItem[] = [
  {
    week: "1",
    theme: "Understanding the Energy Ecosystem",
    keyLearningFocus:
      "Mapping opportunities across the energy value chain, identifying niche areas for growth.",
    facilitator: "Ayodeji Stephen",
    tentativeDates: "21st February 2026",
  },
  {
    week: "2",
    theme: "Upskilling and Reskilling for the Future",
    keyLearningFocus:
      "Identifying the right technical and soft skills needed for the 21st-century energy professional.",
    facilitator: "Ayodeji Stephen",
    tentativeDates: "28th February 2026",
  },
  {
    week: "3",
    theme: "Time and Opportunity Management",
    keyLearningFocus:
      "Building productivity habits, goal-setting, and balancing career demands.",
    facilitator: "Chinenye Ajayi",
    tentativeDates: "7th March 2026",
  },
  {
    week: "4",
    theme: "Asking the Right Questions as a Young Professional",
    keyLearningFocus:
      "Framing meaningful questions to mentors, employers, and peers for career growth.",
    facilitator: "TBD",
    tentativeDates: "14th March 2026",
  },
  {
    week: "5",
    theme: "What Next? Crafting Your Career Pathway",
    keyLearningFocus:
      "Developing personalised action plans and roadmaps for continued growth.",
    facilitator: "Chibunna Ogbonna",
    tentativeDates: "21st March 2026",
  },
  {
    week: "6",
    theme: "Building Visibility and Networks + Accessing Global Opportunities",
    keyLearningFocus:
      "Personal branding, LinkedIn optimisation, and leveraging global opportunities.",
    facilitator: "Ayodeji Stephen",
    tentativeDates: "28th March, 2026",
  },
  {
    week: "7",
    theme: "Special Guest Appearance",
    keyLearningFocus:
      "The Future of Energy: Opportunities for Young Leaders and Innovators",
    facilitator: "Mr Biodun Ogunleye",
    tentativeDates: "29th March, 2025",
  },
];

export default function Schedule() {
  return (
    <div className="min-h-screen relative font-poppins bg-[#09090b] text-white">
      <Header />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-10">
        <div className="pt-6 md:pt-10">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Program Schedule
          </h1>
          <p className="mt-3 text-white/70 max-w-3xl">
            View the full week-by-week schedule, including themes, key learning
            focus, facilitators, and tentative dates.
          </p>
        </div>

        <section className="mt-8">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-white/10 bg-white/5">
            <table className="min-w-full text-left">
              <thead className="bg-white/10">
                <tr className="text-sm text-white/90">
                  <th className="px-4 py-3 font-semibold">Week</th>
                  <th className="px-4 py-3 font-semibold">Theme</th>
                  <th className="px-4 py-3 font-semibold">Key Learning Focus</th>
                  <th className="px-4 py-3 font-semibold">Facilitator</th>
                  <th className="px-4 py-3 font-semibold">Tentative Dates</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {SCHEDULE.map((item) => (
                  <tr key={item.week} className="text-sm text-white/80">
                    <td className="px-4 py-4 align-top font-medium text-white">
                      {item.week}
                    </td>
                    <td className="px-4 py-4 align-top">{item.theme}</td>
                    <td className="px-4 py-4 align-top">{item.keyLearningFocus}</td>
                    <td className="px-4 py-4 align-top">{item.facilitator}</td>
                    <td className="px-4 py-4 align-top whitespace-nowrap">
                      {item.tentativeDates}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden flex flex-col gap-4">
            {SCHEDULE.map((item) => (
              <div
                key={item.week}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-white">
                    Week {item.week}
                  </div>
                  <div className="text-xs text-white/70">{item.tentativeDates}</div>
                </div>

                <div className="mt-3">
                  <div className="text-base font-semibold text-white">
                    {item.theme}
                  </div>
                  <div className="mt-2 text-sm text-white/75 leading-relaxed">
                    {item.keyLearningFocus}
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-1 text-sm">
                  <div className="text-white/60">Facilitator</div>
                  <div className="text-white">{item.facilitator}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
