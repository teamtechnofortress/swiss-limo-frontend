import type { FleetContent } from '@/content/fleet';

const fleetContent: FleetContent = {
  metadata: {
    title: 'La nostra flotta',
    description: 'Veicoli con autista executive, di prima classe e van, con tariffe trasparenti al chilometro.',
  },
  hero: {
    eyebrow: 'La nostra flotta',
    title: 'Una flotta scelta per',
    titleHighlight: 'ogni viaggio.',
    description: 'Dalle raffinate berline executive ai van spaziosi, scegli il veicolo che offre al tuo viaggio il giusto equilibrio tra comfort, spazio e presenza.',
    explore: 'Scopri la flotta',
    bookRide: 'Prenota il tuo viaggio',
    highlights: {
      executive: 'Executive & prima classe',
      groups: 'Opzioni per ogni gruppo',
      luggage: 'Capacità bagagli indicata',
    },
  },
  listing: {
    eyebrow: 'Scegli il tuo veicolo',
    title: 'Comfort su misura per i tuoi piani.',
    description: 'Confronta capacità e prezzi, poi scegli il veicolo più adatto al tuo gruppo e ai tuoi bagagli.',
    vehicleCount: {
      singular: '{count} veicolo disponibile',
      plural: '{count} veicoli disponibili',
    },
    viewAll: 'Vedi tutti i veicoli',
    categoriesLabel: 'Categorie di veicoli',
    categories: {
      all: 'Tutti i veicoli',
      executive: 'Executive',
      firstClass: 'Prima classe',
      van: 'Van',
    },
  },
  empty: {
    title: 'Non ci sono veicoli disponibili in questa categoria.',
    description: 'Scegli un’altra categoria per scoprire la flotta.',
    action: 'Vedi tutti i veicoli',
  },
  cta: {
    eyebrow: 'Non sai quale veicolo è adatto?',
    title: 'Inizia dal tuo viaggio.',
    description: 'Inserisci percorso, numero di passeggeri e bagagli, poi visualizza i veicoli disponibili per i tuoi piani.',
    action: 'Trova il tuo veicolo',
  },
  vehicleCard: {
    categories: { executive: 'Executive', first_class: 'Prima classe', van: 'Van' },
    viewVehicle: 'Vedi {vehicle}',
    passengerCapacity: 'Fino a {count}',
    luggageCapacity: '{count} bagagli',
    requestQuote: 'Richiedi un’offerta',
    bookNow: 'Prenota ora',
    pricing: 'Prezzo',
    priceOnRequest: 'Su richiesta',
    getQuote: 'Richiedi un’offerta',
    startingFrom: 'Da',
    baseFare: 'Tariffa base',
    baseFareIncludesFirstKm: 'Tariffa base · inclusi i primi {distance} km',
    minimumFare: 'Tariffa minima',
  },
  detail: {
    metadata: { notFound: 'Veicolo non trovato' },
    fallbackDescription: 'Viaggi privati con autista per trasferimenti aeroportuali, viaggi di lavoro e spostamenti personali.',
    booking: { title: 'Prenota il tuo viaggio', description: 'Autista, veicolo e prezzo finale del percorso sono confermati prima del pagamento.', requestQuote: 'Richiedi un’offerta', bookNow: 'Prenota ora', pricingNotice: 'Il prezzo finale, IVA inclusa, viene mostrato con il percorso e i dettagli del viaggio prima del pagamento.', enquire: 'Richiedi ora', passengers: 'Fino a {count} passeggeri', luggage: 'Fino a {count} bagagli' },
    comfort: { eyebrow: 'Comfort a bordo' },
    concierge: { eyebrow: 'Servizio concierge', title: 'Hai bisogno di aiuto per scegliere?', description: 'Non sei sicuro che {vehicle} sia adatto al tuo viaggio? Il nostro team può aiutarti a scegliere.', contact: 'Contatta il nostro team' },
    amenities: { wifi: 'Wi-Fi', water: 'Acqua fresca', champagne: 'Servizio champagne', leather: 'Sedili in pelle' },
    gallery: { photosComingSoon: 'Foto disponibili a breve', previous: 'Foto precedente del veicolo', next: 'Foto successiva del veicolo', photos: 'Foto del veicolo', showPhoto: 'Mostra foto {count}', photoAlt: '{vehicle}, foto {count}' },
  },
};

export default fleetContent;
