import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  const locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;
  const messageLocale = {
    en: 'en',
    de: 'de-CH',
    fr: 'fr-CH',
    it: 'it-CH',
  }[locale];

  return {
    locale,
    messages: (await import(`../messages/${messageLocale}`)).default,
  };
});
