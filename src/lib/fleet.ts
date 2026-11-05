import { api, ApiError } from './api';
import { config } from './config';
import type { Vehicle, VehicleCategory, VehicleMedia, VehicleMediaImage } from './types';

interface ApiVehicle {
  id?: unknown;
  slug?: unknown;
  name?: unknown;
  model_name?: unknown;
  category?: unknown;
  description?: unknown;
  passenger_capacity?: unknown;
  luggage_capacity?: unknown;
  price_per_km?: unknown;
  minimum_fare?: unknown;
  amenities?: unknown;
  media?: unknown;
  image?: unknown;
  gallery?: unknown;
  images?: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function categoryFromApi(value: unknown): VehicleCategory | null {
  const slug = isRecord(value) ? value.slug : value;

  if (slug === 'executive' || slug === 'van') return slug;
  if (slug === 'first-class' || slug === 'first_class') return 'first_class';

  return null;
}

function numberOrNull(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function mediaUrl(value: unknown): string | null {
  if (typeof value !== 'string' || value.length === 0) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (!value.startsWith('/')) return value;

  // The API may return Laravel's relative `/storage/...` path. Resolve it against
  // the backend origin rather than the Next.js site origin.
  return `${config.apiUrl.replace(/\/api\/?$/, '')}${value}`;
}

function mediaImageFromApi(value: unknown): VehicleMediaImage | null {
  if (!isRecord(value) || typeof value.id !== 'number' || !Number.isInteger(value.id)) return null;
  const url = mediaUrl(value.url);
  const thumbnail = value.thumbnail_url === null || value.thumbnail_url === undefined ? null : mediaUrl(value.thumbnail_url);
  const alt = value.alt === null || value.alt === undefined ? null : typeof value.alt === 'string' ? value.alt : null;
  return url && (value.thumbnail_url === null || value.thumbnail_url === undefined || thumbnail)
    ? { id: value.id, url, thumbnail_url: thumbnail, alt }
    : null;
}

function mediaFromApi(value: unknown): VehicleMedia {
  const media = isRecord(value) ? value : null;
  const cover = mediaImageFromApi(media?.cover);
  const gallery = Array.isArray(media?.gallery)
    ? media.gallery.flatMap((item) => {
      const image = mediaImageFromApi(item);
      return image ? [image] : [];
    })
    : [];

  return { cover, gallery };
}

/** Converts the public Laravel response into the shape used by the UI. */
function vehicleFromApi(vehicle: ApiVehicle): Vehicle | null {
  const category = categoryFromApi(vehicle.category);
  if (typeof vehicle.slug !== 'string' || typeof vehicle.name !== 'string' || !category) {
    return null;
  }

  const media = mediaFromApi(vehicle.media);
  const legacyImageUrl = isRecord(vehicle.image) ? mediaUrl(vehicle.image.url) : null;
  const legacyImageUrls = Array.isArray(vehicle.images)
    ? vehicle.images.flatMap((image) => typeof image === 'string' ? [mediaUrl(image)].filter((url): url is string => url !== null) : [])
    : legacyImageUrl ? [legacyImageUrl] : [];
  const imageUrls = media.cover || media.gallery.length > 0
    ? [media.cover?.url, ...media.gallery.map((image) => image.url)].filter((url): url is string => Boolean(url))
    : legacyImageUrls;

  return {
    ...(typeof vehicle.id === 'number' ? { id: vehicle.id } : {}),
    slug: vehicle.slug,
    name: vehicle.name,
    model_name: typeof vehicle.model_name === 'string' ? vehicle.model_name : null,
    category,
    description: typeof vehicle.description === 'string' ? vehicle.description : null,
    passenger_capacity: numberOrNull(vehicle.passenger_capacity) ?? 0,
    luggage_capacity: numberOrNull(vehicle.luggage_capacity) ?? 0,
    price_per_km: numberOrNull(vehicle.price_per_km),
    minimum_fare: numberOrNull(vehicle.minimum_fare),
    amenities: Array.isArray(vehicle.amenities)
      ? vehicle.amenities.filter((amenity): amenity is string => typeof amenity === 'string')
      : [],
    media,
    images: imageUrls,
  };
}

/**
 * Sample fleet used when the API is unreachable or has no vehicles yet.
 * Prices match the backend VehicleSeeder. Replace the copy and photos with your own.
 */
export const STATIC_FLEET: Vehicle[] = [
  {
    slug: 'mercedes-e-class',
    name: 'Mercedes E-Class',
    model_name: 'E 220d',
    category: 'executive',
    description:
      'The composed executive choice for business travel. A quiet cabin, generous rear legroom and a calm, confident ride.',
    passenger_capacity: 3,
    luggage_capacity: 3,
    price_per_km: 350,
    minimum_fare: 8000,
    amenities: ['wifi', 'water'],
    media: { cover: null, gallery: [] },
    images: [],
  },
  {
    slug: 'mercedes-s-class',
    name: 'Mercedes S-Class',
    model_name: 'S 350',
    category: 'first_class',
    description:
      'Our flagship saloon. Refined materials, rear-seat comfort and a level of quiet that makes long journeys feel short.',
    passenger_capacity: 3,
    luggage_capacity: 3,
    price_per_km: 470,
    minimum_fare: 10000,
    amenities: ['wifi', 'water', 'champagne'],
    media: { cover: null, gallery: [] },
    images: [],
  },
  {
    slug: 'mercedes-v-class',
    name: 'Mercedes V-Class',
    model_name: 'V 250',
    category: 'van',
    description:
      'Space for the whole party. Seven passengers with room for luggage, ideal for families, groups and wedding guests.',
    passenger_capacity: 7,
    luggage_capacity: 7,
    price_per_km: 380,
    minimum_fare: 9000,
    amenities: ['wifi', 'water'],
    media: { cover: null, gallery: [] },
    images: [],
  },
  {
    slug: 'byd-seal-u',
    name: 'BYD Seal U DM-i',
    model_name: 'Seal U DM-i',
    category: 'executive',
    description:
      'A modern, efficient executive hybrid. Smooth, silent and well equipped for city and motorway travel.',
    passenger_capacity: 4,
    luggage_capacity: 4,
    price_per_km: 300,
    minimum_fare: 7000,
    amenities: ['wifi'],
    media: { cover: null, gallery: [] },
    images: [],
  },
  {
    slug: 'mercedes-sprinter',
    name: 'Mercedes Sprinter',
    model_name: 'Sprinter',
    category: 'van',
    description:
      'Group travel for up to fourteen passengers. Ask us for a price for your route and date.',
    passenger_capacity: 14,
    luggage_capacity: 14,
    price_per_km: null,
    minimum_fare: null,
    amenities: [],
    media: { cover: null, gallery: [] },
    images: [],
  },
  {
    slug: 'mercedes-maybach',
    name: 'Mercedes Maybach',
    model_name: 'S 680',
    category: 'first_class',
    description:
      'The most exclusive car in our fleet, for travellers who expect the very best. Price on request.',
    passenger_capacity: 2,
    luggage_capacity: 2,
    price_per_km: null,
    minimum_fare: null,
    amenities: [],
    media: { cover: null, gallery: [] },
    images: [],
  },
];

export async function getVehicles(category?: string): Promise<Vehicle[]> {
  const apiCategory = category === 'first_class' ? 'first-class' : category;
  const query = apiCategory ? `?category=${encodeURIComponent(apiCategory)}` : '';

  try {
    const res = await api<{ data: ApiVehicle[] }>(`/public/vehicles${query}`, {
      next: { revalidate: 300 },
    });
    const vehicles = res.data.map(vehicleFromApi).filter((vehicle): vehicle is Vehicle => vehicle !== null);

    if (vehicles.length > 0) {
      return vehicles;
    }
  } catch {
    // The API is unreachable or the endpoint is not deployed yet. Use the sample fleet below.
  }

  return STATIC_FLEET.filter((v) => !category || v.category === category);
}

export async function getVehicle(slug: string): Promise<Vehicle | null> {
  try {
    const res = await api<{ data: ApiVehicle }>(`/public/vehicles/${encodeURIComponent(slug)}`, {
      next: { revalidate: 300 },
    });

    return vehicleFromApi(res.data);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
  }

  return STATIC_FLEET.find((v) => v.slug === slug) ?? null;
}
