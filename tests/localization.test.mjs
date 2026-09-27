import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const en=JSON.parse(await readFile('locales/en.json','utf8'));
const ar=JSON.parse(await readFile('locales/ar.json','utf8'));
test('the bilingual preview has matched translation keys and no handbag store references',async()=>{
  assert.deepEqual(Object.keys(en).sort(),Object.keys(ar).sort());
  for(const [locale,path] of [['en',''],['ar','ar/']]){
    const html=await readFile(`dist/${path}index.html`,'utf8');
    assert.match(html,new RegExp(`lang="${locale}"`));
    assert.match(html,/noindex,nofollow/);
    assert.match(html,/BUKHOOR/);
    assert.doesNotMatch(html,/ÉLAN|shopping-three-kappa|ffukncssuqmwlowdrbau|\{\{/);
  }
});
test('the concept catalog contains no prices or sellable inventory',async()=>{
  const source=await readFile('fixtures.js','utf8');
  assert.match(source,/Editorial examples only/);
  assert.doesNotMatch(source,/price_minor|stock_quantity/);
  const config=await readFile('store-config.js','utf8');
  assert.match(config,/luybeingvgdkcsegxbbh/);
  assert.match(config,/mode: 'preview'/);
});
