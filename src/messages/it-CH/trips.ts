import type { TripsContent } from '@/content/trips';

const tripsContent: TripsContent = {
  metadata: { title: 'Gite giornaliere e tour', description: 'Gite giornaliere private con autista, tour e viaggi su misura in tutta Europa.' },
  hero: {
    eyebrow: 'Gite giornaliere e tour privati', title: 'Il tuo viaggio,', titleHighlight: 'a modo tuo.',
    description: 'Esplora i luoghi che ti stanno a cuore, dalle città iconiche ai paesaggi alpini e alle fughe oltre confine. Il tuo autista privato si occupa della strada mentre tu ti godi la giornata come preferisci.',
    explore: 'Scopri i nostri viaggi', customDay: 'Pianifica una giornata su misura',
    highlights: { chauffeur: 'Autista privato', itinerary: 'Itinerario flessibile', planning: 'Pianificazione su misura' },
  },
  listing: {
    eyebrow: 'Viaggi selezionati', title: 'Trova il viaggio adatto alla tua giornata.',
    description: 'Esplora le nostre esperienze private, poi personalizza il percorso e i dettagli con il nostro team.',
    count: { singular: '{count} viaggio disponibile', plural: '{count} viaggi disponibili' },
  },
  unavailable: { title: 'I viaggi non sono attualmente disponibili.', description: 'Il nostro team può comunque aiutarti a organizzare una giornata privata secondo i tuoi piani.', action: 'Pianifica un viaggio su misura' },
  empty: { title: 'Altri viaggi stanno arrivando.', description: 'Dicci dove desideri andare e creeremo un viaggio privato intorno ai tuoi piani.', action: 'Richiedi un viaggio su misura' },
  pagination: { label: 'Pagine dei viaggi', previous: 'Precedente', next: 'Successivo', status: 'Pagina {page} di {lastPage}' },
  cta: { eyebrow: 'Una giornata pensata intorno a te', title: 'Hai in mente un’altra meta?', description: 'Condividi i tuoi piani e ti aiuteremo a organizzare un viaggio privato adatto ai tuoi tempi, interessi e gruppo.', action: 'Inizia a pianificare' },
  card: { pricingLabels: { fixed: 'Viaggio a prezzo fisso', distance: 'Prezzo in base al percorso', enquiry: 'Su misura su richiesta' }, from: 'Da', pricing: 'Prezzo', onRequest: 'Su richiesta', routeQuote: 'Preventivo per il tuo percorso' },
};

export default tripsContent;
