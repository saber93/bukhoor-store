(() => {
  const config = window.BUKHOOR_CONFIG;
  async function catalog() {
    if (config.mode !== 'supabase') throw new Error('Catalog connection is not enabled');
    const response = await fetch(`${config.apiBase}/catalog`, {signal:AbortSignal.timeout(15000)});
    if (!response.ok) throw new Error('Catalog unavailable');
    const data = await response.json();
    if (!Array.isArray(data.products)) throw new Error('Invalid catalog');
    return data;
  }
  window.BukhoorCommerce = {catalog};
})();
