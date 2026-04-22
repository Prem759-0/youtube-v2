
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
- **Other**: React Hook Form, 
