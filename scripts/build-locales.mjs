import {readFile,writeFile,mkdir,cp,rm} from 'node:fs/promises';
const dictionaries = Object.fromEntries(await Promise.all(['en','ar'].map(async locale => [locale,JSON.parse(await readFile(`locales/${locale}.json`,'utf8'))])));
const keys = Object.keys(dictionaries.en).sort();
if (JSON.stringify(keys) !== JSON.stringify(Object.keys(dictionaries.ar).sort())) throw new Error('English and Arabic translation keys differ');
const escape = value => String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
await rm('dist',{recursive:true,force:true});
await mkdir('dist/ar',{recursive:true});
await mkdir('dist/locales',{recursive:true});
await cp('assets','dist/assets',{recursive:true});
for(const file of ['styles.css','store-config.js','fixtures.js','commerce-client.js','i18n.js','app.js'])await cp(file,`dist/${file}`);
for(const locale of ['en','ar']){
  await writeFile(`dist/locales/${locale}.js`,`window.BUKHOOR_MESSAGES = Object.freeze(${JSON.stringify(dictionaries[locale])});\n`);
  for(const page of ['index.html','checkout.html']){
    const home=locale==='ar'?'/ar/':'/';
    const values={...dictionaries[locale],'@lang':locale,'@dir':locale==='ar'?'rtl':'ltr','@home':home,'@alternate':locale==='ar'?'/':'/ar/','@otherlang':locale==='ar'?'en':'ar','@otherlabel':locale==='ar'?'English':'العربية'};
    const template=await readFile(`templates/${page}`,'utf8');
    const html=template.replace(/\{\{([^{}]+)\}\}/g,(_,key)=>{if(!(key in values))throw new Error(`Missing ${locale}: ${key}`);return escape(values[key]);});
    await writeFile(`dist${home}${page}`,html);
  }
}
console.log('Built bilingual Bukhoor Store preview.');
