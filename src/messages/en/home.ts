import type { HomeContent } from '@/content/home';

/**
 * Homepage copy is deliberately separate from shared layout copy and API data.
 */
const homeContent: HomeContent = {
  metadata: {
    title: 'Private Chauffeur Switzerland | Zurich Airport Transfers',
    description: 'Book a private chauffeur in Switzerland. Zurich airport transfers, executive travel and fixed-price day tours in Mercedes-Benz vehicles. Book online today.',
  },
  hero: {
    eyebrow: 'Private Chauffeur Services in Switzerland',
    title: 'Swiss Chauffeur Service, Built Around Your Schedule',
    description: 'Airport pickups, private drivers and fixed-price tours across Switzerland.',
    bookTransfer: 'Book a Transfer',
    exploreDayTrips: 'Explore Day Trips',
    trustBadges: [
      { title: 'Rated 4.9/5', subtitle: 'by clients' },
      { title: 'Trusted by 10,000+', subtitle: 'travelers' },
      { title: '24/7', subtitle: 'support' },
      { title: 'Swiss', subtitle: 'service quality' },
    ],
    transferTab: 'Find your transfer',
    dayTripTab: 'Day Trip / Tour',
    formDescription: 'Enter your pickup location, destination, date, time and passenger count to see available vehicles and fixed prices.',
    pickupLabel: 'Pickup Location',
    pickupPlaceholder: 'Zurich Airport (ZRH)',
    destinationLabel: 'Destination',
    destinationPlaceholder: 'Lucerne, Switzerland',
    dateLabel: 'Date',
    timeLabel: 'Time',
    passengersLabel: 'Passengers',
    passengers: [1, 2, 3, 4, 5, 6, 7].map((value) => ({ value, label: `${value} Passenger${value === 1 ? '' : 's'}` })),
    submitLabel: 'Book Now',
  },
  services: {
    eyebrow: 'Chauffeur Services',
    title: 'Premium Chauffeur Services Across Switzerland',
    description: 'From airport pickups to executive travel and scenic long-distance routes, our chauffeur services cover every type of journey in Switzerland.',
    items: [
      { icon: 'plane', title: 'Airport Transfers', text: 'Reliable airport pickups and drop-offs at Zurich and other Swiss airports. Your driver tracks your flight, so a delay never leaves you waiting at the curb.', image: '/images/home/service-airport.jpg', imageAlt: 'Mercedes-Benz chauffeur car on the tarmac at Zurich Airport with a Swiss passenger jet' },
      { icon: 'briefcase', title: 'Private Chauffeur Hire', text: 'Hire a professional driver by the hour or by the day for meetings, shopping, sightseeing or events. One driver, one vehicle, and your schedule.', image: '/images/home/service-chauffeur.jpg', imageAlt: 'Professional chauffeur opening a car door for a client' },
      { icon: 'users', title: 'Corporate Travel', text: 'Discreet, punctual transport for executives and business teams. Work on the road in a quiet, comfortable cabin with reliable timing for every appointment.', image: '/images/home/service-corporate.jpg', imageAlt: 'Business traveler working on a laptop in the back seat of a chauffeur-driven car' },
      { icon: 'mapPin', title: 'Long-Distance Transfers', text: 'Comfortable intercity travel between Swiss cities, ski resorts and lakeside towns, with no train changes and no parking worries.', image: '/images/home/service-long-distance.jpg', imageAlt: 'Mercedes sedan driving along a scenic Swiss lakeside road with mountains in the background' },
    ],
    airport: {
      imageAlt: 'Mercedes-Benz chauffeur car parked outside Zurich Airport terminal',
      title: 'Zurich Airport Transfer: Private Chauffeur from ZRH',
      description: 'Start your Swiss journey with a private chauffeur from Zurich Airport (ZRH) to your hotel, business meeting or final destination anywhere in Switzerland. Your driver meets you inside the terminal with a name sign, helps with your luggage and takes you directly to your door in a premium Mercedes-Benz.',
      features: [
        { icon: 'plane', text: 'Airport pickup\nand drop-off' },
        { icon: 'clock', text: 'Flight\ntracking' },
        { icon: 'users', text: 'Meet and\ngreet' },
        { icon: 'car', text: 'Premium\nMercedes fleet' },
      ],
      action: 'Book Your Transfer',
    },
  },
  trips: {
    regionLabel: 'Featured day trips and tours',
    eyebrow: 'Featured private journeys',
    title: 'Private Day Trips and Tours from Zurich',
    description: 'Explore Switzerland at your own pace. Every tour is private, so you choose the stops, the timing and the pace.',
    viewAll: 'View All Tours',
    details: 'Details',
    bookNow: 'Book Now',
    upNext: 'Up next',
    playSlideshow: 'Play slideshow',
    pauseSlideshow: 'Pause slideshow',
    previousTrip: 'Previous trip',
    nextTrip: 'Next trip',
    priceFrom: 'From',
    priceLabel: 'Pricing',
    priceOnRequest: 'On request',
    routeBased: 'Route based',
  },
  fleet: {
    eyebrow: 'Our Fleet',
    title: 'Our Luxury Fleet: Mercedes-Benz Chauffeur Vehicles',
    description: 'Every vehicle is clean, climate-controlled and driven by a professional chauffeur. Base fares include the first 16 km.',
    viewAll: 'View All Vehicles',
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
  benefits: {
    title: 'Why Choose Swiss Aero Transfer?',
    description: 'Our clients choose us for the details that make a difference.',
    items: [
      { icon: 'swiss', title: 'Swiss Quality and Precision', text: 'Punctual service, planned routes and attention to every detail.' },
      { icon: 'users', title: 'Professional Chauffeurs', text: 'Experienced chauffeurs who know Switzerland well.' },
      { icon: 'gem', title: 'Luxury and Comfort', text: 'Premium vehicles with climate control, quiet cabins and a smooth ride.' },
      { icon: 'clock', title: 'Reliable and On-Time', text: 'Flight tracking and live updates keep you on schedule.' },
      { icon: 'shieldCheck', title: 'Safe and Secure Booking', text: 'Transparent, fixed pricing with secure online payment.' },
    ],
  },
  quote: {
    title: 'Get a Personalized Quote Today',
    description: 'Plan your trip with our travel experts and receive a custom offer. Reply within one business day, or message us on WhatsApp for a quick answer.',
    request: 'Request a Quote',
    whatsapp: 'WhatsApp Us',
  },
  faqs: {
    title: 'Frequently Asked Questions',
    items: [
      { question: 'How much does a private transfer from Zurich Airport cost?', answer: 'Prices start at CHF 69 for an E-Class sedan and include the first 16 km. Your exact fare depends on the vehicle and destination, and you can see it when you book.' },
      { question: 'Do you track flights?', answer: 'Yes. We monitor your flight, so your driver arrives on time even if your flight is early or delayed.' },
      { question: 'Can I book a driver for the whole day?', answer: 'Yes. Our private chauffeur hire covers hourly or full-day bookings for sightseeing, meetings and events.' },
      { question: 'How many passengers can ride in one vehicle?', answer: 'The E-Class and S-Class seat up to 3 passengers. The V-Class seats up to 7 passengers.' },
      { question: 'Are your day tours private?', answer: 'Yes. Every tour is private, with only your group in the vehicle.' },
    ],
  },
};

export default homeContent;

