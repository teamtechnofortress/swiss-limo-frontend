import type { VehicleCardCopy } from '@/lib/format';

export type FleetContent = {
  metadata: { title: string; description: string };
  hero: {
    eyebrow: string;
    title: string;
    titleHighlight: string;
    description: string;
    explore: string;
    bookRide: string;
    highlights: {
      executive: string;
      groups: string;
      luggage: string;
    };
  };
  listing: {
    eyebrow: string;
    title: string;
    description: string;
    vehicleCount: {
      singular: string;
      plural: string;
    };
    viewAll: string;
    categoriesLabel: string;
    categories: {
      all: string;
      executive: string;
      firstClass: string;
      van: string;
    };
  };
  empty: {
    title: string;
    description: string;
    action: string;
  };
  cta: {
    eyebrow: string;
    title: string;
    description: string;
    action: string;
  };
  vehicleCard: VehicleCardCopy;
  detail: {
    metadata: { notFound: string };
    fallbackDescription: string;
    booking: {
      title: string;
      description: string;
      requestQuote: string;
      bookNow: string;
      pricingNotice: string;
      enquire: string;
      passengers: string;
      luggage: string;
    };
    comfort: { eyebrow: string };
    concierge: { eyebrow: string; title: string; description: string; contact: string };
    amenities: Record<string, string>;
    gallery: {
      photosComingSoon: string;
      previous: string;
      next: string;
      photos: string;
      showPhoto: string;
      photoAlt: string;
    };
  };
};
