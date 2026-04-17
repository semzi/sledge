import { Calendar, Clock, LayoutDashboard, Menu, MessageSquare, Pencil, Plus, Search, Settings, Star, Trash2, Users, X, Map as MapIcon } from 'lucide-react';
// import contentData from '../../data/content.json'; (No longer needed)
import { useEffect, useMemo, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { API_BASE } from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import RoadmapManager from '../components/RoadmapManager';

type AdminTab = 'dashboard' | 'registrations' | 'sessions' | 'schedule' | 'settings' | 'pages' | 'roadmap' | 'testimonials';

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

type Testimonial = {
  id: number;
  name: string;
  role: string | null;
  content: string;
  image_url: string | null;
  rating: number;
  is_active: number;
  created_at: string;
};

type ContentData = {
  programs: {
    mentorship: {
      title: string;
      subtitle: string;
      price: number;
      priceNgn?: number;
      priceUsd?: number;
      priceUnit: string;
      duration: string;
      intensity: string;
      cohortSize: number;
      cohortsPerYear: number;
      mode: string;
      mentor: string;
      outcome: string;
      heroDesc: string;
      desc1: string;
      desc2: string;
      featuresLabel: string;
      features: string[];
      ctaText: string;
      ctaLink: string;
      isPopular: boolean;
      isNew: boolean;
    };
    oneOnOne: {
      title: string;
      subtitle: string;
      priceNgn?: number;
      priceUsd?: number;
      desc1: string;
      desc2: string;
      featuresLabel: string;
      features: string[];
      ctaText: string;
      ctaLink: string;
      isPopular: boolean;
      isNew: boolean;
    };
    plus: {
      title: string;
      subtitle: string;
      price: number;
      priceNgn?: number;
      priceUsd?: number;
      priceUnit: string;
      duration: string;
      intensity: string;
      heroDesc: string;
      desc1: string;
      desc2: string;
      featuresLabel: string;
      features: string[];
      ctaText: string;
      ctaLink: string;
      isPopular: boolean;
      isNew: boolean;
    };
  };
  about: {
    badge: string;
    title: string;
    description: string;
    features: Array<{
      title: string;
      description: string;
    }>;
  };
  futureForward: {
    badge: string;
    title: string;
    description: string;
    items: Array<{
      title: string;
      description: string;
      image: string;
    }>;
  };
};

type DashboardSeriesPoint = {
  date: string;
  count: number;
  status?: string;
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

  const SessionsPage = () => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [q, setQ] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [editingSession, setEditingSession] = useState<any | null>(null);
    const [saving, setSaving] = useState(false);

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const load = async () => {
      setLoading(true);
      try {
        const url = new URL(`${API_BASE}/sessions.php`);
        if (q) url.searchParams.set('q', q);
        if (startDate) url.searchParams.set('startDate', startDate);
        if (endDate) url.searchParams.set('endDate', endDate);
        if (selectedDays.length > 0) url.searchParams.set('days', selectedDays.join(','));
        if (statusFilter) url.searchParams.set('status', statusFilter);
        
        const res = await fetch(url.toString());
        const json = await res.json();
        setItems(json.items || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => { load(); }, [q, startDate, endDate, selectedDays, statusFilter]);

    const toggleDay = (day: string) => {
      setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
    };

    const handleStatusToggle = async (id: number, newStatus: string) => {
      try {
        await fetch(`${API_BASE}/sessions.php`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, status: newStatus })
        });
        await load();
      } catch (e) {
        console.error(e);
      }
    };

    const handleUpdate = async (id: number, data: any) => {
      setSaving(true);
      try {
        await fetch(`${API_BASE}/sessions.php`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, ...data })
        });
        setEditingSession(null);
        await load();
      } catch (e) {
        console.error(e);
      } finally {
        setSaving(false);
      }
    };

    const handleDelete = async (id: number) => {
      if (!confirm('Are you sure you want to delete this session?')) return;
      try {
        await fetch(`${API_BASE}/sessions.php`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        await load();
      } catch (e) {
        console.error(e);
      }
    };

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Booked Sessions</h2>
            <p className="text-sm text-white/40 font-medium italic">Monitor and manage your upcoming mentorship appointments.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 space-y-6 backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1 space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-1 font-mono">Quick Search</label>
              <div className="relative group">
                <Search className="w-4 h-4 text-white/20 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-green-500 transition-colors" />
                <input 
                  value={q} 
                  onChange={e => setQ(e.target.value)} 
                  placeholder="name or email..." 
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-green-500/50 text-sm transition-all" 
                />
              </div>
            </div>
            <div className="md:col-span-1 space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-1 font-mono">From Date</label>
              <input 
                type="date" 
                value={startDate} 
                onChange={e => setStartDate(e.target.value)} 
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-green-500/50 text-sm [color-scheme:dark]" 
              />
            </div>
            <div className="md:col-span-1 space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-1 font-mono">To Date</label>
              <input 
                type="date" 
                value={endDate} 
                onChange={e => setEndDate(e.target.value)} 
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-green-500/50 text-sm [color-scheme:dark]" 
              />
            </div>
            <div className="md:col-span-1 space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-1 font-mono">Current Status</label>
              <select 
                value={statusFilter} 
                onChange={e => setStatusFilter(e.target.value)} 
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-green-500/50 text-sm appearance-none cursor-pointer"
              >
                <option value="" className="bg-[#0f0f11]">All Reservations</option>
                <option value="confirmed" className="bg-[#0f0f11]">Confirmed</option>
                <option value="pending" className="bg-[#0f0f11]">Pending</option>
                <option value="cancelled" className="bg-[#0f0f11]">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-1 font-mono">Filter by Days of the Week</label>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map(day => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={cx(
                    "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300",
                    selectedDays.includes(day) 
                      ? "bg-green-500 text-black border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]" 
                      : "bg-white/5 text-white/30 border-white/10 hover:text-white/60 hover:bg-white/10"
                  )}
                >
                  {day}
                </button>
              ))}
              {selectedDays.length > 0 && (
                <button 
                  onClick={() => setSelectedDays([])}
                  className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-400/60 hover:text-red-400 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 border-2 border-green-500/20 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm text-white/20 font-mono">Syncing bookings...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] p-16 text-center">
               <Calendar className="w-12 h-12 text-white/10 mx-auto mb-4" />
               <h3 className="text-xl font-bold text-white mb-2">No Appointments Found</h3>
               <p className="text-sm text-white/40 max-w-xs mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {items.map(it => {
                const dateObj = new Date(it.session_date);
                const day = dateObj.getDate();
                const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
                const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

                return (
                  <div key={it.id} className="group relative bg-[#0f0f11]/40 border border-white/5 rounded-2xl p-4 hover:bg-white/[0.03] hover:border-white/10 transition-all duration-300">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                      {/* Date Badge */}
                      <div className="flex shrink-0 lg:flex-col items-center justify-center lg:w-20 lg:h-20 bg-white/5 rounded-xl border border-white/5 group-hover:border-green-500/30 transition-colors p-3 lg:p-0">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/30 lg:mb-1 mr-3 lg:mr-0">{month}</span>
                        <span className="text-2xl font-black text-white leading-none">{day}</span>
                        <span className="hidden lg:block text-[9px] font-black uppercase tracking-tighter text-green-500/60 mt-1">{weekday.slice(0,3)}</span>
                      </div>

                      {/* Main Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-white truncate max-w-sm">{it.name}</h3>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-white/50 text-[12px] font-medium">
                            <span className="text-green-500/60 font-black text-[9px] uppercase font-mono tracking-tighter">Booker:</span>
                            {it.email} 
                            {it.phone && <span className="text-white/20 ml-2">• {it.phone}</span>}
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-white/40 text-[12px] font-medium mt-0.5">
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-3 h-3 text-green-500/40" />
                                {it.session_time} 
                            </div>
                            <span className="text-white/10">|</span> 
                            <span className="text-white/60 font-bold">{it.title}</span>
                            
                            {it.meeting_link && (
                                <div className="flex items-center gap-2 px-2 py-0.5 rounded-lg bg-green-500/10 border border-green-500/20 group/link">
                                    <span className="text-[10px] text-green-400 font-mono truncate max-w-[120px]">{it.meeting_link}</span>
                                    <button 
                                        onClick={() => {
                                            navigator.clipboard.writeText(it.meeting_link);
                                            alert('Link copied to clipboard!');
                                        }}
                                        className="p-1 text-green-400/40 hover:text-green-400 transition-colors"
                                        title="Copy Meeting Link"
                                    >
                                        <Plus className="w-3 h-3 rotate-45" /> 
                                    </button>
                                </div>
                            )}
                          </div>
                        </div>
                        {it.purpose && <p className="mt-4 text-xs text-white/30 italic leading-relaxed line-clamp-1 group-hover:line-clamp-none transition-all">"{it.purpose}"</p>}
                      </div>

                      {/* Actions & Controls */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 lg:pt-0 shrink-0 border-t lg:border-none border-white/5">
                        <div className="flex gap-1.5 p-1 bg-white/5 rounded-xl border border-white/5 shrink-0">
                          {(['pending', 'confirmed', 'cancelled'] as const).map((s) => (
                            <button
                              key={s}
                              onClick={() => handleStatusToggle(it.id, s)}
                              className={cx(
                                "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                                it.status === s 
                                  ? s === 'confirmed' ? "bg-green-500 text-black" : s === 'cancelled' ? "bg-red-500 text-white" : "bg-white text-black"
                                  : "text-white/20 hover:text-white"
                              )}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button 
                            onClick={() => setEditingSession(it)} 
                            className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-green-400 hover:border-green-500/30 transition-all"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(it.id)} 
                            className="p-3 rounded-xl bg-red-500/5 border border-white/10 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all font-bold"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {editingSession && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditingSession(null)} />
            <div className="relative w-full max-w-xl bg-[#0f0f11] border border-white/10 rounded-[2rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
              <h3 className="text-xl font-bold text-white mb-6">Edit Booking</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-1">Title</label>
                  <input 
                    value={editingSession.title} 
                    onChange={e => setEditingSession({ ...editingSession, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-green-500/50" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-1">Date</label>
                    <input 
                      type="date"
                      value={editingSession.session_date} 
                      onChange={e => setEditingSession({ ...editingSession, session_date: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-green-500/50 [color-scheme:dark]" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-1">Time</label>
                    <input 
                      value={editingSession.session_time} 
                      onChange={e => setEditingSession({ ...editingSession, session_time: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-green-500/50" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-1">Meeting Link</label>
                  <input 
                    placeholder="Enter Zoom/Google Meet link..."
                    value={editingSession.meeting_link || ''} 
                    onChange={e => setEditingSession({ ...editingSession, meeting_link: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-green-500/50 text-sm font-mono" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-1">Status</label>
                  <div className="flex gap-2">
                    {['pending', 'confirmed', 'cancelled'].map(s => (
                      <button
                        key={s}
                        onClick={() => setEditingSession({ ...editingSession, status: s })}
                        className={cx(
                          "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                          editingSession.status === s 
                            ? s === 'confirmed' ? "bg-green-500 text-black border-green-500" : s === 'cancelled' ? "bg-red-500 text-white border-red-500" : "bg-white text-black border-white"
                            : "bg-white/5 text-white/30 border-white/10 hover:bg-white/10"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="pt-6 flex gap-3">
                  <button 
                    onClick={() => setEditingSession(null)}
                    className="flex-1 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white/60 font-black uppercase tracking-widest text-[11px] hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleUpdate(editingSession.id, { 
                        title: editingSession.title, 
                        session_date: editingSession.session_date, 
                        session_time: editingSession.session_time, 
                        status: editingSession.status,
                        meeting_link: editingSession.meeting_link
                    })}
                    disabled={saving}
                    className="flex-1 py-3.5 rounded-xl bg-green-500 hover:bg-green-600 text-black font-black uppercase tracking-widest text-[11px] transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const nav = useMemo(
    () => [
      { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
      { id: 'registrations' as const, label: 'Registrations', icon: Users },
      { id: 'sessions' as const, label: 'Sessions', icon: Calendar },
      { id: 'schedule' as const, label: 'Schedule', icon: Calendar },
      { id: 'roadmap' as const, label: 'Roadmap', icon: MapIcon },
      { id: 'testimonials' as const, label: 'Testimonials', icon: MessageSquare },
      { id: 'pages' as const, label: 'Page editors', icon: Pencil },
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

  const SideNav = () => (
    <aside className="bg-[#0f0f11] border-r border-white/10 h-full w-72 flex flex-col shrink-0">
      <div className="p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 blur-lg rounded-full group-hover:bg-green-500/40 transition-all"></div>
              <img src="/logo2.png" alt="Sledge Logo" className="relative w-10 h-10 object-contain" />
            </div>
            <div className="text-white font-bold text-xl tracking-tight">Sledge <span className="text-green-500">Admin</span></div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-2 rounded-xl hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <nav className="flex-1 px-5 pb-8 space-y-8 overflow-y-auto custom-scrollbar">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-white/30 font-bold mb-4 ml-3">Menu</div>
          <ul className="space-y-2">
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
                      'w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-300',
                      active
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]'
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <Icon className={cx("w-5 h-5", active ? "text-green-400" : "text-white/40")} />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <div className="p-5 border-t border-white/5">
        <button
          onClick={logout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[15px] font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-all duration-300"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          Logout
        </button>
      </div>
    </aside>
  );

  const DashboardPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<AdminDashboardResponse | null>(null);
    const [sessions, setSessions] = useState<any[]>([]);
    const [receiptEmail, setReceiptEmail] = useState('');
    const [receiptLoading, setReceiptLoading] = useState(false);
    const [receiptError, setReceiptError] = useState<string | null>(null);
    const [showTestimonials, setShowTestimonials] = useState(true);
    const [updatingSetting, setUpdatingSetting] = useState(false);

    useEffect(() => {
      let cancelled = false;
      const load = async () => {
        setLoading(true);
        setError(null);
        try {
          const [resDash, resSess] = await Promise.all([
             fetch(`${API_BASE}/admin-dashboard.php`),
             fetch(`${API_BASE}/sessions.php`)
          ]);
          const jsonDash = await resDash.json().catch(() => null);
          const jsonSess = await resSess.json().catch(() => null);
          
          if (!resDash.ok || !jsonDash) throw new Error('Failed to load dashboard');
          if (!cancelled) {
            setData(jsonDash);
            setSessions(jsonSess?.items || []);
            
            // Fetch show_testimonials setting
            const resContent = await fetch(`${API_BASE}/content.php`);
            const jsonContent = await resContent.json().catch(() => null);
            if (jsonContent && jsonContent.show_testimonials !== undefined) {
              setShowTestimonials(jsonContent.show_testimonials === true || jsonContent.show_testimonials === 'true');
            }
          }
        } catch (e) {
          if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load dashboard');
        } finally {
          if (!cancelled) setLoading(false);
        }
      };
      load();
      return () => { cancelled = true; };
    }, []);

    const series = data?.series ?? [];
    
    // Aggregate bookings by date and status
    const bookingsByDate: Record<string, { pending: number, completed: number, cancelled: number }> = {};
    sessions.forEach(s => {
      if (!s.session_date) return;
      if (!bookingsByDate[s.session_date]) bookingsByDate[s.session_date] = { pending: 0, completed: 0, cancelled: 0 };
      const st = (s.status || 'pending').toLowerCase();
      if (st === 'completed') bookingsByDate[s.session_date].completed += 1;
      else if (st === 'cancelled') bookingsByDate[s.session_date].cancelled += 1;
      else bookingsByDate[s.session_date].pending += 1;
    });

    // Aggregate registrations by date and status
    const regByDate: Record<string, { pending: number, paid: number }> = {};
    const dateMap = new Map<string, any>();
    series.forEach(p => {
      if (!regByDate[p.date]) regByDate[p.date] = { pending: 0, paid: 0 };
      const st = (p.status || 'pending').toLowerCase();
      if (st === 'verified' || st === 'paid' || st === 'attendee') regByDate[p.date].paid += p.count;
      else regByDate[p.date].pending += p.count;
    });
    
    const allDates = new Set([...Object.keys(regByDate), ...Object.keys(bookingsByDate)]);
    allDates.forEach(d => {
       dateMap.set(d, {
           date: d,
           RegPending: regByDate[d]?.pending || 0,
           RegPaid: regByDate[d]?.paid || 0,
           BookPending: bookingsByDate[d]?.pending || 0,
           BookCompleted: bookingsByDate[d]?.completed || 0,
           BookCancelled: bookingsByDate[d]?.cancelled || 0,
       });
    });

    let chartData = Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date));
    chartData = chartData.map(d => {
      const dObj = new Date(d.date);
      let ds = '';
      if (!isNaN(dObj.getTime())) {
          ds = dObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else {
          ds = d.date; // Fallback
      }
      return { ...d, displayDate: ds };
    });

    const { total = 0, attendees = 0, pending = 0, paid_usd = 0 } = data?.registrations ?? {};

    const generateReceipt = async () => {
      const email = receiptEmail.trim();
      if (!email) { setReceiptError('Email is required'); return; }
      setReceiptLoading(true); setReceiptError(null);
      try {
        const res = await fetch(`${API_BASE}/admin-receipt-lookup.php`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }),
        });
        const json = (await res.json().catch(() => null)) as any;
        if (!res.ok || !json || json.success !== true) throw new Error(json?.message || 'Failed to generate receipt');
        const rid = String(json.registration_id ?? '');
        if (!rid) throw new Error('Missing registration id');
        window.open(`/payment-receipt?rid=${encodeURIComponent(rid)}`, '_blank', 'noopener,noreferrer');
      } catch (e) {
        setReceiptError(e instanceof Error ? e.message : 'Failed to generate receipt');
      } finally { setReceiptLoading(false); }
    };

    const toggleTestimonialsSetting = async () => {
      const newValue = !showTestimonials;
      setUpdatingSetting(true);
      try {
        const res = await fetch(`${API_BASE}/content-editor.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ show_testimonials: newValue })
        });
        if (res.ok) setShowTestimonials(newValue);
      } catch (e) {
        console.error(e);
      } finally {
        setUpdatingSetting(false);
      }
    };

    return (
      <div className="space-y-6 animate-in fade-in duration-700">
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {[
            { label: 'Registrations', value: total, sub: 'Total registered', color: 'green' },
            { label: 'Attendees', value: attendees, sub: 'Status verified', color: 'green' },
            { label: 'Paid', value: `$${paid_usd}`, sub: 'Attendees', color: 'white' },
            { label: 'Pending', value: pending, sub: 'Awaiting verification', color: 'white' }
          ].map((stat, i) => (
            <div key={i} className="group relative">
              <div className="absolute inset-0 bg-white/5 rounded-2xl group-hover:bg-white/10 transition-all duration-300"></div>
              <div className="relative p-6 border border-white/10 rounded-2xl overflow-hidden">
                <div className={cx(
                  "absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-20 transition-opacity",
                  stat.color === 'green' ? "bg-green-500" : "bg-white"
                )}></div>
                <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">{stat.label}</p>
                <h2 className={cx(
                  "text-4xl font-bold tracking-tight mb-1",
                  stat.color === 'green' ? "text-green-400" : "text-white"
                )}>
                  {loading ? (
                    <div className="h-10 w-24 bg-white/5 animate-pulse rounded-lg"></div>
                  ) : stat.value}
                </h2>
                <p className="text-white/40 text-xs">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="relative group overflow-hidden bg-white/[0.02] border border-white/10 rounded-2xl p-6 md:p-8">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-green-500/5 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="relative h-[400px] w-full pt-4">
                {chartData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-sm text-white/30 italic">
                    {loading ? 'Fetching analytics…' : 'No tracking data available.'}
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorRegPaid" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorRegPending" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#eab308" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorBookCompleted" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorBookPending" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorBookCancelled" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="displayDate" stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 10}} tickLine={false} axisLine={false} dy={10} minTickGap={20} />
                      <YAxis stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 10}} tickLine={false} axisLine={false} dx={-10} allowDecimals={false} />
                      <Tooltip contentStyle={{backgroundColor: '#050505', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', color: 'rgba(255,255,255,0.8)'}} itemStyle={{fontWeight: 'bold'}} />
                      <Legend iconType="circle" wrapperStyle={{fontSize: '11px', paddingTop: '10px'}} />
                      
                      <Area type="monotone" name="Reg: Paid" dataKey="RegPaid" stackId="reg" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorRegPaid)" activeDot={{r: 4, fill: '#22c55e', stroke: '#050505', strokeWidth: 2}} />
                      <Area type="monotone" name="Reg: Pending" dataKey="RegPending" stackId="reg" stroke="#eab308" strokeWidth={2} fillOpacity={1} fill="url(#colorRegPending)" activeDot={{r: 4, fill: '#eab308', stroke: '#050505', strokeWidth: 2}} />
                      
                      <Area type="monotone" name="Book: Completed" dataKey="BookCompleted" stackId="book" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorBookCompleted)" activeDot={{r: 4, fill: '#3b82f6', stroke: '#050505', strokeWidth: 2}} />
                      <Area type="monotone" name="Book: Pending" dataKey="BookPending" stackId="book" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorBookPending)" activeDot={{r: 4, fill: '#f97316', stroke: '#050505', strokeWidth: 2}} />
                      <Area type="monotone" name="Book: Cancelled" dataKey="BookCancelled" stackId="book" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorBookCancelled)" activeDot={{r: 4, fill: '#ef4444', stroke: '#050505', strokeWidth: 2}} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

        <div className="relative group overflow-hidden bg-white/[0.02] border border-white/10 rounded-2xl p-8">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-green-500/10 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Generate receipt</h3>
                <p className="text-sm text-white/50 max-w-md">Enter a user email. Only verified registrations can generate a receipt.</p>
              </div>
              <div className="flex gap-4">
                <input
                  value={receiptEmail}
                  onChange={(e) => setReceiptEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="min-w-[300px] px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-green-500/50 transition-all font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={generateReceipt}
                  disabled={receiptLoading}
                  className="whitespace-nowrap px-8 py-3 rounded-xl bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
                >
                  {receiptLoading ? 'Syncing...' : 'Generate Receipt'}
                </button>
              </div>
            </div>
            {receiptError && <div className="mt-4 text-sm text-red-100 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20 inline-block font-medium">{receiptError}</div>}
          </div>
        </div>

        <div className="relative overflow-hidden bg-white/[0.02] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={cx(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                showTestimonials ? "bg-green-500/10 text-green-500" : "bg-white/5 text-white/20"
              )}>
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Global Testimonials</h3>
                <p className="text-sm text-white/40 font-medium italic">Toggle visibility of testimonials section on public pages.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleTestimonialsSetting}
              disabled={updatingSetting}
              className={cx(
                "px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all border",
                showTestimonials 
                  ? "bg-green-500 text-black border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]" 
                  : "bg-white/5 text-white/40 border-white/10"
              )}
            >
              {updatingSetting ? 'Syncing...' : (showTestimonials ? 'Enabled' : 'Disabled')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const TestimonialsPage = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);

    const load = useCallback(async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/testimonials.php`);
        const json = await res.json();
        setTestimonials(json.items || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleSave = async () => {
      if (!editing) return;
      setSaving(true);
      try {
        const method = editing.id ? 'PUT' : 'POST';
        const res = await fetch(`${API_BASE}/testimonials.php`, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editing)
        });
        if (res.ok) {
          setEditing(null);
          load();
        }
      } catch (e) {
        console.error(e);
      } finally {
        setSaving(false);
      }
    };

    const handleDelete = async (id: number) => {
      if (!confirm('Are you sure you want to delete this testimonial?')) return;
      try {
        await fetch(`${API_BASE}/testimonials.php`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        load();
      } catch (e) {
        console.error(e);
      }
    };

    const toggleActive = async (t: Testimonial) => {
      try {
        await fetch(`${API_BASE}/testimonials.php`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: t.id, is_active: t.is_active ? 0 : 1 })
        });
        load();
      } catch (e) {
        console.error(e);
      }
    };

    return (
      <div className="space-y-8 animate-in fade-in duration-500 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Testimonials</h2>
            <p className="text-sm text-white/40 font-medium italic">Manage student success stories and feedback.</p>
          </div>
          <button 
            onClick={() => setEditing({ name: '', role: '', content: '', rating: 5, is_active: 1 })}
            className="px-8 py-3 rounded-xl bg-green-500 text-black font-black uppercase tracking-widest text-[11px] hover:bg-green-400 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]"
          >
            Add Testimonial
          </button>
        </div>

        {loading && testimonials.length === 0 ? (
           <div className="py-20 text-center text-white/20 font-mono tracking-widest uppercase text-[10px]">Fetching reviews...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.id} className="group relative bg-[#0f0f11]/40 border border-white/10 rounded-[2rem] p-8 hover:border-white/20 transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={cx("w-4 h-4", i < t.rating ? "text-green-500 fill-green-500" : "text-white/10")} />
                    ))}
                  </div>
                  <button 
                    onClick={() => toggleActive(t)}
                    className={cx(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all",
                      t.is_active ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-white/5 text-white/20 border-white/5"
                    )}
                  >
                    {t.is_active ? 'Active' : 'Hidden'}
                  </button>
                </div>
                
                <p className="text-white/70 text-sm leading-relaxed mb-8 italic">"{t.content}"</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                       {t.image_url ? <img src={t.image_url} alt="" className="w-full h-full object-cover" /> : <Users className="w-5 h-5 text-white/20" />}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm tracking-tight">{t.name}</h4>
                      <p className="text-white/30 text-[11px] font-medium">{t.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditing(t)} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all border border-white/5"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(t.id)} className="p-2.5 rounded-xl bg-red-500/5 hover:bg-red-500/10 text-red-500/40 hover:text-red-500 transition-all border border-white/5"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {editing && createPortal(
          <div className="fixed inset-0 z-[1000] flex items-start sm:items-center justify-center p-4 sm:p-6 overflow-y-auto custom-scrollbar">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setEditing(null)} />
            <div className="relative w-full max-w-2xl bg-[#0f0f11] border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-2xl animate-in fade-in zoom-in duration-300 my-auto">
              <h3 className="text-2xl font-bold text-white mb-8">{editing.id ? 'Edit' : 'Add'} Testimonial</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                   <div className="space-y-2">
                     <label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-1">Name</label>
                     <input 
                       value={editing.name || ''} 
                       onChange={e => setEditing({ ...editing, name: e.target.value })}
                       className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-green-500/50" 
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-1">Role / Company</label>
                     <input 
                       value={editing.role || ''} 
                       onChange={e => setEditing({ ...editing, role: e.target.value })}
                       className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-green-500/50" 
                     />
                   </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-1">Feedback Content</label>
                  <textarea 
                    rows={4}
                    value={editing.content || ''} 
                    onChange={e => setEditing({ ...editing, content: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-green-500/50 resize-none" 
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-1">Rating (1-5)</label>
                        <input 
                            type="number" min="1" max="5"
                            value={editing.rating || 5} 
                            onChange={e => setEditing({ ...editing, rating: parseInt(e.target.value) })}
                            className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-green-500/50" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-1">Avatar URL (Optional)</label>
                        <input 
                            value={editing.image_url || ''} 
                            onChange={e => setEditing({ ...editing, image_url: e.target.value })}
                            placeholder="https://..."
                            className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-green-500/50" 
                        />
                    </div>
                </div>
                
                <div className="pt-4 sm:pt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button 
                    onClick={() => setEditing(null)}
                    className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 font-black uppercase tracking-widest text-[11px] hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 py-4 rounded-2xl bg-green-500 hover:bg-green-600 text-black font-black uppercase tracking-widest text-[11px] transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                  >
                    {saving ? 'Saving...' : 'Save Testimonial'}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    );
  };

  const RegistrationsPage = () => {
    const [q, setQ] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<RegistrationsResponse>({ items: [], page: 1, limit: 10, total: 0 });
    const totalPages = Math.ceil(data.total / limit) || 1;

    useEffect(() => {
      let cancelled = false;
      (async () => {
        setLoading(true);
        try {
          const url = new URL(`${API_BASE}/registrations.php`);
          url.searchParams.set('page', String(page)); url.searchParams.set('limit', String(limit));
          if (q.trim()) url.searchParams.set('q', q.trim());
          const res = await fetch(url.toString());
          const json = await res.json();
          if (!cancelled) setData(json);
        } catch {} finally { if (!cancelled) setLoading(false); }
      })();
      return () => { cancelled = true; };
    }, [page, limit, q]);

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Registrations</h2>
            <p className="text-sm text-white/40 font-medium italic">Monitor Student intake and verified attendees.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative group">
              <Search className="w-4 h-4 text-white/20 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-green-500 transition-colors" />
              <input 
                value={q} 
                onChange={(e) => setQ(e.target.value)} 
                placeholder="Search database..." 
                className="w-full sm:w-80 pl-11 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-green-500/50 focus:bg-white/[0.06] transition-all font-medium" 
              />
            </div>
            
            <div className="relative">
              <select 
                value={limit} 
                onChange={(e) => setLimit(Number(e.target.value))} 
                className="w-full px-6 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-green-500/50 appearance-none cursor-pointer font-bold text-[13px] tracking-wide pr-10"
              >
                <option value={10} className="bg-[#0f0f11]">10 per page</option>
                <option value={20} className="bg-[#0f0f11]">20 per page</option>
                <option value={50} className="bg-[#0f0f11]">50 per page</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="min-w-full text-left">
              <thead className="text-[10px] uppercase font-black tracking-[0.2em] text-white/20 border-b border-white/5 bg-white/[0.01]">
                <tr>
                  <th className="px-8 py-5"># ID</th>
                  <th className="px-6 py-5">Full Name</th>
                  <th className="px-6 py-5">Contact Details</th>
                  <th className="px-6 py-5">Location</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Date Applied</th>
                </tr>
              </thead>
              <tbody className={cx("divide-y divide-white/[0.02] text-[14px] transition-opacity duration-300", loading ? "opacity-40 pointer-events-none" : "opacity-100")}>
                {data.items.map((r) => (
                  <tr key={r.id} className="text-white/60 hover:bg-white/[0.04] transition-all group/row cursor-default">
                    <td className="px-8 py-5 font-mono text-[11px] text-white/20 group-hover/row:text-green-500/40">#{r.id}</td>
                    <td className="px-6 py-5 font-bold text-white tracking-tight group-hover/row:text-green-400 transition-colors">{r.full_name || '—'}</td>
                    <td className="px-6 py-5">
                      <div className="text-white/50 font-medium">{r.email}</div>
                      <div className="text-[11px] text-white/20 font-mono mt-0.5">{r.phone || '—'}</div>
                    </td>
                    <td className="px-6 py-5 font-medium text-white/30">{r.country || '—'}</td>
                    <td className="px-6 py-5">
                      <span className={cx(
                        "px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                        r.registration_status === 'attendee' 
                          ? "bg-green-500/10 text-green-400 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]" 
                          : "bg-white/5 text-white/30 border-white/10"
                      )}>
                        {r.registration_status || 'verified'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right text-white/20 font-bold font-mono text-[12px]">
                      {r.created_at ? new Date(r.created_at).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/[0.01]">
            <div className="text-[11px] font-black uppercase tracking-widest text-white/20">
              Active Records: <span className="text-green-500 ml-1">{data.total.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                disabled={page <= 1} 
                onClick={() => setPage(p => p - 1)} 
                className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-widest text-white hover:bg-white/10 disabled:opacity-20 transition-all"
              >
                Prev
              </button>
              <div className="px-4 font-mono font-bold text-green-500 text-sm">
                {page} <span className="mx-2 text-white/10">/</span> {totalPages}
              </div>
              <button 
                disabled={page >= totalPages} 
                onClick={() => setPage(p => p + 1)} 
                className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-widest text-white hover:bg-white/10 disabled:opacity-20 transition-all"
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
    const [activeSchedTab, setActiveSchedTab] = useState<'mentorship' | 'plus'>('mentorship');
    const [items, setItems] = useState<ScheduleItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ week: '', theme: '', key_learning_focus: '', facilitator: '', tentative_date: '' });
    const [editingId, setEditingId] = useState<string | null>(null);

    const load = async () => {
      if (activeSchedTab === 'plus') {
        setItems([]);
        return;
      }
      
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/schedule.php?program=${activeSchedTab}`);
        const json = await res.json();
        setItems(json.items || []);
      } catch (e) {
        console.error("Fetch error:", e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      setItems([]); // Clear immediately for feedback
      load(); 
    }, [activeSchedTab]);

    const submit = async () => {
      if (activeSchedTab === 'plus') return;
      
      setSaving(true);
      try {
        const method = editingId ? 'PUT' : 'POST';
        const body = { 
          ...form, 
          id: editingId ? Number(editingId) : undefined, 
          week: Number(form.week),
          program: activeSchedTab 
        };
        await fetch(`${API_BASE}/schedule.php`, { 
          method, 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify(body) 
        });
        setForm({ week: '', theme: '', key_learning_focus: '', facilitator: '', tentative_date: '' }); 
        setEditingId(null); 
        await load();
      } catch {} finally { setSaving(false); }
    };

    const handleDelete = async (id: string) => {
      if (activeSchedTab === 'plus') return;
      
      if (!confirm('Are you sure you want to delete this session?')) return;
      try {
        await fetch(`${API_BASE}/schedule.php`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: Number(id), program: activeSchedTab })
        });
        await load();
      } catch {}
    };

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Session Timeline</h2>
              <p className="text-sm text-white/40 font-medium italic">Manage program curriculum and facilitator assignments.</p>
            </div>
            
            <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5 ml-0 md:ml-8">
              {(['mentorship', 'plus'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setActiveSchedTab(p)}
                  className={cx(
                    "px-5 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all",
                    activeSchedTab === p ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"
                  )}
                >
                  {p === 'mentorship' ? 'Mentorship' : 'Sledge Plus'}
                </button>
              ))}
            </div>
          </div>
          {activeSchedTab === 'mentorship' && (
            <button 
              onClick={() => { setEditingId(null); setForm({ week: '', theme: '', key_learning_focus: '', facilitator: '', tentative_date: '' }); }}
              className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all"
            >
              Clear Draft
            </button>
          )}
        </div>

        {activeSchedTab === 'mentorship' ? (
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1 space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-1">Week</label>
                <input value={form.week} onChange={e => setForm(f => ({ ...f, week: e.target.value }))} placeholder="01" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-green-500/50 font-mono" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-1">Core Theme</label>
                <input value={form.theme} onChange={e => setForm(f => ({ ...f, theme: e.target.value }))} placeholder="Module Topic" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-green-500/50 font-bold" />
              </div>
              <div className="md:col-span-1 space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-1">Scheduled Date</label>
                <input value={form.tentative_date} onChange={e => setForm(f => ({ ...f, tentative_date: e.target.value }))} placeholder="Jan 20" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-green-500/50" />
              </div>
              <div className="md:col-span-4 space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-1">Learning Focus & Agenda</label>
                <textarea value={form.key_learning_focus} onChange={e => setForm(f => ({ ...f, key_learning_focus: e.target.value }))} placeholder="Outline what will be covered..." className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-green-500/50 min-h-[100px]" />
              </div>
              <div className="md:col-span-3 space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-1">Lead Facilitator</label>
                <input value={form.facilitator} onChange={e => setForm(f => ({ ...f, facilitator: e.target.value }))} placeholder="Facilitator Name" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-green-500/50" />
              </div>
              <div className="md:col-span-1 flex items-end">
                <button 
                  onClick={submit} 
                  disabled={saving}
                  className="w-full py-3.5 rounded-xl bg-green-500 hover:bg-green-600 text-black font-black uppercase tracking-widest text-[11px] transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] disabled:opacity-50"
                >
                  {saving ? 'Syncing...' : editingId ? 'Update Entry' : 'Create Entry'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-12 text-center">
            <div className="max-w-md mx-auto">
              <Calendar className="w-12 h-12 text-white/10 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Plus Schedule Coming Soon</h3>
              <p className="text-sm text-white/40">The curriculum for Sledge Plus is currently being finalized. Once ready, you'll be able to manage the timeline here.</p>
            </div>
          </div>
        )}

        <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="text-[10px] uppercase font-black tracking-[0.2em] text-white/20 border-b border-white/5 bg-white/[0.01]">
                <tr>
                  <th className="px-8 py-5">Week</th>
                  <th className="px-8 py-5">Curriculum Focus</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-8 py-12 text-center text-sm text-white/20 italic font-medium">
                      {loading ? 'Refreshing database...' : 'No schedule records found for this program.'}
                    </td>
                  </tr>
                ) : (
                  items.map(it => (
                    <tr key={it.id} className="text-white/60 hover:bg-white/[0.04] transition-all group/row">
                      <td className="px-8 py-6 font-black text-green-500 font-mono text-lg">W{it.week}</td>
                      <td className="px-8 py-6">
                        <div className="font-bold text-white text-base group-hover/row:text-green-400 transition-colors">{it.theme}</div>
                        <div className="text-[11px] text-white/30 font-bold uppercase tracking-widest mt-1">Facilitator: {it.facilitator} • {it.tentative_date}</div>
                      </td>
                      <td className="px-8 py-6 text-right flex justify-end gap-3">
                        <button 
                          onClick={() => { setEditingId(it.id); setForm(it); }} 
                          className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-green-500 hover:border-green-500/50 transition-all group/btn"
                        >
                          <Pencil className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        </button>
                        <button 
                          onClick={() => handleDelete(it.id)} 
                          className="p-3 rounded-xl bg-red-500/5 border border-white/10 text-red-400/40 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/30 transition-all group/btn2"
                        >
                          <Trash2 className="w-4 h-4 group-hover/btn2:scale-110 transition-transform" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const PagesPage = () => {
    const [data, setData] = useState<ContentData | null>(null);
    const [saving, setSaving] = useState(false);
    const [subTab, setSubTab] = useState<'programs'|'about'|'futureForward'>('programs');
    const [activeProgram, setActiveProgram] = useState<'mentorship'|'oneOnOne'|'plus'>('mentorship');

    const [loading, setLoading] = useState(true);

    const loadContent = useCallback(async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/content.php`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, []);

    useEffect(() => { loadContent(); }, [loadContent]);

    const handleSave = async () => {
      if (!data) return; setSaving(true);
      try {
        await fetch(`${API_BASE}/content-editor.php`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      } catch {} finally { setSaving(false); }
    };

    if (loading) return <div className="py-20 text-center text-white/20 font-mono tracking-widest uppercase text-[10px]">Syncing content...</div>;
    if (!data) return null;

    const Input = ({ label, value, onChange, type = 'text' }: any) => (
      <div className="space-y-2">
        <label className="text-[10px] uppercase font-bold text-white/40 ml-1">{label}</label>
        {type === 'textarea' ? <textarea value={value} onChange={e => onChange(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white min-h-[100px]" /> : <input type={type} value={value} onChange={e => onChange(type === 'number' ? Number(e.target.value) : e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" />}
      </div>
    );

    const Toggle = ({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) => (
      <label className="flex items-center gap-4 cursor-pointer group select-none">
        <div 
          onClick={() => onChange(!value)}
          className={cx(
            "w-12 h-6 rounded-full transition-all duration-300 relative flex items-center px-1 border",
            value ? "bg-green-500/20 border-green-500/50" : "bg-white/5 border-white/10"
          )}
        >
          <div className={cx(
            "w-4 h-4 rounded-full transition-all duration-300 shadow-sm",
            value ? "translate-x-6 bg-green-400" : "translate-x-0 bg-white/20"
          )} />
        </div>
        <span className="text-[14px] font-medium text-white/60 group-hover:text-white transition-colors">{label}</span>
      </label>
    );

    const ListEditor = ({ label, items, onUpdate, onAdd, onRemove }: { label: string; items: string[]; onUpdate: (i: number, v: string) => void; onAdd: () => void; onRemove: (i: number) => void }) => (
      <div className="space-y-4">
        <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-1 block">{label}</label>
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="flex gap-3 group/item">
              <input
                value={item}
                onChange={(e) => onUpdate(idx, e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[14px] text-white/80 focus:outline-none focus:border-green-500/40 transition-all"
              />
              <button 
                onClick={() => onRemove(idx)}
                className="p-2.5 rounded-xl bg-red-500/5 hover:bg-red-500/10 text-red-400 border border-red-500/10 opacity-0 group-hover/item:opacity-100 transition-all font-bold text-[10px]"
              >
                REMOVE
              </button>
            </div>
          ))}
          <button 
            onClick={onAdd}
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-green-500/60 hover:text-green-500 transition-colors ml-1"
          >
            <Plus className="w-3 h-3" /> Add new entry
          </button>
        </div>
      </div>
    );

    const updateField = (path: string[], val: any) => {
      setData((prev: any) => {
        const next = { ...prev };
        let current = next;
        for (let i = 0; i < path.length - 1; i++) {
          current[path[i]] = { ...current[path[i]] };
          current = current[path[i]];
        }
        current[path[path.length - 1]] = val;
        return next;
      });
    };

    const addListItem = (path: string[], template: any) => {
      setData((prev: any) => {
        const next = { ...prev };
        let current = next;
        for (let i = 0; i < path.length - 1; i++) {
          current[path[i]] = { ...current[path[i]] };
          current = current[path[i]];
        }
        current[path[path.length - 1]] = [...current[path[path.length - 1]], template];
        return next;
      });
    };

    const removeListItem = (path: string[], idx: number) => {
      setData((prev: any) => {
        const next = { ...prev };
        let current = next;
        for (let i = 0; i < path.length - 1; i++) {
          current[path[i]] = { ...current[path[i]] };
          current = current[path[i]];
        }
        current[path[path.length - 1]] = current[path[path.length - 1]].filter((_: any, i: number) => i !== idx);
        return next;
      });
    };

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Page Editors</h2>
            <p className="text-sm text-white/40 font-medium italic">Dynamically update your landing page content from the terminal.</p>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-3 px-8 py-3 rounded-xl bg-white text-black font-black uppercase tracking-widest text-[11px] hover:bg-green-500 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50"
            >
              {saving ? 'Syncing Server...' : 'Commit Changes'}
            </button>
          </div>
        </div>

        <div className="flex border-b border-white/5 gap-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'programs', label: 'Offerings' },
            { id: 'about', label: 'Company' },
            { id: 'futureForward', label: 'Initiatives' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={cx(
                "pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative",
                subTab === tab.id ? "text-green-500" : "text-white/20 hover:text-white/40"
              )}
            >
              {tab.label}
              {subTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.5)]" />}
            </button>
          ))}
        </div>

        {subTab === 'programs' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex gap-2 p-1.5 bg-white/5 rounded-xl w-fit border border-white/5">
              {(['mentorship', 'oneOnOne', 'plus'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setActiveProgram(p)}
                  className={cx(
                    "px-5 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all",
                    activeProgram === p ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"
                  )}
                >
                  {p === 'mentorship' ? 'Mentorship' : p === 'oneOnOne' ? 'One-on-One' : 'Plus'}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.02] border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <Input label="Main Title" value={data.programs[activeProgram].title} onChange={(v: any) => updateField(['programs', activeProgram, 'title'], v)} />
              <Input label="Subtitle" value={data.programs[activeProgram].subtitle} onChange={(v: any) => updateField(['programs', activeProgram, 'subtitle'], v)} />
              
              <div className="md:col-span-2">
                <Input label="Hero Description" value={(data.programs[activeProgram] as any).heroDesc || ''} onChange={(v: any) => updateField(['programs', activeProgram, 'heroDesc'], v)} type="textarea" />
              </div>

              <Input label="Price (Naira ₦)" value={(data.programs[activeProgram] as any).priceNgn || 0} onChange={(v: any) => updateField(['programs', activeProgram, 'priceNgn'], v)} type="number" />
              <Input label="Price (USD $)" value={(data.programs[activeProgram] as any).priceUsd || 0} onChange={(v: any) => updateField(['programs', activeProgram, 'priceUsd'], v)} type="number" />

              <div className="flex flex-col gap-6 pt-4">
                <Toggle label="Popular Badge" value={data.programs[activeProgram].isPopular} onChange={(v: any) => updateField(['programs', activeProgram, 'isPopular'], v)} />
                <Toggle label="New Badge" value={data.programs[activeProgram].isNew} onChange={(v: any) => updateField(['programs', activeProgram, 'isNew'], v)} />
              </div>

              <div className="md:col-span-2 border-t border-white/5 pt-6 mt-4">
                <ListEditor 
                  label="Program Highlights / Features" 
                  items={data.programs[activeProgram].features} 
                  onUpdate={(idx, val) => {
                    const newList = [...data.programs[activeProgram].features];
                    newList[idx] = val;
                    updateField(['programs', activeProgram, 'features'], newList);
                  }}
                  onAdd={() => addListItem(['programs', activeProgram, 'features'], 'New requirement')}
                  onRemove={(idx) => removeListItem(['programs', activeProgram, 'features'], idx)}
                />
              </div>
            </div>
          </div>
        )}

        {subTab === 'about' && (
          <div className="space-y-6 bg-white/[0.02] border border-white/10 rounded-2xl p-8 backdrop-blur-sm animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Section Badge" value={data.about.badge} onChange={(v: any) => updateField(['about', 'badge'], v)} />
              <Input label="Primary Heading" value={data.about.title} onChange={(v: any) => updateField(['about', 'title'], v)} />
              <div className="md:col-span-2">
                <Input label="About Narrative" value={data.about.description} onChange={(v: any) => updateField(['about', 'description'], v)} type="textarea" />
              </div>
            </div>

            <div className="border-t border-white/5 pt-8 mt-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Core Pillars</h3>
                <button onClick={() => addListItem(['about', 'features'], { title: 'New Pillar', description: '' })} className="p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:text-green-500 transition-all"><Plus className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {data.about.features.map((feature, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 relative group/card">
                    <button onClick={() => removeListItem(['about', 'features'], idx)} className="absolute -top-3 -right-3 p-2 rounded-full bg-red-500 text-black font-black text-[9px] opacity-0 group-hover/card:opacity-100 transition-all shadow-xl">DEL</button>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Input label="Pillar Title" value={feature.title} onChange={(v: any) => { const nl = [...data.about.features]; nl[idx].title = v; updateField(['about', 'features'], nl); }} />
                      <div className="md:col-span-2"><Input label="Pillar Context" value={feature.description} onChange={(v: any) => { const nl = [...data.about.features]; nl[idx].description = v; updateField(['about', 'features'], nl); }} type="textarea" /></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {subTab === 'futureForward' && (
          <div className="space-y-6 bg-white/[0.02] border border-white/10 rounded-2xl p-8 backdrop-blur-sm animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Section Badge" value={data.futureForward.badge} onChange={(v: any) => updateField(['futureForward', 'badge'], v)} />
              <Input label="Heading Title" value={data.futureForward.title} onChange={(v: any) => updateField(['futureForward', 'title'], v)} />
              <div className="md:col-span-2">
                <Input label="Contextual Narrative" value={data.futureForward.description} onChange={(v: any) => updateField(['futureForward', 'description'], v)} type="textarea" />
              </div>
            </div>

            <div className="border-t border-white/5 pt-8 mt-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Strategic Initiatives</h3>
                <button onClick={() => addListItem(['futureForward', 'items'], { title: 'New Initiative', description: '', image: '' })} className="p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:text-green-500 transition-all"><Plus className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.futureForward.items.map((item, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 relative group/card space-y-4">
                    <button onClick={() => removeListItem(['futureForward', 'items'], idx)} className="absolute -top-3 -right-3 p-2 rounded-full bg-red-500 text-black font-black text-[9px] opacity-0 group-hover/card:opacity-100 transition-all shadow-xl">DEL</button>
                    <Input label="Initiative Title" value={item.title} onChange={(v: any) => { const nl = [...data.futureForward.items]; nl[idx].title = v; updateField(['futureForward', 'items'], nl); }} />
                    <Input label="Asset Path (Image)" value={item.image} onChange={(v: any) => { const nl = [...data.futureForward.items]; nl[idx].image = v; updateField(['futureForward', 'items'], nl); }} />
                    <Input label="Initiative Scope" value={item.description} onChange={(v: any) => { const nl = [...data.futureForward.items]; nl[idx].description = v; updateField(['futureForward', 'items'], nl); }} type="textarea" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const SettingsPage = () => {
    const [settings, setSettings] = useState<any>({
      available_days: [],
      available_times: [],
      weeks_ahead: 4
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const timeOptions = [
      '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
      '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
    ];

    useEffect(() => {
      fetch(`${API_BASE}/session_settings.php`)
        .then(res => res.json())
        .then(data => {
            setSettings({
                available_days: data.available_days || [],
                available_times: data.available_times || [],
                weeks_ahead: data.weeks_ahead || 4
            });
        })
        .catch(e => console.error("Settings fetch failed:", e))
        .finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
      setSaving(true);
      try {
        await fetch(`${API_BASE}/session_settings.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settings)
        });
        alert('Configuration saved successfully');
      } catch (e) {
        console.error(e);
      } finally {
        setSaving(false);
      }
    };

    const toggleDay = (day: string) => {
      setSettings((prev: any) => ({
        ...prev,
        available_days: prev.available_days.includes(day)
          ? prev.available_days.filter((d: string) => d !== day)
          : [...prev.available_days, day]
      }));
    };

    const toggleTime = (time: string) => {
      setSettings((prev: any) => ({
        ...prev,
        available_times: prev.available_times.includes(time)
          ? prev.available_times.filter((t: string) => t !== time)
          : [...prev.available_times, time]
      }));
    };

    if (loading) return <div className="py-20 text-center text-white/20 font-mono tracking-widest uppercase text-[10px]">Syncing configuration...</div>;

    return (
      <div className="space-y-8 animate-in fade-in duration-500 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Session Configuration</h2>
            <p className="text-sm text-white/40 font-medium italic">Manage mentorship session availability and rules.</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-green-500 text-black font-black uppercase tracking-widest text-[11px] hover:bg-green-400 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scheduling Days */}
          <div className="bg-[#0f0f11]/40 border border-white/10 rounded-[2rem] p-8 space-y-6 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Meeting Days</h3>
            </div>
            <p className="text-sm text-white/40 leading-relaxed font-medium">Select the days students are allowed to book mentorship sessions.</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {daysOfWeek.map(day => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={cx(
                    "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300",
                    settings.available_days.includes(day)
                    ? "bg-green-500 text-black border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                    : "bg-white/5 text-white/20 border-white/5 hover:text-white/40 hover:bg-white/10"
                  )}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Scheduling Times */}
          <div className="bg-[#0f0f11]/40 border border-white/10 rounded-[2rem] p-8 space-y-6 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Time Slots</h3>
            </div>
            <p className="text-sm text-white/40 leading-relaxed font-medium">Define the daily hour slots displayed on the booking page.</p>
            <div className="grid grid-cols-3 gap-2 pt-2">
              {timeOptions.map(time => (
                <button
                  key={time}
                  onClick={() => toggleTime(time)}
                  className={cx(
                    "px-4 py-2.5 rounded-xl text-[10px] font-mono font-black border transition-all duration-300",
                    settings.available_times.includes(time)
                    ? "bg-green-500 text-black border-green-500"
                    : "bg-white/5 text-white/20 border-white/5 hover:text-white/40 hover:bg-white/10"
                  )}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Booking Forecast */}
          <div className="bg-[#0f0f11]/40 border border-white/10 rounded-[2rem] p-8 space-y-6 backdrop-blur-md lg:col-span-2">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20">
                <Settings className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Booking Constraints</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest font-black text-white/30 ml-1 font-mono">Window (Weeks Ahead)</label>
                    <input 
                        type="number"
                        min="1"
                        max="52"
                        value={settings.weeks_ahead}
                        onChange={(e) => setSettings({...settings, weeks_ahead: parseInt(e.target.value)})}
                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold focus:outline-none focus:border-green-500/50 transition-all font-mono"
                    />
                    <p className="text-[11px] text-white/20 italic px-2">This limits how far into the future a student can browse the calendar.</p>
                </div>
                <div className="p-8 rounded-[1.5rem] bg-green-500/5 border border-green-500/10">
                    <p className="text-sm text-green-400/70 leading-relaxed italic font-medium">
                        "Your calendar is currently restricted to <strong>{settings.weeks_ahead} weeks</strong> projection. 
                        This allows for manageable scheduling while preventing extreme long-term bookings."
                    </p>
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Page = () => {
    if (activeTab === 'registrations') return <RegistrationsPage />;
    if (activeTab === 'sessions') return <SessionsPage />;
    if (activeTab === 'schedule') return <SchedulePage />;
    if (activeTab === 'roadmap') return <RoadmapManager />;
    if (activeTab === 'pages') return <PagesPage />;
    if (activeTab === 'settings') return <SettingsPage />;
    if (activeTab === 'testimonials') return <TestimonialsPage />;
    return <DashboardPage />;
  };

  return (
    <div className="flex h-screen bg-[#09090b] text-white overflow-hidden">
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>

      {/* Sidebar Desktop */}
      <div className="hidden md:block h-full">
        <SideNav />
      </div>

      {/* Sidebar Mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 animate-in slide-in-from-left duration-300"><SideNav /></div>
        </div>
      )}

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-24 px-8 border-b border-white/10 flex items-center justify-between bg-[#09090b]/80 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-6">
            <button onClick={() => setMobileOpen(true)} className="md:hidden p-3 rounded-xl bg-white/5 border border-white/10 text-white/60"><Menu className="w-5 h-5" /></button>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.25em] font-black text-green-500/60 mb-0.5">Admin Portal</span>
              <h1 className="text-2xl font-black text-white tracking-tight">{title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden lg:flex items-center gap-4 px-6 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="relative"><div className="w-2 h-2 rounded-full bg-green-500"></div><div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping"></div></div>
                <span className="text-xs font-mono text-white/50">Admin Active</span>
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto pb-20">
            <Page />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
