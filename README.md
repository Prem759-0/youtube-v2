
├──
│   ├── window.svg                     # Window icon
│   ├── Y_logo.ico                     # YouTube logo ico
│   └── Y_logo.png                     # YouTube logo png
│
└── src/                               # Source code
    ├── constants.ts                   # Application constants
    ├── proxy.ts                       # Proxy configuration
    ├── README.md                      # Source README
    │
    ├── app/                           # Next.js App Router
    │   ├── globals.css                # Global CSS styles
    │   ├── layout.tsx                 # Root layout
    │   │
    │   ├── (auth)/                    # Auth route group
    │   │   ├── layout.tsx             # Auth layout
    │   │   ├── sign-in/
    │   │   │   └── [[...sign-in]]/
    │   │   │       └── page.tsx       # Sign-in page
    │   │   └── sign-up/
    │   │       └── [[...sign-up]]/
    │   │           └── page.tsx       # Sign-up page
    │   │
    │   ├── (home)/                    # Home route group
    │   │   ├── client.tsx             # Home client component
    │   │   ├── layout.tsx             # Home layout
    │   │   ├── page.tsx               # Home page
    │   │   └── protected/
    │   │       └── page.tsx           # Protected home page
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
    │   │   ├── button.tsx
    │   │   ├── calendar.tsx
    │   │   ├── card.tsx
    │   │   ├── carousel.tsx
    │   │   ├── chart.tsx
    │   │   ├── checkbox.tsx
    │   │   ├── collapsible.tsx
    │   │   ├── command.tsx
    │   │   ├── context-menu.tsx
    │   │   ├── dialog.tsx
    │   │   ├── drawer.tsx
    │   │   ├── dropdown-menu.tsx
    │   │   ├── empty.tsx
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
    │   ├── filter-carousel.tsx ─      │   ├── form-                 