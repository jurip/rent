## Context

This is a greenfield project — no existing codebase or infrastructure. The goal is to build a modern, visually polished real estate rental platform from scratch. The application needs to serve two primary user roles (renters and landlords) with a mobile-first, responsive design.

**Constraints:**
- Must be production-quality in terms of UI/UX — animations, transitions, loading states, error handling
- Mobile-first responsive design
- Fast page loads and smooth interactions
- Clean, maintainable codebase suitable for iteration

## Goals / Non-Goals

**Goals:**
- Full-featured rental marketplace with property listings, search, bookings, and reviews
- Beautiful, modern UI with smooth animations and polished interactions
- Role-based access (renter vs landlord) with appropriate dashboards
- Image-heavy property pages with galleries and virtual tour support
- Responsive design that works great on mobile and desktop
- Clean component architecture with reusable design system

**Non-Goals:**
- Payment processing (out of scope for initial release — handled offline or in a future phase)
- Real-time chat (initial version uses request-based messaging)
- Native mobile apps (web-first; PWA can be added later)
- Admin panel (landlord dashboard covers listing management; full admin can be added later)
- i18n / multi-language (English-only for initial release)
- Advanced analytics or reporting

## Decisions

### 1. Tech Stack: React + Vite + TypeScript + Tailwind CSS

**Choice:** React 18+ with Vite, TypeScript, and Tailwind CSS for the frontend.

**Why:**
- React has the largest ecosystem and component libraries for building polished UIs
- Vite provides fast HMR and builds, improving developer experience
- TypeScript catches errors early and improves maintainability
- Tailwind CSS enables rapid, consistent styling without fighting CSS specificity. Utility-first approach pairs well with a custom design system
- Large talent pool and community support

**Alternatives considered:**
- Next.js: Adds SSR/SSG which is valuable for SEO of property pages, but adds complexity. Can be adopted later if SEO becomes important.
- Vue/Svelte: Great frameworks but smaller ecosystem for UI component libraries.
- CSS-in-JS (styled-components, etc.): Runtime overhead; Tailwind's build-time approach is faster.

### 2. Backend: Node.js + Express + TypeScript + Prisma

**Choice:** Express.js with TypeScript, Prisma ORM, and PostgreSQL.

**Why:**
- Single language (TypeScript) across full stack reduces context switching
- Prisma provides type-safe database access that pairs perfectly with TypeScript
- PostgreSQL is robust, supports geospatial queries (for map-based search), and has great hosting options
- Express is battle-tested, simple, and has extensive middleware ecosystem

**Alternatives considered:**
- Next.js API routes: Too coupled to the frontend framework. Separate backend is more flexible.
- Python/FastAPI: Different language stack, harder to share types.
- Supabase/Firebase: Faster to start but less flexible long-term; vendor lock-in concern.

### 3. Design System: Custom component library with shadcn/ui foundation

**Choice:** Build on shadcn/ui principles — copy-paste components built on Radix UI primitives, styled with Tailwind.

**Why:**
- Full control over component appearance and behavior
- Radix UI provides accessible, unstyled primitives
- Tailwind classes make customization straightforward
- No npm dependency on a component library — components live in the repo
- Consistent design language across the entire application

### 4. Animations: Framer Motion

**Choice:** Framer Motion for page transitions, scroll animations, hover effects, and micro-interactions.

**Why:**
- Declarative API that integrates naturally with React
- Layout animations for smooth list reordering, gallery transitions
- Gesture support for swipe interactions on mobile
- Built-in spring physics for natural-feeling motion

### 5. State Management: React Query + Zustand

**Choice:** TanStack Query (React Query) for server state, Zustand for client state.

**Why:**
- React Query handles caching, background refetching, optimistic updates, and loading/error states automatically
- Zustand is minimal (1KB), simple API, no boilerplate
- Clear separation: server data in React Query, UI state in Zustand

### 6. Image Handling: Local file uploads + sharp for optimization

**Choice:** Server-side file uploads with sharp for image optimization. Generate multiple sizes (thumbnail, medium, full).

**Why:**
- Avoids external service dependency for MVP
- sharp is fast and produces great optimized images
- Can migrate to CDN/S3 later without changing the API contract
- Property images are the core visual element — fast loading is critical

### 7. Maps: Leaflet (OpenStreetMap)

**Choice:** Leaflet with OpenStreetMap tiles for property location display and map-based search.

**Why:**
- Free, no API key required for basic usage
- Lightweight and performant
- React-Leaflet provides good React bindings
- Can switch to Google Maps/Mapbox later if needed

### 8. Authentication: JWT with refresh tokens (HTTP-only cookies)

**Choice:** JWT access tokens (short-lived, 15min) + refresh tokens (HTTP-only cookie, 7 days).

**Why:**
- Stateless auth scales well
- HTTP-only cookies prevent XSS token theft
- Refresh token rotation adds security
- Well-understood pattern with good library support (bcrypt, jsonwebtoken)

## Architecture Overview

```
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/         # Base design system (buttons, inputs, cards, etc.)
│   │   │   └── shared/     # Shared composite components (property card, gallery, etc.)
│   │   ├── features/       # Feature-specific components and logic
│   │   │   ├── auth/
│   │   │   ├── listings/
│   │   │   ├── property/
│   │   │   ├── booking/
│   │   │   ├── dashboard/
│   │   │   ├── favorites/
│   │   │   └── reviews/
│   │   ├── hooks/          # Shared custom hooks
│   │   ├── stores/         # Zustand stores
│   │   ├── lib/            # Utilities, API client, types
│   │   └── styles/         # Global styles, Tailwind config
│   └── public/
├── server/                 # Express backend
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── services/       # Business logic
│   │   ├── db/             # Prisma schema, migrations
│   │   └── lib/            # Utilities, types
│   └── uploads/            # Local file storage (dev)
└── shared/                 # Shared TypeScript types between client and server
```

## Risks / Trade-offs

- **Image storage on local disk** → Risk of disk space issues and no redundancy. Mitigation: Set file size limits; plan migration to S3/Cloudinary when needed.
- **No SSR** → SEO may suffer for property detail pages. Mitigation: Add Next.js or prerendering later if SEO becomes a priority.
- **Leaflet maps may look less polished than Google Maps** → Mitigation: Custom tile styling and markers can improve aesthetics; easy to swap provider later.
- **Greenfield scope is large** → Risk of feature creep and slow initial delivery. Mitigation: Strict prioritization of core flows; non-goals documented above.
- **JWT stateless auth means no server-side session revocation** → Mitigation: Short access token TTL (15min); token blacklist for critical revocations.

## Open Questions

- Exact design aesthetic (color palette, typography, vibe)? Start with a modern, minimal palette (warm neutrals, accent teal/emerald) and refine based on feedback.
- Property data seeding strategy for development? Use a seed script with realistic dummy data and placeholder images.
