import { useEffect } from "react";

export default function FeatureCards() {
  useEffect(() => {
    // runtime debug: confirm this component mounts in the browser
    console.log("FeatureCards mounted");
  }, []);

  return (
    <section className="px-6 md:px-12 py-12" >
      <div className="max-w-7xl mx-auto">
        <div className="mb-7">
        <h2 className="text-4xl  sm:text-5xl md:text-5xl font-bold  leading-[1.03] mb-2 gradient-text">
               Long-Term 
              Vision.
            </h2>
            <p className="text-gray-300 max-w-[50vw]">The Sledge aims to become Africa’s most influential mentorship network for early-career energy
professionals. Over time, the program will expand to include:</p>
</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "The Sledge Plus",
              desc:
                "an advanced professional track for in-depth coaching and projectcollaboration",
            },
            {
              title: "Annual Alumni Summit",
              desc:
                "showcasing success stories, partnerships, and impact.",
            },
            {
              title: "Scholarship and Internship Linkages",
              desc:
                " connecting mentees with global opportunities.",
            },
          ].map((card, i) => {
            // Per-card gradient presets (gold, green, white)
            const gradientClasses = [
              "from-yellow-500 via-yellow-300 to-yellow-800",
              "from-emerald-400 via-emerald-500 to-emerald-600",
              "from-white/95 via-white/80 to-neutral-200/70",
            ];

            const textColor = i === 2 ? "text-black" : "text-white";
            const subTextColor = i === 2 ? "text-neutral-800" : "text-gray-100";

            return (
              <article
                key={card.title}
                className={`reveal rounded-2xl pt-0 shadow-lg hover:scale-[1.02] transform transition duration-300 bg-gradient-to-br ${
                  gradientClasses[i % gradientClasses.length]
                } border ${i === 2 ? "border-neutral-200/40" : "border-white/6"}`}
                aria-labelledby={`feature-${i}`}
              >
                <div className="mb-4 w-full h-70 rounded-md overflow-hidden flex items-center justify-center">
                  {/* Mock screenshot area; keep subtle contrast against card background */}
                  <div
                    className={`w-full h-full rounded-md border ${
                      i === 2 ? "border-neutral-200/40 bg-white/90" : "border-white/6 bg-black/10"
                    }`}
                  />
                </div>

                <h4 id={`feature-${i}`} className={`px-6 text-lg ${textColor} font-semibold mb-2`}>
                  {card.title}
                </h4>
                <p className={ ` px-6 text-sm ${subTextColor} mb-4`}>{card.desc}</p>

                <div className="flex  items-center justify-between">
                  <a
                    href="#"
                    className={`px-6 mb-6 text-sm ${i === 2 ? "text-neutral-800/90" : "text-white/90"} font-medium inline-flex items-center gap-2`}
                  >
                    Learn more
                    <span className={`inline-block w-5 h-5 rounded-full ${i === 2 ? "bg-neutral-800/6 text-neutral-800" : "bg-white/8 text-white"} flex items-center justify-center`}>↗</span>
                  </a>
                </div> 
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
