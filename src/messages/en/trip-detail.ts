import type { TripDetailContent } from '@/content/trip-detail';

const tripDetailContent: TripDetailContent = {
  metadata: { notFound: 'Trip not found', unavailable: 'Private trips' },
  hero: { eyebrow: 'Private journey', book: 'Book this tour', enquire: 'Enquire about this tour', explore: 'Explore the journey' },
  glance: { label: 'Tour at a glance', duration: 'Duration', pickupReturn: 'Pickup / Return', stops: 'Stops', countries: 'Countries', privateExperience: 'Private experience', personalisedItinerary: 'Personalised itinerary', pickupLocations: '{count} pickup locations', destinations: '{count} destinations', country: '{count} country', countriesPlural: '{count} countries' },
  duration: { minutes: '{count} min', hour: '{count} hour', hours: '{count} hours', hoursWithMinutes: '{hours} {minutes} min' },
  sections: { overview: 'Tour Overview', countries: 'Countries Covered', stops: 'The Incredible Stops', stopsCount: 'The {count} Incredible Stops', gallery: 'Tour Gallery', itinerary: 'Your Tour Itinerary', goodToKnow: 'Good to know' },
  sidebar: {
    title: 'Plan this journey', privateJourney: 'Private journey', startingFrom: 'Starting from', finalPrice: 'Final price depends on pickup, date and vehicle.', routePricing: 'Live route pricing', routePricingDescription: 'Get a quote for your route, date and vehicle.', priceOnRequest: 'Price on request', priceOnRequestDescription: 'Let us prepare a tailored proposal for your trip.', book: 'Book this journey', enquire: 'Enquire now', helpTitle: 'Need help?', helpText: 'Our team is here to assist you.', contactTeam: 'Contact our team', pickupLocations: 'Available pickup locations',
    blocked: { enquiry_only: 'This experience is arranged personally by our team.', pickup_configuration_required: 'Our team can help arrange your pickup and this experience.', destination_configuration_required: 'Our team can help arrange this experience.', fixed_pricing_configuration_required: 'Contact our team for a tailored proposal.' },
  },
  faq: { title: 'Frequently asked questions' },
  gallery: { photo: 'photo', photos: 'photos', openPhoto: 'Open {title} photo {count} in a new tab', showFewer: 'Show fewer photos', viewAll: 'View all photos ({count})' },
};

export default tripDetailContent;
