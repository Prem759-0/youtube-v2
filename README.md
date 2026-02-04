="/sign-in"
    NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
     MUX_WEBHOOK_SECRET=
    ```
  

4.  **Run database migrations:**
    This command will push the schema from `src/db/schema.ts` to your Neon database.
    ```bash
    bun drizzle-kit pus
    ```

5.  **Run the development server:**
    ```bash
    bun run dev
    ```
    The application should now be running at [http://localhost:3000](http://localhost:3000).

## Scripts

-   `bun run dev`: Starts the development server.


