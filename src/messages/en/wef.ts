import type { WefContent } from '@/content/wef';

const wefContent: WefContent = {
  metadata: {
    title: 'WEF Davos 2027 Chauffeur Transfers | Swiss Aero Transfer',
    description: 'Private chauffeur and transfer service for WEF Davos 2027 delegates. Zurich Airport to Davos, St. Moritz transfers and executive vehicles. Request your quote.',
  },
  hero: {
    eyebrow: 'World Economic Forum',
    title: 'WEF Davos 2027 Chauffeur and Transfer Service',
    description: 'Private, reliable and discreet transportation for delegates, executives and visitors attending the World Economic Forum Annual Meeting in Davos.',
    quoteAction: 'Request Your WEF 2027 Quote',
    whatsapp: 'Chat on WhatsApp',
    imageAlt: 'Chauffeur in a dark uniform opening the rear door of a black Mercedes-Benz at Zurich Airport',
    points: [
      { lines: ['Zurich Airport', 'transfers'] },
      { lines: ['WEF event', 'transportation'] },
      { lines: ['Hourly and', 'standby service'] },
      { lines: ['Executive and', 'group travel'] },
    ],
  },
  info: [
    { title: 'WEF Annual Meeting 2027', text: '18 to 22 January 2027' },
    { title: 'Davos-Klosters', text: 'Switzerland' },
    { title: 'For delegates, executives', text: 'and guests' },
    { title: 'All enquiries welcome.', text: 'Availability and pricing on request.' },
  ],
  services: {
    title: 'Our WEF 2027 Transfer Services',
    description: 'Flexible and tailored chauffeur solutions for the World Economic Forum, with service options to suit individual, corporate and delegation needs.',
    items: [
      { title: 'Zurich Airport Transfers', text: 'Private transfers from Zurich Airport (ZRH) to Davos, St. Moritz and other destinations.' },
      { title: 'Davos Chauffeur Service', text: 'Dedicated transportation in Davos for meetings, hotels and event venues.' },
      { title: 'St. Moritz Transfers', text: 'Comfortable private transfers to St. Moritz and nearby resorts.' },
      { title: 'Hourly Chauffeur Service', text: 'A vehicle with a professional driver at your disposal for meetings and events.' },
      { title: 'Executive and Delegation Travel', text: 'Premium transportation for executives, teams and VIP guests.' },
      { title: 'Special Event Transportation', text: 'Tailored transfers for WEF events, private dinners and corporate gatherings.' },
    ],
    airport: {
      imageAlt: 'Black Mercedes-Benz chauffeur car at Zurich Airport at dusk',
      title: 'Zurich Airport to Davos',
      description: 'A seamless and comfortable journey from Zurich Airport to Davos for the WEF Annual Meeting. The drive takes about 2 hours 30 minutes and covers approximately 150 km.',
      action: 'Request a Transfer Quote',
      durationLabel: 'Approximately',
      duration: '2 hours 30 minutes',
      distanceLabel: 'Approximately',
      distance: '150 km',
    },
  },
  quote: {
    eyebrow: 'Quote request',
    title: 'Request Your WEF 2027 Quote',
    description: 'Share your travel details and our team will get back to you with a tailored offer and availability.',
  },
  quoteForm: {
    pickupDate: 'Pickup Date', returnDate: 'Return Date', pickupLocation: 'Pickup Location', pickupPlaceholder: 'e.g. Zurich Airport (ZRH)', destination: 'Destination', destinationPlaceholder: 'e.g. Davos / St. Moritz', passengers: 'Passengers', select: 'Select', vehiclePreference: 'Vehicle Preference', anyVehicle: 'Any / E-Class / S-Class / V-Class', fullName: 'Full Name', phone: 'Phone', email: 'Email', additionalRequirements: 'Additional Requirements', requirementsPlaceholder: 'Tell us about your travel plan, meetings, or any special requests.', securityTitle: 'Security verification is required before sending your quote request.', securityDescription: 'This helps protect our team from automated messages.', securityError: 'Please complete the security check before sending your request.', fallbackError: 'We could not send your request. Please try again.', thankYou: 'Thank you', reference: 'Reference', submitting: 'Sending…', submit: 'Submit Request for Quote', confirmation: 'We will confirm availability and send a tailored quotation shortly.',
  },
  fleet: {
    title: 'Our Executive Fleet',
    viewAll: 'View All Vehicles',
    description: 'Travel in comfort, privacy and style with our premium vehicles, ideal for business travel and WEF delegates.',
    passengers: 'Up to {count} passengers',
    empty: 'Our vehicle selection will appear here shortly.',
  },
  why: {
    title: 'Why Choose Swiss Aero Transfer?',
    description: 'A trusted partner for executive transportation during WEF.',
    items: [
      { title: 'Flight Tracking', text: 'Real-time monitoring for a timely pickup.' },
      { title: 'Meet and Greet', text: 'Personalised airport welcome and assistance.' },
      { title: 'Discreet and Professional', text: 'Experienced, professional chauffeurs who understand executive travel.' },
      { title: 'Flexible and Tailored', text: 'Every enquiry is welcome, with services built around your schedule.' },
    ],
  },
  faq: {
    title: 'Frequently Asked Questions',
    contact: 'Ask us something else',
    items: [
      { question: 'Are you the official transport provider for the World Economic Forum?', answer: 'No. Swiss Aero Transfer is an independent transportation provider and is not affiliated with, endorsed by, or an official partner of the World Economic Forum. We offer private chauffeur services to delegates and visitors attending the event.' },
      { question: 'How long does the transfer from Zurich Airport to Davos take?', answer: 'The journey takes approximately 2 hours 30 minutes and covers about 150 km. Travel times can vary with traffic and weather, so allow extra time during the event.' },
      { question: 'Can you pick up delegates from St. Moritz or other Swiss destinations?', answer: 'Yes. We offer transfers between Zurich Airport, Davos, St. Moritz and other destinations. Contact us with your route for a quote.' },
      { question: 'Do you track flights?', answer: 'Yes. We monitor your flight so your chauffeur is ready for an on-time pickup, even if your arrival changes.' },
      { question: 'Can I book a chauffeur for the whole day during the event?', answer: 'Yes. Our hourly and standby chauffeur service covers meetings, events and multi-stop schedules.' },
      { question: 'How do I request a quote?', answer: 'Complete the quote form on this page with your service, dates, locations, passengers and contact details, or message us on WhatsApp. We will confirm availability and send a tailored quotation.' },
    ],
  },
  cta: {
    titleBefore: 'Plan Your',
    titleHighlight: 'WEF 2027',
    titleAfter: 'Transportation Today',
    description: 'Contact Swiss Aero Transfer for a tailored offer, availability and transport arrangements for Davos, St. Moritz and beyond.',
    action: 'Request a Quote',
    whatsapp: 'Chat on WhatsApp',
    imageAlt: 'Snow-covered Davos mountain landscape',
  },
  disclaimer: 'Swiss Aero Transfer is an independent transportation provider and is not affiliated with, endorsed by, or an official partner of the World Economic Forum.',
};

export default wefContent;
