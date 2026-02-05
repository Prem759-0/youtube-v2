 # YouTube V2

UI Components:** [Shadcn UI](https://ui.shadcn.com/)
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
│   ├── 
│   ├── 



    