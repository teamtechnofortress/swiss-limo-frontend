export type TripCardCopy = {
  pricingLabels: {
    fixed: string;
    distance: string;
    enquiry: string;
  };
  from: string;
  pricing: string;
  onRequest: string;
  routeQuote: string;
};

export type TripsContent = {
  metadata: { title: string; description: string };
  hero: {
    eyebrow: string;
    title: string;
    titleHighlight: string;
    description: string;
    explore: string;
    customDay: string;
    highlights: { chauffeur: string; itinerary: string; planning: string };
  };
  listing: {
    eyebrow: string;
    title: string;
    description: string;
    count: { singular: string; plural: string };
  };
  unavailable: { title: string; description: string; action: string };
  empty: { title: string; description: string; action: string };
  pagination: { label: string; previous: string; next: string; status: string };
  cta: { eyebrow: string; title: string; description: string; action: string };
  card: TripCardCopy;
};
