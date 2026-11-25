export type BookingContent = {
  metadata: { title: string; description: string };
  hero: { titleBefore: string; titleHighlight: string; imageAlt: string };
  progress: { label: string; steps: [string, string, string, string] };
  placeField: { selected: string };
  offer: {
    categories: { executive: string; firstClass: string; van: string };
    passengers: string;
    bags: string;
    discount: string;
    vatIncluded: string;
    vatExcluded: string;
  };
  customer: {
    title: string; intro: string; fullName: string; email: string; phone: string;
    flightNumber: string; flightPlaceholder: string; paymentMethod: string;
    payOnlineTitle: string; payOnlineText: string; payArrivalTitle: string; payArrivalText: string;
    security: string; back: string; continue: string; waiting: string;
  };
  flow: {
    step: string; planTitle: string; pickup: string; destination: string; addressPlaceholder: string;
    date: string; time: string; passengers: string; luggage: string; returnJourney: string;
    returnDate: string; returnTime: string; quoteSecurity: string; checking: string; chooseVehicle: string;
    vehicleTitle: string; vehicleIntro: string; vehicleAvailable: string; vehiclesAvailable: string;
    changeJourney: string; continue: string; reviewTitle: string; reviewIntro: string;
    journeyDetails: string; selectedVehicle: string; selectedForJourney: string; yourDetails: string;
    priceSummary: string; from: string; to: string; distance: string; ratePerKm: string;
    estimatedTotal: string; edit: string; fullName: string; email: string; phone: string;
    flightNumber: string; bookingSecurity: string; bookingSecurityDescription: string;
    backToDetails: string; processing: string; bookNow: string; confirmBooking: string;
    bookingSummary: string; termsPrefix: string; terms: string; termsJoiner: string; privacy: string;
    instantRequest: string; confirmationVia: string; teamContact: string; selectedVehicleLabel: string;
    route: string; return: string; chooseVehicleForPrice: string; needHelp: string; helpText: string; chat?: string;
    addressError: string; quoteSecurityError: string; chooseVehicleError: string; contactError: string;
    bookingSecurityError: string; fallbackError: string;
  };
};
