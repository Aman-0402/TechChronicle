/* ============================================================
   Scroll Reveal — IntersectionObserver for .reveal elements
   ============================================================ */

(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger sibling reveals
          const siblings = Array.from(
            (entry.target.parentElement || document).querySelectorAll('.reveal:not(.visible)')
          ).filter(el => {
            const r = el.getBoundingClientRect();
            return r.top >= 0 && r.top < window.innerHeight;
          });

          const idx = siblings.indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, Math.max(0, idx * 60));

          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  });
})();
