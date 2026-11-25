import type { AirportContent } from '@/content/airport';

const airportContent: AirportContent = {
  metadata: { title: 'Transfert aéroport de Zurich | Chauffeur privé depuis ZRH', description: 'Transferts depuis l’aéroport de Zurich avec suivi des vols, accueil et temps d’attente flexible. Chauffeurs Mercedes-Benz en Suisse et en Europe.' },
  hero: {
    eyebrow: 'Transfert aéroport privé en Suisse', title: 'Transfert aéroport de Zurich', tagline: 'Voyagez confortablement. Arrivez avec style.', description: 'Transferts privés premium depuis l’aéroport de Zurich (ZRH) vers votre hôtel, rendez-vous professionnel ou toute destination en Suisse et en Europe.', book: 'Réserver un transfert aéroport', whatsapp: 'Écrire sur WhatsApp', imageAlt: 'Chauffeur en costume sombre ouvrant la porte d’une Mercedes-Benz noire à l’aéroport de Zurich', points: [{ lines: ['Suivi des', 'vols'] }, { lines: ['Accueil et', 'assistance'] }, { lines: ['Temps d’attente', 'flexible'] }, { lines: ['Service à travers', 'l’Europe'] }],
  },
  quoteForm: {
    title: 'Obtenez votre offre de transfert', description: 'Choisissez un transfert depuis ou vers l’aéroport, ou un aller-retour. Indiquez ensuite votre destination, la date, l’heure et le nombre de passagers.', journeyLabel: 'Type de trajet', arrivalTab: 'Depuis l’aéroport', departureTab: 'Vers l’aéroport', roundTripTab: 'Aller-retour', pickupLocation: 'Lieu de prise en charge', destination: 'Destination', addressPlaceholder: 'Hôtel / ville / adresse', date: 'Date', dateAria: 'Date de prise en charge', time: 'Heure', timeAria: 'Heure de prise en charge', passengers: 'Passagers', passenger: 'Passager', passengersPlural: 'Passagers', submit: 'Demander une offre', locationError: 'Veuillez choisir une adresse parmi les suggestions.',
  },
  benefits: {
    title: 'Pourquoi choisir notre transfert aéroport de Zurich ?', description: 'Un service de transfert aéroport fiable, confortable et personnalisé, apprécié des voyageurs d’affaires et de loisirs.',
    items: [
      { title: 'Suivi des vols', text: 'Nous suivons votre vol afin que votre chauffeur soit à l’heure, même en cas d’avance ou de retard.' },
      { title: 'Accueil personnalisé', text: 'Votre chauffeur vous attend à l’arrivée avec une pancarte à votre nom.' },
      { title: 'Temps d’attente flexible', text: 'Le temps d’attente offert s’adapte à votre vol et à votre arrivée.' },
      { title: 'Flotte haut de gamme', text: 'Voyagez dans des véhicules Mercedes-Benz premium, conçus pour le confort et l’espace.' },
      { title: 'Couverture européenne', text: 'Des transferts depuis Zurich vers les principales villes de Suisse et d’Europe.' },
    ],
  },
  howItWorks: {
    imageAlt: 'Panneau des arrivées à l’aéroport de Zurich indiquant Bienvenue à Zurich', imageCaption: 'Bienvenue à Zurich.', title: 'Comment fonctionne votre transfert aéroport',
    steps: [
      { title: 'Réservez en ligne', text: 'Demandez votre transfert en quelques minutes.' },
      { title: 'Nous suivons votre vol', text: 'Le suivi en temps réel maintient votre prise en charge à l’heure.' },
      { title: 'Accueil personnalisé', text: 'Votre chauffeur vous accueille à l’arrivée.' },
      { title: 'Profitez du trajet', text: 'Détendez-vous dans un véhicule de luxe jusqu’à votre destination.' },
    ],
  },
  fleet: { title: 'Notre flotte pour les transferts aéroport', description: 'Choisissez le véhicule adapté à votre groupe et à vos bagages. Notre flotte comprend des berlines Mercedes-Benz, un van et un SUV Renault.', viewAll: 'Voir tous les véhicules', passengers: 'Jusqu’à {count} passagers', luggage: '{count} bagages', empty: { title: 'Notre sélection de véhicules apparaîtra bientôt.', action: 'Demander votre transfert' } },
  destinations: {
    title: 'Transferts populaires depuis l’aéroport de Zurich', description: 'Des transferts privés depuis l’aéroport de Zurich vers les villes et destinations de montagne les plus prisées de Suisse.', viewAll: 'Voir toutes les destinations',
    items: [
      { name: 'Zurich-ville', time: 'Environ 20 minutes', imageAlt: 'Chauffeur aidant un passager à l’aéroport de Zurich' },
      { name: 'Lucerne', time: 'Environ 45 minutes', imageAlt: 'Pont de la Chapelle et tour de l’eau à Lucerne' },
      { name: 'Interlaken', time: 'Environ 2 h 10', imageAlt: 'Vallée d’Interlaken avec les Alpes suisses' },
      { name: 'Grindelwald', time: 'Environ 2 h 20', imageAlt: 'Village alpin de Grindelwald avec sommets enneigés' },
      { name: 'Bâle', time: 'Environ 1 heure', imageAlt: 'Silhouette de la vieille ville de Bâle' },
      { name: 'Autres villes européennes', time: 'Transferts vers Munich, Milan, Francfort et plus encore.', imageAlt: 'Ville d’affaires européenne à l’heure bleue' },
    ],
  },
  meetAndGreet: { title: 'Accueil à l’aéroport de Zurich', description: 'Après votre vol, votre chauffeur professionnel vous attend dans le hall des arrivées avec une pancarte à votre nom. Il vous aide avec vos bagages et vous accompagne jusqu’au véhicule.', checklist: ['Prise en charge personnalisée à l’aéroport', 'Aide avec les bagages', 'Transfert direct et confortable'], imageAlt: 'Chauffeur attendant dans le hall des arrivées de l’aéroport de Zurich avec une pancarte' },
  travellers: {
    title: 'Pour les voyageurs d’affaires et de loisirs',
    items: [
      { title: 'Transferts professionnels', text: 'Un transport aéroport ponctuel, discret et professionnel pour les voyageurs d’affaires.' },
      { title: 'Transferts en famille', text: 'Des véhicules spacieux et confortables pour les familles, avec sièges enfant disponibles sur demande.' },
    ],
  },
  faq: {
    title: 'Questions fréquentes', contact: 'Posez-nous une autre question',
    items: [
      { question: 'Comment réserver un transfert depuis l’aéroport de Zurich ?', answer: 'Indiquez votre destination, la date, l’heure et le nombre de passagers dans le formulaire, ou écrivez-nous sur WhatsApp. Vous pouvez demander votre transfert en quelques minutes.' },
      { question: 'Où mon chauffeur me rencontrera-t-il à l’aéroport ?', answer: 'Votre chauffeur vous attend dans le hall des arrivées avec une pancarte personnalisée à votre nom.' },
      { question: 'Suivez-vous les vols en cas de retard ?', answer: 'Oui. Nous suivons votre vol en temps réel afin d’adapter la prise en charge à votre arrivée effective.' },
      { question: 'Pouvez-vous me conduire vers d’autres villes européennes ?', answer: 'Oui. Nous assurons des transferts depuis Zurich vers les principales villes de Suisse et d’Europe. Contactez-nous pour une offre adaptée à votre itinéraire.' },
      { question: 'Quelle est la durée de l’attente gratuite ?', answer: 'Chaque réservation inclut un temps d’attente offert. Nous vous confirmerons la durée exacte pour votre trajet.' },
      { question: 'Des sièges enfant sont-ils disponibles ?', answer: 'Oui, sur demande. Indiquez-le lors de votre réservation.' },
    ],
  },
  cta: { titleBefore: 'Réservez votre', titleHighlight: 'transfert aéroport de Zurich', titleAfter: 'dès aujourd’hui', description: 'Des transferts fiables, confortables et privés depuis l’aéroport de Zurich vers la Suisse et l’Europe.', action: 'Réserver maintenant', whatsapp: 'Écrire sur WhatsApp' },
};

export default airportContent;
