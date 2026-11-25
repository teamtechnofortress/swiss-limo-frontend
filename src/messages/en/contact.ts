import type { ContactContent } from '@/content/contact';

const contactContent: ContactContent = {
  metadata: { title: 'Contact', description: 'Contact our team for enquiries, custom tours and bespoke journeys.' },
  hero: { titleBefore: "Let's plan your", titleHighlight: 'journey.' },
  details: { title: 'Contact us', description: 'Our team is here to help.' },
  benefits: {
    title: 'Why enquire with us?',
    items: [
      { title: 'Fast response', text: 'A personal reply within one working day.' },
      { title: 'Tailored service', text: 'Every itinerary is planned around your needs.' },
      { title: 'No obligation', text: 'Receive a clear, considered quote before booking.' },
    ],
  },
  enquiry: {
    eyebrow: 'Enquiry form',
    intro: "Tell us a little about your plans and we'll take care of the rest.",
    subject: { general: 'Enquiry', customTrip: 'Custom trip enquiry', tripTemplate: 'Enquiry: {name}', vehicleTemplate: 'Price request: {name}' },
    form: {
      context: { eyebrow: 'Enquiring about' },
      contact: { title: 'Your contact details', description: 'So our travel team can get back to you.' },
      journey: { title: 'Journey details', description: 'Optional details help us prepare an accurate quote.' },
      fields: { fullName: 'Full name', email: 'Email address', phone: 'Phone number', preferredContact: 'Preferred contact method', travelDate: 'Travel date', returnDate: 'Return date', passengers: 'Passengers', luggage: 'Luggage', pickup: 'Pickup location', dropoff: 'Drop-off location', message: 'How can we help?', messagePlaceholder: 'Tell us about your journey or request...' },
      contactMethods: { noPreference: 'No preference', email: 'Email', phone: 'Phone', whatsapp: 'WhatsApp' },
      security: { title: 'Security verification is required before sending your enquiry.', description: 'This helps protect our team from automated messages.' },
      errors: { security: 'Please complete the security check before sending your enquiry.', fallback: 'We could not send your enquiry. Please try again.' },
      success: { title: 'Thank you', message: 'Your enquiry has been received. Our travel team will get back to you shortly.', reference: 'Reference' },
      sending: 'Sending enquiry…',
      submit: 'Send enquiry',
      responseTime: 'We usually reply within one working day.',
    },
  },
};

export default contactContent;
