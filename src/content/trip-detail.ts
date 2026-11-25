import type { TripBookingBlockedReason } from '@/lib/trips';

export type TripDetailContent = {
  metadata: { notFound: string; unavailable: string };
  hero: { eyebrow: string; book: string; enquire: string; explore: string };
  glance: {
    label: string;
    duration: string;
    pickupReturn: string;
    stops: string;
    countries: string;
    privateExperience: string;
    personalisedItinerary: string;
    pickupLocations: string;
    destinations: string;
    country: string;
    countriesPlural: string;
  };
  duration: { minutes: string; hour: string; hours: string; hoursWithMinutes: string };
  sections: {
    overview: string;
    countries: string;
    stops: string;
    stopsCount: string;
    gallery: string;
    itinerary: string;
    goodToKnow: string;
  };
  sidebar: {
    title: string;
    privateJourney: string;
    startingFrom: string;
    finalPrice: string;
    routePricing: string;
    routePricingDescription: string;
    priceOnRequest: string;
    priceOnRequestDescription: string;
    book: string;
    enquire: string;
    helpTitle: string;
    helpText: string;
    contactTeam: string;
    pickupLocations: string;
    blocked: Record<TripBookingBlockedReason, string>;
  };
  faq: { title: string };
  gallery: {
    photo: string;
    photos: string;
    openPhoto: string;
    showFewer: string;
    viewAll: string;
  };
};
