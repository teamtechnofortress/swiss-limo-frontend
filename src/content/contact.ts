export type EnquiryFormCopy = {
  context: { eyebrow: string };
  contact: { title: string; description: string };
  journey: { title: string; description: string };
  fields: {
    fullName: string;
    email: string;
    phone: string;
    preferredContact: string;
    travelDate: string;
    returnDate: string;
    passengers: string;
    luggage: string;
    pickup: string;
    dropoff: string;
    message: string;
    messagePlaceholder: string;
  };
  contactMethods: { noPreference: string; email: string; phone: string; whatsapp: string };
  security: { title: string; description: string };
  errors: { security: string; fallback: string };
  success: { title: string; message: string; reference: string };
  sending: string;
  submit: string;
  responseTime: string;
};

export type ContactContent = {
  metadata: { title: string; description: string };
  hero: { titleBefore: string; titleHighlight: string };
  details: { title: string; description: string };
  benefits: {
    title: string;
    items: { title: string; text: string }[];
  };
  enquiry: {
    eyebrow: string;
    intro: string;
    subject: {
      general: string;
      customTrip: string;
      tripTemplate: string;
      vehicleTemplate: string;
    };
    form: EnquiryFormCopy;
  };
};
