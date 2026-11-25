export type HeaderCopy = {
  brandTagline: string;
  navigationLabel: string;
  mobileNavigationLabel: string;
  languageLabel: string;
  toggleMenu: string;
  bookRide: string;
  nav: {
    home: string;
    fleet: string;
    airportTransfers: string;
    wef: string;
    dayTours: string;
    about: string;
    contact: string;
  };
};

export type FooterCopy = {
  brandTagline: string;
  description: string;
  navigationLabel: string;
  quickLinks: string;
  contactUs: string;
  followUs: string;
  callUs: string;
  emailUs: string;
  visitUs: string;
  allRightsReserved: string;
  privacyPolicy: string;
  termsAndConditions: string;
  nav: {
    home: string;
    airportTransfers: string;
    dayTours: string;
    fleet: string;
    about: string;
    contact: string;
  };
};

export type LayoutCopy = {
  header: HeaderCopy;
  footer: FooterCopy;
};
