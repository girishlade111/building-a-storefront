# Building a Storefront — Modern E-Commerce Storefront

A modern, themeable e-commerce storefront template built with Next.js, powered
by the **Shopify Storefront API**. Browse products, view collections, manage a
cart, and check out — with a polished landing experience (hero, featured
products, categories, newsletter, footer).

## What it does

This is a complete storefront UI wired to Shopify as the commerce backend:

- Product catalog and collection browsing (via Shopify Storefront GraphQL API)
- Product detail pages with image gallery, variants, and quantity selection
- Cart drawer with add/remove/quantity management (React context state)
- Featured products, category sections, hero banner, newsletter signup
- Dark/light theme support

## Features

- **Shopify integration** — products, single product, and collections fetched
  from the Shopify Storefront API (`lib/shopify.ts`, `hooks/use-shopify.ts`)
- **Cart system** — context-based cart with a slide-out cart drawer
  (`contexts/cart-context.tsx`, `components/cart-drawer.tsx`)
- **Product pages** — dynamic `/product/[id]` detail pages with gallery and tabs
- **Catalog page** — `/products` listing with loading states
- **Marketing sections** — hero, featured products, categories, newsletter, footer
- **Theming** — light/dark mode via `next-themes`
- **Animations** — Framer Motion micro-interactions
- **UI kit** — shadcn/ui primitives (button, card, badge, input)

## Tech stack

- **Next.js 14** (App Router) + **React 18** + TypeScript
- **Shopify Storefront API** (GraphQL, `2025-07`)
- **Tailwind CSS 3** + shadcn/ui (Radix primitives)
- **Framer Motion**, **Lucide React** icons

## Quick start

Prerequisites: Node.js 18+ and npm. You also need a Shopify store with a
Storefront API access token.

```bash
# Install dependencies
npm install --legacy-peer-deps

# Configure your store (create this file locally - never commit it)
cat > .env.local <<'EOF'
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
EOF

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
# Production build + start
npm run build
npm start
```

## Project structure

```
app/
  layout.tsx            # Root layout, theme provider
  page.tsx              # Homepage (hero, featured, categories, newsletter)
  products/
    page.tsx            # Product catalog
    loading.tsx         # Catalog loading state
  product/[id]/page.tsx # Product detail (client-side fetch by id)
components/
  navbar.tsx / hero.tsx / footer.tsx / newsletter.tsx
  featured-products.tsx / categories.tsx
  cart-drawer.tsx       # Slide-out cart
  theme-provider.tsx
  ui/                   # shadcn/ui primitives
contexts/
  cart-context.tsx      # Cart state management
hooks/
  use-shopify.ts        # useProducts / useProduct / useCollections hooks
lib/
  shopify.ts            # Storefront GraphQL client + TypeScript types
  utils.ts              # class-name helpers
```

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` | Yes | Your store domain, e.g. `your-store.myshopify.com` |
| `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Yes | Storefront API access token (create in Shopify admin → Apps → Headless) |

The app throws at startup if `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` is missing.
`.env*` files are git-ignored — never commit real tokens.

## Deployment

Standard Next.js hosting (Vercel recommended): set the two env vars above in
the hosting dashboard, then `npm run build` / `npm start`. The storefront is
client-rendered against Shopify, so it also works as a static export
(`output: "export"` in `next.config.mjs`) — note the dynamic
`/product/[id]` route needs `generateStaticParams` or client-side routing to
resolve under a purely static host. Originally built with v0.

## Credits

Built by Girish Lade — https://ladestack.in
