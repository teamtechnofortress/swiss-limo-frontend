export type AirportQuoteFormCopy = {
  title: string;
  description: string;
  journeyLabel: string;
  arrivalTab: string;
  departureTab: string;
  roundTripTab: string;
  pickupLocation: string;
  destination: string;
  addressPlaceholder: string;
  date: string;
  dateAria: string;
  time: string;
  timeAria: string;
  passengers: string;
  passenger: string;
  passengersPlural: string;
  submit: string;
  locationError: string;
};

export type AirportContent = {
  metadata: { title: string; description: string };
  hero: {
    eyebrow: string;
    title: string;
    tagline: string;
    description: string;
    book: string;
    whatsapp: string;
    imageAlt: string;
    points: { lines: [string, string] }[];
  };
  quoteForm: AirportQuoteFormCopy;
  benefits: {
    title: string;
    description: string;
    items: { title: string; text: string }[];
  };
  howItWorks: {
    imageAlt: string;
    imageCaption: string;
    title: string;
    steps: { title: string; text: string }[];
  };
  fleet: {
    title: string;
    description: string;
    viewAll: string;
    passengers: string;
    luggage: string;
    empty: { title: string; action: string };
  };
  destinations: {
    title: string;
    description: string;
    viewAll: string;
    items: { name: string; time: string; imageAlt: string }[];
  };
  meetAndGreet: {
    title: string;
    description: string;
    checklist: string[];
    imageAlt: string;
  };
  travellers: {
    title: string;
    items: { title: string; text: string }[];
  };
  faq: {
    title: string;
    contact: string;
    items: { question: string; answer: string }[];
  };
  cta: {
    titleBefore: string;
    titleHighlight: string;
    titleAfter: string;
    description: string;
    action: string;
    whatsapp: string;
  };
};
