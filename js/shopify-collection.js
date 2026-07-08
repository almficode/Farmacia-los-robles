/* Carga los productos de una colección Shopify en .products-grid[data-collection] */
(async () => {
  const grid = document.querySelector('.products-grid[data-collection]');
  if (!grid) return;
  const HANDLE = grid.dataset.collection;
  const SHOP = 'wqbppt-ck.myshopify.com';
  const TOKEN = 'bbf966ca4b00833666f89d182a1948f6';
  const query = `{collection(handle:${JSON.stringify(HANDLE)}){products(first:50){edges{node{
    id handle title vendor
    priceRange{minVariantPrice{amount}}
    compareAtPriceRange{minVariantPrice{amount}}
    images(first:1){edges{node{url altText}}}
    variants(first:1){edges{node{availableForSale}}}
  }}}}}`;
  try {
    const res = await fetch(`https://${SHOP}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': TOKEN },
      body: JSON.stringify({ query })
    });
    const { data } = await res.json();
    const products = data?.collection?.products?.edges || [];
    const countEl = document.getElementById('productCount');
    if (!products.length) {
      grid.innerHTML = '<p style="grid-column:1/-1;color:#777;padding:2rem 0">No hay productos en esta categoría todavía.</p>';
      if (countEl) countEl.textContent = '0 productos';
      return;
    }
    if (countEl) countEl.textContent = products.length + (products.length === 1 ? ' producto' : ' productos');
    grid.innerHTML = products.map(({ node: p }, i) => {
      const img = p.images.edges[0]?.node;
      const price = parseFloat(p.priceRange.minVariantPrice.amount);
      const wasRaw = parseFloat(p.compareAtPriceRange?.minVariantPrice?.amount || 0);
      const was = wasRaw > price ? wasRaw : 0;
      const discount = was ? Math.round((1 - price / was) * 100) : 0;
      const available = p.variants.edges[0]?.node?.availableForSale !== false;
      return `<a href="producto.html?handle=${p.handle}" class="pcard" style="display:block;color:inherit;text-decoration:none">
        <div class="pcard__media">
          ${img
            ? `<div class="pcard__media-inner" style="position:absolute;inset:0;width:100%;height:100%"><img src="${img.url}" alt="${img.altText || p.title}" style="width:100%;height:100%;object-fit:cover"/></div>`
            : `<div class="pcard__media-inner">💊</div>`}
          <div class="pcard__badges">
            ${was ? `<span class="pcard__badge pcard__badge--sale">-${discount}%</span>` : ''}
            ${!available ? `<span class="pcard__badge" style="background:#666;color:#fff">Agotado</span>` : ''}
          </div>
          <button class="pcard__wish" onclick="event.preventDefault()">♡</button>
        </div>
        <div class="pcard__info">
          <div class="pcard__brand">${p.vendor}</div>
          <div class="pcard__name">${p.title}</div>
          <div class="pcard__price">
            <span class="pcard__price-now">${price.toFixed(2).replace('.', ',')} €</span>
            ${was ? `<span class="pcard__price-was">${was.toFixed(2).replace('.', ',')} €</span>` : ''}
          </div>
        </div>
      </a>`;
    }).join('');
    if (window.gsap) {
      gsap.utils.toArray('.products-grid .pcard').forEach((el, i) => {
        gsap.fromTo(el, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: 'power3.out', delay: (i % 4) * 0.07,
          scrollTrigger: window.ScrollTrigger ? { trigger: el, start: 'top 92%', once: true } : undefined });
      });
    }
  } catch (e) {
    console.error('Shopify error', e);
    grid.innerHTML = '<p style="grid-column:1/-1;color:#777">Error al cargar productos.</p>';
  }
})();
