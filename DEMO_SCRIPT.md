# Demo Script

## Recording Flow

1. Intro

- Show the login page and state the stack briefly: Next.js App Router, Prisma, cookie auth, uploads, likes, comments, replies.

2. Protected Route

- Open `/feed` in a logged-out state.
- Show redirect to `/login`.

3. Login

- Login as `jane@example.com / Password123`.
- Mention that auth uses a secure `httpOnly` cookie session.

4. Feed Overview

- Point out newest-first ordering.
- Show a seeded public post and Jane’s seeded private post.
- Mention that private posts are author-only.

5. Create Public Post

- Create a new public post with text.
- Upload an image with it.
- After submit, show it appears at the top of the feed.

6. Create Private Post

- Create a private post.
- Show the visibility label on the card.

7. Post Likes

- Like and unlike a post.
- Expand the liked-by viewer and show the user list.

8. Comments And Replies

- Add a comment to a post.
- Add a reply to that comment.
- Like and unlike the comment.
- Like and unlike the reply.
- Expand the liked-by viewer for comment/reply.

9. Logout / Second User

- Logout.
- Login as `alex@example.com / Password123`.
- Show that the public post is visible.
- Show that Jane’s private post is not visible.

10. Registration

- Logout.
- Open the registration page.
- Briefly show the required fields: first name, last name, email, password.

11. Codebase Overview

- Open `README.md`.
- Show `prisma/schema.prisma`.
- Show `lib/auth.ts`, `lib/feed.ts`, and one API route.

12. Wrap-Up

- Mention seeded demo credentials, setup steps, and deployment notes in the README.
