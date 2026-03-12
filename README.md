 ─ ── empty.tsx
    │   │   ├── field.tsx
    │   │   ├── form.tsx
    │   │   ├── hover-card.tsx
    │   │   ├── input-group.tsx
    │   │   ├── input-otp.tsx
    │   │   ├── input.tsx
    │   │   ├── item.tsx
    │   │   ├── kbd.tsx
    │   │   ├── label.tsx
    │   │   ├── menubar.tsx
    │   │   ├── navigation-menu.tsx
    │   │   ├── pagination.tsx
    │   │   ├── popover.tsx
    │   │   ├── progress.tsx
    │   │   ├── radio-group.tsx
    │   │   ├── resizable.tsx
    │   │   ├── scroll-area.tsx
    │   │   ├── select.tsx
    │   │   ├── separator.tsx
    │   │   ├── sheet.tsx
    │   │   ├── sidebar.tsx
    │   │   ├── skeleton.tsx
    │   │   ├── slider.tsx
    │   │   ├── sonner.tsx
    │   │   ├── spinner.tsx
    │   │   ├── switch.tsx
    │   │   ├── table.tsx
    │   │   ├── tabs.tsx
    │   │   ├── textarea.tsx
    │   │   ├── toggle-group.tsx
    │   │   ├── toggle.tsx
    │   │   └── tooltip.tsx
    │   │
    │   ├── filter-carousel.tsx        # Filter carousel component
    │   ├── infinite-scroll.tsx        # Infinite scroll component
    │   ├── responsive-dialog.tsx      # Responsive dialog component
    │   └── user-avatar.tsx            # User avatar component
    │
    ├── db/                            # Database configuration
    │   ├── index.ts                   # Database instance
    │   └── schema.ts                  # Database schema
    │
    ├── hooks/                         # Custom React hooks
    │   ├── use-intersection-observer.ts
    │   └── use-mobile.ts
    │
    ├── lib/                           # Utility libraries
    │   ├── mux.ts                     # Mux video configuration
    │   ├── ratelimit.ts               # Rate limiting utility
    │   ├── redis.ts                   # Redis configuration
    │   ├── uploadthing.ts             # UploadThing configuration
  
    │       ├── constants.ts            # Video constants
    │       ├── server/
    │       │   └── procedures.tsx     # Video procedures
    │       └── ui/
    │           └── components/
    │               ├── video-player.tsx
    │               └── video-thumbnail.tsx
    │
    ├── scripts/                       # Utility scripts
    │   └── seed-categories.ts        # Category seeding script
    │
    └── trpc/                          # tRPC configuration
        ├── client.tsx                 # tRPC client
        ├── init.ts                    # tRPC initialization
        ├── query-client.ts            # Query client
        ├── server.tsx                 # tRPC server
        └── routers/
            └── _app.ts                # Main router
```

## Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v20 or later)
-   [Bun](https://bun.sh/)
-   A [Clerk](https://clerk.com/) account
-   A [Neon](https://neon.tech/) account (or any other PostgreSQL provider)
-   A [Mux](https://www.mux.com/) account
-   An [Upstash](https://upstash.com/) account for Redis and Rate Limiting

### Installation

1.  **Clone the repository:**
    
```
bash
    git clone https://github.com/your-username/youtube-v2.git
    cd youtube-v2
    
```

2.  **Install dependencies:**
    
```
bash
   