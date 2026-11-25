import type { TripDetailContent } from '@/content/trip-detail';

const tripDetailContent: TripDetailContent = {
  metadata: { notFound: 'Trajet introuvable', unavailable: 'Trajets privés' },
  hero: { eyebrow: 'Trajet privé', book: 'Réserver cette excursion', enquire: 'Demander cette excursion', explore: 'Découvrir le trajet' },
  glance: { label: 'L’essentiel de l’excursion', duration: 'Durée', pickupReturn: 'Prise en charge / retour', stops: 'Étapes', countries: 'Pays', privateExperience: 'Expérience privée', personalisedItinerary: 'Itinéraire personnalisé', pickupLocations: '{count} lieux de prise en charge', destinations: '{count} destinations', country: '{count} pays', countriesPlural: '{count} pays' },
  duration: { minutes: '{count} min', hour: '{count} heure', hours: '{count} heures', hoursWithMinutes: '{hours} {minutes} min' },
  sections: { overview: 'Aperçu de l’excursion', countries: 'Pays visités', stops: 'Les étapes incontournables', stopsCount: 'Les {count} étapes incontournables', gallery: 'Galerie de l’excursion', itinerary: 'Votre itinéraire', goodToKnow: 'Bon à savoir' },
  sidebar: { title: 'Planifier ce trajet', privateJourney: 'Trajet privé', startingFrom: 'À partir de', finalPrice: 'Le prix final dépend du lieu de prise en charge, de la date et du véhicule.', routePricing: 'Tarification selon l’itinéraire', routePricingDescription: 'Recevez une offre pour votre itinéraire, votre date et votre véhicule.', priceOnRequest: 'Prix sur demande', priceOnRequestDescription: 'Laissez-nous préparer une proposition sur mesure pour votre trajet.', book: 'Réserver ce trajet', enquire: 'Demander maintenant', helpTitle: 'Besoin d’aide ?', helpText: 'Notre équipe est là pour vous aider.', contactTeam: 'Contacter notre équipe', pickupLocations: 'Lieux de prise en charge disponibles', blocked: { enquiry_only: 'Cette expérience est organisée personnellement par notre équipe.', pickup_configuration_required: 'Notre équipe peut organiser votre prise en charge et cette expérience.', destination_configuration_required: 'Notre équipe peut organiser cette expérience.', fixed_pricing_configuration_required: 'Contactez notre équipe pour une proposition sur mesure.' } },
  faq: { title: 'Questions fréquentes' },
  gallery: { photo: 'photo', photos: 'photos', openPhoto: 'Ouvrir la photo {count} de {title} dans un nouvel onglet', showFewer: 'Afficher moins de photos', viewAll: 'Voir toutes les photos ({count})' },
};

export default tripDetailContent;
