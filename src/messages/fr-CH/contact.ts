import type { ContactContent } from '@/content/contact';

const contactContent: ContactContent = {
  metadata: { title: 'Contact', description: 'Contactez notre équipe pour vos demandes, excursions sur mesure et trajets personnalisés.' },
  hero: { titleBefore: 'Planifions votre', titleHighlight: 'trajet.' },
  details: { title: 'Nous contacter', description: 'Notre équipe est là pour vous aider.' },
  benefits: { title: 'Pourquoi nous contacter ?', items: [{ title: 'Réponse rapide', text: 'Une réponse personnelle dans un délai d’un jour ouvrable.' }, { title: 'Service sur mesure', text: 'Chaque itinéraire est préparé selon vos besoins.' }, { title: 'Sans engagement', text: 'Recevez une offre claire et réfléchie avant de réserver.' }] },
  enquiry: {
    eyebrow: 'Formulaire de demande', intro: 'Parlez-nous un peu de vos projets, nous nous occupons du reste.',
    subject: { general: 'Demande', customTrip: 'Demande de trajet sur mesure', tripTemplate: 'Demande : {name}', vehicleTemplate: 'Demande de prix : {name}' },
    form: {
      context: { eyebrow: 'Demande concernant' }, contact: { title: 'Vos coordonnées', description: 'Afin que notre équipe puisse vous recontacter.' }, journey: { title: 'Détails du trajet', description: 'Des informations facultatives nous aident à préparer une offre précise.' },
      fields: { fullName: 'Nom complet', email: 'Adresse e-mail', phone: 'Numéro de téléphone', preferredContact: 'Moyen de contact préféré', travelDate: 'Date du trajet', returnDate: 'Date de retour', passengers: 'Passagers', luggage: 'Bagages', pickup: 'Lieu de prise en charge', dropoff: 'Destination', message: 'Comment pouvons-nous vous aider ?', messagePlaceholder: 'Parlez-nous de votre trajet ou de votre demande...' },
      contactMethods: { noPreference: 'Sans préférence', email: 'E-mail', phone: 'Téléphone', whatsapp: 'WhatsApp' }, security: { title: 'Une vérification de sécurité est nécessaire avant l’envoi de votre demande.', description: 'Elle aide à protéger notre équipe contre les messages automatisés.' }, errors: { security: 'Veuillez terminer la vérification de sécurité avant d’envoyer votre demande.', fallback: 'Nous n’avons pas pu envoyer votre demande. Veuillez réessayer.' }, success: { title: 'Merci', message: 'Votre demande a bien été reçue. Notre équipe vous recontactera rapidement.', reference: 'Référence' }, sending: 'Envoi de la demande…', submit: 'Envoyer la demande', responseTime: 'Nous répondons généralement dans un délai d’un jour ouvrable.',
    },
  },
};

export default contactContent;
