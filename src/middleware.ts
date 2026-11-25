import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/' || /^\/(en|de-CH|fr-CH|it-CH)(?:\/.*)?$/.test(pathname)) {
    return intlMiddleware(request);
  }
}

export const config = {
  matcher: ['/', '/(en|de-CH|fr-CH|it-CH)/:path*'],
};
