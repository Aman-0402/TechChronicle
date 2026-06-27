/* ============================================================
   Reader — Book-style article reading experience
   ============================================================ */

(function () {
  let currentIdx = 0;
  let articles = [];

  const CATEGORY_ICONS = {
    'AI': '🤖', 'Cybersecurity': '🔐', 'Cloud': '☁️', 'Programming': '💻',
    'Hardware': '🖥️', 'Research': '🔬', 'Startups': '🚀',
    'Open Source': '📦', 'Dev Tools': '🛠️',
  };

  const BG_PATTERNS = [
    'linear-gradient(135deg, #0A84FF22 0%, #BF5AF222 100%)',
    'linear-gradient(135deg, #FF375F22 0%, #FF9F0A22 100%)',
    'linear-gradient(135deg, #30D15822 0%, #64D2FF22 100%)',
    'linear-gradient(135deg, #BF5AF222 0%, #0A84FF22 100%)',
    'linear-gradient(135deg, #FF9F0A22 0%, #FF375F22 100%)',
  ];

  function buildDots() {
    const container = document.getElementById('readerDots');
    if (!container) return;
    container.innerHTML = articles.map((_, i) => `
      <button
        class="reader__dot ${i === currentIdx ? 'active' : ''}"
        data-idx="${i}"
        role="tab"
        aria-selected="${i === currentIdx}"
        aria-label="Go to article ${i + 1}"
        title="${articles[i]?.title || ''}"
      ></button>
    `).join('');

    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.reader__dot');
      if (btn) navigate(parseInt(btn.dataset.idx, 10));
    });
  }

  function updateDots() {
    document.querySelectorAll('.reader__dot').forEach((dot, i) => {
      const active = i === currentIdx;
      dot.classList.toggle('active', active);
      dot.setAttribute('aria-selected', active);
    });
  }

  function updateProgress() {
    const pct = articles.length > 1
      ? Math.round((currentIdx / (articles.length - 1)) * 100)
      : 100;
    const bar = document.getElementById('readerProgressBar');
    const prog = document.getElementById('readerProgress');
    if (bar) bar.style.width = pct + '%';
    if (prog) prog.setAttribute('aria-valuenow', pct);
  }

  function renderArticle(idx, direction = 'right') {
    const article = articles[idx];
    if (!article) return;

    const content = document.getElementById('readerContent');
    if (!content) return;

    const icon = CATEGORY_ICONS[article.category] || '📄';
    const bg = BG_PATTERNS[idx % BG_PATTERNS.length];
    const bodyHTML = article.body
      .map(p => p.startsWith('<blockquote>') ? p : `<p>${p}</p>`)
      .join('');

    content.innerHTML = `
      <div class="reader__article">
        <div class="article-hero-image" style="background: ${bg}; font-size: 4rem; justify-content: center;">
          ${icon}
        </div>
        <div class="article-category-pill">${icon} ${article.category}</div>
        <h1 class="article-title">${article.title}</h1>
        <div class="article-meta">
          <span>🏢 ${article.company}</span>
          <span>⏱ ${article.readTime} min read</span>
          <span>📅 ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
        <div class="article-body">${bodyHTML}</div>
        <div class="article-tags">
          ${article.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      </div>
    `;

    const articleEl = content.querySelector('.reader__article');
    if (articleEl) {
      articleEl.classList.add(direction === 'right' ? 'slide-right' : 'slide-left');
    }

    content.scrollTop = 0;

    // Update indicators
    const indicator = document.getElementById('pageIndicator');
    const timeEl = document.getElementById('readerTime');
    if (indicator) indicator.textContent = `Page ${idx + 1} of ${articles.length}`;
    if (timeEl) timeEl.textContent = `${article.readTime} min read`;

    updateDots();
    updateProgress();

    // Prev/next button states
    const prev = document.getElementById('prevArticle');
    const next = document.getElementById('nextArticle');
    if (prev) {
      prev.disabled = idx === 0;
      prev.style.opacity = idx === 0 ? '0.3' : '1';
    }
    if (next) {
      next.textContent = idx === articles.length - 1 ? 'Close' : 'Next ›';
      next.innerHTML = idx === articles.length - 1
        ? 'Close <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>'
        : 'Next <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>';
    }
  }

  function navigate(idx) {
    if (idx < 0 || idx >= articles.length) return;
    const direction = idx > currentIdx ? 'right' : 'left';
    currentIdx = idx;
    renderArticle(currentIdx, direction);
  }

  function open(idx = 0) {
    articles = TC.articles || [];
    if (!articles.length) return;

    currentIdx = Math.max(0, Math.min(idx, articles.length - 1));
    const readerEl = document.getElementById('reader');
    if (!readerEl) return;

    readerEl.hidden = false;
    document.body.style.overflow = 'hidden';
    buildDots();
    renderArticle(currentIdx);
  }

  function close() {
    const readerEl = document.getElementById('reader');
    if (!readerEl) return;
    readerEl.hidden = true;
    document.body.style.overflow = '';
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('closeReader')?.addEventListener('click', close);
    document.getElementById('prevArticle')?.addEventListener('click', () => navigate(currentIdx - 1));
    document.getElementById('nextArticle')?.addEventListener('click', () => {
      if (currentIdx >= (TC.articles?.length || 1) - 1) close();
      else navigate(currentIdx + 1);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      const reader = document.getElementById('reader');
      if (!reader || reader.hidden) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') navigate(currentIdx + 1);
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') navigate(currentIdx - 1);
      else if (e.key === 'Escape') close();
    });
  });

  window.TC = window.TC || {};
  TC.reader = { open, close, navigate };
})();
