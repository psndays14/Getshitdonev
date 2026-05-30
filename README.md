# Handoff: ZAF BAT — Animated Website

## Overview
ZAF BAT is a French-language real-estate project-management (maîtrise d'ouvrage déléguée) website for a Moroccan construction firm targeting the diaspora. This package contains **12 high-fidelity animated page designs** built in HTML, together with all shared CSS and JS source files.

---

## About the Design Files
The files in this bundle are **design references created in HTML** — high-fidelity prototypes showing the intended look, layout, copy, and animation behaviour. They are **not** production code to be shipped directly. The task is to **recreate these designs in your target codebase** (Next.js, Astro, Vue, plain HTML, etc.) using its established patterns and libraries, preserving pixel fidelity to the designs and lifting the animation behaviour described in this document.

## Fidelity
**High-fidelity.** All colours, typography, spacing, copy, component states, and animations are final. Recreate as close to pixel-perfect as your stack permits.

---

## Architecture

### Shared files (apply to all pages)
| File | Purpose |
|---|---|
| `zafbat-animated.css` | Full design-system CSS — tokens, nav, hero, all section styles, animation initial states, responsive breakpoints |
| `zafbat-pages.css` | Inner-page CSS — page-hero grid, right-panel variants, diaspora map, gallery, team grid, compliance badges, contact hero |
| `zafbat-page.js` | Shared animation engine: page loader, scroll-progress bar, custom cursor, GSAP scroll-reveal system, FAQ toggle, mobile menu, `ZAF.nav()` / `ZAF.footer()` / `ZAF.loader()` HTML generators |

### CDN dependencies (must be loaded before `zafbat-page.js`)
```html
<!-- GSAP core + ScrollTrigger -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<!-- Lenis smooth scroll -->
<script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/bundled/lenis.min.js"></script>
```

### Google Fonts
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=Jost:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600&display=swap" rel="stylesheet">
```

---

## Design Tokens

### Colours
```css
--ivory:    #F7F5F0   /* page background */
--charcoal: #141414   /* primary text, dark sections */
--gold:     #D3A357   /* primary accent */
--gold-2:   #C6943F   /* gold hover state */
--green:    #06402B   /* secondary accent (anxiety cards, submit btn) */
--stone:    #7A7468   /* body text / secondary text */
--stone-lt: #9A9186   /* tertiary / muted text */
--border:   #E4DDD3   /* card/section borders */
--white:    #FFFFFF   /* card backgrounds */
```

### Logo gradients (SVG `<defs>`)
```
#zbA  — gold vertical: #f0d890 → #D3A357 → #9a7a48
#emTL — green TL:  #2E6A4F → #153C2A
#emTR — green TR:  #3E8A67 → #1D4C37
#emBL — green BL:  #0A1E12 → #1A3F28
#emBR — green BR:  #163D28 → #255237
```

### Typography
| Token | Family | Weights |
|---|---|---|
| `--font-serif` | Cormorant Garamond | 300, 400, 600, 700 (+ italic variants) |
| `--font-sans` | Jost | 300, 400, 500, 600 |
| `--font-num` | Space Grotesk | 400, 500, 600 |

### Spacing / Layout
```css
--r:   18px     /* base border-radius */
--max: 1240px   /* max content width */
/* container: width: min(1240px, calc(100% - 48px)); margin: auto */
```

### Shadows
```css
--shadow: 0 14px 32px rgba(20,20,20,.06)   /* card shadow */
```

---

## Pages

### 1. Homepage — `Animated ZAF BAT.html`
**Purpose:** Primary landing page. Establishes trust, explains the MOD service, shows current project and testimonials.

**Sections (top → bottom):**
| # | Section | Background | Key elements |
|---|---|---|---|
| 1 | Page loader | `--charcoal` | Brand name (Cormorant 52px 300 16px-spaced), tagline, gold progress bar animates 0→100% then slides up |
| 2 | Nav | `rgba(247,245,240,.93)` + blur | Logo, 6 links + CTA pill, hamburger on mobile |
| 3 | Hero | `--ivory` | 55/45 grid: left panel (white card), right panel (dark image); particle canvas overlay; counter animation on metrics |
| 4 | Oath | `--charcoal` | 5 oath lines, hatched pattern overlay |
| 5 | Founder letter | `--ivory` | 300px portrait placeholder + letter text, 2-col grid |
| 6 | MOD Comparison | `--white` | 3-col card grid; third card (`mod-zafbat`) has `--charcoal` background + gold bottom accent |
| 7 | Villa Californie | `--ivory` | 3 image tiles 4:5 ratio, zoom on hover |
| 8 | Diaspora testimonials | `--charcoal` | 3 cards with video thumbnails, italic serif quote |
| 9 | Methodology track | `--ivory` | Vertical timeline, GSAP ScrollTrigger progressively lights dots and reveals text |
| 10 | 5 Fears (anxiety) | `--white` | 3-col cards, green top-border accent |
| 11 | FAQ | `--ivory` | 2-col sticky sidebar + accordion, FAQ accordion uses max-height transition |
| 12 | Contact section | `--white` | 2-col: dark info card left, white form card right |
| 13 | Footer | `--charcoal` | 3-col flex row |
| 14 | WhatsApp FAB | Fixed bottom-right | 58px circle, green, pulse ring animation |
| 15 | Mobile bar | Fixed bottom | 3-button grid, only visible <640px |

**Hero left panel details:**
- Background: `rgba(255,255,255,0.82)`, border `1px solid #E4DDD3`, `border-radius: 20px`, `padding: 44px 40px`, `backdrop-filter: blur(6px)`
- Eyebrow: 10px / 500 / 2.5px spacing / uppercase / `--gold`; gold line `28px × 1px` before text
- `h1`: Cormorant Garamond 600, `clamp(38px, 4.4vw, 62px)`, `line-height: 1.08`; `em` italic 300 gold
- Body: 15px Jost, `--stone`, `line-height: 1.85`
- CTA row: gold pill button + outline pill button, `gap: 14px`
- Trust micro: 10px / 1.2px spacing / stone-lt; dot 4px circle `--green` before each item
- Metrics: 3-col grid `gap: 10px`; each card white, 1px border, `14px radius`; number Space Grotesk 30px 600; counter animates 0→N on load

**Hero right panel details:**
- `border-radius: 20px`, `min-height: 500px`, dark overlay `linear-gradient(135deg, rgba(14,11,9,.72) 0%, rgba(14,11,9,.38) 45%, rgba(14,11,9,.82) 100%)`
- Background image: `assets/site/californie/01-cover-pool-firepit.jpg`, `object-fit: cover`, parallax Ken-Burns effect via GSAP on scroll
- Team panel + cities panel overlay on top half
- Bottom strip: privacy disclaimer + gold CTA link

**Particles canvas:** `#particles-canvas` — implement as a subtle floating gold-dot particle system (50–80 particles, low opacity, slow drift).

**Methodology timeline animation:**
- Vertical line on left side; gold fill (`#method-line`) animates height 0→100% as user scrolls, driven by `ScrollTrigger` scrub
- Each `.method-step.lit` class activates when the fill reaches the dot; dot changes from `rgba(211,163,87,.3)` border / ivory fill → solid gold fill with `box-shadow: 0 0 0 6px rgba(211,163,87,.12)`
- Step text (`method-name`, `method-desc`, etc.) starts `opacity: 0; transform: translateX(-12px)` and transitions to visible when `.lit` is added

---

### 2. Diaspora — `Animated Diaspora.html`
**Purpose:** Reassures diaspora clients that remote management is fully handled.

**Hero right panel:** Animated "connection map" panel (`.diaspora-map-panel`):
- 5 city rows (Paris, Bruxelles, Montréal, Dubaï, Londres → Casablanca)
- On page load, each `.dmp-line` animates `width: 0 → 100%` with staggered delay (~0.3s per row) over 0.9s ease
- Each `.dmp-dot` gains `.pulse` class after its line completes → `box-shadow` keyframe animation `cityPulse`
- Footer italic note in Cormorant Garamond

**Sections below hero:** Service guarantee cards, how diaspora remote workflow works.

---

### 3. Conformité — `Animated Compliance.html`
**Purpose:** Transparency page showing 7 verifiable compliance documents.

**Hero right panel:** `.doc-badge-stack` — 7 stacked rows, each with:
- Gold tag badge (`CNOA`, `DATRP`, etc.) — 9px / 700 / 1px spacing / gold-tinted background
- Document name (12px ivory 500) + issuer (10px stone 35% opacity)
- Validity label (10px gold 65%)
- Hover: border lightens to `rgba(211,163,87,.28)`

**Animation:** Badges animate in via GSAP `fromTo` with stagger (0.08s) from `y: 20, opacity: 0` after loader completes.

---

### 4. Équipe — `Animated Equipe.html`
**Purpose:** Introduces the four-person core team.

**Hero right panel:** 2×2 grid of `.tg-card` (team cards):
| Card | Role | Person |
|---|---|---|
| 01 | Directeur Général | Ahmed Yassine Fliyou — Finance, FNBTP CGEM |
| 02 | Directeur de Projet | Achraf Zaddoug — Ingénieur civil, Structure, RPS 2000 |
| 03 | Architecte partenaire | Inscrit CNOA, APS/APD/Permis |
| 04 | Conducteur de travaux | Résident quotidien, photos hebdo |

**Animation:** Cards animate in from 4 corners — `tc0` from top-left, `tc1` from top-right, `tc2` from bottom-left, `tc3` from bottom-right — `fromTo` with `x: ±40, y: ±40, opacity: 0` → origin, duration 0.7s, stagger 0.12s.

---

### 5. Réalisations — `Animated Realisations.html`
**Purpose:** Portfolio of 11 completed villas.

**Gallery hero** (dark, full-height):
- Eyebrow centred, `h1` centred: `clamp(36px, 5.5vw, 72px)`
- 4-column image strip: each image starts `clip-path: inset(0 100% 0 0)` and animates to `inset(0 0% 0 0)` with stagger on load
- Stats bar below strip: 4 stats (11 villas / 4 villes / 0 dépassement / 48 mois max) — Space Grotesk 38px 600 gold, counter animation

**Sections below:** Villa Californie detail (3 image tiles), real site photos from portfolio.

---

### 6. Contact — `Animated Contact.html`
**Page-level override:** `body { background: var(--charcoal) }` — entire page is dark.

**Contact hero** (`.contact-hero-wrap`, 64vh min-height):
- Background: `radial-gradient` + horizontal rule pattern (`repeating-linear-gradient`)
- Giant italic number: Cormorant Garamond 300 italic, `clamp(80px, 16vw, 200px)`, gold
- "48h" text — animate via GSAP `fromTo` with `scale: 0.7, opacity: 0` on load
- Sub-label: 13px / 2.5px spacing / uppercase / white 38% opacity
- Two CTAs centred below

**Contact grid (below hero):** 2-col, `gap: 24px`
- **Left:** Dark info card (`--charcoal` bg) with gradient overlay, contact details list (WhatsApp, response time, zones, hours, confidentiality)
- **Right:** White form card — form fields for Prénom/Nom, Email, Téléphone, Ville, Budget, and Motif textarea; submit button dark green (`--green`), WhatsApp CTA button `#25D366`

---

### 7–12. Methodology Pages — `methodologie/Animated *.html`

Six phase pages sharing the same template. Each page uses a 2-col page-hero with:

**Left panel:**
- Breadcrumb → Accueil / Méthodologie / Phase name
- Phase eyebrow (e.g. "Phase 01 · 3 semaines")
- `h1` with italic gold keyword
- Lead text
- Two CTA buttons (start phase / next phase)
- Phase nav strip: 6 scrollable chips (`.phase-chip`), active chip `--charcoal` bg

**Right panel (`page-hero-right`):**
- Giant italic phase number (Cormorant 90px 300 italic, gold 80% opacity)
- Phase name (30px 600 ivory)
- Phase meta (11px / 2px spacing / gold 55% opacity)

**Animation (right panel):** On load, check icons (`.check-icon`) animate sequentially — each starts invisible and scales/fades in with 0.4s stagger. The `.ph-num` also counter-animates 0→N.

| File | Phase | Duration | Key check items |
|---|---|---|---|
| `Animated Diagnostic.html` | 01 · Diagnostic | 3 semaines | Titres fonciers, PLU, Premier notaire, Budget consolidé, Rapport |
| `Animated Conception.html` | 02 · Conception | 8–14 semaines | Cahier des charges, Architecte CNOA, Esquisses→APD, Permis |
| `Animated Contractualisation.html` | 03 · Contractualisation | 4 semaines | Appel d'offres, Marchés notariés, Séquestre, Avenants |
| `Animated Execution.html` | 04 · Exécution | 12–20 mois | Chantier quotidien, PV hebdo signé, Visioconférence, Gantt |
| `Animated Reception.html` | 05 · Réception | 4 semaines | PV provisoire, Levée des réserves, Permis d'habiter |
| `Animated Garantie.html` | 06 · Garantie | 10 ans | Décennale Loi 59-13, Suivi annuel, Intervention 72h |

---

## Interactions & Behaviour

### Page loader (every page)
1. Page starts with `#loader` fixed full-screen, `--charcoal` background, `z-index: 9999`
2. Brand name fades in (`y: 20 → 0`, 0.65s), tagline fades in (0.5s, delay 0.25s)
3. Gold progress bar (`#loader-fill`) animates `width: 0 → 100%` over 1.0s ease-in-out (delay 0.2s)
4. Loader slides up (`yPercent: -105`, 0.8s power3.inOut, delay 0.12s after bar completes)
5. `display: none` set on complete; hero entrance animation fires

### Hero entrance (after loader)
```
Nav: y: -60 → 0, opacity 0→1, 0.75s
.page-hero-left: y: 30 → 0, opacity 0→1, 0.75s (offset -0.3s)
.page-hero-right: x: 50 → 0, opacity 0→1, 0.85s (offset -0.55s)
```

### Scroll reveals (data-anim attributes)
| Attribute | Animation | Trigger |
|---|---|---|
| `data-anim="up"` | `y: 30 → 0`, opacity 0→1, 0.75s power2.out | `top 89%` |
| `data-anim="left"` | `x: -36 → 0`, opacity 0→1, 0.72s power2.out | `top 89%` |
| `data-anim="right"` | `x: 36 → 0`, opacity 0→1, 0.72s power2.out | `top 89%` |
| `data-anim="scale"` | `scale: 0.93 → 1`, opacity 0→1, 0.7s power2.out | `top 89%` |
| `data-anim="stagger"` | children stagger `y: 24 → 0`, opacity 0→1, 0.65s, 0.1s stagger | `top 88%` |

Delay from `--delay` CSS custom property on element (e.g. `style="--delay:.2s"`).

### Smooth scroll
Lenis with `lerp: 0.075`, `smoothWheel: true`. GSAP ScrollTrigger updated on every Lenis scroll event.

### Scroll progress bar
`#scroll-progress` — fixed top-left, height 2px, gold, `width` = `progress × 100%`, updates on every Lenis scroll tick.

### Custom cursor (desktop only)
- `#cur`: 8px gold dot, follows mouse exactly
- `#cur-ring`: 32px circle, gold 35% border, lags behind with `lerp: 0.12` in rAF loop
- On `a, button` hover: dot scales to 2.2×, ring expands to 48px
- Both start `opacity: 0`, fade in on first `mousemove`

### Mobile menu (hamburger)
- `#menuBtn` visible only ≤960px
- Click toggles `.open` on `#sideMenu` (opacity/transform transition)
- Button shows `✕` when open, `☰` when closed
- Click outside closes menu

### FAQ accordion
- `toggleFaq(id)` — collapses all open items, opens clicked item
- Expand: `max-height` transitions from `0` → `scrollHeight + 'px'`
- First item pre-opened on page load
- Open item: border `rgba(6,64,43,.3)`, Q label turns `--green`, `+` icon rotates 45°

### Counter animation
Elements with `data-count="N"` animate their text content from 0→N after loader completes. Elements with `data-count-text="48h"` skip the counter and directly set the text.

### Number counter for gallery stats
Same `data-count` mechanism, fires on scroll entry into the stats bar.

---

## State Management
- No persistent state required
- FAQ open/close is local DOM state only
- Scroll progress is computed from Lenis scroll event (no storage)

---

## Navigation Structure
```
/ (Animated ZAF BAT.html)
├── /methodologie/Animated Diagnostic.html        (Phase 01)
│   ├── /methodologie/Animated Conception.html    (Phase 02)
│   ├── /methodologie/Animated Contractualisation.html (Phase 03)
│   ├── /methodologie/Animated Execution.html     (Phase 04)
│   ├── /methodologie/Animated Reception.html     (Phase 05)
│   └── /methodologie/Animated Garantie.html      (Phase 06)
├── /Animated Diaspora.html
├── /Animated Compliance.html
├── /Animated Equipe.html
├── /Animated Realisations.html
└── /Animated Contact.html
```

External link: `https://wa.me/212717380728` (WhatsApp, opens in new tab — used in FAB, mobile bar, and multiple CTAs).

---

## Assets
All images are under `assets/site/` and `assets/site/californie/`. Key images referenced:

| File | Used on |
|---|---|
| `assets/zafbat-logo.svg` | Logo mark (also inline SVG in nav) |
| `assets/site/californie/01-cover-pool-firepit.jpg` | Homepage hero right panel |
| `assets/site/californie/02-facade-back-wide.jpg` | Réalisations |
| `assets/site/californie/03-facade-front-wide.jpg` | Homepage Villa Californie tile 1, Réalisations |
| `assets/site/californie/06-back-balcony-vertical.jpg` | Réalisations |
| `assets/site/californie/07-back-dining-wide.jpg` | Homepage Villa Californie tile 2 |
| `assets/site/californie/09-detail-firepit-banana.jpg` | Homepage tile 3, Réalisations |
| `assets/site/californie/12-pool-zen.jpg` | Réalisations |
| `assets/site/Pool_Palms_Crane.jpg` | Diaspora testimonial card 1 |
| `assets/site/Multi-Story_Concrete_Workers.jpg` | Diaspora testimonial card 2 |
| `assets/site/Sunset_From_Building.jpg` | Diaspora testimonial card 3 |
| `assets/site/real-facade-detail.jpg` | Réalisations gallery strip |
| `assets/team/*` | Team member portrait photos (if available) |

---

## Responsive Breakpoints

| Breakpoint | Changes |
|---|---|
| `≤1080px` | Hero becomes single column; signature grid 2-col |
| `≤960px` | Nav links hidden, hamburger shown; contact/FAQ/mod grids go single-col; diaspora grid single-col |
| `≤640px` | `padding-bottom: 90px` on body; WhatsApp FAB hidden; mobile bar shown; `h1` 30px; `h2` 24px; hero left padding reduced; signature grid single-col; container width reduced (`calc(100% - 28px)`) |

---

## Files in This Bundle
```
design_handoff_zafbat_animated/
├── README.md                              ← this file
├── zafbat-animated.css                    ← design-system CSS
├── zafbat-pages.css                       ← inner-page CSS
├── zafbat-page.js                         ← animation engine
├── Animated ZAF BAT.html                  ← homepage
├── Animated Diaspora.html
├── Animated Compliance.html
├── Animated Equipe.html
├── Animated Realisations.html
├── Animated Contact.html
└── methodologie/
    ├── Animated Diagnostic.html           ← Phase 01
    ├── Animated Conception.html           ← Phase 02
    ├── Animated Contractualisation.html   ← Phase 03
    ├── Animated Execution.html            ← Phase 04
    ├── Animated Reception.html            ← Phase 05
    └── Animated Garantie.html             ← Phase 06
```

> **Note:** Image assets are not included in this bundle due to size. Reference the `assets/site/` and `assets/site/californie/` directories in the original project for all photography.

---

## Implementation Notes for Claude Code

1. **Start with tokens.** Copy the `:root` block from `zafbat-animated.css` into your global stylesheet first. Everything else depends on it.

2. **GSAP + Lenis.** All animations use GSAP 3 with ScrollTrigger and Lenis smooth scroll. In a Next.js/React environment, wrap GSAP calls in `useEffect` with proper cleanup (`ScrollTrigger.getAll().forEach(t => t.kill())`).

3. **`ZAF.boot()`** is the single entry point for the animation engine. Call it after the DOM is ready with an optional `hero` callback for page-specific hero animations.

4. **`data-anim` attribute system.** The simplest approach is to keep the attribute-driven reveal system intact — GSAP queries `[data-anim="up"]` etc. on boot. Works well in any SSR framework as long as the HTML is in the DOM before GSAP runs.

5. **Loader.** Show the loader immediately (render it in the HTML before JS loads) so the animation is visible even on slow connections.

6. **Mobile bar.** Only renders on screens `≤640px`. Sits above `safe-area-inset-bottom` on iOS.

7. **WhatsApp FAB.** Hidden on mobile (replaced by mobile bar). Pulse animation uses a pure CSS `@keyframes waPulse`.

8. **Contact form.** No backend wired — implement form submission (email or WhatsApp API) as needed in the target stack.
