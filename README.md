# CodeShare

A simple sharing platform for code snippets built with Next.js, React, Tailwind, and Supabase.

## What it is

`CodeShare` lets users save, manage, and share code snippets in a lightweight workspace.

- Public snippets are discoverable from the home page
- Registered users can store private snippets in a dashboard
- Snippets can be edited, deleted, and shared via a unique link
- Built with Supabase authentication and database storage

## Key features

- Home page with public snippet browse and search
- User sign-up / sign-in via Supabase
- Dashboard for managing a personal snippet library
- Create and edit snippet forms with language, description, tags, and visibility
- Public sharing route: `/code/[shareToken]`
- Private visibility support so only the owner can view unpublished snippets

## Project structure

- `app/` - Next.js App Router pages and route handlers
- `components/` - UI components, including snippet form and copy button
- `lib/` - Supabase client helpers and utility modules
- `public/` - Static assets

## Technologies

- Next.js 16
- React 19
- Tailwind CSS
- Supabase
- TypeScript
- `@base-ui/react` / `lucide-react` for UI components
- `nanoid` for share token generation

## Local setup

1. Install dependencies

```bash
pnpm install
```

2. Create a `.env.local` file in the project root with the required Supabase values:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

3. Run the development server

```bash
pnpm dev
```

4. Open `http://localhost:3000`

## Available scripts

- `pnpm dev` - start development server
- `pnpm build` - build production output
- `pnpm start` - run the production build
- `pnpm lint` - run ESLint

## Notes

- The home page displays public snippets and supports basic search.
- Dashboard users can create, edit, delete, and share snippets.
- Shared links are built using the snippet `share_token`.
- The app uses client-side Supabase auth helpers from `lib/supabase/client.ts`.

## Routes

- `/` - public landing page and snippet explorer
- `/dashboard` - logged-in user's workspace
- `/snippets/create` - create a new snippet
- `/snippets/[id]/edit` - edit an existing snippet
- `/code/[shareToken]` - shared snippet page
