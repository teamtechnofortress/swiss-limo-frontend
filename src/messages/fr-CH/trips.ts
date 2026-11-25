import type { TripsContent } from '@/content/trips';

const tripsContent: TripsContent = {
  metadata: { title: 'Excursions & circuits', description: 'Excursions privées avec chauffeur, circuits et voyages sur mesure à travers l’Europe.' },
  hero: {
    eyebrow: 'Excursions et circuits privés', title: 'Votre voyage,', titleHighlight: 'à votre façon.',
    description: 'Découvrez les lieux qui vous tiennent à cœur, des villes emblématiques aux paysages alpins et aux escapades transfrontalières. Votre chauffeur privé s’occupe de la route pendant que vous profitez de la journée à votre rythme.',
    explore: 'Découvrir nos voyages', customDay: 'Planifier une journée sur mesure',
    highlights: { chauffeur: 'Chauffeur privé', itinerary: 'Itinéraire flexible', planning: 'Organisation sur mesure' },
  },
  listing: {
    eyebrow: 'Voyages sélectionnés', title: 'Trouvez le voyage qui convient à votre journée.',
    description: 'Découvrez nos expériences privées, puis personnalisez l’itinéraire et les détails avec notre équipe.',
    count: { singular: '{count} voyage disponible', plural: '{count} voyages disponibles' },
  },
  unavailable: { title: 'Les voyages sont actuellement indisponibles.', description: 'Notre équipe peut tout de même vous aider à organiser une journée privée selon vos envies.', action: 'Planifier un voyage sur mesure' },
  empty: { title: 'D’autres voyages arrivent bientôt.', description: 'Dites-nous où vous souhaitez aller et nous créerons un voyage privé autour de vos projets.', action: 'Demander un voyage sur mesure' },
  pagination: { label: 'Pages des voyages', previous: 'Précédent', next: 'Suivant', status: 'Page {page} sur {lastPage}' },
  cta: { eyebrow: 'Une journée pensée pour vous', title: 'Vous avez une autre idée en tête ?', description: 'Partagez vos projets et nous organiserons un voyage privé adapté à votre emploi du temps, vos intérêts et votre groupe.', action: 'Commencer à planifier' },
  card: { pricingLabels: { fixed: 'Voyage à prix fixe', distance: 'Tarification selon l’itinéraire', enquiry: 'Sur mesure, sur demande' }, from: 'Dès', pricing: 'Tarif', onRequest: 'Sur demande', routeQuote: 'Offre pour votre itinéraire' },
};

export default tripsContent;
