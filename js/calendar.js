/* ============================================================
   Calendar Widget
   ============================================================ */

(function () {
  let viewYear, viewMonth;

  const MONTHS = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December',
  ];
  const WEEKDAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  function activeDatesForMonth(year, month) {
    // Use TC.activeDates for current month, random pattern otherwise
    const now = new Date();
    if (year === now.getFullYear() && month === now.getMonth()) {
      return new Set(TC.activeDates || []);
    }
    // Generate deterministic pseudo-random set for other months
    const seed = year * 100 + month;
    const set = new Set();
    for (let d = 1; d <= 28; d++) {
      if ((seed * d + d * 7) % 5 !== 0) set.add(d);
    }
    return set;
  }

  function render(container) {
    const now = new Date();
    const today = now.getDate();
    const thisYear = now.getFullYear();
    const thisMonth = now.getMonth();
    const active = activeDatesForMonth(viewYear, viewMonth);

    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const isCurrentMonth = viewYear === thisYear && viewMonth === thisMonth;

    let html = `
      <div class="calendar__header">
        <button class="calendar__nav-btn" id="calPrev" aria-label="Previous month">‹</button>
        <div class="calendar__month-year">${MONTHS[viewMonth]} ${viewYear}</div>
        <button class="calendar__nav-btn" id="calNext" aria-label="Next month">›</button>
      </div>
      <div class="calendar__grid">
        ${WEEKDAYS.map(d => `<div class="calendar__weekday">${d}</div>`).join('')}
    `;

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
      html += `<button class="calendar__day empty" tabindex="-1" aria-hidden="true"></button>`;
    }

    // Day cells
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = isCurrentMonth && d === today;
      const hasArticles = active.has(d);
      const classes = [
        'calendar__day',
        isToday ? 'today' : '',
        hasArticles ? 'has-articles' : '',
      ].filter(Boolean).join(' ');

      html += `
        <button
          class="${classes}"
          data-day="${d}"
          aria-label="${MONTHS[viewMonth]} ${d}${hasArticles ? ', has articles' : ''}"
          ${isToday ? 'aria-current="date"' : ''}
        >${d}</button>
      `;
    }

    html += `</div>`;
    html += `
      <div class="calendar__legend">
        <div class="calendar__legend-item">
          <div class="calendar__legend-dot"></div>
          <span>Has articles</span>
        </div>
        <div class="calendar__legend-item">
          <div class="calendar__legend-today"></div>
          <span>Today</span>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Wire navigation
    container.querySelector('#calPrev')?.addEventListener('click', () => {
      viewMonth--;
      if (viewMonth < 0) { viewMonth = 11; viewYear--; }
      render(container);
    });
    container.querySelector('#calNext')?.addEventListener('click', () => {
      viewMonth++;
      if (viewMonth > 11) { viewMonth = 0; viewYear++; }
      render(container);
    });

    // Wire day clicks
    container.querySelectorAll('.calendar__day:not(.empty)').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.calendar__day').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        const day = parseInt(btn.dataset.day, 10);
        const hasArticles = active.has(day);
        if (hasArticles) {
          // Open first article on dates with articles
          TC.reader?.open(0);
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const now = new Date();
    viewYear  = now.getFullYear();
    viewMonth = now.getMonth();

    const container = document.getElementById('calendarWidget');
    if (container) render(container);
  });
})();
