import { api } from './api';
import { config } from './config';

interface PublicConfigResponse {
  data?: {
    site?: unknown;
    google_browser_key?: unknown;
    google_maps_browser_key?: unknown;
    currency?: unknown;
    turnstile_enabled?: unknown;
    turnstile_site_key?: unknown;
  };
}

export interface SiteSettings {
  name: string;
  logoUrl: string | null;
  contact: {
    email: string | null;
    phone: string | null;
    address: string | null;
  };
}

export interface PublicConfig {
  site: SiteSettings;
  googleMapsBrowserKey: string;
  currency: string;
  turnstileEnabled: boolean;
  turnstileSiteKey: string;
}

function stringOrNull(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

function recordOrNull(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null ? value as Record<string, unknown> : null;
}

/** Environment values keep the customer website usable while the config API is offline. */
export function fallbackPublicConfig(): PublicConfig {
  return {
    site: {
      name: config.brandName,
      logoUrl: null,
      contact: {
        email: config.contactEmail || null,
        phone: config.contactPhone || null,
        address: null,
      },
    },
    googleMapsBrowserKey: '',
    currency: 'CHF',
    turnstileEnabled: Boolean(config.turnstileSiteKey),
    turnstileSiteKey: config.turnstileSiteKey,
  };
}

/**
 * Loads browser-safe site settings from the Laravel API. `no-store` keeps the
 * website identity, contact information, and booking settings current.
 */
export async function getPublicConfig(): Promise<PublicConfig> {
  const { data = {} } = await api<PublicConfigResponse>('/public/config', { cache: 'no-store' });
  const site = recordOrNull(data.site);
  const contact = recordOrNull(site?.contact);

  return {
    site: {
      name: stringOrNull(site?.name) ?? config.brandName,
      logoUrl: stringOrNull(site?.logo_url),
      contact: {
        email: stringOrNull(contact?.email),
        phone: stringOrNull(contact?.phone),
        address: stringOrNull(contact?.address),
      },
    },
    googleMapsBrowserKey:
      typeof data.google_browser_key === 'string'
        ? data.google_browser_key
        : typeof data.google_maps_browser_key === 'string'
          ? data.google_maps_browser_key
          : '',
    currency: typeof data.currency === 'string' ? data.currency : '',
    turnstileEnabled: data.turnstile_enabled === true,
    turnstileSiteKey: typeof data.turnstile_site_key === 'string' ? data.turnstile_site_key : '',
  };
}
