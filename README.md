# YouTube Clone v2

A modern web application built with Next.js, featuring user authentication and a responsive UI. This project is in early development, focusing on user management and interface design, with plans for video functionality in future updates.

## Features

- **User Authentication**: Secure sign-in and sign-up using Clerk
- **Responsive Design**: Mobile-first UI built with Tailwind CSS and Radix UI components
- **Modern UI**: Clean, accessible interface with consistent design patterns
- **Database Integration**: PostgreSQL with Drizzle ORM for efficient data management
- **Type Safety**: Full TypeScript support throughout the application

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Authentication**: Clerk
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Package Manager**: Bun (recommended), npm, yarn, or pnpm

## Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js 18+** (preferably 20+)
- **Package Manager**: Bun, npm, yarn, or pnpm
- **Git**: For cloning the repository
- **Neon Account**: For PostgreSQL database hosting
- **Clerk Account**: For authentication services
- **Ngrok Account** (optional): For local development tunneling

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd youtube-v2
```

### 2. Install Dependencies

Choose your preferred package manager:

```bash
# Using Bun (recommended)
bun install

# Or using npm
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install
```

## Environment Setup

### 1. Create Environment File

Create a `.env.local` file in the root directory:

```bash
touch .env.local
```

Add the following environment variables to `.env.local`:

```env
# Database Configuration
DATABASE_URL=your_neon_database_connection_string

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Clerk Redirect URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### 2. Set Up Neon Database

1. Go to [Neon](https://neon.tech) and create a free account
2. Create a new project
3. Copy the connection string from your project dashboard
4. Paste it as `DATABASE_URL` in your `.env.local` file

### 3. Set Up Clerk Authentication

1. Go to [Clerk](https://clerk.com) and create a free account
2. Create a new application
3. In your Clerk dashboard:
   - Go to "API Keys" and copy your publishable key and secret key
   - Go to "Paths" and configure:
     - Sign-in URL: `/sign-in`
     - Sign-up URL: `/sign-up`
     - After sign-in URL: `/`
     - After sign-up URL: `/`
4. Add the keys to your `.env.local` file

## Database Setup with Drizzle

### 1. Push Database Schema

After setting up your Neon database, push the schema to your database:

```bash
# Using Bun
bunx drizzle-kit push

# Or using npx
npx drizzle-kit push
```

This command will create the necessary tables in your PostgreSQL database.

### 2. View Database (Optional)

To view your database schema and data:

```bash
# Open Drizzle Studio
bunx drizzle-kit studio

# Or using npx
npx drizzle-kit studio
```

This opens a web interface at `http://localhost:4983` where you can view and edit your database.

### 3. Generate Migrations (For Future Schema Changes)

When you update the schema in `src/db/schema.ts`, generate migrations:

```bash
# Generate migration files
bunx drizzle-kit generate

# Apply migrations
bunx drizzle-kit migrate
```

## Running the Application

### Development Server

Start the development server:

```bash
# Using Bun
bun run dev

# Or using npm
npm run dev

# Or using yarn
yarn dev

# Or using pnpm
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Production Build

To build and run the application in production:

```bash
# Build the application
bun run build

# Start production server
bun run start
```

## Using Ngrok for Local Development

Ngrok allows you to expose your local development server to the internet, useful for testing webhooks or sharing your work.

### 1. Install Ngrok

Download and install Ngrok from [ngrok.com](https://ngrok.com).

### 2. Authenticate Ngrok

After installing, authenticate with your ngrok account:

```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

Get your auth token from your ngrok dashboard.

### 3. Start Ngrok Tunnel

With your development server running on port 3000:

```bash
# Expose localhost:3000 to the internet
ngrok http 3000
```

Ngrok will provide a public URL (e.g., `https://abc123.ngrok.io`) that tunnels to your local server.

### 4. Update Clerk Redirect URLs (Optional)

If you need to test authentication flows with ngrok:

1. Update your Clerk application settings with the ngrok URL
2. Add the ngrok domain to your allowed redirect URLs

## Available Scripts

- `dev` - Start the development server
- `dev:webhook` - Start ngrok tunnel for local development
- `dev:all` - Start both development server and ngrok tunnel concurrently
- `build` - Build the application for production
- `start` - Start the production server
- `lint` - Run ESLint for code linting

## Drizzle Commands Reference

- `drizzle-kit push` - Push schema changes directly to database
- `drizzle-kit studio` - Open Drizzle Studio for database management
- `drizzle-kit generate` - Generate migration files from schema changes
- `drizzle-kit migrate` - Apply generated migrations to database

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── (auth)/            # Authentication routes (sign-in/sign-up)
│   ├── (home)/            # Protected home routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout with Clerk provider
│   └── page.tsx           # Home page (redirects to home)
├── components/            # Reusable UI components
│   └── ui/               # Radix UI components
├── db/                   # Database configuration
│   ├── index.ts          # Drizzle client setup
│   └── schema.ts         # Database schema (users table)
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── modules/              # Feature modules
    ├── auth/             # Authentication module
    └── home/             # Home module with navbar/sidebar
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify your `DATABASE_URL` in `.env.local`
   - Ensure your Neon database is active
   - Check if you've run `drizzle-kit push`

2. **Clerk Authentication Issues**
   - Verify your Clerk API keys
   - Check redirect URLs in Clerk dashboard
   - Ensure environment variables are loaded

3. **Build Errors**
   - Clear node_modules: `rm -rf node_modules && bun install`
   - Check Node.js version: `node --version`

4. **Ngrok Connection Issues**
   - Verify ngrok is authenticated
   - Check if port 3000 is available
   - Try different ngrok regions: `ngrok http 3000 --region=us`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Run linting: `bun run lint`
5. Test your changes
6. Commit your changes: `git commit -m 'Add your feature'`
7. Push to the branch: `git push origin feature/your-feature`
8. Open a Pull Request

## License

This project is private and proprietary.

## Future Plans

- Video upload and playback functionality
- Video management features
- User profiles and channels
- Comments and interactions
- Search and recommendations .
