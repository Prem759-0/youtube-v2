

# ⚒️ The app is under development 🛠️⚒️

<div align="cen

  <hr />
* **Video Uploads:** Securely upload large video files using UploadThing.
* **Video Processing:** Uses **Mux** behind the scenes to transcode videos, meaning it generates different resolutions (1080p, 720p, etc.) and provides a smooth, buffer-free streaming experience using HLS (HTTP Live Streaming).
* **Thumbnails & Previews:** Automatically generate and select thumbnails, or upload custom ones. Animated GIF previews are supported when hovering over videos.
* **Views Tracking:** Tracks every unique view natively.
</details>

<details>
<summary><b>👤 Authentication & Users</b></summary>

* **Secure Login/Signup:** Powered by **Clerk**. Supports Social Logins (Google, GitHub) and passwordless email links.
* **User Profiles:** Every user has their own unique profile page showcasing their uploaded videos.
* **Subscriptions:** Users can subscribe and unsubscribe to other creators. The home feed can filter videos purely by subscribed channels.
</details>

<details>
<summary><b>💬 Social Interactions</b></summary>

* **Comments & Replies:** A fully nested commenting system. Users can comment on videos and reply to other comments.
* **Likes & Dislikes:** Users can like or dislike videos and individual comments.
* **Creator Hearts:** Just like the real YouTube, if the creator of a video likes your comment or reply, a special "Creator Heart" with their avatar appears on it!
</details>

<details>
<summary><b>🎛️ Studio Dashboard</b></summary>

* **Creator Studio:** A dedicated `/studio` area where creators can manage their uploads.
* **Video Visibility:** Toggle videos between `Public` and `Private`.
* **Metadata Editing:** Edit video titles, descriptions, and categories.
</details>

<details>
<summary><b>🎨 UI / UX Excellence</b></summary>

* **Responsive Design:** Looks great on 4K Desktop monitors down to mobile screens.
* **Dark / Light Mode:** Fully supports system and user-toggled theme preferences.
* **Infinite Scrolling:** The homepage and comment sections load more items seamlessly as you scroll down.
* **Skeleton Loaders:** Beautiful animated loading states so the user never stares at a blank screen.
</details>

---

## 🛠️ The Tech Stack (What is it built with?)

Here is a simple breakdown of the core technologies running this project:

| Technology | Role in Project | Beginner Explanation |
| :--- | :--- | :--- |
| **Next.js (React)** | Frontend & Backend Framework | The core engine. It renders the UI (React) and also handles our server-side API routes. |
| **TypeScript** | Language | JavaScript with "Types". It catches errors before we even run the code. |
| **Tailwind CSS** | Styling | A utility-first CSS framework. We style elements directly in our HTML/JSX files using class names like `flex`, `text-center`. |
| **Shadcn UI** | UI Components | Pre-built, accessible UI components (Buttons, Dialogs, Dropdowns) that we own and can customize. |
| **Drizzle ORM** | Database Communicator | Allows us to write TypeScript code to interact with our SQL Database instead of raw SQL queries. |
| **PostgreSQL** | Database | The workhorse database where we store Users, Videos data, Comments, and Likes. |
| **tRPC** | API / Data Fetching | "TypeScript Remote Procedure Call". It allows our frontend to ask the backend for data securely, sharing the exact same TypeScript types. |
| **Clerk** | Authentication | Handles all User Logins, Signups, and Sessions securely. |
| **Mux** | Video Infrastructure | The magical service that takes an uploaded `.mp4` and turns it into a scalable, streamable video player. |
| **UploadThing** | File Storage | Securely handles users uploading files (videos, images) directly to the cloud. |

---

## 📂 Detailed Folder Structure

To help you navigate, here is the complete map of the codebase and what every folder does.

```mermaid
graph TD;
    Project_Root-->public;
    Project_Root-->src;
    src-->app;
    src-->components;
    src-->db;
    src-->hooks;
    src-->lib;
    src-->modules;
    src-->scripts;
    src-->trpc;
```

### 1. `public/`
Contains static assets that are served directly to the browser.
* `favicon.png`, `logo.svg`, `user-placeholder.svg`: Static images and icons used globally across the app.

### 2. `src/app/`
This is the heart of **Next.js App Router**. The folder structure here dictates the URLs of the website.
* `globals.css`: The main CSS file holding Tailwind directives and global CSS variables.
* `layout.tsx`: The root wrapper of the entire application. Every page renders inside this.
* `(auth)/`: The parentheses mean this is a "Route Group". It doesn't add to the URL. Contains `/sign-in` and `/sign-up` pages handled by Clerk.
* `(home)/`: The main viewing area of the app (the feed, viewing a video).
  * `page.tsx`: The actual Homepage (`/`).
  * `videos/[videoId]/`: The dynamic route for watching a specific video (e.g., `/videos/12345`).
* `(studio)/`: The Creator Studio dashboard for managing videos.
* `api/`: Backend server routes that handle raw HTTP requests.
  * `trpc/[trpc]/`: The single endpoint that handles ALL tRPC data requests.
  * `uploadthing/`: Endpoints to handle secure file uploads.
  * `users/webhook/` & `videos/webhook/`: Webhooks are listeners. When Clerk creates a new user, or Mux finishes processing a video, they send an HTTP ping to these files so our database can update itself automatically.

### 3. `src/components/`
Reusable UI building blocks used across the application.
* `ui/`: Contains all **Shadcn UI** components. These are low-level building blocks like `button.tsx`, `dialog.tsx`, `input.tsx`, `skeleton.tsx`. 
* `user-avatar.tsx`: A shared component to display user profile pictures.
* `infinite-scroll.tsx`: A logic component that detects when a user scrolls to the bottom of the page to load more data.

### 4. `src/db/`
Everything related to the Database.
* `index.ts`: Establishes the live connection to our PostgreSQL database using Drizzle.
* `schema.ts`: **Highly Important File.** This defines the structure of our database tables (e.g., `users`, `videos`, `comments`, `commentReactions`). If you want to know what data a Video holds, look here.

### 5. `src/hooks/`
Custom React Hooks (reusable logic).
* `use-mobile.ts`: Detects if the current user is on a mobile device based on screen width.
* `use-intersection-observer.ts`: Detects when an element becomes visible on the screen (used for infinite scrolling).

### 6. `src/lib/`
Utility functions and SDK initializers.
* `utils.ts`: Helper functions (like `cn` which elegantly merges Tailwind classes together).
* `mux.ts`, `redis.ts`, `uploadthing.ts`: Initialization files for our third-party services.

### 7. `src/modules/`
**The Core Architecture.** Instead of putting all logic in giant files, this project groups code by "Features" (Domain-Driven Design). Every folder inside here represents a specific feature of the app.
* **Folders:** `auth`, `categories`, `comments`, `home`, `studio`, `subscriptions`, `users`, `videos`.
* Inside a typical module (e.g., `comments/`):
  * `server/procedures.ts`: The backend tRPC code. This is where the database queries happen (e.g., fetching comments, deleting a comment).
  * `ui/components/`: Frontend React components specifically tied to this feature (e.g., `comment-item.tsx`, `comment-form.tsx`).
  * `types.ts`: TypeScript definitions for this feature.

### 8. `src/scripts/`
Standalone node scripts meant to be run from the terminal, usually for maintenance.
* `seed-categories.ts`: A script to populate the database with default YouTube categories (Gaming, Music, Tech, etc.) if it's empty.

### 9. `src/trpc/`
The configuration for tRPC (connecting the frontend to the backend).
* `init.ts`: Sets up the tRPC server and defines "Middlewares" (e.g., `protectedProcedure` ensures a user is logged in before they can run a function).
* `routers/_app.ts`: The root router that combines all the individual module routers (videos, comments, users) into one giant API tree.
* `client.tsx` & `server.tsx`: Helpers that allow us to fetch data from either the Browser (client) or the Next.js Server securely.

---

## 🚀 How to Run the Project Locally

If you want to run this application on your own machine, follow these steps:

### Prerequisites
1. Ensure you have **Node.js** installed (v18 or higher recommended).
2. Install **Bun** or use **npm** (The project uses `bun.lock`, so Bun is preferred).
3. A PostgreSQL database (You can get a free one on [Neon.tech](https://neon.tech/)).

### Step-by-step Setup
1. **Install Dependencies:**
   Open your terminal in the project folder and run:
   ```bash
   npm install
   # or
   bun install
   ```

2. **Setup Environment Variables:**
   Create a file named `.env` in the root folder. You will need to fill in various API keys. *Ask the project owner for these keys or set up your own accounts for Clerk, Mux, UploadThing, and your Database.*
   ```env
   # Example .env structure
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   DATABASE_URL=postgresql://user:password@host/dbname
   UPLOADTHING_SECRET=sk_live_...
   MUX_TOKEN_ID=...
   MUX_TOKEN_SECRET=...
   ```

3. **Push the Database Schema:**
   Before running the app, you need to build the database tables.
   ```bash
   npm run db:push
   # or
   npx drizzle-kit push
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   # or
   bun dev
   ```
   *Your app is now running on `http://localhost:3000`!*

---

<div align="center">
  <br/>
  <h3>Built with ❤️ and Modern Web Technologies.</h3>
  <p>Feel free to explore the code, break things, and learn how a real-world, production-ready full-stack application operates.</p>
  
  <!-- Cool animated CSS gradient line -->
  <img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4520-a447-11eb-908a-139a6edaec5c.gif" width="100%" />
</div>

---

## 💅 CSS & Styling Strategy

This application relies on a modern, highly maintainable approach to CSS:
* **Tailwind CSS:** Most of the layout, spacing, and typography are handled via utility classes, allowing for rapid iterations and a smaller overall CSS footprint.
* **CSS Variables:** The `globals.css` defines root CSS variables for theme colors. This powers the clean, instantaneous Dark / Light mode toggling.
* **Component-Scoped Logic:** Tools like `cn` (clsx + tailwind-merge) dynamically combine utility classes based on React state (e.g., highlighting an active filter or displaying an error state).

---

## 🔮 Future Roadmap

We are constantly improving! Here are a few features planned for future updates:
- [ ] **Playlists:** Allow users to curate and save multiple videos into distinct playlists.
- [ ] **Live Streaming:** True real-time live broadcasting with live chat integration.
- [ ] **Shorts:** A dedicated TikTok-style vertical scrolling feed for short-form content.
- [ ] **Advanced Analytics:** A dashboard for creators with granular charts mapping views, audience retention, and watch times.
