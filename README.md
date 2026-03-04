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
