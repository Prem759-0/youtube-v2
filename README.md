="/sign-in"
    NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
     MUX_WEBHOOK_SECRET="your_mux_webhook_secret"


    # Upstash Rate Limiting
    UPSTASH_REDIS_REST_URL="your_upstash_redis_url"
    UPSTASH_REDIS_REST_TOKEN="your_upstash_redis_token"
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


