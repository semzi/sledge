import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

type Props = {
  threshold?: number; // px scrolled before button appears
};

export default function ScrollToTopButton({ threshold = 200 }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  const handleClick = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      onClick={handleClick}
      aria-label="Scroll to top"
      className={`fixed right-6 bottom-6 z-50 w-12 h-12 rounded-full bg-white/90 text-black shadow-lg flex items-center justify-center transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-gradient ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 pointer-events-none"
      }`}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}