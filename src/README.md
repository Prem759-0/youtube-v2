# Project Structure

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
