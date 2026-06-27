/* ============================================================
   App — Entry point, global init
   ============================================================ */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // Add padding-top to body for fixed nav
    document.body.style.paddingTop = '0';

    // Lazy load images (placeholder approach)
    const lazyImages = document.querySelectorAll('img[data-src]');
    if (lazyImages.length) {
      const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imgObserver.unobserve(img);
          }
        });
      });
      lazyImages.forEach(img => imgObserver.observe(img));
    }

    // Smooth anchor scrolling with nav offset
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href').slice(1);
        if (!id) return;
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) || 64;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });

    // Log initialization
    console.log('%cTechChronicle', 'font-size:24px;font-family:Georgia,serif;color:#0A84FF;font-weight:bold;');
    console.log('%cEvery day in technology, preserved forever.', 'color:#6E6E73;font-size:13px;');
    console.log(`%c${TC.articles?.length || 0} articles loaded`, 'color:#30D158;font-size:11px;font-family:monospace;');
  });
})();
