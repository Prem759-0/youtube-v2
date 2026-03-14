# YouTube V2

This project is a modern, full-stack YouTube clone built with the T3 stack and other modern technologies. It allows users to sign up, upload videos, and browse content. The application is designed to be scalable and performant, leveraging serverless technologies for the database and video processing.

## Overview

This YouTube clone provides a comprehensive platform for video sharing and viewing. It features a clean, user-friendly interface built with Next.js and Tailwind CSS. User authentication is handled by Clerk, and video content is managed, processed, and streamed via Mux. The backend is powered by tRPC, providing end-to-end typesafe APIs.

## Features

-   **Authentication:** Secure and easy user sign-up and sign-in provided by Clerk.
-   **Video Uploads:** Direct-to-Mux video uploads for efficient and robust video processing.
-   **Creator Studio:** A dedicated dashboard for creators to view and manage their uploaded videos.
-   **Infinite Scrolling:** Smooth, paginated loading of videos in the creator studio.
-   **Video Categories:** Videos can be assigned to different categories for better organization.
-   **Typesafe API:** End-to-end typesafety with tRPC.
-   **ORM:** Drizzle ORM for querying a PostgreSQL database.
-   **Responsive Design:** A fully responsive UI that works on all devices.

## Tech Stack

-   **Framework:** [Next.js](https://nextjs.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
-   **Authentication:** [Clerk](https://clerk.com/)
-   **API:** [tRPC](https://trpc.io/)
-   **Database:** [PostgreSQL](https://www.postgresql.org/) (hosted on [Neon](https://neon.tech/))
-   **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
-   **Video Processing:** [Mux](https://www.mux.com/)
-   **Deployment:** Vercel

## Project Structure

```
youtube-v2/
├── .gitignore                          # Git ignore file
├── bun.lock                           # Bun lock file
├── components.json                    # Shadcn UI components configuration
├── drizzle.config.ts                 # Drizzle ORM configuration
├── eslint.config.mjs                  # ESLint configuration
├── next-env.d.ts                      # Next.js type definitions
├── next.config.ts                     # Next.js configuration
├── package-lock.json                  # NPM lock file
├── package.json                       # Project dependencies
├── postcss.config.mjs                 # PostCSS configuration
├── README.md                          # Project documentation
├── TODO.md                            # Todo list
├── tsconfig.json                      # TypeScript configuration
├── tsconfig.tsbuildinfo               # TypeScript build info
│
├── public/                            # Static assets
│   ├── favicon.png                    # Favicon
│   ├── file.svg                       # File icon
│   ├── globe.svg                      # Globe icon
│   ├── logo.svg                       # Logo
│   ├── placeholder.svg                # Placeholder image
│   ├── user-placeholder.svg           # User placeholder
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
    │   ├── utils.ts                   # General utilities
    │   └── workflow.ts                # Workflow utilities
    │
    ├── modules/                       # Feature modules
    │   ├── auth/
    │   │   └── ui/
    │   │       └── components/
    │   │           └── auth-button.tsx
    │   │
    │   ├── categories/
    │   │   └── server/
    │   │       └── procedures.ts      # Category procedures
    │   │
    │   ├── home/
    │   │   └── ui/
    │   │       ├── components/
    │   │       │   ├── home-navbar/
    │   │       │   │   ├── home-input.tsx
    │   │       │   │   └── index.tsx
    │   │       │   └── home-sidebar/
    │   │       │       ├── index.tsx
    │   │       │       ├── main-section.tsx
    │   │       │       └── personal-section.tsx
    │   │       ├── layouts/
    │   │       │   └── home-layouts.tsx
    │   │       ├── sections/
    │   │       │   └── categories-section.tsx
    │   │       └── views/
    │   │           └── home-view.tsx
    │   │
    │   ├── studio/
    │   │   ├── server/
    │   │   │   └── procedures.ts      # Studio procedures
    │   │   └── ui/
    │   │       ├── components/
    │   │       │   ├── studio-upload-modal.tsx
    │   │       │   ├── studio-uploader.tsx
    │   │       │   ├── thumbnail-upload-modal.tsx
    │   │       │   ├── studio-navbar/
    │   │       │   │   └── index.tsx
    │   │       │   └── Studio-sidebar/
    │   │       │       ├── index.tsx
    │   │       │       └── studio-sidebar-header.tsx
    │   │       ├── layouts/
    │   │       │   └── studio-layout.tsx
    │   │       ├── sections/
    │   │       │   ├── form-section.tsx
    │   │       │   └── videos-section.tsx
    │   │       └── views/
    │   │           ├── studio-view.tsx
    │   │           └── video-view.tsx
    │   │
    │   └── videos/
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
        ├── query-client.ts            # Query 