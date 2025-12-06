// Simple intersection observer to add `in-view` class to elements with `.reveal`
// Usage: add `reveal` to an element and optionally `data-delay="200"` (ms)
const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initInView() {
  if (typeof window === 'undefined' || prefersReducedMotion) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          const delay = el.getAttribute('data-delay');
          if (delay) el.style.transitionDelay = `${delay}ms`;
          el.classList.add('in-view');
          obs.unobserve(el);
        }
      });
    },
    {
      // lower threshold so elements animate when ~12% visible
      threshold: 0.12,
      // trigger a little earlier as the user scrolls
      rootMargin: '0px 0px -8% 0px'
    }
  );

  // Helper to observe an element (idempotent)
  const observeEl = (el: HTMLElement) => {
    if ((el as any).__inViewObserved) return;
    (el as any).__inViewObserved = true;
    el.style.willChange = 'transform, opacity';
    observer.observe(el);
  };

  // Observe existing elements
  document.querySelectorAll<HTMLElement>('.reveal').forEach(observeEl);

  // Watch for future elements added by React (or other libs)
  const mo = new MutationObserver(mutations => {
    for (const m of mutations) {
      if (m.type !== 'childList') continue;
      m.addedNodes.forEach(node => {
        if (!(node instanceof HTMLElement)) return;
        if (node.classList && node.classList.contains('reveal')) observeEl(node);
        // also check descendants
        node.querySelectorAll && node.querySelectorAll<HTMLElement>('.reveal').forEach(observeEl);
      });
    }
  });
  mo.observe(document.documentElement || document.body, { childList: true, subtree: true });
}

// initialize on DOMContentLoaded if document ready, otherwise now
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInView);
  } else {
    initInView();
  }
}

export default initInView;
