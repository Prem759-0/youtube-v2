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
    bun drizzle-kit push
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

---
This README provides a comprehensive guide for developers to understand, set up, and contribute to the project .