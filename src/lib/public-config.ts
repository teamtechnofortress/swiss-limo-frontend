import { api } from './api';
import { config } from './config';

interface PublicConfigPayload {
  service_area?: unknown;
  site?: unknown;
  google_browser_key?: unknown;
  google_maps_browser_key?: unknown;
  currency?: unknown;
  turnstile_enabled?: unknown;
  turnstile_site_key?: unknown;
}

interface PublicConfigResponse extends PublicConfigPayload {
  data?: PublicConfigPayload;
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
  serviceArea: {
    enforced: boolean;
    allowedCountries: string[];
  };
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
    serviceArea: { enforced: true, allowedCountries: [...config.placeRegions] },
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
  const response = await api<PublicConfigResponse>('/public/config', { cache: 'no-store' });
  const data = response.data ?? response;
  const site = recordOrNull(data.site);
  const contact = recordOrNull(site?.contact);
  const serviceArea = recordOrNull(data.service_area);
  const countries = serviceArea?.allowed_countries;
  const validCountries = Array.isArray(countries)
    && countries.length > 0
    && countries.length <= 15
    && countries.every((country): country is string =>
      typeof country === 'string' && /^[a-z]{2}$/i.test(country));
  const validServiceArea = typeof serviceArea?.enforced === 'boolean'
    && (serviceArea.enforced === false || validCountries);

  return {
    serviceArea: validServiceArea
      ? {
          enforced: serviceArea!.enforced === true,
          allowedCountries: validCountries ? countries.map((country) => country.toUpperCase()) : [],
        }
      : { enforced: true, allowedCountries: [...config.placeRegions] },
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
