
- 
│   │   │   ├── drawer.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── empty.tsx
│   │   │   ├── field.tsx
│   │   │   ├── form.tsx
│   │   │   ├── hover-card.tsx
│   │   │   ├── input-group.tsx
│   │   │   ├── input-otp.tsx
│   │   │   ├── input.tsx
│   │   │   ├── item.tsx
│   │   │   ├── kbd.tsx
│   │   │   ├── label.tsx
│   │   │   ├── menubar.tsx
│   │   │   ├── navigation-menu.tsx
│   │   │   ├── pagination.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── radio-group.tsx
│   │   │   ├── resizable.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── sonner.tsx
│   │   │   ├── spinner.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── toggle-group.tsx
│   │   │   ├── toggle.tsx
│   │   │   └── tooltip.tsx
│   │   ├── filter-carousel.tsx
│   │   ├── infinite-scroll.tsx
│   │   ├── responsive-dialog.tsx
│   │   └── user-avatar.tsx
│   ├── db
│   │   ├── index.ts
│   │   └── schema.ts
│   ├── hooks
│   │   ├── use-intersection-observer.ts
│   │   └── use-mobile.ts
│   ├── lib
│   │   ├── mux.ts
│   │   ├── ratelimit.ts
│   │   ├── redis.ts
│   │   └── utils.ts
│   ├── modules
│   │   ├── auth
│   │   │   └── ui
│   │   │       └── components
│   │   │           └── auth-button.tsx
│   │   ├── categories
│   │   │   └── server
│   │   │       └── procedures.ts
│   │   ├── home
│   │   │   └── ui
│   │   │       ├── components
│   │   │       │   ├── home-navbar
│   │   │       │   │   ├── home-input.tsx
│   │   │       │   │   └── index.tsx
│   │   │       │   └── home-sidebar
│   │   │       │       ├── index.tsx
│   │   │       │       ├── main-section.tsx
│   │   │       │       └── personal-section.tsx
│   │   │       ├── layouts
│   │   │       │   └── home-layouts.tsx
│   │   │       ├── sections
│   │   │       │   └── categories-section.tsx
│   │   │       └── views
│   │   │           └── home-view.tsx
│   │   ├── studio
│   │   │   ├── server
│   │   │   │   └── procedures.ts
│   │   │   └── ui
│   │   │       ├── components
│   │   │       │   ├── studio-navbar
│   │   │       │   │   └── index.tsx
│   │   │       │   ├── Studio-sidebar
│   │   │       │   │   ├── index.tsx
│   │   │       │   │   └── studio-sidebar-header.tsx
│   │   │       │   ├── studio-upload-modal.tsx
│   │   │       │   └── studio-uploader.tsx
│   │   │       ├── layouts
│   │   │       │   └── studio-layout.tsx
│   │   │       ├── sections
│   │   │       │   ├── form-section.tsx
│   │   │       │   └── videos-section.tsx
│   │   │       └── views
│   │   │           ├── studio-view.tsx
│   │   │           └── video-view.tsx
│   │   └── videos
│   │       ├── server
│   │       │   └── procedures.tsx
│   │       └── ui
│   │           └── components
│   │               ├── video-player.tsx
│   │               └── video-thumbnail.tsx
│   ├── scripts
│   │   └── seed-categories.ts
│   ├── trpc
│   │   ├── routers
│   │   │   └── _app.ts
│   │   ├── client.tsx
│   │   ├── init.ts
│   │   ├── query-client.ts
│   │   └── server.tsx
│   ├── constants.ts
│   ├── middleware.ts
│   └── README.md
├── .gitignore
├── bun.lock
├── components.json
├── desktop.ini
├── drizzle.config.ts
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
├── tsconfig.json
└── tsconfig.tsbuildinfo
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
    ```bash
    git clone https://github.com/your-username/youtube-v2.git
    cd youtube-v2
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add the following environment variables. You can get these values from the respective service dashboards.

    ```env
    # Neon Database URL
    DATABASE_URL="your_database_url"

    # Clerk Authentication
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
    CLERK_SECRET_KEY="your_clerk_secret_key"
    NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
    NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"
    CLERK_WEBHOOK_SECRET="your_clerk_webhook_secret"


    # Mux Video
    MUX_TOKEN_ID="your_mux_token_id"
    MUX_TOKEN_SECRET="your_mux_token_secret"
    MUX_WEBHOOK_SECRET="your_mux_webhook_secret"


    # Upstash Rate Limiting
    UPSTASH_REDIS_REST_URL="your_upstash_redis_url"
    UPSTASH_REDIS_REST_TOKEN="your_upstash_redis_token"
    ```
  

4.  **Run database migrations:**
    This command will push the schema from `src/db/schema.ts` to your Neon database.
    ```bash
    bun drizzle-kit pus
    ```

5.  **Run the development server:**
    ```bash
    bun run dev
    ```
    The application should now be running at [http://localhost:3000](http://localhost:3000).

## Scripts

-   `bun run dev`: Starts the development server.
-   `bun run build`: Creates a production-ready build of the application.
-   `bun run start`: Starts the production server.
-   `bun run lint`: Lints the codebase using Next.js's built-in ESLint configuration.
-   `bun drizzle-kit push`: Pushes the database schema to the database. 



