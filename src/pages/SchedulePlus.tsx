import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_BASE } from "../lib/api";
import { Calendar, ChevronRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

type ScheduleItem = {
  id: string;
  week: string;
  theme: string;
  key_learning_focus: string;
  facilitator: string;
  tentative_date: string;
};

export default function SchedulePlus() {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);

      try {
        // Points to the plus program endpoint (even if it's currently empty)
        const res = await fetch(`${API_BASE}/schedule.php?program=plus`);
        const json = (await res.json().catch(() => null)) as any;

        if (!res.ok || !json || !Array.isArray(json.items)) {
          // If the endpoint is missing or non-functional for plus, we just show empty
          if (!cancelled) setItems([]);
          return;
        }

        const mapped = (json.items as any[]).map((it) => ({
          id: String(it.id),
          week: String(it.week ?? ""),
          theme: String(it.theme ?? ""),
          key_learning_focus: String(it.key_learning_focus ?? ""),
          facilitator: String(it.facilitator ?? ""),
          tentative_date: String(it.tentative_date ?? ""),
        }));

        if (!cancelled) setItems(mapped);
      } catch (e) {
        // On error (like 404 for the endpoint), we just treat it as empty for now
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen relative font-poppins bg-[#050505] text-white flex flex-col overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vh] bg-green-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[40vw] h-[60vh] bg-green-600/5 blur-[150px] rounded-full"></div>
      </div>

      <div className="relative z-50 w-full flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <Header />
        </div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pb-20 flex-grow w-full">
        {/* Header / Hero Area */}
        <section className="pt-16 md:pt-24 mb-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full px-3 py-1 text-[10px] font-bold tracking-widest uppercase mb-8 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
              <Sparkles className="w-3 h-3 fill-current" />
              Detailed Roadmap
            </div>
            <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter mb-8 leading-[1] text-white">
              Sledge <span className="text-green-500 text-grad">Plus</span> Schedule
            </h1>
            <p className="text-white/50 text-lg md:text-xl font-light leading-relaxed mb-6">
              Accelerate your trajectory with our most intensive curriculum yet. Every module is tailored for high-impact growth.
            </p>
          </div>
        </section>

        <section className="relative">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-green-500/20 border-t-green-500 rounded-full animate-spin"></div>
            </div>
          ) : items.length > 0 ? (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto rounded-[2rem] border border-white/10 bg-white/[0.02] backdrop-blur-sm">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-[0.2em] text-white/30 border-b border-white/5">
                      <th className="px-8 py-6 font-black">Week</th>
                      <th className="px-8 py-6 font-black">Theme</th>
                      <th className="px-8 py-6 font-black">Key Learning Focus</th>
                      <th className="px-8 py-6 font-black">Facilitator</th>
                      <th className="px-8 py-6 font-black">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-white/[0.04] transition-colors group">
                        <td className="px-8 py-8 align-top font-black text-green-500 text-xl font-mono">
                          W{item.week}
                        </td>
                        <td className="px-8 py-8 align-top">
                          <div className="font-bold text-white group-hover:text-green-400 transition-colors">{item.theme}</div>
                        </td>
                        <td className="px-8 py-8 align-top text-white/60 text-sm leading-relaxed max-w-xs">
                          {item.key_learning_focus}
                        </td>
                        <td className="px-8 py-8 align-top text-white/80 font-medium">
                          {item.facilitator}
                        </td>
                        <td className="px-8 py-8 align-top whitespace-nowrap text-white/40 font-mono text-sm">
                          {item.tentative_date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden flex flex-col gap-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-3xl border border-white/10 bg-white/[0.02] p-8"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-2xl font-black text-green-500 font-mono">
                        Week {item.week}
                      </div>
                      <div className="text-xs text-white/30 font-mono tracking-widest">{item.tentative_date}</div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-white mb-3">
                        {item.theme}
                      </h3>
                      <p className="text-white/60 text-sm leading-relaxed">
                        {item.key_learning_focus}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-white/5">
                      <div className="text-[10px] uppercase tracking-widest text-white/20 font-bold mb-1">Facilitator</div>
                      <div className="text-white font-medium">{item.facilitator}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Premium Empty State */
            <div className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-white/[0.02] p-12 md:p-20 text-center backdrop-blur-xl">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/10 blur-[100px] rounded-full pointer-events-none"></div>
              <div className="relative z-10 max-w-lg mx-auto">
                <div className="w-20 h-20 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-green-500/20">
                  <Calendar className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 italic">Plus Schedule Coming Soon</h3>
                <p className="text-white/40 text-base md:text-lg mb-10 font-light leading-relaxed">
                  We're currently fine-tuning the high-impact curriculum for Sledge Plus. The full timeline will be available shortly.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link 
                    to="/plus" 
                    className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
                  >
                    Return to Plus <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
