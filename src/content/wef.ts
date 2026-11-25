export type WefContent = {
  metadata: { title: string; description: string };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    quoteAction: string;
    whatsapp: string;
    imageAlt: string;
    points: { lines: [string, string] }[];
  };
  info: { title: string; text: string }[];
  services: {
    title: string;
    description: string;
    items: { title: string; text: string }[];
    airport: {
      imageAlt: string;
      title: string;
      description: string;
      action: string;
      durationLabel: string;
      duration: string;
      distanceLabel: string;
      distance: string;
    };
  };
  quote: { eyebrow: string; title: string; description: string };
  quoteForm: {
    pickupDate: string;
    returnDate: string;
    pickupLocation: string;
    pickupPlaceholder: string;
    destination: string;
    destinationPlaceholder: string;
    passengers: string;
    select: string;
    vehiclePreference: string;
    anyVehicle: string;
    fullName: string;
    phone: string;
    email: string;
    additionalRequirements: string;
    requirementsPlaceholder: string;
    securityTitle: string;
    securityDescription: string;
    securityError: string;
    fallbackError: string;
    thankYou: string;
    reference: string;
    submitting: string;
    submit: string;
    confirmation: string;
  };
  fleet: {
    title: string;
    viewAll: string;
    description: string;
    passengers: string;
    empty: string;
  };
  why: { title: string; description: string; items: { title: string; text: string }[] };
  faq: { title: string; contact: string; items: { question: string; answer: string }[] };
  cta: {
    titleBefore: string;
    titleHighlight: string;
    titleAfter: string;
    description: string;
    action: string;
    whatsapp: string;
    imageAlt: string;
  };
  disclaimer: string;
};
