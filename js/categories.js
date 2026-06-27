/* ============================================================
   Categories Grid
   ============================================================ */

(function () {
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
      // Filter search to this category
      const searchInput = document.getElementById('searchInput');
      const filterBtn = document.querySelector(`.search__filter[data-filter="${id}"]`);
      if (searchInput) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
      }
      if (filterBtn) {
        filterBtn.click();
      }
      document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' });
    }

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
  });
})();
