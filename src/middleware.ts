import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);
const legacyLocaleAliases: Record<string, string> = {
  'de-CH': 'de',
  'fr-CH': 'fr',
  'it-CH': 'it',
};

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const legacyLocale = pathname.match(/^\/(de-CH|fr-CH|it-CH)(\/|$)/)?.[1];

  if (legacyLocale) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(`/${legacyLocale}`, `/${legacyLocaleAliases[legacyLocale]}`);
    return NextResponse.redirect(url, 308);
  }

  if (pathname === '/' || /^\/(en|de|fr|it)(?:\/.*)?$/.test(pathname)) {
    return intlMiddleware(request);
  }
}

export const config = {
  matcher: ['/', '/(en|de|fr|it|de-CH|fr-CH|it-CH)/:path*'],
};
