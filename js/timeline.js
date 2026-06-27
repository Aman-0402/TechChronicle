/* ============================================================
   Timeline — Vertical year/month archive
   ============================================================ */

(function () {
  const MONTHS = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December',
  ];

  function maxCount(yearData) {
    return Math.max(...Object.values(yearData).map(m => m.count));
  }

  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('timelineWidget');
    if (!container || !TC.timelineData) return;

    const years = Object.keys(TC.timelineData).sort((a, b) => b - a);

    container.innerHTML = years.map(year => {
      const yearData = TC.timelineData[year];
      const max = maxCount(yearData);

      const monthsHTML = Object.entries(yearData).map(([month, data]) => {
        const pct = Math.round((data.count / max) * 100);
        return `
          <div class="timeline__month" data-year="${year}" data-month="${month}" role="listitem" tabindex="0">
            <span class="timeline__month-name">${month}</span>
            <div class="timeline__month-bar">
              <div class="timeline__month-bar-fill" style="width: ${pct}%"></div>
            </div>
            <span class="timeline__month-count">${data.count} articles</span>
            <span class="timeline__month-arrow" aria-hidden="true">→</span>
          </div>
        `;
      }).join('');

      return `
        <div class="timeline__year" role="listitem">
          <div class="timeline__year-header">
            <div class="timeline__year-badge">${year}</div>
            <div class="timeline__year-text">${year}</div>
          </div>
          <div class="timeline__months">${monthsHTML}</div>
        </div>
      `;
    }).join('');

    // Interaction
    container.addEventListener('click', (e) => {
      const item = e.target.closest('.timeline__month');
      if (!item) return;
      container.querySelectorAll('.timeline__month').forEach(m => m.classList.remove('active'));
      item.classList.add('active');

      const month = item.dataset.month;
      const year = item.dataset.year;
      // Filter articles to this month (for future enhancement) — for now scroll to edition
      document.getElementById('edition')?.scrollIntoView({ behavior: 'smooth' });
    });

    container.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.target.click();
      }
    });
  });
})();
