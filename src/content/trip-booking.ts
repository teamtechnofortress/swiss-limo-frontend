export type TripBookingContent = {
  metadata: { title: string; description: string };
  hero: { titleBefore: string; titleHighlight: string };
  progress: { label: string; steps: [string, string, string] };
  flow: {
    step: string; planTitle: string; planIntro: string; pickupLocation: string; pickupLocationHelp: string;
    pickupAddress: string; pickupAddressHelp: string; addressPlaceholder: string; travelDate: string;
    noticeHours: string; departureTime: string; preferredDepartureTime: string; travellers: string;
    traveller: string; travellersPlural: string; travellerFixedLimit: string; travellerRange: string;
    travellerSelectRange: string; travellerPlaceholder: string; travellerNotSelected: string;
    security: string; preparing: string; checking: string; chooseVehicle: string; preparingError: string;
    pickupLocationError: string; pickupAddressError: string; travellerError: string; departureError: string;
    quoteError: string; quoteSecurityError: string; vehicleTitle: string; vehicleIntro: string;
    quoteValidUntil: string; editJourney: string; noVehicles: string; changeJourney: string; continue: string;
    finaliseBooking: string; backToVehicles: string; chooseVehicleError: string; contactError: string;
    bookingSecurityError: string; quoteUnavailable: string; fallbackError: string;
  };
  summary: {
    title: string; journey: string; selectPickup: string; date: string; travellers: string;
    selectedVehicle: string; aboutDuration: string; minutes: string; hour: string; hours: string; hoursWithMinutes: string;
  };
  offer: { passengers: string; luggage: string; vatIncluded: string; vatExcluded: string };
  unavailable: { title: string; description: string; enquiry: string };
};
