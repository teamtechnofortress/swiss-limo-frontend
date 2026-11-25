import type { AirportContent } from '@/content/airport';

const airportContent: AirportContent = {
  metadata: { title: 'Transfer aeroporto di Zurigo | Autista privato da ZRH', description: 'Transfer dall’aeroporto di Zurigo con monitoraggio voli, accoglienza e tempi di attesa flessibili. Autisti Mercedes-Benz in Svizzera e in Europa.' },
  hero: {
    eyebrow: 'Transfer aeroportuale privato in Svizzera', title: 'Transfer aeroporto di Zurigo', tagline: 'Viaggia nel comfort. Arriva con stile.', description: 'Transfer privati premium dall’aeroporto di Zurigo (ZRH) al tuo hotel, appuntamento di lavoro o qualsiasi destinazione in Svizzera e in Europa.', book: 'Prenota un transfer aeroportuale', whatsapp: 'Scrivici su WhatsApp', imageAlt: 'Autista in abito scuro che apre la portiera di una Mercedes-Benz nera all’aeroporto di Zurigo', points: [{ lines: ['Monitoraggio', 'voli'] }, { lines: ['Accoglienza e', 'assistenza'] }, { lines: ['Attesa', 'flessibile'] }, { lines: ['Servizio in', 'Europa'] }],
  },
  quoteForm: {
    title: 'Richiedi la tua offerta di transfer', description: 'Scegli un transfer dall’aeroporto, verso l’aeroporto o andata e ritorno. Inserisci poi destinazione, data, ora e numero di passeggeri.', journeyLabel: 'Tipo di viaggio', arrivalTab: 'Dall’aeroporto', departureTab: 'Verso l’aeroporto', roundTripTab: 'Andata e ritorno', pickupLocation: 'Luogo di prelievo', destination: 'Destinazione', addressPlaceholder: 'Hotel / città / indirizzo', date: 'Data', dateAria: 'Data del prelievo', time: 'Ora', timeAria: 'Ora del prelievo', passengers: 'Passeggeri', passenger: 'Passeggero', passengersPlural: 'Passeggeri', submit: 'Richiedi un’offerta', locationError: 'Seleziona un indirizzo dai suggerimenti.',
  },
  benefits: {
    title: 'Perché scegliere il nostro transfer aeroporto di Zurigo?', description: 'Un servizio di transfer aeroportuale affidabile, confortevole e su misura, scelto da viaggiatori d’affari e di piacere.',
    items: [
      { title: 'Monitoraggio voli', text: 'Monitoriamo il tuo volo per far trovare il tuo autista puntuale, anche in caso di anticipo o ritardo.' },
      { title: 'Accoglienza personalizzata', text: 'Il tuo autista ti aspetta agli arrivi con un cartello nominativo.' },
      { title: 'Attesa flessibile', text: 'Il tempo di attesa incluso si adatta al tuo volo e alle procedure di arrivo.' },
      { title: 'Flotta di lusso', text: 'Viaggia in veicoli Mercedes-Benz premium progettati per comfort e spazio.' },
      { title: 'Copertura europea', text: 'Transfer da Zurigo verso le principali città della Svizzera e dell’Europa.' },
    ],
  },
  howItWorks: {
    imageAlt: 'Cartello degli arrivi all’aeroporto di Zurigo con la scritta Benvenuti a Zurigo', imageCaption: 'Benvenuti a Zurigo.', title: 'Come funziona il tuo transfer aeroportuale',
    steps: [
      { title: 'Prenota online', text: 'Richiedi il tuo transfer in pochi minuti.' },
      { title: 'Monitoriamo il tuo volo', text: 'Il monitoraggio in tempo reale mantiene il ritiro nei tempi previsti.' },
      { title: 'Accoglienza personalizzata', text: 'Il tuo autista ti accoglie agli arrivi.' },
      { title: 'Goditi il viaggio', text: 'Rilassati in un veicolo di lusso fino alla tua destinazione.' },
    ],
  },
  fleet: { title: 'La nostra flotta per transfer aeroportuali', description: 'Scegli il veicolo adatto al tuo gruppo e ai tuoi bagagli. La nostra flotta include berline Mercedes-Benz, un van e un SUV Renault.', viewAll: 'Vedi tutti i veicoli', passengers: 'Fino a {count} passeggeri', luggage: '{count} bagagli', empty: { title: 'La nostra selezione di veicoli sarà disponibile a breve.', action: 'Richiedi il tuo transfer' } },
  destinations: {
    title: 'Transfer più richiesti dall’aeroporto di Zurigo', description: 'Transfer privati dall’aeroporto di Zurigo verso le città e le località montane più visitate della Svizzera.', viewAll: 'Vedi tutte le destinazioni',
    items: [
      { name: 'Città di Zurigo', time: 'Circa 20 minuti', imageAlt: 'Autista che aiuta un passeggero all’aeroporto di Zurigo' },
      { name: 'Lucerna', time: 'Circa 45 minuti', imageAlt: 'Ponte della Cappella e torre dell’acqua a Lucerna' },
      { name: 'Interlaken', time: 'Circa 2 ore e 10 minuti', imageAlt: 'Valle di Interlaken con le Alpi svizzere' },
      { name: 'Grindelwald', time: 'Circa 2 ore e 20 minuti', imageAlt: 'Villaggio alpino di Grindelwald con cime innevate' },
      { name: 'Basilea', time: 'Circa 1 ora', imageAlt: 'Profilo del centro storico di Basilea' },
      { name: 'Altre città europee', time: 'Transfer per Monaco, Milano, Francoforte e altre città.', imageAlt: 'Città d’affari europea all’ora blu' },
    ],
  },
  meetAndGreet: { title: 'Accoglienza all’aeroporto di Zurigo', description: 'Dopo il tuo volo, il tuo autista professionista ti attende nella sala arrivi con un cartello personalizzato. Ti aiuterà con i bagagli e ti accompagnerà al veicolo.', checklist: ['Ritiro personalizzato in aeroporto', 'Assistenza con i bagagli', 'Transfer diretto e confortevole'], imageAlt: 'Autista in attesa nella sala arrivi dell’aeroporto di Zurigo con un cartello nominativo' },
  travellers: {
    title: 'Per viaggiatori d’affari e di piacere',
    items: [
      { title: 'Transfer business', text: 'Trasporto aeroportuale puntuale, discreto e professionale per viaggiatori d’affari.' },
      { title: 'Transfer per famiglie', text: 'Veicoli spaziosi e confortevoli per famiglie, con seggiolini per bambini disponibili su richiesta.' },
    ],
  },
  faq: {
    title: 'Domande frequenti', contact: 'Fai un’altra domanda',
    items: [
      { question: 'Come prenoto un transfer dall’aeroporto di Zurigo?', answer: 'Inserisci destinazione, data, ora e numero di passeggeri nel modulo di prenotazione, oppure scrivici su WhatsApp. Puoi richiedere il transfer in pochi minuti.' },
      { question: 'Dove mi incontrerà il mio autista in aeroporto?', answer: 'Il tuo autista ti incontra nella sala arrivi con un cartello nominativo personalizzato.' },
      { question: 'Monitorate i voli in caso di ritardo?', answer: 'Sì. Monitoriamo il tuo volo in tempo reale, così il ritiro si adatta all’orario di arrivo effettivo.' },
      { question: 'Potete portarmi in altre città europee?', answer: 'Sì. Copriamo transfer da Zurigo verso le principali città della Svizzera e dell’Europa. Contattaci per un’offerta sul tuo itinerario.' },
      { question: 'Quanto dura l’attesa gratuita?', answer: 'Ogni prenotazione include un tempo di attesa gratuito. Confermeremo la durata esatta per il tuo viaggio.' },
      { question: 'Sono disponibili seggiolini per bambini?', answer: 'Sì, su richiesta. Indicalo al momento della prenotazione.' },
    ],
  },
  cta: { titleBefore: 'Prenota oggi il tuo', titleHighlight: 'transfer aeroporto di Zurigo', titleAfter: '', description: 'Transfer affidabili, confortevoli e privati dall’aeroporto di Zurigo verso la Svizzera e l’Europa.', action: 'Prenota ora', whatsapp: 'Scrivici su WhatsApp' },
};

export default airportContent;
