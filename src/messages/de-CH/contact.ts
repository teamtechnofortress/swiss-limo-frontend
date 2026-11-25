import type { ContactContent } from '@/content/contact';

const contactContent: ContactContent = {
  metadata: { title: 'Kontakt', description: 'Kontaktieren Sie unser Team für Anfragen, individuelle Touren und massgeschneiderte Fahrten.' },
  hero: { titleBefore: 'Planen wir Ihre', titleHighlight: 'Fahrt.' },
  details: { title: 'Kontaktieren Sie uns', description: 'Unser Team hilft Ihnen gerne weiter.' },
  benefits: { title: 'Warum bei uns anfragen?', items: [{ title: 'Schnelle Antwort', text: 'Eine persönliche Antwort innerhalb eines Arbeitstages.' }, { title: 'Individueller Service', text: 'Jede Fahrt wird auf Ihre Bedürfnisse abgestimmt.' }, { title: 'Unverbindlich', text: 'Erhalten Sie vor der Buchung eine klare, sorgfältig erstellte Offerte.' }] },
  enquiry: {
    eyebrow: 'Anfrageformular', intro: 'Erzählen Sie uns kurz von Ihren Plänen – wir kümmern uns um den Rest.',
    subject: { general: 'Anfrage', customTrip: 'Anfrage für eine individuelle Fahrt', tripTemplate: 'Anfrage: {name}', vehicleTemplate: 'Preisanfrage: {name}' },
    form: {
      context: { eyebrow: 'Anfrage zu' }, contact: { title: 'Ihre Kontaktdaten', description: 'Damit unser Reiseteam Sie erreichen kann.' }, journey: { title: 'Fahrtdetails', description: 'Optionale Angaben helfen uns, eine genaue Offerte vorzubereiten.' },
      fields: { fullName: 'Vollständiger Name', email: 'E-Mail-Adresse', phone: 'Telefonnummer', preferredContact: 'Bevorzugte Kontaktmethode', travelDate: 'Reisedatum', returnDate: 'Rückfahrtdatum', passengers: 'Passagiere', luggage: 'Gepäck', pickup: 'Abholort', dropoff: 'Zielort', message: 'Wie können wir Ihnen helfen?', messagePlaceholder: 'Erzählen Sie uns von Ihrer Fahrt oder Anfrage...' },
      contactMethods: { noPreference: 'Keine Präferenz', email: 'E-Mail', phone: 'Telefon', whatsapp: 'WhatsApp' }, security: { title: 'Vor dem Senden Ihrer Anfrage ist eine Sicherheitsprüfung erforderlich.', description: 'Sie schützt unser Team vor automatisierten Nachrichten.' }, errors: { security: 'Bitte schliessen Sie die Sicherheitsprüfung ab, bevor Sie Ihre Anfrage senden.', fallback: 'Ihre Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut.' }, success: { title: 'Vielen Dank', message: 'Ihre Anfrage ist bei uns eingegangen. Unser Reiseteam meldet sich in Kürze bei Ihnen.', reference: 'Referenz' }, sending: 'Anfrage wird gesendet…', submit: 'Anfrage senden', responseTime: 'Wir antworten in der Regel innerhalb eines Arbeitstages.',
    },
  },
};

export default contactContent;
