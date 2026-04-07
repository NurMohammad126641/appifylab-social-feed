import { FeedShell } from "@/components/feed/feed-shell";
import { getCurrentUser, requireUserId } from "@/lib/auth";
import { getFeedPosts } from "@/lib/feed";

export default async function FeedPage() {
  const userId = await requireUserId();
  const [currentUser, posts] = await Promise.all([getCurrentUser(), getFeedPosts(userId)]);

  if (!currentUser) {
    return null;
  }

  return <FeedShell currentUser={currentUser} posts={posts} />;
}
