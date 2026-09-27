# Setup status

- GitHub source: `saber93/bukhoor-store` and `saber93/bukhoor-admin`.
- Intended Supabase project: `luybeingvgdkcsegxbbh`.
- Current storefront: bilingual concept preview with three illustrative examples, dedicated detail pages, a local preview bag, and a checkout review page. Ordering stays closed; no personal or payment information is requested.
- Current Admin: a separate copy configured for the new project URL. Sign-in requires the new project's publishable key and an authorized Admin user.
- Product examples were inspired by the general categories on [Noon’s UAE incense page](https://www.noon.com/uae-en/home-and-kitchen/home-decor/home-fragrance/incense-and-incense-holders/incense/). No Noon assets, reviews, prices, or stock were copied.

Before connecting live products: inspect the new Supabase project's schema, apply reviewed commerce migrations, deploy the Edge Function with new project secrets, set its CORS origins after choosing Vercel domains, and enter the owner's actual product records and photos. Keep sample concepts separate from those records. Confirm shipping, tax and business terms for this brand before checkout opens.
