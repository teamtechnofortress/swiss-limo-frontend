import type { TripsContent } from '@/content/trips';

const tripsContent: TripsContent = {
  metadata: {
    title: 'Day trips & tours',
    description: 'Private chauffeur-driven day trips, tours and tailored journeys across Europe.',
  },
  hero: {
    eyebrow: 'Private day trips & tours',
    title: 'Your journey,',
    titleHighlight: 'your way.',
    description: 'Explore the places you care about, from iconic cities to alpine landscapes and cross-border escapes. Your private chauffeur takes care of the road while you enjoy the day your way.',
    explore: 'Explore our journeys',
    customDay: 'Plan a custom day',
    highlights: { chauffeur: 'Private chauffeur', itinerary: 'Flexible itinerary', planning: 'Tailored planning' },
  },
  listing: {
    eyebrow: 'Curated journeys',
    title: 'Find the journey that fits your day.',
    description: 'Explore our private experiences, then personalise the route and details with our team.',
    count: { singular: '{count} journey available', plural: '{count} journeys available' },
  },
  unavailable: {
    title: 'Journeys are currently unavailable.',
    description: 'Our team can still help you arrange a private day around your plans.',
    action: 'Plan a custom trip',
  },
  empty: {
    title: 'More journeys are on their way.',
    description: 'Tell us where you would like to go and we will create a private journey around your plans.',
    action: 'Ask for a custom trip',
  },
  pagination: { label: 'Trip pages', previous: 'Previous', next: 'Next', status: 'Page {page} of {lastPage}' },
  cta: {
    eyebrow: 'A day designed around you',
    title: 'Have somewhere else in mind?',
    description: 'Share your plans and we’ll help arrange a private journey that suits your timing, interests and group.',
    action: 'Start planning',
  },
  card: {
    pricingLabels: { fixed: 'Fixed-price journey', distance: 'Route-based pricing', enquiry: 'Tailored on request' },
    from: 'From',
    pricing: 'Pricing',
    onRequest: 'On request',
    routeQuote: 'Quote for your route',
  },
};

export default tripsContent;
