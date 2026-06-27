/* ============================================================
   Today's Edition — Date display + article preview grid
   ============================================================ */

(function () {
  document.addEventListener('DOMContentLoaded', () => {
    // Display today's date
    const dateEl = document.getElementById('editionDate');
    if (dateEl) {
      const now = new Date();
      dateEl.textContent = now.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      });
    }

    // Build article preview grid
    const grid = document.getElementById('articlePreviewGrid');
    if (!grid || !TC.articles) return;

    grid.innerHTML = TC.articles.map((a, i) => `
      <article class="article-card" data-id="${a.id}" tabindex="0" role="button" aria-label="Read: ${a.title}">
        <div class="article-card__category">${a.category}</div>
        <h3 class="article-card__title">${a.title}</h3>
        <p class="article-card__excerpt">${a.excerpt}</p>
        <div class="article-card__footer">
          <span class="article-card__time">${a.readTime} min read</span>
          <span class="article-card__num">${String(i + 1).padStart(2, '0')}</span>
        </div>
      </article>
    `).join('');

    // Click opens reader
    grid.addEventListener('click', (e) => {
      const card = e.target.closest('.article-card');
      if (!card) return;
      const id = parseInt(card.dataset.id, 10);
      const idx = TC.articles.findIndex(a => a.id === id);
      if (idx >= 0 && TC.reader) TC.reader.open(idx);
    });
    grid.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') e.target.click();
    });

    // Start reading button
    document.getElementById('startReadingBtn')
      ?.addEventListener('click', () => TC.reader?.open(0));
  });
})();
