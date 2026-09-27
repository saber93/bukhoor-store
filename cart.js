(() => {
  const key = 'bukhoor-preview-bag-v1';
  const concepts = window.BUKHOOR_CONCEPTS || [];
  const {t,locale} = window.BukhoorI18n;
  const home = locale === 'ar' ? '/ar/' : '/';
  const valid = new Set(concepts.map(item => item.slug));
  function read() {
    try {
      const value = JSON.parse(localStorage.getItem(key) || '{}');
      if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
      return Object.fromEntries(Object.entries(value).filter(([slug,quantity]) => valid.has(slug) && Number.isInteger(quantity) && quantity > 0 && quantity <= 9));
    } catch { return {}; }
  }
  function save(bag) {
    try { localStorage.setItem(key,JSON.stringify(bag)); } catch {}
    updateCount();
    render();
  }
  function add(slug) {
    if (!valid.has(slug)) return false;
    const bag = read();
    bag[slug] = Math.min(9,(bag[slug] || 0) + 1);
    save(bag);
    return true;
  }
  function set(slug,quantity) {
    if (!valid.has(slug)) return;
    const bag = read();
    if (quantity <= 0) delete bag[slug]; else bag[slug] = Math.min(9,quantity);
    save(bag);
  }
  function updateCount() {
    const count = Object.values(read()).reduce((sum,quantity) => sum + quantity,0);
    document.querySelectorAll('[data-cart-count]').forEach(el => {el.textContent = String(count);});
  }
  function itemRow(item,quantity,editable) {
    const row = document.createElement('article'); row.className = 'cart-item';
    const imageLink = document.createElement('a'); imageLink.href = `${home}products/${item.slug}/`;
    const image = document.createElement('img'); image.src = item.image; image.alt = t(item.title); imageLink.append(image);
    const body = document.createElement('div');
    const label = document.createElement('span'); label.className = 'eyebrow'; label.textContent = t(item.category === 'bakhoor' ? 'Bakhoor' : item.category === 'oud' ? 'Oud' : 'Incense');
    const title = document.createElement('h2'); const link = document.createElement('a'); link.href = imageLink.href; link.textContent = t(item.title); title.append(link);
    const note = document.createElement('p'); note.textContent = t('Illustrative example — price pending');
    body.append(label,title,note);
    if (editable) {
      const controls = document.createElement('div'); controls.className = 'quantity-controls';
      const minus = document.createElement('button'); minus.type='button';minus.textContent='−';minus.setAttribute('aria-label',`${t('Remove one')} ${t(item.title)}`);minus.addEventListener('click',()=>set(item.slug,quantity-1));
      const value = document.createElement('span');value.textContent=String(quantity);
      const plus = document.createElement('button');plus.type='button';plus.textContent='+';plus.disabled=quantity>=9;plus.setAttribute('aria-label',`${t('Add one')} ${t(item.title)}`);plus.addEventListener('click',()=>set(item.slug,quantity+1));
      const remove = document.createElement('button');remove.type='button';remove.className='remove-item';remove.textContent=t('Remove');remove.addEventListener('click',()=>set(item.slug,0));
      controls.append(minus,value,plus,remove);body.append(controls);
    } else { const qty=document.createElement('small');qty.textContent=`${t('Quantity')}: ${quantity}`;body.append(qty); }
    row.append(imageLink,body);
    return row;
  }
  function render() {
    const bag = read();
    const entries = concepts.filter(item => bag[item.slug]);
    for (const [id,editable] of [['cart-items',true],['checkout-items',false]]) {
      const root=document.getElementById(id);
      if (!root) continue;
      root.replaceChildren();
      if (!entries.length) {const empty=document.createElement('p');empty.className='empty-state';empty.textContent=t('Your preview bag is empty. Explore the collection to add a concept.');root.append(empty);}
      else entries.forEach(item => root.append(itemRow(item,bag[item.slug],editable)));
    }
    const review=document.getElementById('review-checkout');
    if (review) {review.setAttribute('aria-disabled',String(entries.length===0));review.classList.toggle('disabled',entries.length===0);}
  }
  const review=document.getElementById('review-checkout');
  if (review) review.addEventListener('click',event=>{if(!Object.keys(read()).length)event.preventDefault();});
  window.BukhoorCart = {read,add,set};
  updateCount();
  render();
})();
