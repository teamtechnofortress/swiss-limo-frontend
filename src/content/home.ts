import type { VehicleCardCopy } from '@/lib/format';

export type HomeIcon =
  | 'plane'
  | 'briefcase'
  | 'car'
  | 'clock'
  | 'gem'
  | 'mapPin'
  | 'shieldCheck'
  | 'users';


export type HomeContent = {
  metadata: { title: string; description: string };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    bookTransfer: string;
    exploreDayTrips: string;
    trustBadges: { title: string; subtitle: string }[];
    transferTab: string;
    dayTripTab: string;
    formDescription: string;
    pickupLabel: string;
    pickupPlaceholder: string;
    destinationLabel: string;
    destinationPlaceholder: string;
    dateLabel: string;
    timeLabel: string;
    passengersLabel: string;
    passengers: { value: number; label: string }[];
    submitLabel: string;
  };
  services: {
    eyebrow: string;
    title: string;
    description: string;
    items: { icon: HomeIcon; title: string; text: string; image: string; imageAlt: string }[];
    airport: {
      imageAlt: string;
      title: string;
      description: string;
      features: { icon: HomeIcon; text: string }[];
      action: string;
    };
  };
  trips: {
    regionLabel: string;
    eyebrow: string;
    title: string;
    description: string;
    viewAll: string;
    details: string;
    bookNow: string;
    upNext: string;
    playSlideshow: string;
    pauseSlideshow: string;
    previousTrip: string;
    nextTrip: string;
    priceFrom: string;
    priceLabel: string;
    priceOnRequest: string;
    routeBased: string;
  };
  fleet: { eyebrow: string; title: string; description: string; viewAll: string };
  vehicleCard: VehicleCardCopy;
  benefits: {
    title: string;
    description: string;
    items: { icon: HomeIcon | 'swiss'; title: string; text: string }[];
  };
  quote: { title: string; description: string; request: string; whatsapp: string };
  faqs: { title: string; items: { question: string; answer: string }[] };
};
