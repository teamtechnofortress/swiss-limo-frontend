# Alpine Chauffeur · Website

Luxury chauffeur website in black and soft gold. Built with Next.js 15 (App Router), TypeScript and Tailwind CSS.
It talks to the Laravel booking API and falls back to sample data where an endpoint is not available.

## Quick start

```bash
cp .env.example .env.local      # then fill in the values
npm install
npm run dev                      # http://localhost:3000
```

Also deploy the backend changes in `backend-addition/` (see its README). The website needs them for live vehicles
and for the pre-selected vehicle on the booking page.

## Environment

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API including `/api`, for example `https://api.example.ch/api` |
| `NEXT_PUBLIC_BRAND_NAME` | Brand name shown in the header, footer and pages |
| `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_CONTACT_PHONE` | Contact details |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key. Required while the backend has bot checks on |

`FRONTEND_URL` in the Laravel `.env` must equal this site's origin. Stripe redirects and email links use it.

## Pages

| Route | What it does | Data |
|---|---|---|
| `/` | Hero with quick search, trust points, fleet preview, airport band, tours, how it works | API with sample fallback |
| `/fleet` | Vehicle grid with category tabs | API with sample fallback |
| `/fleet/[slug]` | Gallery, specifications, amenities, price, book button | API with sample fallback |
| `/book` | Three-step booking: journey, vehicle, details and payment | Live quotes and bookings |
| `/airport-transfers` | Zurich, Geneva and Basel airport journeys | Static |
| `/tours`, `/tours/[slug]` | Private tours | Static (`src/lib/tours.ts`) |
| `/bookings/[reference]` | Booking status, pay now, cancellation request | Live, with the access token from this browser tab |
| `/bookings/verify?token=` | Cash booking confirmation from the email link | Live |
| `/about`, `/contact` | Company story and contact details | Static |

## How the data flows

- **Vehicles:** `GET /public/vehicles` and `GET /public/vehicles/{slug}`. If the API is down or empty, the site shows the
  sample fleet in `src/lib/fleet.ts`.
- **Quote:** the browser sends Google place IDs, the time and the party size. The price comes only from the server.
- **Booking:** the browser sends the quote token and the chosen vehicle. The response contains an access token. It is kept in
  `sessionStorage` for this tab only, never in the URL after the first visit.
- **Payment:** online bookings go to Stripe Checkout. Stripe redirects back to `/bookings/{reference}?payment=success`.
  The page refreshes until the webhook confirms the payment.

## Design

| Token | Value | Use |
|---|---|---|
| `ink` | `#0b0b0c` | Background |
| `ink-soft`, `ink-raised` | `#141416`, `#1b1b1e` | Cards and panels |
| `gold` | `#c9a96e` | Accents, prices, labels |
| `gold-soft` | `#e6d3a6` | Highlights in gradients |
| `ivory` | `#f4efe4` | Text |
| Headings | Cormorant Garamond | Editorial, elegant headings |
| Body | Inter | Interface and body text |

## What to replace before launch

1. **Brand and contact** details in `.env.local`.
2. **Photos.** Vehicles show a placeholder until the backend returns images. Upload photos in Media Library.
3. **Copy.** The vehicle descriptions in `src/lib/fleet.ts`, the tour texts in `src/lib/tours.ts` and the about text are
   written as neutral placeholders. Replace them with your own wording and facts.
4. **Prices** in `src/lib/fleet.ts` are sample values for the fallback only. Live prices come from the API.
5. **Legal pages.** Add terms, privacy and cancellation pages. The footer and booking pages refer to a cancellation policy.

## Things to know

- **Address search needs a browser key.** The frontend obtains it from `GET /api/public/config` as `google_maps_browser_key`; without it, suggestions do not appear. Restrict the key to your browser domains and enable only Places API (New). Turn the
  booking form into a manual entry only if you change the backend to accept text addresses, which it does not do today.
- **Pre-filled airport addresses** are resolved to the first Google suggestion when the page opens. Check the result on
  the booking page before you continue.
- **Bot checks.** With Turnstile on in the backend, the site must have its site key, or quotes and bookings will be refused.
- **Confirmation links** are single-use. Some email clients open links automatically. That is harmless: the second
  request simply returns the booking as confirmed.
- **Not run yet.** I could not install or build the project in my environment, so run `npm install` and `npm run typecheck`
  first and send me any errors.
- **Images** use plain `<img>` tags, which keeps the setup simple. Switch to `next/image` with a `remotePatterns` entry
  for your media host when you are ready to optimise images.

## Project structure

```
src/
  app/             pages (App Router): layout, home, fleet, book, airport, tours, bookings, about, contact
  components/
    layout/        header and footer
    ui/            buttons, fields, cards, section headings, image placeholder
    home/          hero with quick search
    fleet/         vehicle card, gallery, category tabs
    booking/       booking flow, place search, offers, Turnstile, booking status
  lib/             config, API client, types, formatting, Google Places, fleet and tour data
backend-addition/  Laravel files and changes the website needs
```
