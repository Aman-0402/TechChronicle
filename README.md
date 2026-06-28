# ⌬ TechChronicle

> Every day in technology, preserved forever.

A premium, framework-free technology publication built with vanilla HTML5, CSS3, and JavaScript. No React. No Vue. No Tailwind. Just the web platform.

---

## Live Pages

| Page | Description |
|------|-------------|
| `index.html` | Landing page — hero, features, stats |
| `today.html` | Today's Edition — 20 articles with full-screen reader |
| `timeline.html` | Timeline + interactive calendar side-by-side |
| `topics.html` | Category browser with inline article grid |
| `search.html` | Instant search with keyword highlighting |

---

## Tech Stack

- **HTML5** — semantic markup, ARIA roles, accessibility attributes
- **CSS3** — custom properties (design token system), Grid, Flexbox, animations
- **Vanilla JavaScript** — ES6 modules, IntersectionObserver, Canvas API
- **Zero dependencies** — no npm, no build step, no framework

---

## Features

- Dark / light mode with CSS custom property token system
- Animated particle field hero section (Canvas API + mouse repulsion)
- Full-screen article reader with keyboard navigation (← → Esc)
- Instant search with `<mark>` keyword highlighting
- URL param pre-fill: `search.html?q=nvidia` or `?category=AI`
- Scroll-reveal animations via IntersectionObserver
- Animated stat counters (easeOutExpo timing)
- Responsive nav with hamburger menu
- Per-page active nav link (no JS required)

---

## Project Structure

```
TechChronicle/
├── index.html          # Landing page
├── today.html          # Daily edition + reader overlay
├── timeline.html       # Timeline + calendar
├── topics.html         # Category browser
├── search.html         # Instant search
├── css/
│   ├── variables.css   # Design token system (light + dark)
│   ├── reset.css       # CSS reset
│   ├── typography.css  # Type scale
│   ├── layout.css      # Container, grid utilities
│   ├── components.css  # Buttons, cards, nav, tags
│   ├── hero.css        # Hero section + canvas
│   ├── stats.css       # Stats grid + counters
│   ├── search.css      # Search widget + results
│   ├── reader.css      # Full-screen reader overlay
│   ├── footer.css      # Footer
│   ├── animations.css  # Scroll-reveal, transitions
│   ├── pages.css       # Page-specific (header, timeline, topics)
│   └── dark-mode.css   # Dark mode overrides
├── js/
│   ├── data.js         # TC.articles, TC.categories, TC.stats, TC.timelineData
│   ├── theme.js        # Dark/light toggle + localStorage persistence
│   ├── canvas.js       # Particle field (hero canvas)
│   ├── hero.js         # Hero stat counters
│   ├── nav.js          # Hamburger menu, scroll-hide nav
│   ├── animations.js   # IntersectionObserver scroll-reveal
│   ├── stats.js        # Stats grid renderer
│   ├── edition.js      # Today's Edition article grid
│   ├── reader.js       # Full-screen article reader
│   ├── timeline.js     # Timeline bar chart renderer
│   ├── calendar.js     # Interactive calendar
│   ├── categories.js   # Category grid + cross-page navigation
│   ├── search.js       # Instant search + browse grid
│   └── app.js          # Bootstrap / page init
└── Tech.md             # Append-only technology knowledge base (50 articles)
```

---

## Knowledge Base — Tech.md

`Tech.md` is an append-only technology knowledge base with 50 real articles covering:

- Artificial Intelligence & Language Models
- Quantum Computing
- Robotics & Autonomous Systems
- Cybersecurity
- Semiconductors & Hardware
- Cloud Computing & Infrastructure
- Policy & Regulation
- Open Source

Each article includes: Title, Date, Company, Category, Summary, Key Takeaways, Why It Matters, Source URL.

Every article was committed individually with its own git commit.

---

## Running Locally

No build step required. Open any HTML file directly in a browser:

```bash
# Option 1 — open directly
open index.html

# Option 2 — local server (avoids CORS on some browsers)
npx serve .
# or
python -m http.server 8080
```

---

## Design System

CSS custom properties defined in `css/variables.css`:

```css
/* Spacing, radius, typography, z-index, transitions */
/* Light tokens on :root */
/* Dark tokens on [data-theme="dark"] */
```

Toggle dark mode via the `◑` button in the nav. Preference persists in `localStorage`.

---

## Article Reader

Open from any article card. Controls:

| Input | Action |
|-------|--------|
| `→` / `↓` | Next article |
| `←` / `↑` | Previous article |
| `Esc` | Close reader |
| Click dot | Jump to article |

---

## Stats

- 50 articles in `Tech.md` knowledge base
- 20 articles in live site (`data.js`)
- 9 technology categories
- 5 pages
- 0 npm dependencies
- 0 framework dependencies

---

*Built with HTML, CSS, and JavaScript. Nothing else.*
