
#  ⚒️ The app is under development 🛠️⚒️
---

# YouTube V2 - Full-Stack YouTube Clone


## Overview
Modern YouTube clone with T3 stack (Next.js 16 App Router, tRPC, TypeScript, Tailwind, Drizzle ORM on PostgreSQL/Neon). Features: Clerk auth, Mux video upload/streaming/processing, creator studio, home feed with categories/sidebar/infinite scroll, comments/reactions/views/subscriptions, AI workflows (title/desc/thumbnail gen via OpenRouter/Google GenAI), Shadcn UI, responsive design. Scalable, typesafe end-to-end.

**Key Modules**: auth, categories, comments (form/item UI, server procs), home (feed/navbar/sidebar), studio (upload/edit/dashboard), subscriptions, users, video-reactions/views, videos (upload/edit/categories/player/thumbnail).

## Tech Stack (from package.json)
- **Framework**: Next.js 16.1.1, React 19.2.3
- **Styling/UI**: Tailwind CSS 4, Shadcn/Radix-UI (50+ components), Lucide icons, clsx/cva/tailwind-merge
- **API/Data**: tRPC 11-rc.730 