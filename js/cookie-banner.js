(function () {
  if (localStorage.getItem('cookieConsent')) return;

  var banner = document.createElement('div');
  banner.id = 'cookieBanner';
  banner.innerHTML = [
    '<div style="max-width:900px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:1.5rem;flex-wrap:wrap">',
      '<div style="flex:1;min-width:260px">',
        '<p style="margin:0 0 .3rem;font-weight:600;font-size:.95rem;color:#fff">Usamos cookies 🍪</p>',
        '<p style="margin:0;font-size:.82rem;color:rgba(255,255,255,.65);line-height:1.6">',
          'Utilizamos cookies propias y de terceros para mejorar tu experiencia y analizar el uso del sitio. ',
          'Puedes aceptarlas, rechazarlas o consultar nuestra ',
          '<a href="politica-cookies.html" style="color:#C8A96E;text-decoration:underline">Política de Cookies</a>.',
        '</p>',
      '</div>',
      '<div style="display:flex;gap:.75rem;flex-shrink:0;flex-wrap:wrap">',
        '<button id="cookieDeny" style="padding:.55rem 1.1rem;border-radius:6px;border:1px solid rgba(255,255,255,.25);background:transparent;color:rgba(255,255,255,.75);font-size:.82rem;cursor:pointer;font-family:inherit;transition:background .2s">Solo necesarias</button>',
        '<button id="cookieAccept" style="padding:.55rem 1.25rem;border-radius:6px;border:none;background:#C8A96E;color:#071C11;font-size:.82rem;font-weight:700;cursor:pointer;font-family:inherit;transition:opacity .2s">Aceptar todas</button>',
      '</div>',
    '</div>'
  ].join('');

  Object.assign(banner.style, {
    position: 'fixed',
    bottom: '0',
    left: '0',
    right: '0',
    zIndex: '9999',
    background: 'rgba(7,28,17,.97)',
    backdropFilter: 'blur(8px)',
    padding: '1rem 1.5rem',
    borderTop: '1px solid rgba(200,169,110,.25)',
    fontFamily: 'Inter, sans-serif',
    boxShadow: '0 -4px 24px rgba(0,0,0,.3)',
    transform: 'translateY(100%)',
    transition: 'transform .4s cubic-bezier(.16,1,.3,1)'
  });

  document.body.appendChild(banner);

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      banner.style.transform = 'translateY(0)';
    });
  });

  function dismiss(value) {
    localStorage.setItem('cookieConsent', value);
    banner.style.transform = 'translateY(100%)';
    setTimeout(function () { banner.remove(); }, 450);
  }

  document.getElementById('cookieAccept').addEventListener('click', function () { dismiss('all'); });
  document.getElementById('cookieDeny').addEventListener('click', function () { dismiss('necessary'); });

  document.getElementById('cookieDeny').addEventListener('mouseover', function () {
    this.style.background = 'rgba(255,255,255,.08)';
  });
  document.getElementById('cookieDeny').addEventListener('mouseout', function () {
    this.style.background = 'transparent';
  });
})();
