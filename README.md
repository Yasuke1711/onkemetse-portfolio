# Onkemetse Khavara · Portfolio

A personal developer portfolio and web-development showcase for Onkemetse Khavara. The project uses the clean section-led structure of the JavaScript Mastery portfolio tutorial as a reference, with an independently implemented Next.js application.

## Stack

- Next.js 16.4.6 (App Router)
- React 19.3.1
- TypeScript
- Tailwind CSS 4.3.5 (PostCSS integration)
- Motion for React

## Getting started

Requirements: Node.js 20.9 or later.

```bash
npm install
cp .env.example .env.local
# Add a real inbox to NEXT_PUBLIC_CONTACT_EMAIL before enabling enquiries.
npm run dev
```

Open http://localhost:3000.

## Available scripts

```bash
npm run dev       # local development
npm run build     # production build
npm run start     # run production build
npm run lint      # ESLint
npm run typecheck # TypeScript check
```

## Project structure

```text
src/
  app/
    globals.css
    layout.tsx
    page.tsx
  components/
    portfolio.tsx
  data/
    projects.ts
```

## Notes before publishing

- The project and demo catalogue deliberately distinguishes **Selected work** from **Concept demos**. Do not present concept websites as commissioned client work.
- Some portfolio entries are initial records and need approved screenshots, precise project descriptions and live URLs before launch.
- Replace or curate the remote Unsplash photographs with properly licensed assets for the final demos. The current images are visual placeholders.
- The currency selector requests indicative exchange rates through `/api/rates`, backed by ExchangeRate-API Open Access (`open.er-api.com`). The server caches the source response for 24 hours. Provider attribution is linked in the pricing section. If the service is unavailable or does not provide a rate for a currency, the UI falls back to an unavailable/quote-on-request state. The provider permits commercial conversion but prohibits redistribution of raw rate data. Agree the actual quotation currency with each client; displayed conversions are not contract prices.
- Zimbabwe Gold (ZiG / ZWG) may not be available from the exchange-rate provider. USD remains available as an alternative display currency.
- The contact form posts to `/api/contact`. Configure `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and a verified `CONTACT_FROM_EMAIL` in Vercel to enable server-side delivery. Until those values are configured, the form prepares an email in the visitor's email app instead.
- Canonical and social-sharing metadata currently use `https://onkemetse-portfolio.vercel.app`. Update this when a custom production domain is selected.
- Do not reuse the original tutorial author's Sanity project ID, dataset or credentials. A separate Sanity project can be configured later if a CMS becomes useful.

## Design direction

The first pass establishes the page architecture and visual language: Home, About, Work, Skills and Contact. It includes scroll reveals, an active section indicator, animated project filtering, indicative pricing and 50/50 payment terms. The concept website demos will be implemented as their own routes in a later phase.

## Phase two additions

- Three dedicated project case studies live at `/work/mckay-plant-hire`, `/work/the-grand-house` and `/work/little-acacia`.
- A print-ready CV is available at `/cv`, with a browser print/save-to-PDF action.
- The contact form posts to `/api/contact`. Configure `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and a verified `CONTACT_FROM_EMAIL` in Vercel to enable server-side delivery. If delivery is not configured, the form prepares an email in the visitor's email app instead.
- Canonical metadata, social-sharing metadata, structured person data, robots rules and a sitemap are included.
- Website concepts remain explicitly labelled as concepts. Their sample rates, inventory, room details and enquiry interactions are not represented as live booking services.
