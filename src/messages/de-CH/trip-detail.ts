import type { TripDetailContent } from '@/content/trip-detail';

const tripDetailContent: TripDetailContent = {
  metadata: { notFound: 'Fahrt nicht gefunden', unavailable: 'Private Fahrten' },
  hero: { eyebrow: 'Private Fahrt', book: 'Diese Tour buchen', enquire: 'Zu dieser Tour anfragen', explore: 'Fahrt entdecken' },
  glance: { label: 'Tour auf einen Blick', duration: 'Dauer', pickupReturn: 'Abholung / Rückfahrt', stops: 'Stopps', countries: 'Länder', privateExperience: 'Privates Erlebnis', personalisedItinerary: 'Individuelle Reiseroute', pickupLocations: '{count} Abholorte', destinations: '{count} Ziele', country: '{count} Land', countriesPlural: '{count} Länder' },
  duration: { minutes: '{count} Min.', hour: '{count} Stunde', hours: '{count} Stunden', hoursWithMinutes: '{hours} {minutes} Min.' },
  sections: { overview: 'Tourübersicht', countries: 'Bereiste Länder', stops: 'Die besonderen Stopps', stopsCount: 'Die {count} besonderen Stopps', gallery: 'Tourgalerie', itinerary: 'Ihre Tourroute', goodToKnow: 'Gut zu wissen' },
  sidebar: { title: 'Diese Fahrt planen', privateJourney: 'Private Fahrt', startingFrom: 'Ab', finalPrice: 'Der Endpreis hängt von Abholort, Datum und Fahrzeug ab.', routePricing: 'Live-Routenpreis', routePricingDescription: 'Erhalten Sie eine Offerte für Ihre Route, Ihr Datum und Ihr Fahrzeug.', priceOnRequest: 'Preis auf Anfrage', priceOnRequestDescription: 'Gerne erstellen wir eine individuelle Offerte für Ihre Fahrt.', book: 'Diese Fahrt buchen', enquire: 'Jetzt anfragen', helpTitle: 'Brauchen Sie Hilfe?', helpText: 'Unser Team hilft Ihnen gerne weiter.', contactTeam: 'Unser Team kontaktieren', pickupLocations: 'Verfügbare Abholorte', blocked: { enquiry_only: 'Dieses Erlebnis wird persönlich von unserem Team organisiert.', pickup_configuration_required: 'Unser Team hilft Ihnen gerne bei der Organisation Ihrer Abholung und dieser Fahrt.', destination_configuration_required: 'Unser Team hilft Ihnen gerne bei der Organisation dieser Fahrt.', fixed_pricing_configuration_required: 'Kontaktieren Sie unser Team für eine individuelle Offerte.' } },
  faq: { title: 'Häufig gestellte Fragen' },
  gallery: { photo: 'Foto', photos: 'Fotos', openPhoto: '{title} – Foto {count} in einem neuen Tab öffnen', showFewer: 'Weniger Fotos anzeigen', viewAll: 'Alle Fotos anzeigen ({count})' },
};

export default tripDetailContent;
