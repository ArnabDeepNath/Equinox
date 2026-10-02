# Equinox Sports Booking PWA (POC)

Premium gold/black themed sports booking platform built with **Next.js + Firebase**.

## Included in this POC

- User-facing platform with:
  - Venue and game discovery
  - Slot booking flow (multi-venue)
  - Membership request flow
  - Community feed (posts/comments/likes)
- Admin panel at `/admin` with:
  - Dashboard metrics
  - Bookings
  - Transactions
  - Membership approvals
  - Catalog management (venues/games/courts)
  - Audit logs
- Role-based access (Admin + User)
- Membership conditional booking:
  - Members-only slots
  - Member discounts
- Mock payment flow (gateway-ready architecture)
- Email confirmation (real SMTP if configured)
- WhatsApp notification mock logger
- PWA support (manifest + service worker)

## Tech Stack

- Next.js (App Router, TypeScript)
- Firebase (Auth/Firestore-ready setup)
- Tailwind CSS
- shadcn-style reusable UI primitives

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Copy env file:

```bash
cp .env.example .env.local
```

3. Fill Firebase and SMTP values in `.env.local`.

4. Run dev server:

```bash
npm run dev
```

Open: [http://localhost:3000](http://localhost:3000)

## Demo Users (POC)

- `admin@equinoxsport.com` (Admin)
- `aarav@example.com` (User, approved member)
- `meera@example.com` (User, pending member)

Use `/login` with any of the above emails.

## Firestore deployment files

- `firestore.rules`
- `firestore.indexes.json`

Deploy with Firebase CLI after linking your project.

## Deploying to Vercel

1. Push this repository to GitHub.
2. Import in Vercel.
3. Add all environment variables from `.env.example`.
4. Deploy.

## Notes for next phase

- Replace mock payment with Razorpay/Instamojo adapter.
- Enable Firebase Phone OTP auth.
- Move in-memory mock data to real Firestore reads/writes.
