/* ============================================================
   Hero — Counter animation, CTA handlers
   ============================================================ */

(function () {
  function animateCounter(el, target, duration = 1600) {
    let start = null;
    const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const value = Math.floor(easeOutQuart(progress) * target);
      el.textContent = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(step);
  }

  function initHeroCounters() {
    const els = document.querySelectorAll('[data-count]');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.count, 10);
          animateCounter(entry.target, target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    els.forEach(el => observer.observe(el));
  }

  document.addEventListener('DOMContentLoaded', () => {
    initHeroCounters();

    function scrollToSection(id) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }

    document.getElementById('readTodayHero')
      ?.addEventListener('click', () => scrollToSection('edition'));
    document.getElementById('readTodayNav')
      ?.addEventListener('click', () => scrollToSection('edition'));
    document.getElementById('browseTimeline')
      ?.addEventListener('click', () => scrollToSection('timeline'));
  });
})();
