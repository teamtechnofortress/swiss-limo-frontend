import type { ContactContent } from '@/content/contact';

const contactContent: ContactContent = {
  metadata: { title: 'Contatti', description: 'Contatta il nostro team per richieste, tour personalizzati e viaggi su misura.' },
  hero: { titleBefore: 'Pianifichiamo il tuo', titleHighlight: 'viaggio.' },
  details: { title: 'Contattaci', description: 'Il nostro team è qui per aiutarti.' },
  benefits: { title: 'Perché inviarci una richiesta?', items: [{ title: 'Risposta rapida', text: 'Una risposta personale entro un giorno lavorativo.' }, { title: 'Servizio su misura', text: 'Ogni itinerario è pianificato in base alle tue esigenze.' }, { title: 'Senza impegno', text: 'Ricevi un’offerta chiara e accurata prima di prenotare.' }] },
  enquiry: {
    eyebrow: 'Modulo di richiesta', intro: 'Raccontaci brevemente i tuoi programmi e penseremo noi al resto.',
    subject: { general: 'Richiesta', customTrip: 'Richiesta per viaggio personalizzato', tripTemplate: 'Richiesta: {name}', vehicleTemplate: 'Richiesta di prezzo: {name}' },
    form: {
      context: { eyebrow: 'Richiesta relativa a' }, contact: { title: 'I tuoi contatti', description: 'Così il nostro team potrà ricontattarti.' }, journey: { title: 'Dettagli del viaggio', description: 'I dettagli facoltativi ci aiutano a preparare un’offerta accurata.' },
      fields: { fullName: 'Nome completo', email: 'Indirizzo e-mail', phone: 'Numero di telefono', preferredContact: 'Metodo di contatto preferito', travelDate: 'Data del viaggio', returnDate: 'Data di ritorno', passengers: 'Passeggeri', luggage: 'Bagagli', pickup: 'Luogo di prelievo', dropoff: 'Destinazione', message: 'Come possiamo aiutarti?', messagePlaceholder: 'Raccontaci del tuo viaggio o della tua richiesta...' },
      contactMethods: { noPreference: 'Nessuna preferenza', email: 'E-mail', phone: 'Telefono', whatsapp: 'WhatsApp' }, security: { title: 'È richiesta una verifica di sicurezza prima di inviare la richiesta.', description: 'Aiuta a proteggere il nostro team dai messaggi automatizzati.' }, errors: { security: 'Completa la verifica di sicurezza prima di inviare la richiesta.', fallback: 'Non siamo riusciti a inviare la tua richiesta. Riprova.' }, success: { title: 'Grazie', message: 'La tua richiesta è stata ricevuta. Il nostro team ti contatterà a breve.', reference: 'Riferimento' }, sending: 'Invio della richiesta…', submit: 'Invia la richiesta', responseTime: 'Di solito rispondiamo entro un giorno lavorativo.',
    },
  },
};

export default contactContent;
