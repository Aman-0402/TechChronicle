/* ============================================================
   Categories Grid — works on both topics.html and as a widget
   ============================================================ */

(function () {
  const isTopicsPage = !!document.getElementById('topicArticles');

  document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('categoriesGrid');
    if (!grid || !TC.categories) return;

    grid.innerHTML = TC.categories.map(cat => `
      <div
        class="category-card"
        style="--category-color: ${cat.color}"
        data-category="${cat.id}"
        role="listitem"
        tabindex="0"
        aria-label="${cat.label}: ${cat.count.toLocaleString()} articles"
      >
        <div class="category-card__icon" style="background: ${cat.color}22; color: ${cat.color}">
          ${cat.icon}
        </div>
        <div class="category-card__name">${cat.label}</div>
        <div class="category-card__count">${cat.count.toLocaleString()} articles</div>
        <span class="category-card__arrow" aria-hidden="true">→</span>
      </div>
    `).join('');

    function openCategory(id) {
      if (isTopicsPage) {
        showTopicArticles(id);
      } else {
        // On other pages, navigate to search page filtered by category
        window.location.href = `search.html?category=${encodeURIComponent(id)}`;
      }
    }

    function showTopicArticles(categoryId) {
      const cat = TC.categories.find(c => c.id === categoryId);
      if (!cat) return;

      const section = document.getElementById('topicArticles');
      const titleEl = document.getElementById('topicTitle');
      const articleGrid = document.getElementById('topicArticleGrid');
      if (!section || !titleEl || !articleGrid) return;

      const filtered = TC.articles.filter(a => a.category === categoryId);

      titleEl.textContent = `${cat.icon} ${cat.label}`;
      articleGrid.innerHTML = filtered.length
        ? filtered.map((a, i) => `
          <article class="article-card" data-id="${a.id}" data-category="${a.category}" tabindex="0" role="button" aria-label="Read: ${a.title}">
            <div class="article-card__category">${a.category}</div>
            <h3 class="article-card__title">${a.title}</h3>
            <p class="article-card__excerpt">${a.excerpt}</p>
            <div class="article-card__footer">
              <span class="article-card__time">${a.readTime} min read</span>
              <span class="article-card__num">${String(i + 1).padStart(2, '0')}</span>
            </div>
          </article>
        `).join('')
        : `<p style="color:var(--text-tertiary);padding:var(--space-6)">No articles in this category yet.</p>`;

      section.hidden = false;
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Open reader on card click
      articleGrid.querySelectorAll('.article-card').forEach(card => {
        const handler = () => {
          const id = parseInt(card.dataset.id, 10);
          const idx = TC.articles.findIndex(a => a.id === id);
          if (idx >= 0 && TC.reader) TC.reader.open(idx);
        };
        card.addEventListener('click', handler);
        card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); } });
      });

      // Highlight active card
      grid.querySelectorAll('.category-card').forEach(c => {
        c.classList.toggle('active', c.dataset.category === categoryId);
      });
    }

    // Clear topic view
    document.getElementById('clearTopicBtn')?.addEventListener('click', () => {
      const section = document.getElementById('topicArticles');
      if (section) section.hidden = true;
      grid.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
      grid.scrollIntoView({ behavior: 'smooth' });
    });

    grid.addEventListener('click', (e) => {
      const card = e.target.closest('.category-card');
      if (card) openCategory(card.dataset.category);
    });

    grid.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.target.click();
      }
    });

    // Handle ?category= param on search page redirect
    const params = new URLSearchParams(window.location.search);
    const preset = params.get('category');
    if (preset && isTopicsPage) showTopicArticles(preset);
  });
})();
