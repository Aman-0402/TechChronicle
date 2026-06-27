/* ============================================================
   Theme — Dark / Light toggle with localStorage persistence
   ============================================================ */

(function () {
  const STORAGE_KEY = 'tc-theme';
  const root = document.documentElement;

  function getPreferred() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  // Apply before paint to avoid FOUC
  apply(getPreferred());

  window.TC = window.TC || {};
  TC.theme = {
    toggle() {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      apply(next);
    },
    get current() { return root.getAttribute('data-theme'); },
  };

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('themeToggle');
    if (btn) btn.addEventListener('click', TC.theme.toggle);
  });

  // Sync across tabs
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && e.newValue) apply(e.newValue);
  });
})();
