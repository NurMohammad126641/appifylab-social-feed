# Appifylab Social Feed

Submission-ready full-stack social feed built with Next.js App Router, TypeScript, Prisma, secure cookie-based auth, and the provided Appifylab design assets.

## Overview

The application delivers the assessment requirements end to end:

- registration with first name, last name, email, and password
- secure login/logout with server-validated cookie sessions
- protected feed route
- public and private posts
- newest-first ordering
- post creation with text and optional image upload
- like/unlike on posts
- comments and nested replies
- like/unlike on comments and replies
- liked-by viewers for posts, comments, and replies
- seeded demo accounts and walkthrough-ready demo data

The UI preserves the supplied design language from the provided HTML/CSS package and adapts it into a working Next.js App Router implementation.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Prisma ORM
- SQLite for default local development
- Zod validation
- `bcryptjs` for password hashing
- `jose` for signed session cookies
- local filesystem uploads under `public/uploads`

## Features Implemented

- Secure registration and login flows
- `httpOnly`, `sameSite=lax` cookie-based sessions
- Server-side route protection for `/feed`
- Public/private visibility enforced in both reads and writes
- Feed sorted newest first
- Optional image upload with file type and size validation
- Post likes
- Comment and reply creation
- Comment and reply likes
- Liked-by viewers rendered in the feed
- Seeded users and content for reviewer demo
- Responsive adaptation of the provided auth/feed designs

## Project Structure

- `app/`: App Router pages and route handlers
- `components/auth/`: login/register UI
- `components/feed/`: feed UI, composer, post cards, comments, likes, logout
- `lib/auth.ts`: password hashing, JWT cookie session creation, current-user helpers
- `lib/feed.ts`: feed query and comment-tree shaping
- `lib/uploads.ts`: validated local image storage
- `lib/validation.ts`: Zod schemas for auth, posts, comments, and uploads
- `prisma/schema.prisma`: data model
- `prisma/migrations/`: migration history
- `prisma/seed.ts`: demo data seed
- `public/assets/`: provided design assets integrated into the app
- `public/seed/`: seeded demo images

## Environment Variables

Copy `.env.example` to `.env` and adjust as needed.

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="replace-with-a-long-random-secret"
```

Required:

- `DATABASE_URL`: Prisma database connection string
- `AUTH_SECRET`: signing secret for the session cookie JWT

Local development defaults to SQLite. Production should use a strong `AUTH_SECRET` and, ideally, non-local media storage.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Apply migrations and seed demo data:

```bash
npm run db:setup
```

3. Start the app:

```bash
npm run dev
```

4. Open `http://localhost:3000`

## Useful Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run db:generate
npm run db:migrate
npm run db:deploy
npm run db:push
npm run db:seed
npm run db:setup
```

## Database Setup

Local default:

- Prisma uses SQLite via `DATABASE_URL="file:./dev.db"`.
- The repository includes the migration history in `prisma/migrations/`.
- `npm run db:setup` is the fastest way to get a runnable local demo.

Production note:

- `prisma migrate deploy` is the correct production migration command.
- Because this repository is intentionally SQLite-first for simple review, a production deployment that needs shared, durable infrastructure should move to PostgreSQL and object storage for uploads.

## Seed Data

Run:

```bash
npm run db:seed
```

This resets users, posts, likes, comments, and replies, then recreates demo data.

## Demo Credentials

- `jane@example.com` / `Password123`
- `alex@example.com` / `Password123`
- `sam@example.com` / `Password123`

Demo note:

- Jane has a seeded private post that only Jane can see.

## Authentication

High-level flow:

- Registration and login validate input with Zod.
- Passwords are hashed with `bcryptjs`.
- Successful auth signs a JWT using `AUTH_SECRET`.
- The JWT is stored in the `social_feed_session` `httpOnly` cookie.
- Feed access is protected server-side through `requireUserId()` in [`lib/auth.ts`](./lib/auth.ts).
- Write APIs independently re-check authentication before mutating data.

Tradeoff:

- Session revocation is cookie-expiry based. There is no persistent session table.

## Visibility Rules

Visibility logic:

- `PUBLIC` posts are visible to every authenticated user.
- `PRIVATE` posts are visible only to the post author.
- Feed filtering happens in the database query in [`lib/feed.ts`](./lib/feed.ts).
- Comment/reply creation and like endpoints also verify access so non-authors cannot interact with someone else’s private post.

## Data Modeling

Core relationships:

- `User` owns `Post` and `Comment`
- `PostLike` stores unique `(postId, userId)` reactions
- `Comment` is used for both comments and replies through `parentId`
- `CommentLike` stores unique `(commentId, userId)` reactions

Where to review:

- Schema: [`prisma/schema.prisma`](./prisma/schema.prisma)
- Feed query/tree shaping: [`lib/feed.ts`](./lib/feed.ts)
- Post APIs: [`app/api/posts/route.ts`](./app/api/posts/route.ts), [`app/api/posts/[postId]/like/route.ts`](./app/api/posts/%5BpostId%5D/like/route.ts)
- Comment APIs: [`app/api/comments/route.ts`](./app/api/comments/route.ts), [`app/api/comments/[commentId]/like/route.ts`](./app/api/comments/%5BcommentId%5D/like/route.ts)

## Security Considerations

- Passwords are hashed, never stored in plaintext.
- Session cookies are `httpOnly`, `sameSite=lax`, and `secure` in production.
- Auth and content mutations validate all incoming input.
- Private post access is checked in read and write paths.
- Uploads are limited to specific image MIME types and a 5 MB cap.
- Upload filenames are generated server-side and not trusted from user input.
- Secrets are environment-based and `.env` is ignored.

## Scalability Considerations

For the assessment scope, the implementation is intentionally simple and readable. For millions of posts and reads, the next steps would be:

- cursor pagination instead of loading the whole feed
- denormalized counters or cached aggregates for reaction totals
- object storage plus CDN for uploaded images
- PostgreSQL or another production database instead of SQLite
- background jobs for fan-out, moderation, and media processing
- observability around auth, uploads, and slow queries

The current schema already includes useful indexes on authorship, visibility, and created timestamps.

## Tradeoffs and Limitations

- SQLite keeps local review friction low, but it is not the ideal production datastore.
- Uploads are stored on local disk, which is fine for local review but not for stateless multi-instance deployment.
- There is no admin/moderation surface because it is outside assignment scope.
- Session invalidation is coarse-grained and based on cookie expiry.
- The feed currently focuses on correctness and clarity over advanced pagination/caching strategies.

## Deployment Notes

Status:

- The repository is deployment-prepared.
- A full live deployment was not completed from this environment because platform access and production infrastructure are outside the local workspace.

Recommended target:

- Any Node-capable host that can run `next build` and `next start`.
- For a quick reviewer-friendly deploy, Render or Railway are reasonable choices.

Recommended production changes before public hosting:

- use PostgreSQL instead of SQLite
- move uploads to object storage such as S3, R2, or Cloudinary
- set a strong `AUTH_SECRET`
- run `npm run db:deploy` during deploy

Minimal deployment flow:

1. Provision a Node host.
2. Set `DATABASE_URL` and `AUTH_SECRET`.
3. Install dependencies with `npm install`.
4. Run `npm run build`.
5. Run `npm run db:deploy`.
6. Start with `npm run start`.

If you keep SQLite for a demo deployment, ensure the platform provides persistent writable disk storage for the database file and uploads directory.

## Code Review Guide

Review these files first:

- [`prisma/schema.prisma`](./prisma/schema.prisma)
- [`lib/auth.ts`](./lib/auth.ts)
- [`lib/feed.ts`](./lib/feed.ts)
- [`lib/uploads.ts`](./lib/uploads.ts)
- [`app/api/auth/register/route.ts`](./app/api/auth/register/route.ts)
- [`app/api/auth/login/route.ts`](./app/api/auth/login/route.ts)
- [`app/api/posts/route.ts`](./app/api/posts/route.ts)
- [`app/api/comments/route.ts`](./app/api/comments/route.ts)
- [`components/feed/post-card.tsx`](./components/feed/post-card.tsx)
- [`components/feed/comment-thread.tsx`](./components/feed/comment-thread.tsx)

## Validation Completed In This Hardening Pass

Confirmed locally:

- `npm install`
- Prisma migration sync
- seed script
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- app boot on a local dev server
- protected route redirect
- register/login/logout
- public/private visibility behavior
- image upload
- likes, comments, replies, and liked-by viewers
- validation failures for invalid inputs
- key static assets loading correctly
