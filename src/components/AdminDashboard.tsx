import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, LayoutDashboard, Menu, Pencil, Search, Settings, Trash2, Users, X } from 'lucide-react';
import { API_BASE } from '../lib/api';

type AdminTab = 'dashboard' | 'registrations' | 'schedule' | 'settings';

type Registration = {
  id: number;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  country?: string | null;
  current_status?: string | null;
  institution_or_organization?: string | null;
  field_or_role?: string | null;
  highest_education?: string | null;
  registration_status?: string | null;
  created_at?: string | null;
};

type RegistrationsResponse = {
  items: Registration[];
  page: number;
  limit: number;
  total: number;
};

type DashboardSeriesPoint = {
  date: string;
  count: number;
};

type DashboardRecentItem = {
  id: number;
  full_name: string | null;
  email: string | null;
  registration_status: string | null;
  created_at: string | null;
};

type AdminDashboardResponse = {
  registrations: {
    total: number;
    attendees: number;
    pending: number;
    paid_usd: number;
    amount_per_attendee_usd: number;
  };
  series: DashboardSeriesPoint[];
  recent: DashboardRecentItem[];
};

type ScheduleItem = {
  id: string;
  week: string;
  theme: string;
  key_learning_focus: string;
  facilitator: string;
  tentative_date: string;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = useMemo(
    () => [
      { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
      { id: 'registrations' as const, label: 'Registrations', icon: Users },
      { id: 'schedule' as const, label: 'Schedule', icon: Calendar },
      { id: 'settings' as const, label: 'Settings', icon: Settings },
    ],
    []
  );

  const title = useMemo(() => {
    const found = nav.find((n) => n.id === activeTab);
    return found?.label ?? 'Admin';
  }, [activeTab, nav]);

  const logout = () => {
    localStorage.removeItem('admin_session');
    navigate('/login');
  };

  const SideNav = ({ compact }: { compact?: boolean }) => (
    <aside
      className={cx(
        'bg-dark-v2 border-r border-white/20 h-full',
        compact ? 'w-full' : 'w-64'
      )}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-white.png" alt="Sledge Logo" className="w-9 h-9" />
            <div className="text-white font-semibold">Sledge Admin</div>
          </div>
          {compact && (
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-700/50 text-white"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <nav className="px-3 pb-4">
        <ul className="space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = item.id === activeTab;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileOpen(false);
                  }}
                  className={cx(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition',
                    active
                      ? 'bg-white/10 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );

  const DashboardPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<AdminDashboardResponse | null>(null);
    const [receiptEmail, setReceiptEmail] = useState('');
    const [receiptLoading, setReceiptLoading] = useState(false);
    const [receiptError, setReceiptError] = useState<string | null>(null);

    useEffect(() => {
      let cancelled = false;
      const load = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(`${API_BASE}/admin-dashboard.php`);
          const json = (await res.json().catch(() => null)) as any;
          if (!res.ok || !json) throw new Error('Failed to load dashboard');
          if (!cancelled) setData(json as AdminDashboardResponse);
        } catch (e) {
          if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load dashboard');
        } finally {
          if (!cancelled) setLoading(false);
        }
      };
      load();
      return () => {
        cancelled = true;
      };
    }, []);

    const series = data?.series ?? [];
    const maxY = Math.max(1, ...series.map((p) => p.count));
    const points = series
      .map((p, idx) => {
        const x = series.length <= 1 ? 0 : (idx / (series.length - 1)) * 100;
        const y = 100 - (p.count / maxY) * 100;
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(' ');

    const total = data?.registrations.total ?? 0;
    const attendees = data?.registrations.attendees ?? 0;
    const pending = data?.registrations.pending ?? 0;
    const paid = data?.registrations.paid_usd ?? 0;

    const generateReceipt = async () => {
      const email = receiptEmail.trim();
      if (!email) {
        setReceiptError('Email is required');
        return;
      }

      setReceiptLoading(true);
      setReceiptError(null);
      try {
        const res = await fetch(`${API_BASE}/admin-receipt-lookup.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        const json = (await res.json().catch(() => null)) as any;
        if (!res.ok || !json || json.success !== true) {
          throw new Error(json?.message || 'Failed to generate receipt');
        }

        const rid = String(json.registration_id ?? '');
        if (!rid) throw new Error('Missing registration id');

        const receiptUrl = `/payment-receipt?rid=${encodeURIComponent(rid)}`;
        window.open(receiptUrl, '_blank', 'noopener,noreferrer');
      } catch (e) {
        setReceiptError(e instanceof Error ? e.message : 'Failed to generate receipt');
      } finally {
        setReceiptLoading(false);
      }
    };

    return (
      <div className="space-y-6">
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-dark-v2 border border-white/20 rounded-lg shadow-xl p-5">
            <p className="text-gray-300 text-sm">Registrations</p>
            <h2 className="text-3xl gradient-text font-bold text-white">{loading ? '—' : total}</h2>
            <p className="text-gray-300 text-sm">Total registered</p>
          </div>

          <div className="bg-dark-v2 border border-white/20 rounded-lg shadow-xl p-5">
            <p className="text-gray-300 text-sm">Attendees</p>
            <h2 className="text-3xl green-text font-bold text-white">{loading ? '—' : attendees}</h2>
            <p className="text-gray-300 text-sm">Registration status verified</p>
          </div>

          <div className="bg-dark-v2 border border-white/20 rounded-lg shadow-xl p-5">
            <p className="text-gray-300 text-sm">Paid</p>
            <h2 className="text-3xl green-text font-bold text-white">{loading ? '—' : `$${paid}`}</h2>
            <p className="text-gray-300 text-sm">{loading ? '' : 'Attendees'}</p>
          </div>

          <div className="bg-dark-v2 border border-white/20 rounded-lg shadow-xl p-5">
            <p className="text-gray-300 text-sm">Pending</p>
            <h2 className="text-3xl gradient-text font-bold text-white">{loading ? '—' : pending}</h2>
            <p className="text-gray-300 text-sm">Awaiting verification</p>
          </div>
        </div>

        <div className="bg-dark-v2 border border-white/20 rounded-lg shadow-xl p-6">
          <div className="flex flex-col md:flex-row md:items-end gap-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">Generate receipt</h3>
              <p className="text-sm text-white/70">Enter a user email. Only verified registrations can generate a receipt.</p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              value={receiptEmail}
              onChange={(e) => setReceiptEmail(e.target.value)}
              placeholder="Email"
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none md:col-span-3"
            />
            <button
              type="button"
              onClick={generateReceipt}
              disabled={receiptLoading}
              className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed text-white"
            >
              {receiptLoading ? 'Checking…' : 'Generate'}
            </button>
          </div>

          {receiptError && <div className="mt-3 text-sm text-red-400">{receiptError}</div>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-dark-v2 border border-white/20 rounded-lg shadow-xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Registrations over time</h3>
              <div className="text-sm text-white/60">Daily</div>
            </div>

            <div className="mt-4 h-56 w-full rounded-xl border border-white/10 bg-black/20 p-3">
              {series.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-white/60">
                  {loading ? 'Loading…' : 'No data yet.'}
                </div>
              ) : (
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                  <polyline
                    fill="none"
                    stroke="rgba(16, 212, 6, 0.9)"
                    strokeWidth="2"
                    points={points}
                  />
                  <polyline
                    fill="rgba(16, 212, 6, 0.10)"
                    stroke="none"
                    points={`0,100 ${points} 100,100`}
                  />
                </svg>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 bg-dark-v2 border border-white/20 rounded-lg shadow-xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Recent registrations</h3>
              <button
                type="button"
                onClick={() => setActiveTab('registrations')}
                className="text-sm text-white/70 hover:text-white"
              >
                View all
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {(data?.recent ?? []).map((r) => (
                <div key={r.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold text-white truncate">{r.full_name ?? '—'}</div>
                      <div className="text-sm text-white/70 truncate">{r.email ?? '—'}</div>
                    </div>
                    <div className="text-xs text-white/60">#{r.id}</div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-white/60">
                    <div>{r.registration_status ?? 'pending'}</div>
                    <div className="truncate">{r.created_at ?? ''}</div>
                  </div>
                </div>
              ))}

              {!loading && (data?.recent?.length ?? 0) === 0 && (
                <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/60">
                  No registrations yet.
                </div>
              )}

              {loading && (
                <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/60">
                  Loading…
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-dark-v2 border border-white/20 rounded-lg shadow-xl p-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-white">Quick actions</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('registrations')}
                className="px-3 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/15 text-white"
              >
                View registrations
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('schedule')}
                className="px-3 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/15 text-white"
              >
                Manage schedule
              </button>
            </div>
          </div>
          <p className="mt-2 text-sm text-white/70">Use the sidebar to manage registrations, update the schedule, or log out.</p>
        </div>
      </div>
    );
  };

  const RegistrationsPage = () => {
    const [q, setQ] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<RegistrationsResponse>({ items: [], page: 1, limit: 10, total: 0 });

    const totalPages = Math.max(1, Math.ceil(data.total / limit));

    useEffect(() => {
      let cancelled = false;
      const load = async () => {
        setLoading(true);
        setError(null);
        try {
          const url = new URL(`${API_BASE}/registrations.php`);
          url.searchParams.set('page', String(page));
          url.searchParams.set('limit', String(limit));
          if (q.trim()) url.searchParams.set('q', q.trim());

          const res = await fetch(url.toString());
          const json = (await res.json().catch(() => null)) as unknown;
          if (!res.ok || !json || typeof json !== 'object') {
            throw new Error('Failed to load registrations');
          }

          if (!cancelled) setData(json as RegistrationsResponse);
        } catch (e) {
          if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load registrations');
        } finally {
          if (!cancelled) setLoading(false);
        }
      };
      load();
      return () => {
        cancelled = true;
      };
    }, [page, limit, q]);

    useEffect(() => {
      setPage(1);
    }, [q, limit]);

    return (
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-white">Registrations</h2>
            <p className="text-sm text-white/70">Search and paginate through registrations.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-white/60 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search name, email, phone, status…"
                className="w-full sm:w-80 pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>

            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none"
            >
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
            </select>
          </div>
        </div>

        <div className="bg-dark-v2 border border-white/20 rounded-lg shadow-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10 text-sm text-white/70">
            {loading ? 'Loading…' : `${data.total} total`}
          </div>

          {error && <div className="px-4 py-3 text-sm text-red-400">{error}</div>}

          {/* Desktop table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-white/5 text-white/80 text-xs">
                <tr>
                  <th className="px-4 py-3 font-semibold">ID</th>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Phone</th>
                  <th className="px-4 py-3 font-semibold">Country</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-sm">
                {data.items.map((r) => (
                  <tr key={r.id} className="text-white/85">
                    <td className="px-4 py-3">{r.id}</td>
                    <td className="px-4 py-3 font-medium text-white">{r.full_name ?? '—'}</td>
                    <td className="px-4 py-3">{r.email ?? '—'}</td>
                    <td className="px-4 py-3">{r.phone ?? '—'}</td>
                    <td className="px-4 py-3">{r.country ?? '—'}</td>
                    <td className="px-4 py-3">{r.registration_status ?? '—'}</td>
                    <td className="px-4 py-3">{r.created_at ?? '—'}</td>
                  </tr>
                ))}
                {!loading && data.items.length === 0 && (
                  <tr>
                    <td className="px-4 py-6 text-white/60" colSpan={7}>
                      No registrations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden divide-y divide-white/10">
            {data.items.map((r) => (
              <div key={r.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-white font-semibold">{r.full_name ?? '—'}</div>
                    <div className="text-sm text-white/70">{r.email ?? '—'}</div>
                  </div>
                  <div className="text-xs text-white/60">#{r.id}</div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-white/60">Phone</div>
                    <div className="text-white/85">{r.phone ?? '—'}</div>
                  </div>
                  <div>
                    <div className="text-white/60">Country</div>
                    <div className="text-white/85">{r.country ?? '—'}</div>
                  </div>
                  <div>
                    <div className="text-white/60">Status</div>
                    <div className="text-white/85">{r.registration_status ?? '—'}</div>
                  </div>
                  <div>
                    <div className="text-white/60">Created</div>
                    <div className="text-white/85">{r.created_at ?? '—'}</div>
                  </div>
                </div>
              </div>
            ))}
            {!loading && data.items.length === 0 && (
              <div className="p-4 text-white/60">No registrations found.</div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-t border-white/10">
            <div className="text-sm text-white/70">
              Page {data.page} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                className="px-3 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed text-white"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || loading}
                className="px-3 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed text-white"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SchedulePage = () => {
    const [items, setItems] = useState<ScheduleItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<Omit<ScheduleItem, 'id'>>({
      week: '',
      theme: '',
      key_learning_focus: '',
      facilitator: '',
      tentative_date: '',
    });
    const [editingId, setEditingId] = useState<string | null>(null);

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/schedule.php`);
        const json = (await res.json().catch(() => null)) as any;
        if (!res.ok || !json || !Array.isArray(json.items)) throw new Error('Failed to load schedule');
        setItems(
          json.items.map((it: any) => ({
            id: String(it.id),
            week: String(it.week ?? ''),
            theme: String(it.theme ?? ''),
            key_learning_focus: String(it.key_learning_focus ?? ''),
            facilitator: String(it.facilitator ?? ''),
            tentative_date: String(it.tentative_date ?? ''),
          }))
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load schedule');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      load();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const submit = async () => {
      if (!form.week.trim() || !form.theme.trim() || !form.key_learning_focus.trim() || !form.facilitator.trim() || !form.tentative_date.trim()) {
        setError('Please fill in all fields.');
        return;
      }

      setSaving(true);
      setError(null);
      try {
        if (editingId) {
          const res = await fetch(`${API_BASE}/schedule.php`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: Number(editingId),
              week: Number(form.week),
              theme: form.theme,
              key_learning_focus: form.key_learning_focus,
              facilitator: form.facilitator,
              tentative_date: form.tentative_date,
            }),
          });
          const json = (await res.json().catch(() => null)) as any;
          if (!res.ok || !json || json.success !== true) throw new Error(json?.message || 'Failed to update schedule item');
          setEditingId(null);
        } else {
          const res = await fetch(`${API_BASE}/schedule.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              week: Number(form.week),
              theme: form.theme,
              key_learning_focus: form.key_learning_focus,
              facilitator: form.facilitator,
              tentative_date: form.tentative_date,
            }),
          });
          const json = (await res.json().catch(() => null)) as any;
          if (!res.ok || !json || json.success !== true) throw new Error(json?.message || 'Failed to create schedule item');
        }

        setForm({ week: '', theme: '', key_learning_focus: '', facilitator: '', tentative_date: '' });
        await load();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to save schedule item');
      } finally {
        setSaving(false);
      }
    };

    const startEdit = (it: ScheduleItem) => {
      setEditingId(it.id);
      setForm({
        week: it.week,
        theme: it.theme,
        key_learning_focus: it.key_learning_focus,
        facilitator: it.facilitator,
        tentative_date: it.tentative_date,
      });
    };

    const deleteItem = async (id: string) => {
      const numericId = Number(id);
      if (!Number.isFinite(numericId) || numericId <= 0) {
        setError('Invalid schedule id');
        return;
      }
      setSaving(true);
      setError(null);
      try {
        const url = new URL(`${API_BASE}/schedule.php`);
        url.searchParams.set('id', String(numericId));

        const res = await fetch(url.toString(), {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: numericId }),
        });

        const json = (await res.json().catch(() => null)) as any;
        if (!res.ok || !json || json.success !== true) {
          throw new Error(json?.message || 'Failed to delete schedule item');
        }

        if (editingId === id) {
          setEditingId(null);
          setForm({ week: '', theme: '', key_learning_focus: '', facilitator: '', tentative_date: '' });
        }

        await load();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to delete schedule item');
      } finally {
        setSaving(false);
      }
    };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Schedule</h2>
          <p className="text-sm text-white/70">Add, view, and edit schedule items.</p>
        </div>

        <div className="bg-dark-v2 border border-white/20 rounded-lg shadow-xl p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              value={form.week}
              onChange={(e) => setForm((f) => ({ ...f, week: e.target.value }))}
              placeholder="Week"
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none"
            />
            <input
              value={form.theme}
              onChange={(e) => setForm((f) => ({ ...f, theme: e.target.value }))}
              placeholder="Theme"
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none md:col-span-2"
            />
            <input
              value={form.tentative_date}
              onChange={(e) => setForm((f) => ({ ...f, tentative_date: e.target.value }))}
              placeholder="Tentative date"
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none"
            />
            <textarea
              value={form.key_learning_focus}
              onChange={(e) => setForm((f) => ({ ...f, key_learning_focus: e.target.value }))}
              placeholder="Key learning focus"
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none md:col-span-4 min-h-[80px]"
            />
            <input
              value={form.facilitator}
              onChange={(e) => setForm((f) => ({ ...f, facilitator: e.target.value }))}
              placeholder="Facilitator"
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none md:col-span-3"
            />
            <button
              type="button"
              onClick={submit}
              disabled={saving}
              className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed text-white"
            >
              {saving ? 'Saving…' : editingId ? 'Save' : 'Add'}
            </button>
          </div>

          {error && <div className="mt-3 text-sm text-red-400">{error}</div>}
        </div>

        <div className="bg-dark-v2 border border-white/20 rounded-lg shadow-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10 text-sm text-white/70">
            {loading ? 'Loading…' : `${items.length} items`}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-white/5 text-white/80 text-xs">
                <tr>
                  <th className="px-4 py-3 font-semibold">Week</th>
                  <th className="px-4 py-3 font-semibold">Theme</th>
                  <th className="px-4 py-3 font-semibold">Key learning focus</th>
                  <th className="px-4 py-3 font-semibold">Facilitator</th>
                  <th className="px-4 py-3 font-semibold">Tentative date</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-sm">
                {items.map((it) => (
                  <tr key={it.id} className="text-white/85">
                    <td className="px-4 py-3">{it.week}</td>
                    <td className="px-4 py-3 font-medium text-white">{it.theme}</td>
                    <td className="px-4 py-3">{it.key_learning_focus}</td>
                    <td className="px-4 py-3">{it.facilitator || '—'}</td>
                    <td className="px-4 py-3">{it.tentative_date || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(it)}
                          className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/15 text-white"
                        >
                          <Pencil className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteItem(it.id)}
                          disabled={saving}
                          className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-red-500/15 hover:bg-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed text-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-white/10">
            {items.map((it) => (
              <div key={it.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-white font-semibold">Week {it.week}</div>
                    <div className="text-sm text-white/80">{it.theme}</div>
                    <div className="mt-1 text-sm text-white/60">{it.tentative_date || '—'}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(it)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/15 text-white"
                      aria-label="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteItem(it.id)}
                      disabled={saving}
                      className="p-2 rounded-lg bg-red-500/15 hover:bg-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed text-red-200"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 text-sm text-white/75 leading-relaxed">
                  {it.key_learning_focus}
                </div>
                <div className="mt-3 text-sm">
                  <div className="text-white/60">Facilitator</div>
                  <div className="text-white/85">{it.facilitator || '—'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const SettingsPage = () => (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-white">Settings</h2>
        <p className="text-sm text-white/70">Account actions.</p>
      </div>

      <div className="bg-dark-v2 border border-white/20 rounded-lg shadow-xl p-6">
        <button
          type="button"
          onClick={logout}
          className="px-4 py-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200"
        >
          Logout
        </button>
      </div>
    </div>
  );

  const Page = () => {
    if (activeTab === 'registrations') return <RegistrationsPage />;
    if (activeTab === 'schedule') return <SchedulePage />;
    if (activeTab === 'settings') return <SettingsPage />;
    return <DashboardPage />;
  };

  return (
    <div className="min-h-screen bg-[#09090b] font-poppins text-white">
      <div className="flex min-h-screen">
        <div className="hidden lg:block">
          <SideNav />
        </div>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw]">
              <SideNav compact />
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-40 bg-dark-v2 border-b border-white/20 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-700/50"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="min-w-0">
                <div className="text-sm text-white/60">Admin</div>
                <div className="text-lg font-semibold truncate">{title}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-sm text-white/70">
                <span className="truncate max-w-[200px]">
                  {(() => {
                    try {
                      const s = localStorage.getItem('admin_session');
                      const parsed = s ? JSON.parse(s) : null;
                      return parsed?.admin?.email ?? 'Admin';
                    } catch {
                      return 'Admin';
                    }
                  })()}
                </span>
              </div>
              <button
                type="button"
                onClick={logout}
                className="px-3 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/15"
              >
                Logout
              </button>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              <Page />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
