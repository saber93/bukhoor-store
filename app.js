(() => {
  const {t,money,locale} = window.BukhoorI18n;
  const config = window.BUKHOOR_CONFIG;
  const grid = document.getElementById('product-grid');
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  let items = window.BUKHOOR_CONCEPTS.map(item => ({...item,illustrative:true}));
  let filter = 'all';
  function render() {
    const matching = filter === 'all' ? items : items.filter(item => item.category === filter);
    grid.innerHTML = matching.length ? matching.map(item => {
      const title = item.illustrative ? t(item.title) : locale === 'ar' && item.name_ar ? item.name_ar : item.name;
      const description = item.illustrative ? t(item.description) : locale === 'ar' && item.description_ar ? item.description_ar : item.description;
      const image = item.image;
      const price = item.illustrative ? t('Product details coming soon') : money(item.price_minor);
      return `<article class="product-card"><img src="${escape(image)}" alt="${escape(title)}" loading="lazy"><div class="product-copy"><small>${escape(t(item.illustrative || item.fixture ? 'ILLUSTRATIVE EXAMPLE' : 'Bukhoor Store'))}</small><h3 dir="auto">${escape(title)}</h3><p dir="auto">${escape(description)}</p><span>${escape(price)}</span></div></article>`;
    }).join('') : `<p class="empty-state">${escape(t('No concepts in this category yet.'))}</p>`;
  }
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(el => {const active = el === button;el.classList.toggle('active',active);el.setAttribute('aria-pressed',String(active));});
    render();
  }));
  document.getElementById('year').textContent = new Date().getFullYear();
  render();
  if (config.mode === 'supabase') window.BukhoorCommerce.catalog().then(data => {
    items = data.products.filter(product => product.available !== false).map(product => ({...product,illustrative:false}));
    render();
  }).catch(() => {grid.innerHTML = `<p class="empty-state">${escape(t('The catalog could not be loaded.'))}</p>`;});
})();
