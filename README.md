# YouTube Clone (v2)

A modern YouTube clone built with Next.js 16, featuring user authentication, video management, and a responsive UI.

## Features

- **User Authentication**: Secure authentication using Clerk
- **Video Platform**: Full YouTube-like experience with video uploads and playback
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Modern UI**: Built with Radix UI components for accessibility and consistency
- **Database**: PostgreSQL with Drizzle ORM for efficient data management
- **Type Safety**: Full TypeScript support throughout the application

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Authentication**: Clerk
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization

## Prerequisites

Before running this project, make sure you have the following installed:

- Node.js 18+ (preferably 20+)
- npm, yarn, pnpm, or bun
- A Neon PostgreSQL database account
- A Clerk account for authentication

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd youtube-v2
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add the following:

```env
# Database
DATABASE_URL=your_neon_database_url

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

## Database Setup

1. Create a new project in [Neon](https://neon.tech)
2. Get your database connection string
3. Run database migrations:
```bash
npx drizzle-kit push
```

## Clerk Setup

1. Create a new application in [Clerk](https://clerk.com)
2. Configure your authentication settings
3. Copy the API keys to your environment variables

## Running the Application

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── (auth)/            # Authentication routes
│   ├── (home)/            # Home and protected routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
│   └── ui/               # Radix UI components
├── db/                   # Database configuration
│   ├── index.ts          # Drizzle client
│   └── schema.ts         # Database schema
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── modules/              # Feature modules
    ├── auth/             # Authentication module
    └── home/             # Home module
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code linting

## Database Commands

- `npx drizzle-kit push` - Push schema changes to database
- `npx drizzle-kit studio` - Open Drizzle Studio for database management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is private and proprietary
