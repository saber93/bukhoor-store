(() => {
  const {t,locale} = window.BukhoorI18n;
  const slug = document.body.dataset.product;
  const item = window.BUKHOOR_CONCEPTS.find(candidate => candidate.slug === slug);
  const home = locale === 'ar' ? '/ar/' : '/';
  const escape = value => String(value ?? '').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  if (!item) return;
  document.getElementById('add-to-bag').addEventListener('click', () => {
    window.BukhoorCart.add(slug);
    document.getElementById('add-message').textContent = t('Added to the preview bag. No order or payment was created.');
  });
  document.getElementById('related-grid').innerHTML = window.BUKHOOR_CONCEPTS.filter(candidate => candidate.slug !== slug).map(candidate => `<article class="product-card"><a href="${home}products/${escape(candidate.slug)}/"><img src="${escape(candidate.image)}" alt="${escape(t(candidate.title))}" loading="lazy"><div class="product-copy"><small>${escape(t('ILLUSTRATIVE EXAMPLE'))}</small><h3>${escape(t(candidate.title))}</h3><p>${escape(t(candidate.description))}</p><span>${escape(t('View details'))} ↗</span></div></a></article>`).join('');
  document.getElementById('year').textContent = new Date().getFullYear();
})();
