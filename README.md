# Bukhoor Store storefront

A separate bilingual storefront for the Bukhoor Store brand. The GitHub repository is `saber93/bukhoor-store`. The project is a **concept preview**: the three examples illustrate bakhoor, oud and incense types, with original generated artwork. They are not customer products, prices or stock. The Noon page was a category reference only; no Noon listing text or photos were copied.

The intended backend project is `https://luybeingvgdkcsegxbbh.supabase.co`. `store-config.js` contains that public address but the site remains in `preview` mode until the new database, Edge Function and verified catalog are ready. Visitors can browse dedicated English and Arabic concept pages, save examples in a local preview bag, and review a checkout preview. No customer details, orders or payments are collected. No credentials or customer data from the other store are included.

Build and preview locally:

```sh
node scripts/build-locales.mjs
node --test tests/*.test.mjs
python3 -m http.server 8000 --directory dist
```

Open `/` for English and `/ar/` for Arabic. Product pages are under `/products/<slug>/` and `/ar/products/<slug>/`; the bag and checkout preview also exist in both languages. Every preview page requests `noindex`. The Vercel configuration publishes the generated `dist/` directory. Add the actual products and photography before opening orders or search indexing.

Arabic routes share the branded [Arabic Open Graph image](assets/og-ar.jpg). English routes use the existing hero image. The build defaults to `https://bukhoor-store.vercel.app` for absolute social image and page URLs; set `PUBLIC_SITE_URL` during build if the production domain changes.

The separate Admin/backend code is in `/Users/me/Downloads/bukhoor-admin`. The existing Élan projects are independent.
