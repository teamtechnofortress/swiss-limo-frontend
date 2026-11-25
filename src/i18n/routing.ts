import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'de-CH', 'fr-CH', 'it-CH'],
  defaultLocale: 'en',
  localePrefix: 'always',
});
