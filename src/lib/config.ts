/** Public configuration. Only NEXT_PUBLIC_ values are available in the browser. */
export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api',
  brandName: process.env.NEXT_PUBLIC_BRAND_NAME ?? 'Swiss Aero Transfer',
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'hello@example.ch',
  contactPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? '+41 00 000 00 00',
  turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '',
  /** Countries offered in address search. Must match allowed_countries in the backend. */
  placeRegions: ['CH', 'DE', 'FR', 'AT', 'IT'],
} as const;
