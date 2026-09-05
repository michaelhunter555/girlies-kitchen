# Girlie's Kitchen

Next.js site for Girlie's Kitchen Jamaican Cuisine (Belcamp, MD).

## Stack

- Next.js (App Router) + TypeScript
- MUI (brochure colors: green, gold, black, cream)
- MongoDB + Mongoose
- TanStack Query
- Stripe (deposit checkout)
- Brevo (transactional email)
- Google Analytics (GA4)

## Setup

1. Copy `.env` and fill:

```
MONGODB_URI=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
ADMIN_EMAIL=
ADMIN_PASSWORD=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
BREVO_API_KEY=
BREVO_SENDER_EMAIL=
BREVO_SENDER_NAME=Girlie's Kitchen
ADMIN_NOTIFY_EMAIL=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

2. Install and run:

```
npm install
npm run dev
```

Open http://localhost:3000

## Contact

Phone: 443-467-0970
Location: Belcamp, MD
