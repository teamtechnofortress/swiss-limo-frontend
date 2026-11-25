import type { AirportContent } from '@/content/airport';

const airportContent: AirportContent = {
  metadata: {
    title: 'Zurich Airport Transfer | Private Chauffeur from ZRH',
    description: 'Zurich Airport transfers with flight tracking, meet and greet and complimentary waiting time. Mercedes-Benz chauffeurs across Switzerland and Europe.',
  },
  hero: {
    eyebrow: 'Private airport transfer in Switzerland',
    title: 'Zurich Airport Transfer',
    tagline: 'Travel in Comfort. Arrive in Style.',
    description: 'Premium private airport transfers from Zurich Airport (ZRH) to your hotel, business meeting or any destination across Switzerland and Europe.',
    book: 'Book Airport Transfer',
    whatsapp: 'Chat on WhatsApp',
    imageAlt: 'Chauffeur in a dark suit opening the door of a black Mercedes-Benz at Zurich Airport',
    points: [{ lines: ['Flight', 'tracking'] }, { lines: ['Meet and', 'greet'] }, { lines: ['Flexible', 'waiting time'] }, { lines: ['Service across', 'Europe'] }],
  },
  quoteForm: {
    title: 'Get your transfer quote', description: 'Choose airport transfer, departure to the airport or round trip. Then enter your destination, date, time and passenger count.', journeyLabel: 'Journey type', arrivalTab: 'Airport Transfer', departureTab: 'To Airport (Departure)', roundTripTab: 'Round trip', pickupLocation: 'Pickup Location', destination: 'Destination', addressPlaceholder: 'Hotel / City / Address', date: 'Date', dateAria: 'Pickup date', time: 'Time', timeAria: 'Pickup time', passengers: 'Passengers', passenger: 'Passenger', passengersPlural: 'Passengers', submit: 'Get a Quote', locationError: 'Please choose an address from the suggestions.',
  },
  benefits: {
    title: 'Why Choose Our Zurich Airport Transfer?',
    description: 'A reliable, comfortable and tailored airport transfer service trusted by business and leisure travelers.',
    items: [
      { title: 'Flight Tracking', text: 'We monitor your flight so your chauffeur arrives on time, even when your flight is early or delayed.' },
      { title: 'Meet and Greet', text: 'Your chauffeur waits for you at arrivals with a name board.' },
      { title: 'Flexible Waiting Time', text: 'Complimentary waiting time is adjusted to your flight and arrival process.' },
      { title: 'Luxury Fleet', text: 'Travel in premium Mercedes-Benz vehicles designed for comfort and space.' },
      { title: 'Europe Coverage', text: 'Transfers from Zurich to all major cities in Switzerland and across Europe.' },
    ],
  },
  howItWorks: {
    imageAlt: 'Arrivals sign at Zurich Airport reading Welcome to Zurich', imageCaption: 'Welcome to Zurich.', title: 'How Our Airport Transfer Works',
    steps: [
      { title: 'Book Online', text: 'Request your transfer in minutes.' },
      { title: 'We Track Your Flight', text: 'Real-time monitoring keeps your pickup on schedule.' },
      { title: 'Meet and Greet', text: 'Your chauffeur welcomes you at arrivals.' },
      { title: 'Enjoy Your Ride', text: 'Relax in a luxury vehicle to your destination.' },
    ],
  },
  fleet: {
    title: 'Our Zurich Airport Transfer Fleet', description: 'Choose the vehicle that fits your group and luggage. Our fleet includes Mercedes-Benz sedans and a minivan, plus a Renault SUV.', viewAll: 'View All Vehicles', passengers: 'Up to {count} passengers', luggage: '{count} bags', empty: { title: 'Our vehicle selection will appear here shortly.', action: 'Request your transfer' },
  },
  destinations: {
    title: 'Popular Transfers from Zurich Airport', description: 'Private transfers from Zurich Airport to Switzerland’s most visited cities and mountain destinations.', viewAll: 'View All Destinations',
    items: [
      { name: 'Zurich City', time: 'About 20 minutes', imageAlt: 'Chauffeur helping a passenger at Zurich Airport' },
      { name: 'Lucerne', time: 'About 45 minutes', imageAlt: 'Chapel Bridge and tower in Lucerne' },
      { name: 'Interlaken', time: 'About 2 hours 10 minutes', imageAlt: 'Interlaken valley with Swiss Alps' },
      { name: 'Grindelwald', time: 'About 2 hours 20 minutes', imageAlt: 'Alpine village with snow-capped peaks in Grindelwald' },
      { name: 'Basel', time: 'About 1 hour', imageAlt: 'Basel old town skyline' },
      { name: 'Other European Cities', time: 'Transfers to Munich, Milan, Frankfurt and more.', imageAlt: 'European business-city skyline at blue hour' },
    ],
  },
  meetAndGreet: {
    title: 'Meet & Greet at Zurich Airport', description: 'After your flight, your professional chauffeur will wait for you in the arrivals hall with a personalized name board. They will help with your luggage and escort you to your vehicle.', checklist: ['Personalized airport pickup', 'Assistance with luggage', 'Comfortable, direct transfer'], imageAlt: 'Chauffeur waiting in the Zurich Airport arrivals hall with a name board',
  },
  travellers: {
    title: 'For Business and Leisure Travelers',
    items: [
      { title: 'Business Transfers', text: 'Punctual, discreet and professional airport transportation for corporate travelers.' },
      { title: 'Family Transfers', text: 'Spacious and comfortable vehicles for families, with child seats available on request.' },
    ],
  },
  faq: {
    title: 'Frequently Asked Questions', contact: 'Ask us something else',
    items: [
      { question: 'How do I book a Zurich Airport transfer?', answer: 'Enter your destination, date, time and passenger count in the booking form, or message us on WhatsApp. You can request your transfer in minutes.' },
      { question: 'Where will my chauffeur meet me at the airport?', answer: 'Your chauffeur meets you in the arrivals hall, holding a personalized name board with your name.' },
      { question: 'Do you track flights in case of delays?', answer: 'Yes. We monitor your flight in real time, so your pickup adjusts to your actual arrival time.' },
      { question: 'Can you transfer me to other European cities?', answer: 'Yes. We cover transfers from Zurich to major cities across Switzerland and Europe. Contact us for a quote on your route.' },
      { question: 'How long is the free waiting time?', answer: 'Every booking includes complimentary waiting time. We will confirm the exact duration for your booking.' },
      { question: 'Are child seats available?', answer: 'Yes, on request. Ask for child seats when you book.' },
    ],
  },
  cta: {
    titleBefore: 'Book Your', titleHighlight: 'Zurich Airport Transfer', titleAfter: 'Today', description: 'Reliable, comfortable and private transfers from Zurich Airport to Switzerland and Europe.', action: 'Book Now', whatsapp: 'Chat on WhatsApp',
  },
};

export default airportContent;
