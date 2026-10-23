# BoroBazar — Grocery Shop

An online grocery store with a customer storefront and an admin dashboard, built with Next.js 16 (App Router). Customers browse and search products, order with cash on delivery, track their orders and review what they bought. Admins manage products, categories, flash sales and orders.

The data and business rules live in a separate Express + MongoDB API: [grocery-shop-server](https://github.com/emonahmed123/grocery-shop-server). This repository is the frontend.

## Contents

- [Project overview](#project-overview)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [File structure](#file-structure)
- [Frontend architecture](#frontend-architecture)
- [Deployment](#deployment)

## Project overview

| | |
|---|---|
| **Storefront** | Home, search, product pages, cart, checkout, and the customer's account pages. |
| **Admin dashboard** | `/dashboard`, for users with the `admin` role. |
| **Backend** | `grocery-shop-server`, reached only from the Next.js server through `BACKEND_URL`. |
| **Images** | Uploaded to [imgbb](https://imgbb.com); only the hosted link is stored. |
| **Payments** | Cash on delivery. Card payment is shown as "coming soon". |

Prices, stock and order totals are always worked out by the backend; the frontend never sends a price.

## Features

### Storefront
- **Home**: live flash sale, new arrivals and popular products, loaded from the backend on every request so new products show at once. Each section streams in on its own with a skeleton.
- **Search**: text search, category filter, four sort orders and "Load more". All of it sits in the URL (`/search?searchTerm=apple&category=fruits-items&sort=lowest-price`), so refresh, back and shared links keep the same results.
- **Product page**: gallery, live price (flash, sale or regular), stock, variations, related products and reviews.
- **Cart**: kept in `localStorage`, synced across tabs, capped at the stock.
- **Checkout**: district (with the delivery fee), address, Bangladeshi mobile number, delivery note and "leave at door". Orders are checked in the browser and again on the server.
- **Reviews**: only customers whose order with the product was delivered can review it, once per product.

### Customer account
- Register, log in, forgot and reset password.
- Profile, change password, and **My Orders** with items, payment and status.
- Emails from the backend when an order is placed and when its status changes.

### Admin dashboard
- **Overview**: revenue, orders, customers, stock alerts and recent orders.
- **Products**: server-side paging, search, category filter and sorting; add and edit in a modal; a details page.
- **Images**: paste a link, or upload from the computer (also by drag and drop). Uploads go to imgbb; photos larger than 1.5 MB are shrunk in the browser first.
- **Categories**: add, edit and delete, with image and icon uploads and sub categories. With no saved categories the store shows its demo list, which can be copied in with one click.
- **Flash sales**: start a sale on several products with a discount, time window and quantity limit. The **History** tab keeps every sale (ended, sold out, removed or replaced) with its units sold, orders and revenue.
- **Orders**: payment column and the status flow pending → confirmed → shipped → delivered, or cancelled (stock goes back).
- Collapsible sidebar, breadcrumbs, and a loading skeleton for every page.

## Tech stack

| Area | Tools |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Server Components, Server Actions, `proxy.ts`), React 19, TypeScript 5 |
| Styling | Tailwind CSS 4, [shadcn/ui](https://ui.shadcn.com) on Radix UI, `lucide-react` icons, `tw-animate-css` |
| Server state | TanStack Query 5 (with devtools in development) |
| Client state | Zustand 5 (cart and checkout) |
| Forms & validation | TanStack Form 1, Zod 4 |
| Tables | TanStack Table 9 |
| HTTP | Axios (server side only) |
| Other UI | Embla Carousel, Sonner toasts, `next-themes` |
| Images | imgbb API |
| Tooling | pnpm, ESLint 9 (`eslint-config-next`, TanStack Query plugin, `@shadcn/lint`) |
| Hosting | Vercel |

## Getting started

Requirements: **Node.js 24** (20.9 or newer works) and **pnpm** (through Corepack), plus a running [grocery-shop-server](https://github.com/emonahmed123/grocery-shop-server).

```bash
corepack enable
pnpm install
cp .env.example .env.local   # then fill in the values
pnpm dev                     # http://localhost:3000
```

### Environment variables

Both are read only on the server; neither has a `NEXT_PUBLIC_` prefix, so they never reach the browser.

| Name | Description |
|---|---|
| `BACKEND_URL` | Base URL of the backend, without `/api`, e.g. `http://localhost:5000`. |
| `IMGBB_API_KEY` | API key from [api.imgbb.com](https://api.imgbb.com), for image uploads in the dashboard. |

### Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm start` | Run the production build |
| `pnpm lint` | ESLint |

## File structure

```
.
├── app/                        # Routes (App Router)
│   ├── (mainlayout)/           # Storefront: header, footer, cart
│   │   ├── page.tsx            # Home
│   │   ├── search/             # Search and filters
│   │   ├── products/[slug]/    # Product page
│   │   ├── checkout/
│   │   ├── my-account/         # Profile, orders, change password (customers)
│   │   └── about-us, contact-us, faq, privacy, terms
│   ├── (auth)/                 # login, register, forgot-password, reset-password
│   ├── (dashboardlayout)/      # Admin only (checked in layout.tsx)
│   │   └── dashboard/          # overview, products, categories, flash-sale, orders, profile, change-password
│   ├── layout.tsx              # Root layout and providers
│   ├── error.tsx, not-found.tsx
│   └── globals.css             # Tailwind theme and brand colours
├── components/
│   ├── ui/                     # shadcn/ui primitives
│   ├── mainlayout/             # Storefront sections: home, search, product, checkout, layout…
│   ├── dashboard/              # Dashboard pages: products, categories, flash-sale, orders, overview, layout
│   ├── shared/                 # Used by both, e.g. the reusable DataTable and ProductImage
│   ├── form/                   # Form fields: AppField, AppTextareaField, ImageInput
│   ├── account/, auth/, cart/, icons/
├── actions/                    # Server Actions ("use server"): the browser's way into the backend
├── services/                   # Backend calls and response mapping (server only)
├── queries/                    # TanStack Query keys and query options
├── hooks/                      # Client hooks: queries, mutations, uploads, URL list state
├── store/                      # Zustand stores: cart, checkout
├── zod/                        # Validation schemas, shared by forms and server actions
├── types/                      # Shared TypeScript types
├── lib/                        # Helpers: axios client, auth cookies and routes, formatting, search params
├── providers/                  # QueryProvider, StoreHydration
├── public/                     # Static files and demo data (data/*.json)
├── proxy.ts                    # Route guard and token refresh before a page renders
└── next.config.ts
```

## Frontend architecture

### Rendering

- Pages are **Server Components** by default. Store pages fetch on the server (home and search per request, so new products appear immediately) and stream slow parts through `<Suspense>` with skeletons.
- Interactive parts (cart, forms, tables, filters) are **Client Components**.
- Every dashboard route has a `loading.tsx`, so navigation shows a skeleton straight away.

### How data moves

The browser never calls the backend directly. Every request goes through the Next.js server, which adds the user's token from an httpOnly cookie.

```
Component ─▶ hook (useQuery / useMutation) ─▶ query options (queries/)
          ─▶ Server Action (actions/)  ─▶ service (services/) ─▶ axios ─▶ backend API
```

| Layer | Folder | Job |
|---|---|---|
| Service | `services/` | Knows the backend: endpoints, request shape, and mapping responses to the app's types. `server-only`. |
| Server Action | `actions/` | The browser's entry point. Validates input with Zod again, checks the role for admin writes, and returns `{ success, message, data }` instead of throwing. |
| Query options | `queries/` | One place for query keys and fetchers, shared by server prefetching and client hooks. |
| Hooks | `hooks/` | `useQuery` / `useMutation` wrappers; mutations invalidate the right keys and show toasts. |

- **Prefetching**: dashboard pages prefetch on the server with `PrefetchBoundary` (`prefetchQuery` → `dehydrate` → `HydrationBoundary`), so tables render with data on the first paint and the client cache takes over from there.
- **Query keys** are nested (`["dashboard", "products", …]`), so one invalidation refreshes every list, detail page and flash sale view that depends on it.
- **Server-side tables**: the reusable `DataTable` (TanStack Table) runs in client mode for small lists or server mode, where paging, sorting, search and filters go to the backend and `keepPreviousData` keeps the current page visible while the next loads.
- **Search state in the URL**: the storefront search reads its options from `searchParams` and links to new URLs instead of keeping React state.

### State

| Kind | Where |
|---|---|
| Server data (products, orders, user) | TanStack Query cache |
| Cart | Zustand with `persist` (localStorage), read after the first render to avoid hydration mismatches |
| Checkout form | Zustand (not persisted) |
| Search and filters | The URL |
| Form state | TanStack Form with Zod schemas |

### Authentication

- Login stores the access and refresh tokens in **httpOnly cookies**; JavaScript in the page never sees them.
- `proxy.ts` runs before each page: it refreshes tokens that are about to expire, sends guests away from protected pages (`/checkout`, `/my-account`, `/dashboard`) and logged-in users away from `/login` and `/register`.
- The proxy is only a convenience. The dashboard layout checks the admin role on the server, admin Server Actions check it again, and the backend checks every request.
- Redirects after login only accept same-site paths, so the login page cannot be used as an open redirect.

### Image uploads

1. The admin picks or drops files in `ImageInput`.
2. Photos over 1.5 MB are scaled to 2000 px WebP in the browser.
3. Each image goes in its own request to `uploadImageAction` (imgbb takes one image per request, and Vercel limits request bodies to 4.5 MB). Several images upload in parallel.
4. The server action checks the admin role, file type and size, and sends the image to imgbb with the secret key.
5. The returned link is put into the form and saved like a pasted link. Saving waits until uploads finish.

## Deployment

The app is deployed on Vercel.

1. Set `BACKEND_URL` and `IMGBB_API_KEY` in **Project Settings → Environment Variables**.
2. `package.json` pins Node.js `24.x` through `engines`, which overrides the project's Node setting. Next.js 16 does not run on older versions.
3. Vercel detects pnpm from `pnpm-lock.yaml`; no build settings need changing.
