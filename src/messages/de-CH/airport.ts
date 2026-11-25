import type { AirportContent } from '@/content/airport';

const airportContent: AirportContent = {
  metadata: { title: 'Flughafen Zürich Transfer | Privater Chauffeur ab ZRH', description: 'Flughafen-Transfers ab Zürich mit Flugverfolgung, Empfang und flexibler Wartezeit. Mercedes-Benz Chauffeure in der Schweiz und Europa.' },
  hero: {
    eyebrow: 'Privater Flughafen-Transfer in der Schweiz', title: 'Flughafen Zürich Transfer', tagline: 'Komfortabel reisen. Stilvoll ankommen.', description: 'Premium-Transfers mit privatem Chauffeur vom Flughafen Zürich (ZRH) zu Ihrem Hotel, Geschäftstermin oder jedem Ziel in der Schweiz und Europa.', book: 'Flughafen-Transfer buchen', whatsapp: 'Auf WhatsApp schreiben', imageAlt: 'Chauffeur im dunklen Anzug öffnet die Tür einer schwarzen Mercedes-Benz Limousine am Flughafen Zürich', points: [{ lines: ['Flug-', 'verfolgung'] }, { lines: ['Empfang und', 'Begrüssung'] }, { lines: ['Flexible', 'Wartezeit'] }, { lines: ['Service in', 'Europa'] }],
  },
  quoteForm: {
    title: 'Transfer-Offerte erhalten', description: 'Wählen Sie Flughafen-Transfer, Fahrt zum Flughafen oder Hin- und Rückfahrt. Geben Sie anschliessend Ziel, Datum, Zeit und Anzahl Passagiere ein.', journeyLabel: 'Art der Fahrt', arrivalTab: 'Flughafen-Transfer', departureTab: 'Zum Flughafen', roundTripTab: 'Hin- und Rückfahrt', pickupLocation: 'Abholort', destination: 'Zielort', addressPlaceholder: 'Hotel / Ort / Adresse', date: 'Datum', dateAria: 'Abholdatum', time: 'Uhrzeit', timeAria: 'Abholzeit', passengers: 'Passagiere', passenger: 'Passagier', passengersPlural: 'Passagiere', submit: 'Offerte anfordern', locationError: 'Bitte wählen Sie eine Adresse aus den Vorschlägen.',
  },
  benefits: {
    title: 'Warum unseren Flughafen-Transfer Zürich wählen?', description: 'Ein zuverlässiger, komfortabler und individuell abgestimmter Flughafen-Transfer für Geschäfts- und Privatreisende.',
    items: [
      { title: 'Flugverfolgung', text: 'Wir überwachen Ihren Flug, damit Ihr Chauffeur pünktlich bereitsteht – auch bei früherer Ankunft oder Verspätung.' },
      { title: 'Empfang und Begrüssung', text: 'Ihr Chauffeur erwartet Sie in der Ankunftshalle mit einem Namensschild.' },
      { title: 'Flexible Wartezeit', text: 'Die kostenlose Wartezeit richtet sich nach Ihrem Flug und dem Ankunftsablauf.' },
      { title: 'Premium-Flotte', text: 'Reisen Sie in hochwertigen Mercedes-Benz Fahrzeugen mit viel Komfort und Platz.' },
      { title: 'Europaweit unterwegs', text: 'Transfers von Zürich in alle wichtigen Städte der Schweiz und Europas.' },
    ],
  },
  howItWorks: {
    imageAlt: 'Ankunftsschild am Flughafen Zürich mit der Aufschrift Willkommen in Zürich', imageCaption: 'Willkommen in Zürich.', title: 'So funktioniert Ihr Flughafen-Transfer',
    steps: [
      { title: 'Online buchen', text: 'Fordern Sie Ihren Transfer in wenigen Minuten an.' },
      { title: 'Wir verfolgen Ihren Flug', text: 'Die Flugüberwachung hält Ihre Abholung im Zeitplan.' },
      { title: 'Empfang und Begrüssung', text: 'Ihr Chauffeur empfängt Sie bei der Ankunft.' },
      { title: 'Fahrt geniessen', text: 'Entspannen Sie sich auf dem Weg zu Ihrem Ziel.' },
    ],
  },
  fleet: { title: 'Unsere Flughafen-Transfer-Flotte', description: 'Wählen Sie das passende Fahrzeug für Ihre Gruppe und Ihr Gepäck. Unsere Flotte umfasst Mercedes-Benz Limousinen und einen Van sowie einen Renault SUV.', viewAll: 'Alle Fahrzeuge ansehen', passengers: 'Bis zu {count} Passagiere', luggage: '{count} Gepäckstücke', empty: { title: 'Unsere Fahrzeugauswahl erscheint in Kürze.', action: 'Transfer anfragen' } },
  destinations: {
    title: 'Beliebte Transfers ab Flughafen Zürich', description: 'Private Transfers vom Flughafen Zürich zu den beliebtesten Städten und Bergzielen der Schweiz.', viewAll: 'Alle Ziele ansehen',
    items: [
      { name: 'Zürich Stadt', time: 'Etwa 20 Minuten', imageAlt: 'Chauffeur hilft einem Fahrgast am Flughafen Zürich' },
      { name: 'Luzern', time: 'Etwa 45 Minuten', imageAlt: 'Kapellbrücke und Wasserturm in Luzern' },
      { name: 'Interlaken', time: 'Etwa 2 Stunden 10 Minuten', imageAlt: 'Interlaken-Tal mit Schweizer Alpen' },
      { name: 'Grindelwald', time: 'Etwa 2 Stunden 20 Minuten', imageAlt: 'Alpendorf Grindelwald mit schneebedeckten Gipfeln' },
      { name: 'Basel', time: 'Etwa 1 Stunde', imageAlt: 'Altstadt-Silhouette von Basel' },
      { name: 'Andere europäische Städte', time: 'Transfers nach München, Mailand, Frankfurt und mehr.', imageAlt: 'Europäische Geschäftsstadt bei Abenddämmerung' },
    ],
  },
  meetAndGreet: { title: 'Empfang am Flughafen Zürich', description: 'Nach Ihrem Flug wartet Ihr professioneller Chauffeur in der Ankunftshalle mit einem persönlichen Namensschild. Er hilft Ihnen mit dem Gepäck und begleitet Sie zu Ihrem Fahrzeug.', checklist: ['Persönliche Abholung am Flughafen', 'Hilfe mit dem Gepäck', 'Komfortabler Direkttransfer'], imageAlt: 'Chauffeur wartet in der Ankunftshalle des Flughafens Zürich mit einem Namensschild' },
  travellers: {
    title: 'Für Geschäfts- und Privatreisende',
    items: [
      { title: 'Geschäftsreisen', text: 'Pünktlicher, diskreter und professioneller Flughafentransport für Geschäftsreisende.' },
      { title: 'Familienreisen', text: 'Geräumige und komfortable Fahrzeuge für Familien; Kindersitze sind auf Anfrage verfügbar.' },
    ],
  },
  faq: {
    title: 'Häufig gestellte Fragen', contact: 'Weitere Frage stellen',
    items: [
      { question: 'Wie buche ich einen Transfer vom Flughafen Zürich?', answer: 'Geben Sie Ziel, Datum, Uhrzeit und Passagierzahl im Buchungsformular ein oder schreiben Sie uns auf WhatsApp. Ihren Transfer können Sie in wenigen Minuten anfragen.' },
      { question: 'Wo trifft mich mein Chauffeur am Flughafen?', answer: 'Ihr Chauffeur erwartet Sie in der Ankunftshalle mit einem persönlichen Namensschild.' },
      { question: 'Verfolgen Sie Flüge bei Verspätungen?', answer: 'Ja. Wir überwachen Ihren Flug in Echtzeit, damit sich die Abholung Ihrer tatsächlichen Ankunft anpasst.' },
      { question: 'Fahren Sie auch in andere europäische Städte?', answer: 'Ja. Wir fahren von Zürich in wichtige Städte der Schweiz und Europas. Kontaktieren Sie uns für eine Offerte zu Ihrer Route.' },
      { question: 'Wie lange ist die kostenlose Wartezeit?', answer: 'Jede Buchung beinhaltet kostenlose Wartezeit. Die genaue Dauer bestätigen wir für Ihre Buchung.' },
      { question: 'Sind Kindersitze verfügbar?', answer: 'Ja, auf Anfrage. Bitte geben Sie den Wunsch bei der Buchung an.' },
    ],
  },
  cta: { titleBefore: 'Buchen Sie Ihren', titleHighlight: 'Flughafen-Transfer Zürich', titleAfter: 'heute', description: 'Zuverlässige, komfortable und private Transfers vom Flughafen Zürich in die Schweiz und nach Europa.', action: 'Jetzt buchen', whatsapp: 'Auf WhatsApp schreiben' },
};

export default airportContent;
