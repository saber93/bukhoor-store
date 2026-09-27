import {readFile,writeFile,mkdir,cp,rm} from 'node:fs/promises';
const dictionaries = Object.fromEntries(await Promise.all(['en','ar'].map(async locale => [locale,JSON.parse(await readFile(`locales/${locale}.json`,'utf8'))])));
const concepts = JSON.parse(await readFile('concepts.json','utf8'));
const siteOrigin = new URL(process.env.PUBLIC_SITE_URL || 'https://bukhoor-store.vercel.app').origin;
const keys = Object.keys(dictionaries.en).sort();
if (JSON.stringify(keys) !== JSON.stringify(Object.keys(dictionaries.ar).sort())) throw new Error('English and Arabic translation keys differ');
if (new Set(concepts.map(item => item.slug)).size !== concepts.length || concepts.some(item => !/^[a-z0-9-]+$/.test(item.slug))) throw new Error('Invalid concept slugs');
const escape = value => String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const render = (template,values,locale) => template.replace(/\{\{([^{}]+)\}\}/g,(_,key)=>{
  if (!(key in values)) throw new Error(`Missing ${locale}: ${key}`);
  return escape(values[key]);
});
await rm('dist',{recursive:true,force:true});
await mkdir('dist/ar',{recursive:true});
await mkdir('dist/locales',{recursive:true});
await cp('assets','dist/assets',{recursive:true});
for(const file of ['styles.css','store-config.js','commerce-client.js','i18n.js','app.js','product.js','cart.js']) await cp(file,`dist/${file}`);
await writeFile('dist/fixtures.js',`window.BUKHOOR_CONCEPTS = Object.freeze(${JSON.stringify(concepts)});\n`);
for(const locale of ['en','ar']){
  const dictionary=dictionaries[locale];
  await writeFile(`dist/locales/${locale}.js`,`window.BUKHOOR_MESSAGES = Object.freeze(${JSON.stringify(dictionary)});\n`);
  const home=locale==='ar'?'/ar/':'/';
  const common={...dictionary,'@lang':locale,'@dir':locale==='ar'?'rtl':'ltr','@home':home,'@alternate':locale==='ar'?'/':'/ar/','@otherlang':locale==='ar'?'en':'ar','@otherlabel':locale==='ar'?'English':'العربية','@cart':`${home}cart.html`,'@checkout':`${home}checkout.html`,'@ogImage':`${siteOrigin}/assets/${locale==='ar'?'og-ar.jpg':'hero-bukhoor.png'}`,'@ogAlt':dictionary['Bukhoor Store share image'],'@ogWidth':locale==='ar'?'1200':'1672','@ogHeight':locale==='ar'?'630':'941','@ogMime':locale==='ar'?'image/jpeg':'image/png','@ogLocale':locale==='ar'?'ar_AE':'en_AE'};
  for(const page of ['index.html','cart.html','checkout.html']){
    const template=await readFile(`templates/${page}`,'utf8');
    await writeFile(`dist${home}${page}`,render(template,{...common,'@canonical':`${siteOrigin}${page==='index.html'?home:`${home}${page}`}`},locale));
  }
  const productTemplate=await readFile('templates/product.html','utf8');
  for(const item of concepts){
    const dir=`dist${home}products/${item.slug}`;
    await mkdir(dir,{recursive:true});
    const productPath=`${home}products/${item.slug}/`;
    const values={...common,'@canonical':`${siteOrigin}${productPath}`,'@slug':item.slug,'@productPath':productPath,'@alternateProduct':locale==='ar'?`/products/${item.slug}/`:`/ar/products/${item.slug}/`,'@productTitle':dictionary[item.title],'@productDescription':dictionary[item.description],'@productDetail':dictionary[item.detail],'@productMoment':dictionary[item.moment],'@productNote':dictionary[item.note],'@productImage':item.image,'@productCategory':dictionary[item.category==='bakhoor'?'Bakhoor':item.category==='oud'?'Oud':'Incense']};
    for(const key of ['@productTitle','@productDescription','@productDetail','@productMoment','@productNote']) if(!values[key]) throw new Error(`Missing ${locale} product copy: ${key}`);
    await writeFile(`${dir}/index.html`,render(productTemplate,values,locale));
  }
}
console.log('Built bilingual Bukhoor Store preview and product journey.');
