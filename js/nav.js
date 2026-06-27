/* ============================================================
   Navigation — Scroll behavior, active link, hamburger
   ============================================================ */

(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementById('nav');
    const hamburger = document.getElementById('navHamburger');
    const links = document.querySelectorAll('.nav__link');

    // Scroll: add shadow + highlight active section
    const sections = Array.from(document.querySelectorAll('section[id]'));

    function onScroll() {
      if (!nav) return;
      nav.classList.toggle('scrolled', window.scrollY > 20);

      // Active link based on scroll position
      let current = '';
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100) current = section.id;
      }
      links.forEach(link => {
        const href = link.getAttribute('href')?.replace('#', '');
        link.classList.toggle('active', href === current);
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Hamburger
    if (hamburger && nav) {
      hamburger.addEventListener('click', () => {
        const open = !nav.classList.contains('mobile-open');
        nav.classList.toggle('mobile-open', open);
        hamburger.classList.toggle('open', open);
        hamburger.setAttribute('aria-expanded', open);
      });
    }

    // Close mobile menu on nav link click
    links.forEach(link => {
      link.addEventListener('click', () => {
        nav?.classList.remove('mobile-open');
        hamburger?.classList.remove('open');
        hamburger?.setAttribute('aria-expanded', 'false');
      });
    });

    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
      if (nav && nav.classList.contains('mobile-open') && !nav.contains(e.target)) {
        nav.classList.remove('mobile-open');
        hamburger?.classList.remove('open');
        hamburger?.setAttribute('aria-expanded', 'false');
      }
    });
  });
})();
