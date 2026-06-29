/* =============================================
   FARMACIA LOS ROBLES — Premium Animations
   GSAP + ScrollTrigger + Lenis Smooth Scroll
   ============================================= */

// ── SMOOTH SCROLL (Lenis) ──────────────────────
let lenis;

function initLenis() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

// ── CUSTOM CURSOR ──────────────────────────────
function initCursor() {
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring || window.matchMedia('(pointer:coarse)').matches) return;

  document.documentElement.classList.add('has-cursor');

  let mx = 0, my = 0, rx = 0, ry = 0;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    gsap.to(dot, { x: mx, y: my, duration: 0.06, ease: 'none' });
  });

  gsap.ticker.add(() => {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    gsap.set(ring, { x: rx, y: ry });
  });

  const hoverEls = document.querySelectorAll('a, button, [data-cursor-grow]');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(ring, { scale: 1.9, opacity: .5, duration: .3 });
      gsap.to(dot, { scale: 0, duration: .2 });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(ring, { scale: 1, opacity: .85, duration: .35 });
      gsap.to(dot, { scale: 1, duration: .2 });
    });
  });
}

// ── MAGNETIC BUTTONS ───────────────────────────
function initMagnetic() {
  document.querySelectorAll('[data-magnetic]').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      gsap.to(btn, { x: x * 0.35, y: y * 0.35, duration: .4, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: .6, ease: 'elastic.out(1,.4)' });
    });
  });
}

// ── TEXT SPLIT REVEAL ──────────────────────────
function splitAndReveal(selector, type = 'lines') {
  const els = document.querySelectorAll(selector);
  els.forEach(el => {
    const text = el.textContent;
    if (type === 'chars') {
      el.innerHTML = text.split('').map(c =>
        c === ' ' ? ' ' : `<span class="char" style="display:inline-block">${c}</span>`
      ).join('');
      gsap.from(el.querySelectorAll('.char'), {
        scrollTrigger: { trigger: el, start: 'top 88%' },
        y: '110%', opacity: 0, duration: 1,
        stagger: 0.02, ease: 'power4.out',
        delay: parseFloat(el.dataset.delay || 0)
      });
    } else {
      // word split
      el.innerHTML = text.split(' ').map(w =>
        `<span class="word-wrap" style="overflow:hidden;display:inline-block;vertical-align:bottom;margin-right:.25em"><span class="word" style="display:inline-block">${w}</span></span>`
      ).join('');
      gsap.from(el.querySelectorAll('.word'), {
        scrollTrigger: { trigger: el, start: 'top 88%' },
        y: '115%', duration: 1.1,
        stagger: 0.055, ease: 'power4.out',
        delay: parseFloat(el.dataset.delay || 0)
      });
    }
  });
}

// ── CLIP-PATH REVEALS ──────────────────────────
function initClipReveal() {
  gsap.utils.toArray('.clip-reveal').forEach(el => {
    gsap.fromTo(el,
      { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
      {
        clipPath: 'inset(0 0% 0 0)',
        duration: 1.2,
        ease: 'power4.inOut',
        scrollTrigger: { trigger: el, start: 'top 82%' }
      }
    );
  });
}

// ── STANDARD SCROLL REVEALS ────────────────────
function initScrollReveal() {
  // Fade up
  gsap.utils.toArray('.anim-up').forEach(el => {
    gsap.to(el, {
      y: 0, opacity: 1, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
      delay: parseFloat(el.dataset.delay || 0)
    });
  });

  // Fade left
  gsap.utils.toArray('.anim-left').forEach(el => {
    gsap.to(el, {
      x: 0, opacity: 1, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
      delay: parseFloat(el.dataset.delay || 0)
    });
  });

  // Fade right
  gsap.utils.toArray('.anim-right').forEach(el => {
    gsap.to(el, {
      x: 0, opacity: 1, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
      delay: parseFloat(el.dataset.delay || 0)
    });
  });

  // Scale
  gsap.utils.toArray('.anim-scale').forEach(el => {
    gsap.to(el, {
      scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.5)',
      scrollTrigger: { trigger: el, start: 'top 88%' },
      delay: parseFloat(el.dataset.delay || 0)
    });
  });

  // Fade
  gsap.utils.toArray('.anim-fade').forEach(el => {
    gsap.to(el, {
      opacity: 1, duration: 1, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
      delay: parseFloat(el.dataset.delay || 0)
    });
  });

  // Stagger groups
  gsap.utils.toArray('.stagger-group').forEach(group => {
    const items = group.querySelectorAll('.stagger-item');
    gsap.from(items, {
      y: 60, opacity: 0, duration: .9, ease: 'power3.out',
      stagger: .12,
      scrollTrigger: { trigger: group, start: 'top 82%' }
    });
  });
}

// ── PARALLAX ───────────────────────────────────
function initParallax() {
  gsap.utils.toArray('[data-parallax]').forEach(el => {
    const speed = parseFloat(el.dataset.parallax || .3);
    gsap.to(el, {
      yPercent: speed * -30,
      ease: 'none',
      scrollTrigger: {
        trigger: el.closest('[data-parallax-wrap]') || el.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });
}

// ── COUNTER ANIMATION ──────────────────────────
function initCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const obj = { val: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target,
          duration: 2.2,
          ease: 'power2.out',
          onUpdate() {
            el.textContent = (target % 1 === 0
              ? Math.round(obj.val)
              : obj.val.toFixed(1)
            ) + suffix;
          }
        });
      }
    });
  });
}

// ── SECTION LINE DRAW ──────────────────────────
function initLineDraws() {
  gsap.utils.toArray('.line-draw').forEach(el => {
    gsap.fromTo(el,
      { scaleX: 0, transformOrigin: 'left center' },
      {
        scaleX: 1, duration: 1.2, ease: 'power4.inOut',
        scrollTrigger: { trigger: el, start: 'top 90%' }
      }
    );
  });
}

// ── HEADER ─────────────────────────────────────
function initHeader() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  ScrollTrigger.create({
    start: 80,
    onUpdate(self) {
      nav.classList.toggle('solid', self.scroller.scrollTop > 80);
    }
  });

  // Also use scroll event as fallback
  window.addEventListener('scroll', () => {
    nav.classList.toggle('solid', window.scrollY > 80);
  }, { passive: true });
}

// ── MOBILE MENU ────────────────────────────────
function initMobileMenu() {
  const btn   = document.querySelector('.nav__hamburger');
  const menu  = document.querySelector('.mob-menu');
  const close = document.querySelector('.mob-menu__close');
  const links = document.querySelectorAll('.mob-menu__link');
  if (!btn || !menu) return;

  function open() {
    menu.classList.add('open');
    document.body.style.overflow = 'hidden';
    gsap.from(links, { x: -40, opacity: 0, stagger: .07, duration: .6, ease: 'power3.out', delay: .2 });
  }
  function close_() {
    menu.classList.remove('open');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', open);
  if (close) close.addEventListener('click', close_);
  links.forEach(l => l.addEventListener('click', close_));
}

// ── SEARCH ─────────────────────────────────────
function initSearch() {
  const overlay = document.querySelector('.search-overlay');
  const input   = overlay?.querySelector('.search-input');
  const closBtn = overlay?.querySelector('.search-close-btn');
  document.querySelectorAll('[data-search]').forEach(btn => {
    btn.addEventListener('click', () => {
      overlay.classList.add('open');
      setTimeout(() => input?.focus(), 300);
    });
  });
  closBtn?.addEventListener('click', () => overlay.classList.remove('open'));
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') overlay?.classList.remove('open');
  });
}

// ── CART ───────────────────────────────────────
function initCart() {
  const overlay = document.querySelector('.cart-overlay');
  const drawer  = document.querySelector('.cart-drawer');

  function open() {
    overlay?.classList.add('open');
    drawer?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    overlay?.classList.remove('open');
    drawer?.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-cart]').forEach(b => b.addEventListener('click', open));
  overlay?.addEventListener('click', close);
  document.querySelectorAll('[data-cart-close]').forEach(b => b.addEventListener('click', close));

  document.querySelectorAll('[data-add-cart]').forEach(btn => {
    btn.addEventListener('click', () => {
      window.showToast?.('¡Añadido al carrito! 🛒');
      open();
    });
  });
}

// ── FAQ ────────────────────────────────────────
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => {
        o.classList.remove('open');
        const oa = o.querySelector('.faq-a');
        if (oa) gsap.to(oa, { height: 0, duration: .35, ease: 'power2.inOut' });
      });
      if (!isOpen) {
        item.classList.add('open');
        gsap.set(a, { height: 'auto' });
        gsap.from(a, { height: 0, duration: .4, ease: 'power2.out' });
      }
    });
  });
}

// ── TOAST ──────────────────────────────────────
window.showToast = function(msg, type = 'success') {
  const container = document.querySelector('.toasts') || (() => {
    const d = document.createElement('div');
    d.className = 'toasts';
    document.body.appendChild(d);
    return d;
  })();

  const t = document.createElement('div');
  t.className = 'toast' + (type === 'error' ? ' toast--err' : '');
  t.innerHTML = `<span>${type === 'success' ? '✓' : '!'}</span><span>${msg}</span>`;
  container.appendChild(t);

  setTimeout(() => {
    t.classList.add('out');
    setTimeout(() => t.remove(), 350);
  }, 3200);
};

// ── WHATSAPP FAB ───────────────────────────────
function initWAFab() {
  const fab = document.querySelector('.wa-fab');
  if (!fab) return;
  ScrollTrigger.create({
    start: 300,
    onUpdate(self) {
      gsap.to(fab, { opacity: self.scroller.scrollTop > 300 ? 1 : 0, duration: .3 });
    }
  });
}

// ── INIT ALL ───────────────────────────────────
function init() {
  initLenis();
  initHeader();
  initMobileMenu();
  initSearch();
  initCart();
  initFAQ();
  initScrollReveal();
  initClipReveal();
  initParallax();
  initCounters();
  initLineDraws();
  initCursor();
  initMagnetic();

  // Refresh ScrollTrigger on load
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
