import type { FleetContent } from '@/content/fleet';

const fleetContent: FleetContent = {
  metadata: {
    title: 'Notre flotte',
    description: 'Véhicules avec chauffeur executive, première classe et vans, avec une tarification transparente au kilomètre.',
  },
  hero: {
    eyebrow: 'Notre flotte',
    title: 'Une flotte choisie pour',
    titleHighlight: 'chaque trajet.',
    description: 'Des berlines executive raffinées aux vans spacieux, choisissez le véhicule qui offre à votre trajet le bon équilibre entre confort, espace et prestance.',
    explore: 'Découvrir la flotte',
    bookRide: 'Réserver votre trajet',
    highlights: {
      executive: 'Executive & première classe',
      groups: 'Des options pour chaque groupe',
      luggage: 'Capacité bagages affichée',
    },
  },
  listing: {
    eyebrow: 'Choisissez votre véhicule',
    title: 'Le confort adapté à vos projets.',
    description: 'Comparez les capacités et les tarifs, puis choisissez le véhicule adapté à votre groupe et à vos bagages.',
    vehicleCount: {
      singular: '{count} véhicule disponible',
      plural: '{count} véhicules disponibles',
    },
    viewAll: 'Voir tous les véhicules',
    categoriesLabel: 'Catégories de véhicules',
    categories: {
      all: 'Tous les véhicules',
      executive: 'Executive',
      firstClass: 'Première classe',
      van: 'Vans',
    },
  },
  empty: {
    title: 'Aucun véhicule n’est disponible dans cette catégorie.',
    description: 'Choisissez une autre catégorie pour découvrir la flotte.',
    action: 'Voir tous les véhicules',
  },
  cta: {
    eyebrow: 'Vous hésitez sur le véhicule adapté ?',
    title: 'Commencez par votre trajet.',
    description: 'Indiquez votre itinéraire, la taille de votre groupe et vos bagages, puis consultez les véhicules adaptés à vos projets.',
    action: 'Trouver votre véhicule',
  },
  vehicleCard: {
    categories: { executive: 'Executive', first_class: 'Première classe', van: 'Vans' },
    viewVehicle: 'Voir {vehicle}',
    passengerCapacity: 'Jusqu’à {count}',
    luggageCapacity: '{count} bagages',
    requestQuote: 'Demander une offre',
    bookNow: 'Réserver',
    pricing: 'Tarif',
    priceOnRequest: 'Sur demande',
    getQuote: 'Demander une offre',
    startingFrom: 'Dès',
    baseFare: 'Tarif de base',
    baseFareIncludesFirstKm: 'Tarif de base · {distance} premiers km inclus',
    minimumFare: 'Tarif minimum',
  },
  detail: {
    metadata: { notFound: 'Véhicule introuvable' },
    fallbackDescription: 'Transport privé avec chauffeur pour les transferts aéroport, les voyages d’affaires et les déplacements personnels.',
    booking: { title: 'Réserver votre trajet', description: 'Votre chauffeur, votre véhicule et le prix final de l’itinéraire sont confirmés avant le paiement.', requestQuote: 'Demander une offre', bookNow: 'Réserver', pricingNotice: 'Le prix final, TVA comprise, est affiché avec votre itinéraire et les détails de votre voyage avant le paiement.', enquire: 'Demander maintenant', passengers: 'Jusqu’à {count} passagers', luggage: 'Jusqu’à {count} bagages' },
    comfort: { eyebrow: 'Confort à bord' },
    concierge: { eyebrow: 'Service conciergerie', title: 'Besoin d’aide pour choisir ?', description: 'Vous ne savez pas si {vehicle} convient à votre trajet ? Notre équipe peut vous aider à choisir.', contact: 'Contacter notre équipe' },
    amenities: { wifi: 'Wi-Fi', water: 'Eau fraîche', champagne: 'Service champagne', leather: 'Sièges en cuir' },
    gallery: { photosComingSoon: 'Photos bientôt disponibles', previous: 'Photo précédente du véhicule', next: 'Photo suivante du véhicule', photos: 'Photos du véhicule', showPhoto: 'Afficher la photo {count}', photoAlt: '{vehicle}, photo {count}' },
  },
};

export default fleetContent;
