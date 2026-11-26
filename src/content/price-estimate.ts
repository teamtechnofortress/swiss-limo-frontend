export type PriceEstimateContent = {
  metadata: { title: string; description: string };
  hero: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    description: string;
    imageAlt: string;
  };
  form: {
    title: string;
    description: string;
    distance: string;
    distancePlaceholder: string;
    distanceHint: string;
    passengers: string;
    passengersHint: string;
    luggage: string;
    luggageHint: string;
    optional: string;
    submit: string;
    loading: string;
    distanceError: string;
    fallbackError: string;
  };
  results: {
    eyebrow: string;
    title: string;
    description: string;
    waitingTitle: string;
    waitingDescription: string;
    noResultsTitle: string;
    noResultsDescription: string;
    vehicleCount: string;
    category: string;
    seats: string;
    bags: string;
    estimatedFare: string;
    estimateNote: string;
    bookVehicle: string;
  };
  customQuote: {
    eyebrow: string;
    title: string;
    description: string;
    action: string;
    reassurance: string;
  };
};
