import React, { useEffect, useState } from 'react';
import { Quote, Star, Users } from 'lucide-react';
import { API_BASE } from '../lib/api';

interface TestimonialData {
  id: number;
  name: string;
  role: string | null;
  content: string;
  image_url: string | null;
  rating: number;
}

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [visible, setVisible] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resContent, resTestimonials] = await Promise.all([
          fetch(`${API_BASE}/content.php`),
          fetch(`${API_BASE}/testimonials.php?activeOnly=true`)
        ]);
        
        const content = await resContent.json();
        const testimonialsData = await resTestimonials.json();

        const isVisible = content.show_testimonials === true || content.show_testimonials === 'true';
        setVisible(isVisible);
        
        if (isVisible) {
          setTestimonials(testimonialsData.items || []);
        }
      } catch (e) {
        console.error("Failed to fetch testimonials", e);
        setVisible(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || visible === false || testimonials.length === 0) return null;

  return (
    <section className="bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-6xl font-medium tracking-tight mb-6 leading-[1.1] text-grad max-w-4xl mx-auto">
          What Our Mentees Say.
        </h2>
        <p className="text-white/40 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed">
          Hear from the professionals who have transformed their careers through the Sledge Mentorship program.
        </p>
      </div>

      <div className="relative w-full">
        {/* Left Fading Effect */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-[#09090b] to-transparent z-10"></div>
        
        {/* Right Fading Effect */}
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-[#09090b] to-transparent z-10"></div>

        <div className="testimonial-marquee py-10">
          <style>{`
            .testimonial-marquee { overflow: hidden; }
            .testimonial-track {
              display: flex;
              gap: 1.5rem;
              width: max-content;
              animation: scroll 40s linear infinite;
            }
            .testimonial-track:hover { animation-play-state: paused; }

            @keyframes scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }

            @media (min-width: 768px) {
              .testimonial-track {
                gap: 2.5rem;
              }
            }
          `}</style>

          <div className="testimonial-track">
            {/* Double the items for seamless loop */}
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={`${t.id}-${i}`} className="flex-shrink-0 w-[260px] md:w-[420px] p-5 md:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-green-500/30 transition-all duration-300">
                <div className="flex items-center gap-3 md:gap-4 mb-4">
                  <div className="w-10 h-10 md:w-14 h-14 rounded-full overflow-hidden border-2 border-green-500/50">
                    {t.image_url ? (
                        <img src={t.image_url} alt={t.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/5">
                            <Users className="w-5 h-5 text-white/20" />
                        </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm md:text-lg">{t.name}</h4>
                    <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-wider">{t.role}</p>
                  </div>
                  <Quote className="ml-auto w-5 h-5 md:w-7 h-7 text-green-500/10" />
                </div>
                <p className="text-white/60 italic text-xs md:text-base leading-relaxed">
                  "{t.content}"
                </p>
                {t.rating > 0 && (
                    <div className="flex gap-0.5 mt-4">
                        {[...Array(5)].map((_, si) => (
                            <Star key={si} className={cx("w-3 h-3", si < t.rating ? "text-green-500 fill-green-500" : "text-white/5")} />
                        ))}
                    </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Simple utility for class joining if not available globally
function cx(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

export default Testimonials;

