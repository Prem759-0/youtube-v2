


<div align="center">
  <img src="./public/logo.svg" alt="YouTube Logo" width="120" height="120" />
  <h1 align="center">YouTube v2</h1>
  <p align="center">
    <strong>A modern, scalable full-stack video sharing platform inspired by YouTube, built with Next.js, tRPC, Drizzle, Clerk, Mux, and Tailwind CSS.</strong>
  </p>

  <img src="https://readme-typing-svg.demolab.com?font=Inter&weight=600&size=22&pause=1000&color=FF0000&center=true&vCenter=true&width=700&lines=Next.js+App+Router;TypeScript+Full+Stack;tRPC+React+Query;Drizzle+PostgreSQL;Mux+UploadThing+AI" alt="Typing SVG" />

  <br />

  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/tRPC-2596BE?style=for-the-badge&logo=trpc&logoColor=white" alt="tRPC" />
</div>

<p align="center">

  <a href="https://github.com/Prem759-0" title="Ask Me Anything!" style="margin: 4px; display: inline-block;"><img src="https://flat.badgen.net/static/Ask%20me/anything?icon=github&color=black&scale=1.01" alt="Ask Me Anything!" /></a>
  <a href="https://github.com/Prem759-0/youtube-v2/blob/main/LICENSE" title="GitHub license" style="margin: 4px; display: inline-block;"><img src="https://flat.badgen.net/github/license/Prem759-0/youtube-v2?icon=github&color=black&scale=1.01" alt="GitHub license" /></a>
  <a href="https://github.com/Prem759-0/youtube-v2/commits/main" title="Maintenance" style="margin: 4px; display: inline-block;"><img src="https://flat.badgen.net/static/Maintained/yes?icon=github&color=black&scale=1.01" alt="Maintenance" /></a>
  <a href="https://github.com/Prem759-0/youtube-v2/branches" title="GitHub branches" style="margin: 4px; display: inline-block;"><img src="https://flat.badgen.net/github/branches/Prem759-0/youtube-v2?icon=github&color=black&scale=1.01" alt="GitHub branches" /></a>
  <a href="https://github.com/Prem759-0/youtube-v2/commits" title="Github commits" style="margin: 4px; display: inline-block;"><img src="https://flat.badgen.net/github/commits/Prem759-0/youtube-v2?icon=github&color=black&scale=1.01" alt="Github commits" /></a>
  <a href="https://github.com/Prem759-0/youtube-v2/issues" title="GitHub issues" style="margin: 4px; display: inline-block;"><img src="https://flat.badgen.net/github/issues/Prem759-0/youtube-v2?icon=github&color=black&scale=1.01" alt="GitHub issues" /></a>
  <a href="https://github.com/Prem759-0/youtube-v2/pulls" title="GitHub pull requests" style="margin: 4px; display: inline-block;"><img src="https://flat.badgen.net/github/prs/Prem759-0/youtube-v2?icon=github&color=black&scale=1.01" alt="GitHub pull requests" /></a>
  <a href="https://newtube-clone.vercel.app" title="Vercel status" style="margin: 4px; display: inline-block;"><img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel status" /></a>
  <a href="https://github.com/Prem759-0/youtube-v2" title="Views" style="margin: 4px; display: inline-block;"><img src="https://img.shields.io/badge/Views-Open%20Live-blue?style=for-the-badge&logo=github&logoColor=white" alt="Views" /></a>
  <a href="https://github.com/Prem759-0/youtube-v2" title="Stars" style="margin: 4px; display: inline-block;"><img src="https://img.shields.io/badge/Stars-⭐%20Coming%20Soon-yellow?style=for-the-badge" alt="Stars" /></a>

</p>

---

## 🌟 Overview

YouTube v2 is a polished full-stack clone of YouTube-style video experiences. It includes:
- secure authentication with Clerk
- video upload and processing with UploadThing + Mux
- AI-powered title, description, and thumbnail generation
- nested comments and reactions
- subscriptions, playlists, and user profiles
- a studio page for creators
- responsive UI with modern motion and polished visuals

This project is ideal for learning full-stack architecture, real-time-like media workflows, AI integrations, and modern React application design.

## ✨ Premium Creator Experience

A polished, modern content pipeline powers the studio experience from upload to social engagement.

```mermaid
flowchart LR

    A[📤 Upload video] --> B[⚡ Secure processing]
    B --> C[🤖 AI title]
    B --> D[📝 AI description]
    B --> E[🖼️ AI thumbnail]
    C --> F[✨ Review & refine]
    D --> F
    E --> F
    F --> G[🔄 Revalidate studio]
    G --> H[🚀 Publish & share]
    H --> I[💬 Comment]
    H --> J[👍 React]
    H --> K[👥 Subscribe]
    I --> L[📈 Community growth]
    J --> L
    K --> L

```

This flow is designed to feel closer to a real creator platform than a simple demo, with guided onboarding, fast iteration, and a smooth publishing loop.




### 🌈 Experience highlights
- cinematic creator-first onboarding flow
- smarter AI-assisted publishing steps
- polished revalidation and preview experience
- strong community interaction loop after publish
- premium, modern UI details throughout the studio

---

## ✨ Advanced Features Included

### 💬 Chat Flow / Creator Workflow
This project is designed around a smooth and modern creator experience, including an AI-assisted content pipeline that feels close to a real production platform.

#### 1. Upload & Prepare Content
- A creator uploads a video from the studio area
- The file is securely handled through UploadThing
- The video is processed and prepared for playback using Mux

#### 2. AI-Assisted Metadata Generation
Once the video is ready, the creator can:
- generate a title with AI
- generate a description with AI
- generate a thumbnail with AI
- review the output and edit it manually if needed

#### 3. First-Time AI Guidance
To make the flow beginner-friendly, the studio includes a guided onboarding experience:
- a first-time info panel appears for each AI generator
- the user sees how long generation may take
- the UI explains when to use the revalidate/refresh action
- the guide appears only once per generator for a smoother experience

#### 4. Revalidate & Publish Workflow
After AI generation finishes:
- the creator can click the refresh/revalidate button
- the latest title, description, and thumbnail are synced
- the video details are updated in the studio preview

#### 5. Social Interaction Flow
After publishing, users can:
- watch the video
- leave comments and replies
- like or dislike the video
- interact with creators through subscriptions and profiles

#### 6. Advanced Creator Experience
The studio experience is built to feel like a professional platform with:
- a polished dashboard interface
- clean metadata editing flow
- fast content management
- smooth onboarding for new creators

> This flow makes the app feel much more like a real YouTube-style creator platform rather than a simple upload demo.

---

### 🎬 Video Experience
- secure video uploads
- video transcoding and streaming through Mux
- thumbnail upload and AI thumbnail generation
- video previews and responsive player UI
- view tracking and video metadata management

### 🤖 AI Studio Features
- AI-generated title suggestions
- AI-generated descriptions
- AI-generated thumbnails
- first-time guided AI onboarding for creators

### 👤 Social & Creator Features
- user authentication and profiles
- subscriptions and channel-like follow system
- comments and replies
- like/dislike reactions
- playlists and saved content
- creator studio dashboard

### 🎨 UI / UX
- modern responsive layout
- polished cards, dialogs, skeleton load states, and animations
- dark/light theme-ready styling
- advanced component architecture with reusable UI primitives

---

## 🧱 Tech Stack

| Technology | Purpose |
| :--- | :--- |
| Next.js 16 | App Router, SSR, API routes |
| TypeScript | type-safe app development |
| Tailwind CSS | utility-first styling |
| Shadcn UI | accessible UI primitives |
| tRPC | typed API layer |
| React Query | caching and data fetching |
| Drizzle ORM | database access |
| PostgreSQL | main relational database |
| Clerk | authentication and user management |
| Mux | video upload, transcoding, streaming |
| UploadThing | secure file uploads |
| OpenRouter | AI title and description generation |
| Leonardo AI | AI thumbnail generation |
| Upstash | workflow and Redis services |

---

## 📁 Project Structure

```text
src/
  app/                # Next.js routes and layouts
  components/         # reusable UI components
  db/                 # database connection and schema
  hooks/              # custom React hooks
  lib/                # utilities and service clients
  modules/            # feature-based modules
  scripts/            # maintenance scripts
  trpc/               # tRPC setup and routers
```

---

## 🚀 Quick Start

### 1) Install Node.js
Use Node.js 20+.

### 2) Install dependencies
Choose one:

```bash
npm install
```

or

```bash
bun install
```

### 3) Create environment file
Copy the demo environment file:

```bash
cp .env.example .env.local
```

Then fill in all required values.

### 4) Setup PostgreSQL database
You can use:
- Neon
- Supabase Postgres
- Railway
- Local Postgres

Then set the connection string:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

### 5) Push the database schema

```bash
npx drizzle-kit push
```

or

```bash
bunx drizzle-kit push
```

### 6) Run the app

```bash
npm run dev
```

or

```bash
bun dev
```

Open:

```text
http://localhost:3000
```

---

## 🔐 Environment Variables

A complete example file is included at [.env.example](.env.example).

### Required Variables

#### App
- NEXT_PUBLIC_APP_URL
- NEXT_PUBLIC_APP_BASE_URL
- NEXT_PUBLIC_VERCEL_URL
- NEXT_PUBLIC_VERCEL_ENV

#### Clerk Authentication
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY
- CLERK_SIGNING_SECRET
- NEXT_PUBLIC_CLERK_SIGN_IN_URL
- NEXT_PUBLIC_CLERK_SIGN_UP_URL
- NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL
- NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL

#### Database
- DATABASE_URL

#### Video / Media
- MUX_TOKEN_ID
- MUX_TOKEN_SECRET
- MUX_WEBHOOK_SECRET

#### File Uploads
- UPLOADTHING_SECRET
- UPLOADTHING_APP_ID

#### AI Services
- OPENROUTER_API_KEY
- LEONARDO_API_KEY

#### Workflow / Queue / Redis
- QSTASH_TOKEN
- UPSTASH_WORKFLOW_URL
- UPSTASH_REDIS_REST_URL
- UPSTASH_REDIS_REST_TOKEN

---

## 🔧 How to Get Each API Key

### 1. Clerk
1. Go to https://clerk.com
2. Create an account and a new app
3. In the Clerk dashboard, copy:
   - Publishable Key
   - Secret Key
4. Enable webhooks and copy the signing secret

### 2. PostgreSQL Database
Use one of these:
- Neon: https://neon.tech
- Supabase: https://supabase.com
- Railway: https://railway.app

After creating a database, copy the connection string into DATABASE_URL.

### 3. Mux
1. Sign up at https://www.mux.com
2. Create a new project
3. Copy:
   - Token ID
   - Token Secret
   - Webhook Secret

### 4. UploadThing
1. Go to https://uploadthing.com
2. Create an account
3. Create a project and copy:
   - Secret Key
   - App ID

### 5. OpenRouter
1. Go to https://openrouter.ai
2. Create an account
3. Generate an API key for AI title and description generation

### 6. Leonardo AI
1. Go to https://leonardo.ai
2. Create an account
3. Generate an API key for AI thumbnail generation

### 7. Upstash
1. Go to https://upstash.com
2. Create a Redis database
3. Create QStash
4. Copy:
   - Redis REST URL
   - Redis REST Token
   - QStash token
   - workflow URL

---

## 🧪 Local Development Tips

### Recommended tools
- Node.js 20+
- Bun or npm
- Docker optional for local Postgres
- ngrok for testing webhooks locally

### Install ngrok
If you want to test webhooks locally:

#### Windows
```powershell
winget install --id ngrok.ngrok
```

#### macOS
```bash
brew install ngrok/ngrok/ngrok
```

#### Linux
```bash
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
```

Then start a tunnel:

```bash
ngrok http 3000
```

Use the public HTTPS forwarding URL for webhook endpoints.

---

## 🗂️ Database Setup

Run:

```bash
npx drizzle-kit push
```

If you use Bun:

```bash
bunx drizzle-kit push
```

If you need to reset locally, be careful because it can remove or recreate data depending on your setup.

---

## 🧠 Advanced Project Highlights

This project is designed to feel like a modern production-grade YouTube clone with:
- smooth creator workflow
- AI-assisted content creation
- scalable media pipeline
- modern UI motion and interaction design
- typed end-to-end features through tRPC

Planned and evolving areas include:
- advanced creator analytics
- live streaming
- Shorts-style experience
- richer social notifications
- more personalized recommendation systems

---

## 🛡️ Security

Please review [SECURITY.md](SECURITY.md) for responsible disclosure and security expectations.

Do not commit:
- .env files
- secrets
- private API keys
- webhook secrets
- database connection strings

---

## 📣 Contribution

Contributions are welcome. If you want to help improve the project:
1. fork the repository
2. create a new branch
3. make your change
4. open a pull request

---

## ✅ Summary

This project is already a strong full-stack foundation for a YouTube-like product. With the right services configured, it can become a powerful media platform with AI-assisted content creation, scalable uploads, rich creator tools, and a polished user experience.
