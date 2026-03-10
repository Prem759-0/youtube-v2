.

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
    bun install
    
```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add the following environment variables. You can get these values from the respective service dashboards.

    
```
env
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
    
```
bash
    bun drizzle-kit push
    
```

5.  **Run the development server:**
    
```
bash
    bun run dev
    
```
    The application should now be running at [http://localhost:3000](http://localhost:3000).

## Scripts

-   `bun run dev`: Starts the development server.
-   `bun run build`: Creates a production-ready build of the application.
-   `bun run start`: Starts the production server.
-   `bun run lint`: Lints the codebase using Next.js's built-in ESLint configuration.
-   `bun drizzle-kit push`: Pushes the database schema to the database.

## Project Overview

### Authentication (Clerk)
The project uses Clerk for authentication. The auth routes are located in `src/app/(auth)/` and include:
- Sign-in page at `/sign-in`
- Sign-up page at `/sign-up`

### Home Page
The main home page is in `src/app/(home)/` with components in `src/modules/home/ui/`. It includes:
- Navigation bar
- Sidebar with categories
- Video feed

### Creator Studio
The studio is in `src/app/(studio)/` with components in `src/modules/studio/ui/`. It provides:
- Video management dashboard
- Video upload functionality
- Video editing capabilities

### API Routes
- `src/app/api/trpc/` - tRPC API endpoints
- `src/app/api/videos/webhook/` - Video processing webhooks
- `src/app/api/videos/workflows/` - AI workflows for title/description generation
- `src/app/api/uploadthing/` - File upload handling
- `src/app/api/users/webhook/` - User management webhooks

### Database
The project uses Drizzle ORM with PostgreSQL. The schema is defined in `src/db/schema.ts`.

### Video Processing
Videos are processed and streamed via Mux. Configuration is in `src/lib/mux.ts`.





