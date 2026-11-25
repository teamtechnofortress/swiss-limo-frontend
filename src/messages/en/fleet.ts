import type { FleetContent } from '@/content/fleet';

const fleetContent: FleetContent = {
  metadata: {
    title: 'Our fleet',
    description: 'Executive, first class and van chauffeur vehicles. Transparent per-kilometre pricing.',
  },
  hero: {
    eyebrow: 'Our fleet',
    title: 'A fleet chosen for',
    titleHighlight: 'every journey.',
    description: 'From refined executive saloons to spacious vans, choose the vehicle that gives your journey the right balance of comfort, space and presence.',
    explore: 'Explore the fleet',
    bookRide: 'Book your ride',
    highlights: {
      executive: 'Executive & first class',
      groups: 'Options for every group',
      luggage: 'Luggage capacity shown',
    },
  },
  listing: {
    eyebrow: 'Choose your vehicle',
    title: 'Comfort, matched to your plans.',
    description: 'Compare capacity and pricing, then choose the vehicle that works best for your party and luggage.',
    vehicleCount: {
      singular: '{count} vehicle available',
      plural: '{count} vehicles available',
    },
    viewAll: 'View all vehicles',
    categoriesLabel: 'Vehicle categories',
    categories: {
      all: 'All vehicles',
      executive: 'Executive',
      firstClass: 'First class',
      van: 'Vans',
    },
  },
  empty: {
    title: 'No vehicles are available in this category.',
    description: 'Please choose another category to explore the fleet.',
    action: 'View all vehicles',
  },
  cta: {
    eyebrow: 'Not sure which vehicle is right?',
    title: 'Start with your journey.',
    description: 'Enter your route, party size and luggage, then view the vehicles available for your plans.',
    action: 'Find your vehicle',
  },
  vehicleCard: {
    categories: { executive: 'Executive', first_class: 'First class', van: 'Vans' },
    viewVehicle: 'View {vehicle}',
    passengerCapacity: 'Up to {count}',
    luggageCapacity: '{count} bags',
    requestQuote: 'Request a quote',
    bookNow: 'Book now',
    pricing: 'Pricing',
    priceOnRequest: 'Price on request',
    getQuote: 'Get a quote',
    startingFrom: 'Starting from',
    baseFare: 'Base fare',
    baseFareIncludesFirstKm: 'Base fare · includes first {distance} km',
    minimumFare: 'Minimum fare',
  },
  detail: {
    metadata: { notFound: 'Vehicle not found' },
    fallbackDescription: 'Private chauffeur travel for airport transfers, business trips and personal journeys.',
    booking: { title: 'Book your ride', description: 'Your chauffeur, vehicle and final route price are confirmed before payment.', requestQuote: 'Request a quote', bookNow: 'Book now', pricingNotice: 'Final pricing, including VAT, is shown with your route and travel details before payment.', enquire: 'Enquire now', passengers: 'Up to {count} passengers', luggage: 'Up to {count} bags' },
    comfort: { eyebrow: 'On-board comfort' },
    concierge: { eyebrow: 'Concierge service', title: 'Need help choosing?', description: 'Not sure if {vehicle} is right for your trip? Our team can help you choose.', contact: 'Contact our team' },
    amenities: { wifi: 'Wi-Fi', water: 'Chilled water', champagne: 'Champagne service', leather: 'Leather seating' },
    gallery: { photosComingSoon: 'Photos coming soon', previous: 'Previous vehicle photo', next: 'Next vehicle photo', photos: 'Vehicle photos', showPhoto: 'Show photo {count}', photoAlt: '{vehicle}, photo {count}' },
  },
};

export default fleetContent;
