import { Navigation, Settings, Users } from 'lucide-react';
import StaggerChildren from '../staggerChildren';
import { useContent } from '../contexts/ContentContext';

const About: React.FC = () => {
  const { content, loading } = useContent();

  if (loading || !content) return null;
  const { about } = content;
  
  const iconMap = [
    <Navigation className="w-6 h-6" />,
    <Settings className="w-6 h-6" />,
    <Users className="w-6 h-6" />
  ];

  return (
    <section id="about" className="relative z-10 mx-auto mt-12">
      <div className="flex flex-col gap-10 lg:gap-14 w-full">
        {/* Top: Heading */}
        <div className="text-gray-300 w-full max-w-4xl mx-auto px-6 md:px-12 text-center flex flex-col items-center">
          <div className="inline-block bg-white/10 text-white border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide uppercase mb-6 shadow-sm">
            {about.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium leading-[1.15] mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/60">
            {about.title}
          </h2>
          <p className="text-base text-white/70 leading-relaxed max-w-4xl text-center">
            {about.description}
          </p>
        </div>

        {/* Bottom: Stacking Flex on Mobile / Grid on Desktop */}
        <StaggerChildren className="flex flex-col lg:grid lg:grid-cols-3 pt-2 pb-8 px-6 md:px-10 gap-6 lg:gap-8 mx-auto">
          {about.features.map((feature: { title: string; description: string }, idx: number) => (
            <div 
              key={idx}
              className={`w-full flex flex-col items-start gap-5 fade-in group border border-white/10 p-8 rounded-3xl bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-green-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(34,197,94,0.2)] ${idx === 1 ? 'fade-in-delay-200' : idx === 2 ? 'fade-in-delay-400' : ''}`}
            >
              <div className="w-14 h-14 border border-white/20 rounded-2xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center text-white shadow-xl backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:bg-green-500/20 group-hover:border-green-500/50 group-hover:text-green-400 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                {iconMap[idx]}
              </div>
              <div>
                <h3 className="font-bold text-white text-xl mb-3 tracking-tight transition-colors duration-300 group-hover:text-green-300">
                  {feature.title}
                </h3>
                <p className="text-white/70 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
};

export default About;
