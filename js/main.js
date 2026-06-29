/* =========================================
   FARMACIA LOS ROBLES — Main JavaScript
   ========================================= */

'use strict';

// ── INIT ────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initSearch();
  initHeroSlider();
  initScrollReveal();
  initCart();
  initFAQ();
  initReviewsDrag();
  initBackToTop();
  initToast();
  initCustomCursor();
  initMarquee();
  initProductCards();
  initCounters();
});

// ── HEADER ──────────────────────────────────
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const update = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
      header.classList.remove('site-header--transparent');
    } else {
      header.classList.remove('scrolled');
      if (header.dataset.transparent) header.classList.add('site-header--transparent');
    }
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

// ── MOBILE NAV ──────────────────────────────
function initMobileNav() {
  const toggle  = document.querySelector('.nav__mobile-toggle');
  const nav     = document.querySelector('.mobile-nav');
  const close   = document.querySelector('.mobile-nav__close');
  if (!toggle || !nav) return;

  const open  = () => { nav.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const shut  = () => { nav.classList.remove('open'); document.body.style.overflow = ''; };

  toggle.addEventListener('click', open);
  close?.addEventListener('click', shut);
  nav.addEventListener('click', e => { if (e.target === nav) shut(); });
}

// ── SEARCH ──────────────────────────────────
function initSearch() {
  const overlay   = document.querySelector('.search-overlay');
  const triggers  = document.querySelectorAll('[data-search]');
  const closeBtn  = document.querySelector('.search-close');
  const input     = overlay?.querySelector('input');
  if (!overlay) return;

  const open  = () => { overlay.classList.add('open'); input?.focus(); document.body.style.overflow = 'hidden'; };
  const shut  = () => { overlay.classList.remove('open'); document.body.style.overflow = ''; };

  triggers.forEach(t => t.addEventListener('click', open));
  closeBtn?.addEventListener('click', shut);
  overlay.addEventListener('click', e => { if (e.target === overlay) shut(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') shut(); });

  document.querySelectorAll('.search-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      if (input) { input.value = tag.textContent.trim(); input.focus(); }
    });
  });
}

// ── HERO SLIDER ─────────────────────────────
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero__slide');
  const dots   = document.querySelectorAll('.hero__dot');
  if (!slides.length) return;

  let current = 0;
  let timer;

  const goTo = idx => {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  };

  const next = () => goTo(current + 1);
  const startAuto = () => { timer = setInterval(next, 6000); };
  const stopAuto  = () => clearInterval(timer);

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); });
  });

  startAuto();
}

// ── SCROLL REVEAL ────────────────────────────
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal, .stagger');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

// ── CART ────────────────────────────────────
let cartItems = [];

function initCart() {
  const cartBtns    = document.querySelectorAll('[data-cart]');
  const drawer      = document.querySelector('.cart-drawer');
  const overlay     = document.querySelector('.cart-overlay');
  const closeBtn    = drawer?.querySelector('[data-cart-close]');
  const badge       = document.querySelector('.cart-badge');

  if (!drawer) return;

  const openCart  = () => { drawer.classList.add('open'); overlay.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const closeCart = () => { drawer.classList.remove('open'); overlay.classList.remove('open'); document.body.style.overflow = ''; };

  cartBtns.forEach(btn => btn.addEventListener('click', openCart));
  closeBtn?.addEventListener('click', closeCart);
  overlay?.addEventListener('click', closeCart);

  document.querySelectorAll('[data-add-cart]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const card = btn.closest('[data-product]');
      const name  = card?.querySelector('.product-card__name')?.textContent || 'Producto';
      const price = card?.querySelector('.product-card__price-current')?.textContent || '0,00€';
      addToCart({ name, price });
    });
  });
}

function addToCart(item) {
  cartItems.push(item);
  updateCartBadge();
  showToast(`${item.name} añadido al carrito`, 'success');
  renderCartItems();
}

function updateCartBadge() {
  const badges = document.querySelectorAll('.cart-badge, .nav__badge');
  badges.forEach(b => { b.textContent = cartItems.length; });
}

function renderCartItems() {
  const list = document.querySelector('.cart-items');
  if (!list) return;

  if (!cartItems.length) {
    list.innerHTML = `
      <div style="text-align:center;padding:3rem 1rem;color:var(--c-gray-mid)">
        <div style="font-size:3rem;margin-bottom:1rem">🛒</div>
        <p style="font-family:var(--f-display);font-size:1.25rem;margin-bottom:.5rem">Tu carrito está vacío</p>
        <p style="font-size:.875rem">Explora nuestra tienda y añade productos</p>
      </div>`;
    return;
  }

  list.innerHTML = cartItems.map((item, i) => `
    <div class="cart-item" data-index="${i}">
      <div class="cart-item__img" style="background:var(--c-gray-ghost);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:2rem">💊</div>
      <div class="cart-item__details">
        <div class="cart-item__name">${item.name}</div>
        <div class="cart-item__qty">
          <button onclick="changeQty(${i},-1)">−</button>
          <span>1</span>
          <button onclick="changeQty(${i},1)">+</button>
        </div>
      </div>
      <div class="cart-item__price">${item.price}</div>
    </div>
  `).join('');
}

window.changeQty = (i, d) => {
  if (d < 0) { cartItems.splice(i, 1); updateCartBadge(); renderCartItems(); }
};

// ── FAQ ─────────────────────────────────────
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-question');
    q?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

// ── REVIEWS DRAG ────────────────────────────
function initReviewsDrag() {
  const track = document.querySelector('.reviews-track');
  if (!track) return;

  let isDown = false, startX, scrollLeft;

  track.addEventListener('mousedown', e => {
    isDown = true;
    track.classList.add('dragging');
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });

  track.addEventListener('mouseleave', () => { isDown = false; track.classList.remove('dragging'); });
  track.addEventListener('mouseup', () => { isDown = false; track.classList.remove('dragging'); });
  track.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    track.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });
}

// ── BACK TO TOP ─────────────────────────────
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ── TOAST ────────────────────────────────────
function initToast() { window._toastContainer = document.querySelector('.toast-container'); }

window.showToast = function(msg, type = '') {
  const container = window._toastContainer || document.querySelector('.toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast${type ? ' toast--' + type : ''}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
    <span>${msg}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('leaving');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

// ── CUSTOM CURSOR ────────────────────────────
function initCustomCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cursor = document.querySelector('.custom-cursor');
  if (!cursor) return;

  const dot  = cursor.querySelector('.cursor-dot');
  const ring = cursor.querySelector('.cursor-ring');

  let mx = -100, my = -100, rx = -100, ry = -100;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  const interactables = 'a, button, [data-cursor]';

  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactables)) ring.classList.add('hovered');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactables)) ring.classList.remove('hovered');
  });

  const animate = () => {
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animate);
  };

  animate();
}

// ── MARQUEE CLONE ────────────────────────────
function initMarquee() {
  const inner = document.querySelector('.marquee-inner');
  if (!inner) return;
  inner.innerHTML += inner.innerHTML;
}

// ── PRODUCT CARDS ────────────────────────────
function initProductCards() {
  document.querySelectorAll('.product-card__wishlist').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const isLiked = btn.dataset.liked === '1';
      btn.dataset.liked = isLiked ? '0' : '1';
      btn.innerHTML = isLiked ? '♡' : '♥';
      btn.style.color = isLiked ? '' : 'var(--c-red)';
      showToast(isLiked ? 'Eliminado de favoritos' : 'Añadido a favoritos');
    });
  });

  document.querySelectorAll('.product-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const gallery = thumb.closest('.product-gallery');
      if (!gallery) return;
      gallery.querySelectorAll('.product-thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const main = gallery.querySelector('.product-main-img img');
      if (main && thumb.querySelector('img')) main.src = thumb.querySelector('img').src;
    });
  });
}

// ── COUNTERS ────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseFloat(el.dataset.counter);
      const suffix = el.dataset.suffix || '';
      const dur    = 1800;
      const start  = performance.now();

      const tick = now => {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = (target % 1 === 0 ? Math.round(target * ease) : (target * ease).toFixed(1)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// ── FILTER TOGGLE (SHOP) ─────────────────────
window.toggleFilters = function() {
  const filters = document.querySelector('.shop-filters');
  filters?.classList.toggle('open');
};

// ── QUANTITY (PRODUCT PAGE) ─────────────────
window.changeProductQty = function(delta) {
  const el = document.querySelector('.product-qty-value');
  if (!el) return;
  const v = Math.max(1, parseInt(el.textContent) + delta);
  el.textContent = v;
};

// ── NEWSLETTER ──────────────────────────────
document.addEventListener('submit', e => {
  if (e.target.matches('.newsletter-form')) {
    e.preventDefault();
    const input = e.target.querySelector('input');
    if (input?.value) {
      showToast('¡Gracias! Te has suscrito correctamente.', 'success');
      input.value = '';
    }
  }
  if (e.target.matches('.contact-form')) {
    e.preventDefault();
    showToast('Mensaje enviado. Te contactaremos pronto.', 'success');
    e.target.reset();
  }
});

// ── SMOOTH ANCHOR ────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
