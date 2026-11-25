import type { TripDetailContent } from '@/content/trip-detail';

const tripDetailContent: TripDetailContent = {
  metadata: { notFound: 'Viaggio non trovato', unavailable: 'Viaggi privati' },
  hero: { eyebrow: 'Viaggio privato', book: 'Prenota questo tour', enquire: 'Richiedi informazioni su questo tour', explore: 'Scopri il viaggio' },
  glance: { label: 'Tour in sintesi', duration: 'Durata', pickupReturn: 'Prelievo / ritorno', stops: 'Tappe', countries: 'Paesi', privateExperience: 'Esperienza privata', personalisedItinerary: 'Itinerario personalizzato', pickupLocations: '{count} luoghi di prelievo', destinations: '{count} destinazioni', country: '{count} paese', countriesPlural: '{count} paesi' },
  duration: { minutes: '{count} min', hour: '{count} ora', hours: '{count} ore', hoursWithMinutes: '{hours} {minutes} min' },
  sections: { overview: 'Panoramica del tour', countries: 'Paesi visitati', stops: 'Le tappe imperdibili', stopsCount: 'Le {count} tappe imperdibili', gallery: 'Galleria del tour', itinerary: 'Il tuo itinerario', goodToKnow: 'Da sapere' },
  sidebar: { title: 'Pianifica questo viaggio', privateJourney: 'Viaggio privato', startingFrom: 'A partire da', finalPrice: 'Il prezzo finale dipende dal luogo di prelievo, dalla data e dal veicolo.', routePricing: 'Prezzo in base al percorso', routePricingDescription: 'Richiedi un’offerta per il tuo percorso, la data e il veicolo.', priceOnRequest: 'Prezzo su richiesta', priceOnRequestDescription: 'Lasciaci preparare una proposta su misura per il tuo viaggio.', book: 'Prenota questo viaggio', enquire: 'Richiedi ora', helpTitle: 'Serve aiuto?', helpText: 'Il nostro team è qui per aiutarti.', contactTeam: 'Contatta il nostro team', pickupLocations: 'Luoghi di prelievo disponibili', blocked: { enquiry_only: 'Questa esperienza viene organizzata personalmente dal nostro team.', pickup_configuration_required: 'Il nostro team può organizzare il tuo prelievo e questa esperienza.', destination_configuration_required: 'Il nostro team può organizzare questa esperienza.', fixed_pricing_configuration_required: 'Contatta il nostro team per una proposta personalizzata.' } },
  faq: { title: 'Domande frequenti' },
  gallery: { photo: 'foto', photos: 'foto', openPhoto: 'Apri la foto {count} di {title} in una nuova scheda', showFewer: 'Mostra meno foto', viewAll: 'Vedi tutte le foto ({count})' },
};

export default tripDetailContent;
