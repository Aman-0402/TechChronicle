/* ============================================================
   Search — Instant filtering with highlight
   ============================================================ */

(function () {
  let activeFilter = 'all';
  let query = '';

  function highlight(text, q) {
    if (!q) return text;
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
  }

  function matches(article) {
    const inCategory = activeFilter === 'all' || article.category === activeFilter;
    if (!query) return inCategory;
    const q = query.toLowerCase();
    return inCategory && (
      article.title.toLowerCase().includes(q) ||
      article.excerpt.toLowerCase().includes(q) ||
      article.company.toLowerCase().includes(q) ||
      article.category.toLowerCase().includes(q) ||
      article.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  function openArticle(id) {
    const idx = TC.articles.findIndex(a => a.id === id);
    if (idx >= 0 && TC.reader) TC.reader.open(idx);
  }

  function render(results, container) {
    if (!results.length) {
      container.innerHTML = `
        <div class="search__empty">
          <div class="search__empty-icon">🔍</div>
          <div class="search__empty-title">No results found</div>
          <div class="search__empty-sub">Try different keywords or clear the filter</div>
        </div>
      `;
      return;
    }

    const countEl = `<div class="search__count">${results.length} result${results.length !== 1 ? 's' : ''}</div>`;
    const items = results.map((a, i) => `
      <div class="search__result-item" data-id="${a.id}" tabindex="0" role="button" aria-label="Read: ${a.title}">
        <div class="search__result-num">${String(i + 1).padStart(2, '0')}</div>
        <div class="search__result-body">
          <div class="search__result-category">${a.category}</div>
          <div class="search__result-title">${highlight(a.title, query)}</div>
          <div class="search__result-excerpt">${highlight(a.excerpt, query)}</div>
        </div>
      </div>
    `).join('');

    container.innerHTML = countEl + items;

    container.querySelectorAll('.search__result-item').forEach(item => {
      const handler = () => openArticle(parseInt(item.dataset.id, 10));
      item.addEventListener('click', handler);
      item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); } });
    });
  }

  function showEmpty(container) {
    container.innerHTML = `
      <div class="search__empty">
        <div class="search__empty-icon">✦</div>
        <div class="search__empty-title">Start searching</div>
        <div class="search__empty-sub">Enter a keyword, company, or technology above</div>
      </div>
    `;
  }

  function runSearch(container) {
    const results = (TC.articles || []).filter(matches);
    render(results, container);
  }

  function buildBrowseGrid() {
    const browseGrid = document.getElementById('browseGrid');
    if (!browseGrid || !TC.articles) return;

    browseGrid.innerHTML = TC.articles.map((a, i) => `
      <article class="article-card" data-id="${a.id}" data-category="${a.category}" tabindex="0" role="button" aria-label="Read: ${a.title}">
        <div class="article-card__category">${a.category}</div>
        <h3 class="article-card__title">${a.title}</h3>
        <p class="article-card__excerpt">${a.excerpt}</p>
        <div class="article-card__footer">
          <span class="article-card__time">${a.readTime} min read</span>
          <span class="article-card__num">${String(i + 1).padStart(2, '0')}</span>
        </div>
      </article>
    `).join('');

    browseGrid.addEventListener('click', e => {
      const card = e.target.closest('.article-card');
      if (card) openArticle(parseInt(card.dataset.id, 10));
    });
    browseGrid.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.target.click(); }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const input    = document.getElementById('searchInput');
    const clearBtn = document.getElementById('searchClear');
    const results  = document.getElementById('searchResults');
    const filters  = document.querySelectorAll('.search__filter');

    if (input && results) {
      showEmpty(results);

      // Pre-fill from URL param (e.g. ?q=openai or ?category=AI)
      const params = new URLSearchParams(window.location.search);
      const preQ   = params.get('q');
      const preCat = params.get('category');

      if (preCat) {
        const matchingFilter = document.querySelector(`.search__filter[data-filter="${preCat}"]`);
        if (matchingFilter) {
          filters.forEach(b => b.classList.remove('active'));
          matchingFilter.classList.add('active');
          activeFilter = preCat;
        }
      }
      if (preQ) {
        input.value = preQ;
        query = preQ;
        if (clearBtn) clearBtn.hidden = false;
      }
      if (preQ || preCat !== null) runSearch(results);

      input.addEventListener('input', () => {
        query = input.value.trim();
        if (clearBtn) clearBtn.hidden = !query;
        const browseEl = document.getElementById('searchBrowse');
        if (browseEl) browseEl.hidden = !!query || activeFilter !== 'all';
        if (!query && activeFilter === 'all') showEmpty(results);
        else runSearch(results);
      });

      clearBtn?.addEventListener('click', () => {
        input.value = '';
        query = '';
        clearBtn.hidden = true;
        const browseEl = document.getElementById('searchBrowse');
        if (browseEl) browseEl.hidden = false;
        if (activeFilter === 'all') showEmpty(results);
        else runSearch(results);
        input.focus();
      });

      filters.forEach(btn => {
        btn.addEventListener('click', () => {
          filters.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          activeFilter = btn.dataset.filter;
          const browseEl = document.getElementById('searchBrowse');
          if (browseEl) browseEl.hidden = !!query || activeFilter !== 'all';
          if (!query && activeFilter === 'all') showEmpty(results);
          else runSearch(results);
        });
      });
    }

    buildBrowseGrid();
  });
})();
