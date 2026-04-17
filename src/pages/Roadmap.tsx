import Header from "../components/Header";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { motion } from "framer-motion";
import { 
  Globe, Zap, Briefcase, Users, Layers, Target, Rocket, BookOpen, 
  Clock, CheckCircle2, Circle, Star, Award, Shield, Heart, Lightbulb, 
  Map, MousePointer2, Settings, Wrench, Terminal, Code, Cpu, Database, 
  Cloud, Activity, BarChart3, PieChart, TrendingUp, Presentation, 
  Image as ImageIcon, Link, Mail, Phone, MessageSquare, ArrowRight 
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchRoadmap } from "../lib/api";
import { Skeleton } from "../components/ui/Skeleton";

interface Track {
  id: string;
  title: string;
  icon?: string;
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
  icon?: string;
  color: string;
  items: PhaseItem[];
}

interface RoadmapData {
  tracks: Track[];
  phases: Phase[];
}

const iconMap: Record<string, React.ElementType> = {
  Globe, Zap, Briefcase, Users, Layers, Target, Rocket, BookOpen, 
  Clock, CheckCircle2, Circle, Star, Award, Shield, Heart, Lightbulb, 
  Map, MousePointer2, Settings, Wrench, Terminal, Code, Cpu, Database, 
  Cloud, Activity, BarChart3, PieChart, TrendingUp, Presentation, 
  Image: ImageIcon, Link, Mail, Phone, MessageSquare
};

function RoadmapSkeleton() {
// ...
  return (
    <div className="space-y-24">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-48 rounded-3xl" />
        ))}
      </div>
      <div className="space-y-32">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-16">
            <div className="flex flex-col items-center space-y-4">
              <Skeleton className="w-16 h-16 rounded-2xl" />
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-16 w-full max-w-xl" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-x-24">
              {[1, 2, 3, 4].map((j) => (
                <Skeleton key={j} className="h-64 rounded-3xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Roadmap() {
  const { data, isLoading, error } = useQuery<RoadmapData>({
    queryKey: ["roadmap"],
    queryFn: fetchRoadmap,
  });

  const renderIcon = (name?: string, className: string = "w-5 h-5") => {
    const IconComponent = (name && iconMap[name]) ? iconMap[name] : Globe;
    return <IconComponent className={className} />;
  };

  return (
    <div className="min-h-screen relative font-poppins bg-[#030303] text-white selection:bg-green-500/30 overflow-x-hidden">
      <SEO 
        title="Roadmap | Sledge Mentorship"
        description="Comprehensive 10-week roadmap for the Sledge Mentorship Program - from foundations to integration."
        keywords="mentorship roadmap, career growth, professional development, 10-week program"
      />
      <Header />

      {/* Cinematic Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-500/10 blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '5s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(20,20,20,0)_0%,rgba(3,3,3,1)_80%)]"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32">
        <header className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-green-400 uppercase bg-green-400/10 border border-green-400/20 rounded-full">
              The Journey
            </span>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40">
              LEARNING <br className="hidden md:block" /> <span className="text-white">ARCHITECTURE</span>
            </h1>
            <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
              A meticulously designed 10-week professional transformation journey. 
              From foundational mental models to global industry specialization.
            </p>
          </motion.div>
        </header>

        {isLoading ? (
          <RoadmapSkeleton />
        ) : error ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Failed to load roadmap</h2>
            <p className="text-white/50">Please try again later or check your connection.</p>
          </div>
        ) : (
          <>
            {/* Tracks Section */}
            <section className="mb-32">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-center mb-10"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent to-green-500/50"></div>
                  <span className="text-[10px] font-bold tracking-[0.3em] text-green-400 uppercase">Specialized Pathways</span>
                  <div className="w-12 h-px bg-gradient-to-l from-transparent to-green-500/50"></div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {data?.tracks.map((track, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -5 }}
                    className={`p-6 rounded-3xl border ${track.borderColor} bg-gradient-to-br ${track.color} backdrop-blur-xl relative overflow-hidden group transition-all duration-300`}
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                      {renderIcon(track.icon)}
                    </div>
                    <div className="relative z-10">
                      <span className="text-xs font-mono text-white/40 mb-2 block">{track.id}</span>
                      <h3 className="text-lg font-bold mb-2 group-hover:text-white transition-colors">{track.title}</h3>
                      <p className="text-xs text-white/50 leading-relaxed">{track.description}</p>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">
                      <span>SPECIALIZED TRACK</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </section>

            <div className="relative">
              {/* Central Timeline Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-white/20 via-white/5 to-transparent hidden lg:block -translate-x-1/2"></div>
              
              <div className="space-y-32">
                {data?.phases.map((phase, phaseIndex) => (
                  <section key={phaseIndex} className="relative">
                    {/* Phase Header */}
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                      className="flex flex-col items-center mb-16 relative z-20"
                    >
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${phase.color} flex items-center justify-center mb-6 shadow-lg shadow-black/50 rotate-3`}>
                        <div className="-rotate-3 text-white">
                          {renderIcon(phase.icon, "w-6 h-6")}
                        </div>
                      </div>
                      <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-center">{phase.title}</h2>
                      <div className="flex items-center gap-3 text-white/50 mb-4 font-mono">
                        <Clock className="w-4 h-4" />
                        <span>{phase.weeks}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                        <span>{phase.subtitle}</span>
                      </div>
                      <p className="text-white/40 text-center max-w-xl">{phase.description}</p>
                    </motion.div>

                    {/* Weeks Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-x-24 relative">
                      {phase.items.map((item, itemIndex) => (
                        <motion.div
                          key={itemIndex}
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{ duration: 0.7, delay: itemIndex * 0.1 }}
                          className={`relative group ${
                            itemIndex % 2 !== 0 ? 'lg:mt-12' : ''
                          }`}
                        >
                          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                              <span className="text-4xl font-black text-white/10 group-hover:text-green-500/20 transition-colors duration-500 uppercase italic">
                                {item.week}
                              </span>
                              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-black/40 text-white/30 group-hover:text-green-400 group-hover:border-green-500/30 transition-all duration-500">
                                 <Zap className="w-4 h-4 translate-y-[1px]" />
                              </div>
                            </div>
                            
                            <h3 className="text-xl font-bold mb-4 leading-snug group-hover:text-green-400 transition-colors duration-500">
                              {item.title}
                            </h3>
                            
                            <p className="text-white/50 text-sm leading-relaxed mb-8 flex-grow">
                              {item.description}
                            </p>
                            
                            <div className="pt-6 border-t border-white/5 flex items-center gap-3">
                              <div className="px-3 py-1 bg-green-500/10 rounded-md text-[10px] font-bold tracking-widest text-green-400 uppercase border border-green-500/20">
                                DELIVERABLE
                              </div>
                              <span className="text-xs font-semibold text-white/70 italic">
                                {item.highlight}
                              </span>
                            </div>
                          </div>

                          {/* Timeline Dot (Desktop) */}
                          <div className={`absolute top-1/2 w-4 h-4 rounded-full bg-white/20 border-4 border-[#030303] hidden lg:block z-30 transition-all duration-500 group-hover:bg-green-500 group-hover:scale-125 ${
                            itemIndex % 2 === 0 ? '-right-[58px] -translate-y-1/2' : '-left-[58px] -translate-y-1/2'
                          }`}></div>
                        </motion.div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Cinematic Stats */}
        {!isLoading && !error && (
          <section className="mt-48 grid grid-cols-2 md:grid-cols-4 gap-8">
             {[
               { label: "WEEKS", value: "10" },
               { label: "TRACKS", value: "04" },
               { label: "PROJECTS", value: "01" },
               { label: "MENTORS", value: "10+" }
             ].map((stat, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.1 }}
                 className="text-center"
               >
                 <div className="text-5xl md:text-7xl font-black text-white mb-2">{stat.value}</div>
                 <div className="text-xs font-bold tracking-[0.2em] text-white/30">{stat.label}</div>
               </motion.div>
             ))}
          </section>
        )}

        {/* Final CTA */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-48 text-center"
        >
          <div className="relative p-12 md:p-24 rounded-[3rem] overflow-hidden">
            {/* Background for CTA */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-transparent"></div>
            <div className="absolute inset-0 border border-white/10 backdrop-blur-3xl rounded-[3rem]"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-6xl font-black mb-10 tracking-tighter">
                READY TO ARCHITECT <br /> YOUR FUTURE?
              </h2>
              <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                <a 
                  href="/program" 
                  className="group relative px-10 py-5 bg-white text-black font-black text-sm uppercase tracking-widest rounded-full overflow-hidden transition-all hover:pr-14"
                >
                  <span className="relative z-10">Initialize Program</span>
                  <Rocket className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0" />
                </a>
                <a 
                  href="/contact" 
                  className="px-10 py-5 bg-black/40 border border-white/10 text-white font-black text-sm uppercase tracking-widest rounded-full hover:bg-white/5 transition-all"
                >
                  Inquiry Protocol
                </a>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 10s ease-in-out infinite;
        }
      `}} />
    </div>
  );
}


