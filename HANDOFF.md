# Handoff

## What Reviewers Should Do First

1. Run `npm install`
2. Run `npm run db:setup`
3. Run `npm run dev`
4. Open `http://localhost:3000`
5. Login with `jane@example.com / Password123`

## Demo Accounts

- `jane@example.com` / `Password123`
- `alex@example.com` / `Password123`
- `sam@example.com` / `Password123`

## Key Reviewer Checks

- Logged-out access to `/feed` redirects to `/login`
- Jane can see her private post
- Alex cannot see Jane’s private post
- Public posts are visible across accounts
- Feed is newest-first
- Posts support text plus image upload
- Post, comment, and reply likes toggle correctly
- Liked-by viewers show who reacted

## Important Files

- [`README.md`](./README.md)
- [`prisma/schema.prisma`](./prisma/schema.prisma)
- [`lib/auth.ts`](./lib/auth.ts)
- [`lib/feed.ts`](./lib/feed.ts)
- [`app/api/posts/route.ts`](./app/api/posts/route.ts)
- [`app/api/comments/route.ts`](./app/api/comments/route.ts)

## Deployment Status

- Build validated locally
- Repo is deployment-prepared
- Full live deployment was not completed from this workspace
- For a real hosted version, use a Node host, set `AUTH_SECRET`, and prefer PostgreSQL plus object storage for uploads
