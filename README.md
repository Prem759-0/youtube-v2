
#  ⚒️ The app is under development 🛠️⚒️
---

# YouTube V2 - Full-Stack YouTube Clone


## Overview
Modern YouTube clone with T3 stack (Next.js 16 App Router, tRPC, TypeScript, Tailwind, Drizzle ORM on PostgreSQL/Neon). Features: Clerk auth, Mux video upload/streaming/processing, creator studio, home feed with categories/sidebar/infinite scroll, comments/reactions/views/subscriptions, AI workflows (title/desc/thumbnail gen via OpenRouter/Google GenAI), Shadcn UI, responsive design. Scalable, typesafe end-to-end.

**Key Modules**: auth, categories, comments (form/item UI, server procs), home (feed/navbar/sidebar), studio (upload/edit/dashboard), subscriptions, users, video-reactions/views, videos (upload/edit/categories/player/thumbnail).

## Tech Stack (from package.json)
- **Framework**: Next.js 16.1.1, React 19.2.3
- **Styling/UI**: Tailwind CSS 4, Shadcn/Radix-UI (50+ components), Lucide icons, clsx/cva/tailwind-merge
- **API/Data**: tRPC 11-rc.730 (react-query), Drizzle ORM 0.39/Neon serverless, Zod validation
- **Auth**: Clerk 6.10.3 (webhooks)
- **Video/Media**: Mux (player/uploader/node/sdk), Uploadthing 7.7.4
- **AI/Workflows**: @google/generative-ai 0.24.1, OpenRouter SDK 0.9.11, Upstash Workflow 0.2.6
- **Cache/DB Utils**: Upstash Redis/Ratelimit 1.34.3/2.0.5
- **Other**: React Hook Form, Sonner toasts, Recharts, Embla carousel, Vaul drawer, Superjson, Svix webhooks
- **Dev**: Bun, Drizzle-kit 0.30.3, ESLint 9, tsx 4.19.2

## Full Detailed Project Structure
Detailed tree with every file/folder (from recursive scan). Descriptions based on names/conventions (e.g., procedures.ts = TRPC server procedures).

```
youtube-v2/ (Root)
├── .gitignore                  # Git ignores
├── bun.lock                    # Bun dependency lock
├── components.json             # Shadcn UI config
├── drizzle.config.ts           # Drizzle migrations/config
├── eslint.config.mjs           # ESLint 9 flat config
├── next-env.d.ts               # Next.js types
├── next.config.ts              # Next.js config (e.g., images/Mux)
├── package-lock.json           # NPM lock (fallback)
├── package.json                # Deps/scripts (dev: bun run dev -p 3000)
├── postcss.config.mjs          # PostCSS/Tailwind
├── README.md                   # This doc
├── TODO.md                     # Task tracker
├── tsconfig.json               # TS config

├── public/                     # Static assets
│   ├── favicon.png
│   ├── file.svg
│   ├── globe.svg
│   ├── logo.svg
│   ├── placeholder.svg
│   ├── user-placeholder.svg
│   ├── user.jpg                # Sample user img (open in tabs)
│   ├── window.svg
│   ├── Y_logo.ico
│   └── Y_logo.png

├── src/                        # All source code
│   ├── constants.ts            # App constants (e.g., video limits)
│   ├── proxy.ts                # Proxy config?
│   └── README.md               # Brief src overview

│   ├── app/                    # Next.js App Router (route groups: (auth)/(home)/(studio))
│   │   ├── globals.css         # Tailwind global styles
│   │   └── layout.tsx          # Root layout (providers: TRPC/Clerk/Theme/Query)
│   │
│   │   ├── (auth)/             # Auth routes group
│   │   ├── (home)/             # Home/protected routes
│   │   └── (studio)/           # Studio/creator routes
│   │
│   │   └── api/                # API routes (serverless functions)
│   │       ├── trpc/[trpc]/route.ts               # Main TRPC handler (_app router)
│   │       ├── uploadthing/core.ts                # Uploadthing config
│   │       └── uploadthing/route.ts               # Uploadthing handler
│   │       ├── users/webhook/route.ts             # Clerk user webhook
│   │       └── videos/
│   │           ├── webhook/route.ts               # Mux video webhook (processing)
│   │           └── workflows/                     # AI workflows (Upstash)
│   │               ├── description/route.ts       # AI video desc gen
│   │               ├── thumbnail/route.ts         # AI thumbnail gen
│   │               └── title/route.ts             # AI title gen

│   ├── components/             # Reusable UI (custom + Shadcn)
│   │   ├── filter-carousel.tsx # Category filter carousel (Embla)
│   │   ├── infinite-scroll.tsx # Infinite/paginated scroll
│   │   ├── responsive-dialog.tsx
│   │   └── user-avatar.tsx
│   │   └── ui/                 # Shadcn/Radix primitives (50+ files)
│   │       ├── accordion.tsx, alert-dialog.tsx, alert.tsx, aspect-ratio.tsx, avatar.tsx
│   │       ├── badge.tsx, breadcrumb.tsx, button-group.tsx, button.tsx
│   │       ├── calendar.tsx, card.tsx, carousel.tsx, chart.tsx (Recharts)
│   │       ├── checkbox.tsx, collapsible.tsx, command.tsx
│   │       ├── context-menu.tsx, dialog.tsx, drawer.tsx (Vaul), dropdown-menu.tsx
│   │       ├── empty.tsx, field.tsx, form.tsx (React Hook Form + Zod)
│   │       ├── hover-card.tsx,                          # tRPC 
