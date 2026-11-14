'use client';

import { useEffect, useRef } from 'react';
import { config } from '@/lib/config';

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: Record<string, unknown>) => string;
      remove?: (widgetId?: string) => void;
    };
  }
}

/**
 * Cloudflare Turnstile bot check. Each token is single-use, so mount a fresh widget
 * for every submission. With no site key set, the token stays null (the backend
 * accepts that only when bot checks are switched off).
 */
export function Turnstile({
  onToken,
  siteKey = '',
  theme = 'dark',
}: {
  onToken: (token: string | null) => void;
  siteKey?: string;
  theme?: 'light' | 'dark';
}) {
  const container = useRef<HTMLDivElement>(null);
  const callback = useRef(onToken);
  const effectiveSiteKey = siteKey || config.turnstileSiteKey;

  useEffect(() => {
    callback.current = onToken;
  }, [onToken]);

  useEffect(() => {
    if (!effectiveSiteKey) {
      callback.current(null);
      return;
    }

    let widgetId: string | undefined;

    const render = () => {
      if (!container.current || !window.turnstile) return;

      widgetId = window.turnstile.render(container.current, {
        sitekey: effectiveSiteKey,
        theme,
        callback: (token: string) => callback.current(token),
        'expired-callback': () => callback.current(null),
        'error-callback': () => callback.current(null),
      });
    };

    if (window.turnstile) {
      render();
    } else {
      let script = document.querySelector<HTMLScriptElement>('script[data-turnstile]');

      if (!script) {
        script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.dataset.turnstile = 'true';
        document.head.appendChild(script);
      }

      script.addEventListener('load', render);
    }

    return () => {
      if (widgetId && window.turnstile?.remove) {
        window.turnstile.remove(widgetId);
      }
    };
  }, [effectiveSiteKey, theme]);

  return <div ref={container} className="min-h-[65px]" aria-label="Security verification" />;
}
