

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
