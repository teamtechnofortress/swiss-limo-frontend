import type { TripsContent } from '@/content/trips';

const tripsContent: TripsContent = {
  metadata: { title: 'Tagesausflüge & Touren', description: 'Private Tagesausflüge, Touren und massgeschneiderte Reisen mit Chauffeur in Europa.' },
  hero: {
    eyebrow: 'Private Tagesausflüge & Touren', title: 'Ihre Reise,', titleHighlight: 'auf Ihre Art.',
    description: 'Entdecken Sie Orte, die Ihnen wichtig sind – von berühmten Städten über Alpenlandschaften bis zu grenzüberschreitenden Ausflügen. Ihr privater Chauffeur kümmert sich um die Fahrt, während Sie den Tag nach Ihren Wünschen geniessen.',
    explore: 'Reisen entdecken', customDay: 'Individuellen Tag planen',
    highlights: { chauffeur: 'Privater Chauffeur', itinerary: 'Flexible Route', planning: 'Individuelle Planung' },
  },
  listing: {
    eyebrow: 'Ausgewählte Reisen', title: 'Finden Sie die Reise, die zu Ihrem Tag passt.',
    description: 'Entdecken Sie unsere privaten Erlebnisse und gestalten Sie Route und Details gemeinsam mit unserem Team.',
    count: { singular: '{count} Reise verfügbar', plural: '{count} Reisen verfügbar' },
  },
  unavailable: { title: 'Reisen sind derzeit nicht verfügbar.', description: 'Unser Team hilft Ihnen dennoch gerne, einen privaten Tag nach Ihren Wünschen zu organisieren.', action: 'Individuelle Reise planen' },
  empty: { title: 'Weitere Reisen sind unterwegs.', description: 'Sagen Sie uns, wohin Sie möchten, und wir gestalten eine private Reise nach Ihren Plänen.', action: 'Individuelle Reise anfragen' },
  pagination: { label: 'Reiseseiten', previous: 'Zurück', next: 'Weiter', status: 'Seite {page} von {lastPage}' },
  cta: { eyebrow: 'Ein Tag ganz nach Ihren Wünschen', title: 'Haben Sie ein anderes Ziel im Sinn?', description: 'Teilen Sie uns Ihre Pläne mit und wir organisieren eine private Reise passend zu Ihrem Zeitplan, Ihren Interessen und Ihrer Gruppe.', action: 'Planung starten' },
  card: { pricingLabels: { fixed: 'Fixpreis-Reise', distance: 'Routenbasierte Preise', enquiry: 'Individuell auf Anfrage' }, from: 'Ab', pricing: 'Preis', onRequest: 'Auf Anfrage', routeQuote: 'Offerte für Ihre Route' },
};

export default tripsContent;
