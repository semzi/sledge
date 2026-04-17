import React, { useState, useEffect } from "react";
import { 
  Globe, Zap, Briefcase, Users, Layers, Target, Rocket, BookOpen, 
  Clock, CheckCircle2, Circle, Star, Award, Shield, Heart, Lightbulb, 
  Map, MousePointer2, Settings, Wrench, Terminal, Code, Cpu, Database, 
  Cloud, Activity, BarChart3, PieChart, TrendingUp, Presentation, 
  Image as ImageIcon, Link, Mail, Phone, MessageSquare, Plus, Trash2, X, ChevronDown
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchRoadmap, apiUrl } from "../../lib/api";
import { Skeleton } from "../../components/ui/Skeleton";
import { cn } from "../../lib/utils";

const LUCIDE_ICONS: Record<string, React.ElementType> = {
  Globe, Zap, Briefcase, Users, Layers, Target, Rocket, BookOpen, 
  Clock, CheckCircle2, Circle, Star, Award, Shield, Heart, Lightbulb, 
  Map, MousePointer2, Settings, Wrench, Terminal, Code, Cpu, Database, 
  Cloud, Activity, BarChart3, PieChart, TrendingUp, Presentation, 
  Image: ImageIcon, Link, Mail, Phone, MessageSquare
};

interface Track {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: string;
  borderColor: string;
}

interface PhaseItem {
  week: string;
  title: string;
  description: string;
  highlight: string;
}

interface Phase {
  title: string;
  subtitle: string;
  weeks: string;
  description: string;
  icon: string;
  color: string;
  items: PhaseItem[];
}

interface RoadmapData {
  tracks: Track[];
  phases: Phase[];
}

const IconPicker = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const SelectedIcon = LUCIDE_ICONS[value] || Globe;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:border-white/20 transition-all text-sm"
      >
        <SelectedIcon className="w-4 h-4 text-green-500" />
        <span className="flex-1 text-left">{value || "Select Icon"}</span>
        <ChevronDown className={cn("w-4 h-4 text-white/20 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full max-h-64 overflow-y-auto bg-[#1a1a1c] border border-white/10 rounded-xl shadow-2xl p-2 grid grid-cols-2 gap-1 custom-scrollbar">
          {Object.keys(LUCIDE_ICONS).map((iconName) => {
            const Icon = LUCIDE_ICONS[iconName];
            return (
              <button
                key={iconName}
                type="button"
                onClick={() => {
                  onChange(iconName);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-all text-xs text-left",
                  value === iconName ? "bg-green-500/10 text-green-400" : "text-white/60"
                )}
              >
                <Icon className="w-3 h-3" />
                <span className="truncate">{iconName}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default function RoadmapManager() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<RoadmapData>({
    queryKey: ["roadmap"],
    queryFn: fetchRoadmap,
  });

  const [localData, setLocalData] = useState<RoadmapData | null>(null);
  const [activeTab, setActiveTab] = useState<"tracks" | "phases">("tracks");

  useEffect(() => {
    if (data) setLocalData(JSON.parse(JSON.stringify(data)));
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (updatedData: RoadmapData) => {
      const res = await fetch(apiUrl("/content-editor.php"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roadmap: updatedData }),
      });
      if (!res.ok) throw new Error("Failed to save changes");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmap"] });
      alert("Changes saved successfully!");
    },
    onError: (err) => {
      alert("Error saving changes: " + err.message);
    }
  });

  if (isLoading || !localData) {
    return <div className="space-y-6"><Skeleton className="h-10 w-48" /><Skeleton className="h-[400px] w-full" /></div>;
  }

  const saveChanges = () => {
    mutation.mutate(localData);
  };

  const addTrack = () => {
    const newTrack: Track = {
      id: String(localData.tracks.length + 1).padStart(2, '0'),
      title: "New Track",
      icon: "Globe",
      description: "Track description goes here",
      color: "from-blue-500/20 to-cyan-500/5",
      borderColor: "border-blue-500/20"
    };
    setLocalData({ ...localData, tracks: [...localData.tracks, newTrack] });
  };

  const removeTrack = (index: number) => {
    const newTracks = localData.tracks.filter((_, i) => i !== index);
    setLocalData({ ...localData, tracks: newTracks });
  };

  const addPhase = () => {
    const newPhase: Phase = {
      title: "NEW PHASE",
      subtitle: "Subtitle",
      weeks: "Weeks X-Y",
      description: "Phase description",
      icon: "Layers",
      color: "from-blue-500 to-cyan-400",
      items: []
    };
    setLocalData({ ...localData, phases: [...localData.phases, newPhase] });
  };

  const removePhase = (index: number) => {
    const newPhases = localData.phases.filter((_, i) => i !== index);
    setLocalData({ ...localData, phases: newPhases });
  };

  const addPhaseItem = (phaseIndex: number) => {
    const newItem: PhaseItem = {
      week: "Week X",
      title: "Module Title",
      description: "Module description",
      highlight: "Deliverable"
    };
    const newPhases = [...localData.phases];
    newPhases[phaseIndex].items.push(newItem);
    setLocalData({ ...localData, phases: newPhases });
  };

  const removePhaseItem = (phaseIndex: number, itemIndex: number) => {
    const newPhases = [...localData.phases];
    newPhases[phaseIndex].items = newPhases[phaseIndex].items.filter((_, i) => i !== itemIndex);
    setLocalData({ ...localData, phases: newPhases });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Roadmap Architect</h2>
          <p className="text-sm text-white/40 font-medium italic">Design and structure the 10-week learning journey.</p>
        </div>
        <button 
          onClick={saveChanges}
          disabled={mutation.isPending}
          className="px-8 py-3 rounded-xl bg-green-500 text-black font-black uppercase tracking-widest text-[11px] hover:bg-green-400 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] disabled:opacity-50"
        >
          {mutation.isPending ? "Deploying..." : "Sync Changes"}
        </button>
      </div>

      <div className="flex gap-4 border-b border-white/5 pb-1">
        <button 
          onClick={() => setActiveTab("tracks")}
          className={cn(
            "px-6 py-3 text-[11px] font-black uppercase tracking-widest transition-all relative",
            activeTab === "tracks" ? "text-green-400" : "text-white/30 hover:text-white"
          )}
        >
          Specialized Tracks
          {activeTab === "tracks" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>}
        </button>
        <button 
          onClick={() => setActiveTab("phases")}
          className={cn(
            "px-6 py-3 text-[11px] font-black uppercase tracking-widest transition-all relative",
            activeTab === "phases" ? "text-green-400" : "text-white/30 hover:text-white"
          )}
        >
          Program Phases
          {activeTab === "phases" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>}
        </button>
      </div>

      {activeTab === "tracks" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Active Pathways</h3>
            <button onClick={addTrack} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-green-400 hover:border-green-500/30 transition-all text-[10px] font-black uppercase tracking-widest">
              <Plus className="w-3 h-3" /> Add Track
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {localData.tracks.map((track, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4 group relative">
                <button 
                  onClick={() => removeTrack(idx)}
                  className="absolute -top-2 -right-2 p-2 rounded-full bg-red-500 text-black opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase font-black tracking-widest text-white/20 ml-1">Track ID</label>
                    <input 
                      value={track.id} 
                      onChange={(e) => {
                        const newTracks = [...localData.tracks];
                        newTracks[idx].id = e.target.value;
                        setLocalData({ ...localData, tracks: newTracks });
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase font-black tracking-widest text-white/20 ml-1">Icon</label>
                    <IconPicker value={track.icon} onChange={(val) => {
                      const newTracks = [...localData.tracks];
                      newTracks[idx].icon = val;
                      setLocalData({ ...localData, tracks: newTracks });
                    }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase font-black tracking-widest text-white/20 ml-1">Track Title</label>
                  <input 
                    value={track.title} 
                    onChange={(e) => {
                      const newTracks = [...localData.tracks];
                      newTracks[idx].title = e.target.value;
                      setLocalData({ ...localData, tracks: newTracks });
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase font-black tracking-widest text-white/20 ml-1">Description</label>
                  <textarea 
                    value={track.description} 
                    onChange={(e) => {
                      const newTracks = [...localData.tracks];
                      newTracks[idx].description = e.target.value;
                      setLocalData({ ...localData, tracks: newTracks });
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50 min-h-[80px]" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase font-black tracking-widest text-white/20 ml-1">Color Gradient</label>
                    <input 
                      value={track.color} 
                      onChange={(e) => {
                        const newTracks = [...localData.tracks];
                        newTracks[idx].color = e.target.value;
                        setLocalData({ ...localData, tracks: newTracks });
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-green-500/50" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase font-black tracking-widest text-white/20 ml-1">Border CSS</label>
                    <input 
                      value={track.borderColor} 
                      onChange={(e) => {
                        const newTracks = [...localData.tracks];
                        newTracks[idx].borderColor = e.target.value;
                        setLocalData({ ...localData, tracks: newTracks });
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-green-500/50" 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "phases" && (
        <div className="space-y-12">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Curriculum Phases</h3>
            <button onClick={addPhase} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-green-400 hover:border-green-500/30 transition-all text-[10px] font-black uppercase tracking-widest">
              <Plus className="w-3 h-3" /> Add Phase
            </button>
          </div>
          <div className="space-y-16">
            {localData.phases.map((phase, pIdx) => (
              <div key={pIdx} className="relative p-8 rounded-[2.5rem] bg-white/[0.01] border border-white/5 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <button 
                  onClick={() => removePhase(pIdx)}
                  className="absolute -top-3 -right-3 p-3 rounded-full bg-red-500 text-black shadow-xl"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase font-black tracking-widest text-white/20 ml-1">Phase Title</label>
                      <input 
                        value={phase.title} 
                        onChange={(e) => {
                          const newPhases = [...localData.phases];
                          newPhases[pIdx].title = e.target.value;
                          setLocalData({ ...localData, phases: newPhases });
                        }}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold focus:outline-none focus:border-green-500/50 focus:bg-white/10 transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase font-black tracking-widest text-white/20 ml-1">Subtitle</label>
                      <input 
                        value={phase.subtitle} 
                        onChange={(e) => {
                          const newPhases = [...localData.phases];
                          newPhases[pIdx].subtitle = e.target.value;
                          setLocalData({ ...localData, phases: newPhases });
                        }}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase font-black tracking-widest text-white/20 ml-1">Weeks Scope</label>
                      <input 
                        value={phase.weeks} 
                        onChange={(e) => {
                          const newPhases = [...localData.phases];
                          newPhases[pIdx].weeks = e.target.value;
                          setLocalData({ ...localData, phases: newPhases });
                        }}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase font-black tracking-widest text-white/20 ml-1">Icon</label>
                      <IconPicker value={phase.icon} onChange={(val) => {
                        const newPhases = [...localData.phases];
                        newPhases[pIdx].icon = val;
                        setLocalData({ ...localData, phases: newPhases });
                      }} />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase font-black tracking-widest text-white/20 ml-1">Phase Description</label>
                      <textarea 
                        value={phase.description} 
                        onChange={(e) => {
                          const newPhases = [...localData.phases];
                          newPhases[pIdx].description = e.target.value;
                          setLocalData({ ...localData, phases: newPhases });
                        }}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50 min-h-[100px]" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase font-black tracking-widest text-white/20 ml-1">Accent Color Gradient</label>
                      <input 
                        value={phase.color} 
                        onChange={(e) => {
                          const newPhases = [...localData.phases];
                          newPhases[pIdx].color = e.target.value;
                          setLocalData({ ...localData, phases: newPhases });
                        }}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-green-500/50" 
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">Modules Breakout</h4>
                    <button onClick={() => addPhaseItem(pIdx)} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-green-500/60 hover:text-green-400 transition-colors">
                      <Plus className="w-3 h-3" /> Append Module
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {phase.items.map((item, iIdx) => (
                      <div key={iIdx} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 space-y-4 group relative hover:border-white/10 transition-all">
                        <button 
                          onClick={() => removePhaseItem(pIdx, iIdx)}
                          className="absolute top-4 right-4 text-white/10 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-[8px] uppercase font-black tracking-tight text-white/20">Week</label>
                            <input 
                              value={item.week} 
                              onChange={(e) => {
                                const newPhases = [...localData.phases];
                                newPhases[pIdx].items[iIdx].week = e.target.value;
                                setLocalData({ ...localData, phases: newPhases });
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-green-500/40" 
                            />
                          </div>
                          <div className="col-span-2 space-y-1">
                            <label className="text-[8px] uppercase font-black tracking-tight text-white/20">Module Title</label>
                            <input 
                              value={item.title} 
                              onChange={(e) => {
                                const newPhases = [...localData.phases];
                                newPhases[pIdx].items[iIdx].title = e.target.value;
                                setLocalData({ ...localData, phases: newPhases });
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-green-500/40" 
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] uppercase font-black tracking-tight text-white/20">Deep Context</label>
                          <textarea 
                            value={item.description} 
                            onChange={(e) => {
                              const newPhases = [...localData.phases];
                              newPhases[pIdx].items[iIdx].description = e.target.value;
                              setLocalData({ ...localData, phases: newPhases });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-[11px] focus:outline-none focus:border-green-500/40 min-h-[60px]" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] uppercase font-black tracking-tight text-white/20">Target Deliverable</label>
                          <input 
                            value={item.highlight} 
                            onChange={(e) => {
                              const newPhases = [...localData.phases];
                              newPhases[pIdx].items[iIdx].highlight = e.target.value;
                              setLocalData({ ...localData, phases: newPhases });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-[11px] italic focus:outline-none focus:border-green-500/40" 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
