import type { FleetContent } from '@/content/fleet';

const fleetContent: FleetContent = {
  metadata: {
    title: 'Unsere Flotte',
    description: 'Business-, First-Class- und Van-Chauffeurfahrzeuge mit transparenten Kilometertarifen.',
  },
  hero: {
    eyebrow: 'Unsere Flotte',
    title: 'Eine Flotte für',
    titleHighlight: 'jede Reise.',
    description: 'Von eleganten Business-Limousinen bis zu geräumigen Vans: Wählen Sie das Fahrzeug, das Komfort, Platz und Ausstrahlung Ihrer Reise verbindet.',
    explore: 'Flotte entdecken',
    bookRide: 'Fahrt buchen',
    highlights: {
      executive: 'Business & First Class',
      groups: 'Optionen für jede Gruppe',
      luggage: 'Gepäckkapazität angezeigt',
    },
  },
  listing: {
    eyebrow: 'Fahrzeug wählen',
    title: 'Komfort, passend zu Ihren Plänen.',
    description: 'Vergleichen Sie Kapazität und Preise und wählen Sie das Fahrzeug, das zu Ihrer Reisegruppe und Ihrem Gepäck passt.',
    vehicleCount: {
      singular: '{count} Fahrzeug verfügbar',
      plural: '{count} Fahrzeuge verfügbar',
    },
    viewAll: 'Alle Fahrzeuge ansehen',
    categoriesLabel: 'Fahrzeugkategorien',
    categories: {
      all: 'Alle Fahrzeuge',
      executive: 'Business',
      firstClass: 'First Class',
      van: 'Vans',
    },
  },
  empty: {
    title: 'In dieser Kategorie sind keine Fahrzeuge verfügbar.',
    description: 'Wählen Sie eine andere Kategorie, um die Flotte zu entdecken.',
    action: 'Alle Fahrzeuge ansehen',
  },
  cta: {
    eyebrow: 'Nicht sicher, welches Fahrzeug passt?',
    title: 'Beginnen Sie mit Ihrer Reise.',
    description: 'Geben Sie Route, Gruppengrösse und Gepäck ein und sehen Sie die passenden Fahrzeuge für Ihre Pläne.',
    action: 'Fahrzeug finden',
  },
  vehicleCard: {
    categories: { executive: 'Business', first_class: 'First Class', van: 'Vans' },
    viewVehicle: '{vehicle} ansehen',
    passengerCapacity: 'Bis zu {count}',
    luggageCapacity: '{count} Gepäckstücke',
    requestQuote: 'Offerte anfordern',
    bookNow: 'Jetzt buchen',
    pricing: 'Preise',
    priceOnRequest: 'Auf Anfrage',
    getQuote: 'Offerte anfordern',
    startingFrom: 'Ab',
    baseFare: 'Grundtarif',
    baseFareIncludesFirstKm: 'Grundtarif · inklusive erste {distance} km',
    minimumFare: 'Mindesttarif',
  },
  detail: {
    metadata: { notFound: 'Fahrzeug nicht gefunden' },
    fallbackDescription: 'Private Chauffeurfahrten für Flughafentransfers, Geschäftsreisen und persönliche Fahrten.',
    booking: { title: 'Ihre Fahrt buchen', description: 'Chauffeur, Fahrzeug und endgültiger Routenpreis werden vor der Zahlung bestätigt.', requestQuote: 'Offerte anfordern', bookNow: 'Jetzt buchen', pricingNotice: 'Der Endpreis inklusive Mehrwertsteuer wird vor der Zahlung anhand Ihrer Route und Reisedetails angezeigt.', enquire: 'Jetzt anfragen', passengers: 'Bis zu {count} Passagiere', luggage: 'Bis zu {count} Gepäckstücke' },
    comfort: { eyebrow: 'Komfort an Bord' },
    concierge: { eyebrow: 'Concierge-Service', title: 'Brauchen Sie Hilfe bei der Wahl?', description: 'Sie sind nicht sicher, ob {vehicle} zu Ihrer Fahrt passt? Unser Team berät Sie gerne.', contact: 'Unser Team kontaktieren' },
    amenities: { wifi: 'WLAN', water: 'Gekühltes Wasser', champagne: 'Champagner-Service', leather: 'Ledersitze' },
    gallery: { photosComingSoon: 'Fotos folgen in Kürze', previous: 'Vorheriges Fahrzeugfoto', next: 'Nächstes Fahrzeugfoto', photos: 'Fahrzeugfotos', showPhoto: 'Foto {count} anzeigen', photoAlt: '{vehicle}, Foto {count}' },
  },
};

export default fleetContent;
