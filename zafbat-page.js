/* ═══ ZAF BAT · SHARED PAGE ANIMATION ENGINE ═══
   Include after GSAP + Lenis CDN scripts.
   Call: ZAF.boot({ hero: function(){ ... } })
═══════════════════════════════════════════════ */
(function(){
  window.ZAF = {};

  /* ── NAV LOGO SVG ── */
  ZAF.logoSVG = `<svg class="logo-icon" viewBox="0 0 220 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="overflow:visible">
    <path fill="url(#zbA)" fill-rule="evenodd" mask="url(#zbSocket)" d="M 45,178 L 45,89.5 Q 45,92 42.5,92 L 30.5,92 Q 28,92 28,89.5 L 28,84 Q 28,11 110,11 Q 192,11 192,84 L 192,89.5 Q 192,92 189.5,92 L 177.5,92 Q 175,92 175,89.5 L 175,178 Z M 63,178 L 63,86.5 Q 63,84 60.5,84 L 48.5,84 Q 46,84 46,81.5 Q 46,29 110,29 Q 174,29 174,81.5 Q 174,84 171.5,84 L 159.5,84 Q 157,84 157,86.5 L 157,178 Z"/>
    <polygon points="110,2 110,20 98,20" fill="url(#emTL)"/>
    <polygon points="110,2 122,20 110,20" fill="url(#emTR)"/>
    <polygon points="110,38 98,20 110,20" fill="url(#emBL)"/>
    <polygon points="110,38 122,20 110,20" fill="url(#emBR)"/>
  </svg>`;

  /* ── BOOT ── */
  ZAF.boot = function(opts) {
    opts = opts || {};
    gsap.registerPlugin(ScrollTrigger);

    /* Lenis smooth scroll */
    const lenis = new Lenis({ lerp: .075, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);

    /* Scroll progress bar */
    const prog = document.getElementById('scroll-progress');
    if (prog) lenis.on('scroll', ({ progress: p }) => { prog.style.width = (p * 100) + '%'; });

    /* Capability flags */
    const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;

    /* Cursor — pointer devices only */
    const cur = document.getElementById('cur'), ring = document.getElementById('cur-ring');
    if (cur && ring && canHover) {
      let mx = 0, my = 0, rx = 0, ry = 0;
      document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        cur.style.left = mx + 'px'; cur.style.top = my + 'px';
        cur.style.opacity = 1; ring.style.opacity = 1;
      });
      (function t(){ rx += (mx-rx)*.12; ry += (my-ry)*.12; ring.style.left = rx+'px'; ring.style.top = ry+'px'; requestAnimationFrame(t); })();
      document.querySelectorAll('a,button').forEach(el => {
        el.addEventListener('mouseenter', () => { cur.style.transform='translate(-50%,-50%) scale(2.2)'; ring.style.width='48px'; ring.style.height='48px'; });
        el.addEventListener('mouseleave', () => { cur.style.transform='translate(-50%,-50%) scale(1)'; ring.style.width='32px'; ring.style.height='32px'; });
      });
    }

    /* Page loader */
    function runLoader(cb) {
      const loader = document.getElementById('loader');
      if (!loader) { if (cb) cb(); return; }
      const fill = document.getElementById('loader-fill');
      const brand = document.querySelector('.loader-brand');
      const tagline = document.querySelector('.loader-tagline');
      if (brand) gsap.fromTo(brand, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: .65, ease: 'power2.out' });
      if (tagline) gsap.fromTo(tagline, { opacity: 0 }, { opacity: 1, duration: .5, delay: .25 });
      if (fill) gsap.to(fill, { width: '100%', duration: 1.0, ease: 'power2.inOut', delay: .2,
        onComplete: () => gsap.to(loader, { yPercent: -105, duration: .8, ease: 'power3.inOut', delay: .12,
          onComplete: () => { loader.style.display = 'none'; if (cb) cb(); }
        })
      });
    }

    /* Generic scroll reveals */
    function initReveals() {
      const cfg = { toggleActions: 'play none none none' };
      gsap.utils.toArray('[data-anim="up"]').forEach(el => {
        const d = parseFloat(getComputedStyle(el).getPropertyValue('--delay')) || 0;
        gsap.fromTo(el, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .75, ease: 'power2.out', delay: d,
          scrollTrigger: { trigger: el, start: 'top 89%', ...cfg }
        });
      });
      gsap.utils.toArray('[data-anim="left"]').forEach(el => {
        const d = parseFloat(getComputedStyle(el).getPropertyValue('--delay')) || 0;
        gsap.fromTo(el, { x: -36, opacity: 0 }, { x: 0, opacity: 1, duration: .72, ease: 'power2.out', delay: d,
          scrollTrigger: { trigger: el, start: 'top 89%', ...cfg }
        });
      });
      gsap.utils.toArray('[data-anim="right"]').forEach(el => {
        gsap.fromTo(el, { x: 36, opacity: 0 }, { x: 0, opacity: 1, duration: .72, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 89%', ...cfg }
        });
      });
      gsap.utils.toArray('[data-anim="scale"]').forEach(el => {
        const d = parseFloat(getComputedStyle(el).getPropertyValue('--delay')) || 0;
        gsap.fromTo(el, { scale: .93, opacity: 0 }, { scale: 1, opacity: 1, duration: .7, ease: 'power2.out', delay: d,
          scrollTrigger: { trigger: el, start: 'top 89%', ...cfg }
        });
      });
      gsap.utils.toArray('[data-anim="stagger"]').forEach(parent => {
        const children = parent.children;
        gsap.fromTo(children, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .65, ease: 'power2.out', stagger: .1,
          scrollTrigger: { trigger: parent, start: 'top 88%', ...cfg }
        });
      });
    }

    /* Page hero baseline entrance */
    function heroEntrance() {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('#main-nav', { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: .75 })
        .fromTo('.page-hero-left', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .75 }, '-=.3')
        .fromTo('.page-hero-right', { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: .85, ease: 'power2.out' }, '-=.55');
      if (opts.hero) opts.hero(tl);
    }

    /* Mobile menu */
    const menuBtn = document.getElementById('menuBtn');
    const sideMenu = document.getElementById('sideMenu');
    if (menuBtn && sideMenu) {
      menuBtn.addEventListener('click', () => {
        const o = sideMenu.classList.toggle('open');
        menuBtn.classList.toggle('active', o);
        menuBtn.innerHTML = o ? '✕' : '&#9776;';
      });
      document.addEventListener('click', e => {
        if (!sideMenu.contains(e.target) && !menuBtn.contains(e.target)) {
          sideMenu.classList.remove('open');
          menuBtn.classList.remove('active');
          menuBtn.innerHTML = '&#9776;';
        }
      });
    }

    /* FAQ toggle */
    window.toggleFaq = function(id) {
      const item = document.getElementById(id);
      if (!item) return;
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(el => {
        el.classList.remove('open');
        const a = el.querySelector('.faq-a');
        if (a) a.style.maxHeight = '0';
      });
      if (!isOpen) {
        item.classList.add('open');
        const a = item.querySelector('.faq-a');
        if (a) a.style.maxHeight = a.querySelector('.faq-a-inner').scrollHeight + 'px';
      }
    };
    const firstFaq = document.querySelector('.faq-item');
    if (firstFaq) {
      const a = firstFaq.querySelector('.faq-a');
      if (a) { firstFaq.classList.add('open'); a.style.maxHeight = a.querySelector('.faq-a-inner').scrollHeight + 'px'; }
    }

    window.addEventListener('load', () => {
      if (prefersReduced) {
        const loader = document.getElementById('loader');
        if (loader) loader.style.display = 'none';
        initReveals();
        heroEntrance();
        return;
      }
      initReveals();
      runLoader(() => heroEntrance());
    });
  };

  /* ── NAV + SIDE MENU HTML generator ── */
  ZAF.nav = function(activePage, prefix) {
    prefix = prefix || '';
    const links = [
      { href: prefix + 'Animated ZAF BAT.html', label: 'Accueil' },
      { href: prefix + 'methodologie/Animated Diagnostic.html', label: 'Méthodologie' },
      { href: prefix + 'Animated Diaspora.html', label: 'Diaspora' },
      { href: prefix + 'Animated Compliance.html', label: 'Conformité' },
      { href: prefix + 'Animated Equipe.html', label: 'Équipe' },
      { href: prefix + 'Animated Realisations.html', label: 'Réalisations' },
      { href: prefix + 'Animated Contact.html', label: 'Contact' },
    ];
    const navLinks = links.map(l =>
      `<a href="${l.href}" ${l.label===activePage?'style="color:var(--charcoal)"':''}>${l.label}</a>`
    ).join('');
    const sideLinks = links.map(l =>
      `<a href="${l.href}" ${l.label===activePage?'class="active"':''}>${l.label}</a>`
    ).join('');
    return `
<svg width="0" height="0" style="position:absolute;overflow:hidden"><defs>
  <linearGradient id="zbA" x1="50%" y1="0%" x2="50%" y2="100%"><stop offset="0%" stop-color="#f0d890"/><stop offset="45%" stop-color="#D3A357"/><stop offset="100%" stop-color="#9a7a48"/></linearGradient>
  <linearGradient id="emTL" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#2E6A4F"/><stop offset="100%" stop-color="#153C2A"/></linearGradient>
  <linearGradient id="emTR" x1="100%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#3E8A67"/><stop offset="100%" stop-color="#1D4C37"/></linearGradient>
  <linearGradient id="emBL" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="#0A1E12"/><stop offset="100%" stop-color="#1A3F28"/></linearGradient>
  <linearGradient id="emBR" x1="100%" y1="100%" x2="0%" y2="0%"><stop offset="0%" stop-color="#163D28"/><stop offset="100%" stop-color="#255237"/></linearGradient>
  <mask id="zbSocket" maskUnits="userSpaceOnUse" x="0" y="-4" width="220" height="208"><rect x="0" y="-4" width="220" height="208" fill="#fff"/><polygon points="110,-2 126,20 110,42 94,20" fill="#000"/></mask>
</defs></svg>
<nav id="main-nav">
  <div class="container nav-inner">
    <a class="logo-mark" href="${prefix}Animated ZAF BAT.html">
      <span class="logo-icon-wrap">${ZAF.logoSVG}</span>
      <div class="logo-text"><span class="logo-name">ZAF BAT</span><span class="logo-sub">Maîtrise d'Ouvrage</span></div>
    </a>
    <div class="nav-links">${navLinks}<a href="${prefix}Animated Contact.html" class="nav-cta">Engager une discussion</a></div>
    <button class="menu-btn" id="menuBtn" aria-label="Menu">&#9776;</button>
  </div>
</nav>
<nav class="side-menu" id="sideMenu">
  <div class="side-menu-links">${sideLinks}</div>
  <div class="side-menu-foot"><a href="https://wa.me/212717380728" target="_blank">Discussion privée →</a></div>
</nav>`;
  };

  /* ── FOOTER HTML generator ── */
  ZAF.footer = function(prefix) {
    prefix = prefix || '';
    return `
<footer>
  <div class="container footer-inner">
    <a class="logo-mark" href="${prefix}Animated ZAF BAT.html">
      <span class="logo-icon-wrap">${ZAF.logoSVG}</span>
      <div class="logo-text"><span class="logo-name">ZAF BAT</span><span class="logo-sub">Maîtrise d'Ouvrage</span></div>
    </a>
    <div style="text-align:center"><div class="footer-cities">Casablanca · Rabat · Salé · Marrakech · Tanger</div><div class="footer-tagline">Construire loin, vivre serein.</div></div>
    <div class="footer-copy"><div class="footer-links" style="justify-content:flex-end;margin-bottom:6px"><a href="#">Conformité</a><a href="${prefix}Animated Contact.html">Contact</a></div>© 2026 ZAF BAT · FNBTP CGEM · DATRP</div>
  </div>
</footer>
<a id="wa-btn" href="https://wa.me/212717380728" target="_blank" aria-label="WhatsApp">
  <svg viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.116.554 4.103 1.524 5.83L.057 23.62a.5.5 0 0 0 .62.62l5.79-1.467A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 0 1-5.016-1.38l-.36-.214-3.733.947.964-3.64-.234-.376A9.818 9.818 0 0 1 12 2.182c5.424 0 9.818 4.394 9.818 9.818 0 5.425-4.394 9.818-9.818 9.818z"/></svg>
</a>
<nav class="mob-bar">
  <a class="mob-wa" href="https://wa.me/212717380728" target="_blank">💬 WhatsApp</a>
  <a class="mob-call" href="tel:+212717380728">📞 Appeler</a>
  <a class="mob-call" href="${prefix}Animated Contact.html">✉ Contact</a>
</nav>`;
  };

  /* ── LOADER HTML ── */
  ZAF.loader = function() {
    return `<div id="loader"><div class="loader-inner"><div class="loader-brand">ZAF BAT</div><div class="loader-tagline">Maîtrise d'Ouvrage Déléguée</div></div><div class="loader-line-track"><div class="loader-line-fill" id="loader-fill"></div></div></div>`;
  };

  /* ── UI CHROME ── */
  ZAF.chrome = function() {
    return `<div id="scroll-progress"></div><div id="cur"></div><div id="cur-ring"></div>`;
  };

})();
