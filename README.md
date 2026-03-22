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
