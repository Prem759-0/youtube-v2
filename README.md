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
├── public
│   ├── favicon.png
│   ├── file.svg
│   ├── globe.svg
│   ├── logo.svg
│   ├── placeholder.svg
│   ├── user-placeholder.svg
│   ├── window.svg
│   ├── Y_logo.ico
│   └── Y_logo.png
├── scripts
│   └── generate-tree.ts
├── src
│   ├── app
│   │   ├── (auth)
│   │   │   ├── sign-in
│   │   │   │   └── [[...sign-in]]
│   │   │   │       └── page.tsx
│   │   │   ├── sign-up
│   │   │   │   └── [[...sign-up]]
│   │   │   │       └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (home)
│   │   │   ├── protected
│   │   │   │   └── page.tsx
│   │   │   ├── client.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── (studio)
│   │   │   ├── studio
│   │   │   │   ├── video
│   │   │   │   │   └── [videoId]
│   │   │   │   │       └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── api
│   │   │   ├── trpc
│   │   │   │   └── [trpc]
│   │   │   │       └── route.ts
│   │   │   ├── users
│   │   │   │   └── webhook
│   │   │   │       └── route.ts
│   │   │   └── videos
│   │   │       └── webhook
│   │   │           └── route.ts
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components
│   │   ├── ui
│   │   │   ├── accordion.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── aspect-ratio.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   ├── button-group.tsx
│   │   │   ├── button.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── card.tsx
│   │   │   ├── carousel.tsx
│   │   │   ├── chart.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── collapsible.tsx
│   │   │   ├── command.tsx
│   │   │   ├── context-menu.tsx
│   │   │   ├── dialog.tsx
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
   
