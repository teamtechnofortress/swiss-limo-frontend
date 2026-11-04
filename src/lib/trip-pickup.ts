import { api } from './api';

export type TripPickupConfig =
  | {
      mode: 'selected';
      customAllowed: false;
      locations: TripPickupLocation[];
    }
  | {
      mode: 'custom';
      customAllowed: true;
      locations: TripPickupLocation[];
    };

export interface TripPickupLocation {
  id: number;
  name: string;
  placeId: string;
  address: string;
  durationMinutes: number;
}

interface ApiTripPickupResponse {
  data?: unknown;
}

function positiveInteger(value: unknown): number | null {
  return typeof value === 'number' && Number.isInteger(value) && value > 0 ? value : null;
}

function locationsFromApi(value: unknown): TripPickupLocation[] | null {
  if (!Array.isArray(value)) return null;

  const locations: TripPickupLocation[] = [];
  for (const rawLocation of value) {
    if (typeof rawLocation !== 'object' || rawLocation === null) return null;
    const location = rawLocation as {
      id?: unknown;
      name?: unknown;
      place_id?: unknown;
      address?: unknown;
      duration_minutes?: unknown;
    };
    const id = positiveInteger(location.id);
    const durationMinutes = positiveInteger(location.duration_minutes);
    if (
      !id || !durationMinutes ||
      typeof location.name !== 'string' ||
      typeof location.place_id !== 'string' ||
      typeof location.address !== 'string'
    ) return null;

    locations.push({
      id,
      name: location.name,
      placeId: location.place_id,
      address: location.address,
      durationMinutes,
    });
  }

  return locations;
}

function pickupConfigFromApi(value: unknown): TripPickupConfig | null {
  if (typeof value !== 'object' || value === null) return null;
  const config = value as { mode?: unknown; custom_allowed?: unknown; locations?: unknown };
  const locations = locationsFromApi(config.locations);

  if (!locations) return null;
  if (config.mode === 'selected' && config.custom_allowed === false) {
    return { mode: 'selected', customAllowed: false, locations };
  }
  if (config.mode === 'custom' && config.custom_allowed === true) {
    return { mode: 'custom', customAllowed: true, locations };
  }
  return null;
}

/** Loads the pickup selection for the first trip-booking step. */
export async function getTripPickupConfig(slug: string): Promise<TripPickupConfig | null> {
  const response = await api<ApiTripPickupResponse>(`/public/trips/${encodeURIComponent(slug)}/pickup-config`, {
    cache: 'no-store',
  });

  return pickupConfigFromApi(response.data);
}
