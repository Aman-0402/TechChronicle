/* ============================================================
   Statistics — Animated counters
   ============================================================ */

(function () {
  function animateCounter(el, target, duration = 2000) {
    let start = null;
    const easeOutExpo = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const value = Math.floor(easeOutExpo(progress) * target);
      el.textContent = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(step);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('statsGrid');
    if (!grid || !TC.stats) return;

    grid.innerHTML = TC.stats.map(s => `
      <div class="stat-card" role="listitem">
        <span class="stat-card__icon" aria-hidden="true">${s.icon}</span>
        <span class="stat-card__value">
          <span class="stat-card__num" data-target="${s.value}">0</span><span class="stat-card__suffix">${s.suffix}</span>
        </span>
        <div class="stat-card__label">${s.label}</div>
        <div class="stat-card__desc">${s.desc}</div>
      </div>
    `).join('');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const numEl = entry.target.querySelector('.stat-card__num');
          if (numEl) {
            const target = parseInt(numEl.dataset.target, 10);
            animateCounter(numEl, target);
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    grid.querySelectorAll('.stat-card').forEach(card => observer.observe(card));
  });
})();
