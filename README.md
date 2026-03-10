 # YouTube V2

This 
    │   │
    │   ├── (studio)/                  # Studio route group
    │   │   ├── layout.tsx             # Studio layout
    │   │   └── studio/
    │   │       ├── page.tsx           # Studio dashboard page
    │   │       └── video/
    │   │           └── [videoId]/
    │   │               └── page.tsx   # Video edit page
    │   │
    │   ├── api/                       # API routes
    │   │   ├── trpc/
    │   │   │   └── [trpc]/
    │   │   │       └── route.ts       # tRPC API route
    │   │   │
    │   │   ├── uploadthing/
    │   │   │   ├── core.ts            # UploadThing core
    │   │   │   └── route.ts           # UploadThing route
    │   │   │
    │   │   ├── users/
    │   │   │   └── webhook/
    │   │   │       └── route.ts       # User webhook route
    │   │   │
    │   │   └── videos/
    │   │       ├── webhook/
    │   │       │   └── route.ts       # Video webhook route
    │   │       └── workflows/
    │   │           ├── description/
    │   │           │   └── route.ts   # Description workflow
    │   │           └── title/
    │   │               └── route.ts   # Title workflow
    │   │
    │   └── test-image/                # Test images directory
    │
    ├── components/                    # Shared components
    │   ├── ui/                        # Shadcn UI components
    │   │   ├── accordion.tsx
    │   │   ├── alert-dialog.tsx
    │   │   ├── alert.tsx
    │   │   ├── aspect-ratio.tsx
    │   │   ├── avatar.tsx
    │   │   ├── badge.tsx
    │   │   ├── breadcrumb.tsx
    │   │   ├── button-group.tsx
    │   │ "
    UPSTASH_REDIS_REST_TOKEN="your_upstash_redis_token"
    
```

4.  **Run database migrations:**
    This command will push the 