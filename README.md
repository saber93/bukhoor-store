# Bukhoor Store storefront

A separate bilingual storefront for the Bukhoor Store brand, forked from the Élan storefront structure and tailored to incense. The new GitHub repository is `saber93/bukhoor-store`. The project is a **concept preview**: the three cards illustrate bakhoor, oud and incense types, with original generated artwork. They are not customer products, prices or stock. The Noon page was a category reference only; no Noon listing text or photos were copied.

The intended backend project is `https://luybeingvgdkcsegxbbh.supabase.co`. `store-config.js` contains that public address but the site remains in `preview` mode until the new database, Edge Function, verified catalog and storefront deployment are ready. The checkout page explains that ordering is closed. No payment credentials or customer data from the Élan store are included.

Build and preview locally:

```sh
node scripts/build-locales.mjs
node --test tests/*.test.mjs
python3 -m http.server 8000 --directory dist
```

Open `/` for English and `/ar/` for Arabic. Both pages request `noindex`. The Vercel configuration publishes the generated `dist/` directory. Add the final domain and product photography before opening orders or search indexing.

The separate Admin/backend code is in `/Users/me/Downloads/bukhoor-admin`. The existing Élan projects are independent.
