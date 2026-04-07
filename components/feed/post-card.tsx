import { formatDistanceToNow } from "date-fns";

import { CommentThread } from "@/components/feed/comment-thread";
import { LikeButton } from "@/components/feed/like-button";
import { LikedBy } from "@/components/feed/liked-by";
import type { FeedPost } from "@/lib/feed";
import { formatFullName } from "@/lib/utils";

type PostCardProps = {
  post: FeedPost;
  currentUserId: string;
};

function countComments(comments: FeedPost["comments"]): number {
  return comments.reduce((total, comment) => total + 1 + countComments(comment.replies), 0);
}

export function PostCard({ post, currentUserId }: PostCardProps) {
  const likedByCurrentUser = post.likes.some((like) => like.userId === currentUserId);
  const totalComments = countComments(post.comments);

  return (
    <article className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        <div className="_feed_inner_timeline_post_top">
          <div className="_feed_inner_timeline_post_box">
            <div className="_feed_inner_timeline_post_box_image">
              <img src="/assets/images/post_img.png" alt="" className="_post_img" />
            </div>
            <div className="_feed_inner_timeline_post_box_txt">
              <h4 className="_feed_inner_timeline_post_box_title">
                {formatFullName(post.author.firstName, post.author.lastName)}
              </h4>
              <p className="_feed_inner_timeline_post_box_para">
                {formatDistanceToNow(post.createdAt, { addSuffix: true })} .{" "}
                <span className="_app_post_visibility">
                  {post.visibility === "PRIVATE" ? "Private" : "Public"}
                </span>
              </p>
            </div>
          </div>
          <div className="_feed_inner_timeline_post_box_dropdown">
            <div className="_feed_timeline_post_dropdown">
              <button className="_feed_timeline_post_dropdown_link" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17">
                  <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                  <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                  <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <h4 className="_feed_inner_timeline_post_title">{post.content}</h4>
        {post.imageUrl ? (
          <div className="_feed_inner_timeline_image _app_feed_image">
            <img src={post.imageUrl} alt="Post attachment" className="_time_img" />
          </div>
        ) : null}
      </div>
      <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
        <div className="_feed_inner_timeline_total_reacts_txt _app_reacts_only">
          <p className="_feed_inner_timeline_total_reacts_para1">
            <span>{totalComments}</span> Comment
          </p>
          <p className="_feed_inner_timeline_total_reacts_para2">
            <span>{post.likes.length}</span> Likes
          </p>
        </div>
      </div>
      <div className="_feed_inner_timeline_reaction">
        <LikeButton
          endpoint={`/api/posts/${post.id}/like`}
          initialLiked={likedByCurrentUser}
          initialCount={post.likes.length}
          noun="post"
          className="_feed_inner_timeline_reaction_emoji _feed_reaction"
          activeClassName="_feed_reaction _feed_reaction_active _feed_inner_timeline_reaction_emoji"
          likedLabel="Unlike"
          unlikedLabel="Like"
        />
        <button className="_feed_inner_timeline_reaction_comment _feed_reaction" type="button">
          <span className="_feed_inner_timeline_reaction_link">
            <span>Comment</span>
          </span>
        </button>
        <button className="_feed_inner_timeline_reaction_share _feed_reaction" type="button">
          <span className="_feed_inner_timeline_reaction_link">
            <span>{post.visibility === "PRIVATE" ? "Only you" : "Public post"}</span>
          </span>
        </button>
      </div>
      <div className="_padd_r24 _padd_l24 _app_liked_by_wrap">
        <LikedBy label="post" users={post.likes.map((like) => like.user)} />
      </div>
      <CommentThread comments={post.comments} postId={post.id} currentUserId={currentUserId} />
    </article>
  );
}
