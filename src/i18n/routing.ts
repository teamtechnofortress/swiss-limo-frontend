import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'de', 'fr', 'it'],
  defaultLocale: 'en',
  localeDetection: true,
  localePrefix: 'always',
});
