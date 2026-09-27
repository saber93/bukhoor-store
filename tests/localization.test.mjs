import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const en=JSON.parse(await readFile('locales/en.json','utf8'));
const ar=JSON.parse(await readFile('locales/ar.json','utf8'));
const concepts=JSON.parse(await readFile('concepts.json','utf8'));
test('the full preview journey exists in both languages with neutral Arabic copy',async()=>{
  assert.deepEqual(Object.keys(en).sort(),Object.keys(ar).sort());
  assert.equal(concepts.length,3);
  for(const [locale,prefix] of [['en',''],['ar','ar/']]){
    for(const path of ['index.html','cart.html','checkout.html',...concepts.map(item=>`products/${item.slug}/index.html`)]){
      const html=await readFile(`dist/${prefix}${path}`,'utf8');
      assert.match(html,new RegExp(`lang="${locale}"`));
      assert.match(html,/noindex,nofollow/);
      assert.match(html,/BUKHOOR/);
      assert.doesNotMatch(html,/ÉLAN|shopping-three-kappa|ffukncssuqmwlowdrbau|\{\{/);
      if(locale==='ar') assert.doesNotMatch(html,/اكتشفي|استكشفي|تصفحي|تواصلي|دعي|مساحتكِ|لكِ/);
    }
  }
  assert.doesNotMatch(JSON.stringify(ar),/اكتشفي|استكشفي|تصفحي|تواصلي|دعي|مساحتكِ|لكِ/);
});
test('concept pages stay illustrative and checkout cannot submit an order',async()=>{
  assert.ok(concepts.every(item=>item.slug && item.image && !('price_minor' in item) && !('stock_quantity' in item)));
  const checkout=await readFile('dist/checkout.html','utf8');
  assert.doesNotMatch(checkout,/<form|type="submit"|payment_intent|service_role/i);
  assert.match(checkout,/No order has been placed/);
  const detail=await readFile('dist/products/wood-chip-bakhoor/index.html','utf8');
  assert.match(detail,/Add to preview bag/);
  assert.match(detail,/Illustrative image — not the final product photo/);
  const config=await readFile('store-config.js','utf8');
  assert.match(config,/luybeingvgdkcsegxbbh/);
  assert.match(config,/mode: 'preview'/);
});

test('Arabic share routes use the Arabic 1200 × 630 social image',async()=>{
  const image=await readFile('assets/og-ar.jpg');
  assert.equal(image[0],0xff);
  assert.equal(image[1],0xd8);
  for(const path of ['index.html','cart.html','checkout.html',...concepts.map(item=>`products/${item.slug}/index.html`)]){
    const html=await readFile(`dist/ar/${path}`,'utf8');
    assert.match(html,/property="og:image" content="https:\/\/bukhoor-store\.vercel\.app\/assets\/og-ar\.jpg"/);
    assert.match(html,/name="twitter:image" content="https:\/\/bukhoor-store\.vercel\.app\/assets\/og-ar\.jpg"/);
    assert.match(html,/property="og:image:width" content="1200"/);
    assert.match(html,/property="og:image:height" content="630"/);
    assert.match(html,/property="og:locale" content="ar_AE"/);
    assert.match(html,/property="og:image:alt" content="متجر بخور/);
  }
  const english=await readFile('dist/index.html','utf8');
  assert.match(english,/property="og:image" content="https:\/\/bukhoor-store\.vercel\.app\/assets\/hero-bukhoor\.png"/);
});
