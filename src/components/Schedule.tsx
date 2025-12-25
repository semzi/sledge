import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { API_BASE } from "../lib/api";

type ScheduleItem = {
  id: string;
  week: string;
  theme: string;
  key_learning_focus: string;
  facilitator: string;
  tentative_date: string;
};

export default function Schedule() {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE}/schedule.php`);
        const json = (await res.json().catch(() => null)) as any;

        if (!res.ok || !json || !Array.isArray(json.items)) {
          throw new Error("Failed to load schedule");
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
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load schedule");
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
          {error && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
              {error}
            </div>
          )}

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
                {items.map((item) => (
                  <tr key={item.id} className="text-sm text-white/80">
                    <td className="px-4 py-4 align-top font-medium text-white">
                      {item.week}
                    </td>
                    <td className="px-4 py-4 align-top">{item.theme}</td>
                    <td className="px-4 py-4 align-top">{item.key_learning_focus}</td>
                    <td className="px-4 py-4 align-top">{item.facilitator}</td>
                    <td className="px-4 py-4 align-top whitespace-nowrap">
                      {item.tentative_date}
                    </td>
                  </tr>
                ))}
                {!loading && items.length === 0 && (
                  <tr>
                    <td className="px-4 py-6 text-sm text-white/70" colSpan={5}>
                      No schedule items yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-white">
                    Week {item.week}
                  </div>
                  <div className="text-xs text-white/70">{item.tentative_date}</div>
                </div>

                <div className="mt-3">
                  <div className="text-base font-semibold text-white">
                    {item.theme}
                  </div>
                  <div className="mt-2 text-sm text-white/75 leading-relaxed">
                    {item.key_learning_focus}
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-1 text-sm">
                  <div className="text-white/60">Facilitator</div>
                  <div className="text-white">{item.facilitator}</div>
                </div>
              </div>
            ))}

            {!loading && items.length === 0 && (
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                No schedule items yet.
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
