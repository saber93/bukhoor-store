(() => {
  const locale = document.documentElement.lang === 'ar' ? 'ar' : 'en';
  const dictionary = window.BUKHOOR_MESSAGES || {};
  const t = key => dictionary[key] || key;
  const money = fils => new Intl.NumberFormat(locale === 'ar' ? 'ar-AE' : 'en-AE', {style:'currency',currency:'AED'}).format(fils / 100);
  window.BukhoorI18n = {locale,t,money};
})();
