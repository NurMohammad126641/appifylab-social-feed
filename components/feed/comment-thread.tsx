"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { LikeButton } from "@/components/feed/like-button";
import { LikedBy } from "@/components/feed/liked-by";
import type { FeedCommentNode } from "@/lib/feed";
import { formatFullName } from "@/lib/utils";

type CommentThreadProps = {
  comments: FeedCommentNode[];
  postId: string;
  currentUserId: string;
  level?: number;
};

function CommentComposer({
  postId,
  parentId,
  buttonLabel,
}: {
  postId: string;
  parentId?: string;
  buttonLabel: string;
}) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          parentId,
          content,
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Unable to save comment.");
        return;
      }

      setContent("");
      router.refresh();
    } catch {
      setError("Unable to save comment right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="_feed_inner_comment_box">
      <form className="_feed_inner_comment_box_form" onSubmit={handleSubmit}>
        <div className="_feed_inner_comment_box_content">
          <div className="_feed_inner_comment_box_content_image">
            <img src="/assets/images/comment_img.png" alt="" className="_comment_img" />
          </div>
          <div className="_feed_inner_comment_box_content_txt">
            <textarea
              className="form-control _comment_textarea"
              placeholder={parentId ? "Write a reply" : "Write a comment"}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              required
            />
          </div>
        </div>
        <div className="_app_comment_actions">
          {error ? <p className="_app_form_error">{error}</p> : null}
          <button className="_app_comment_submit" type="submit" disabled={loading}>
            {loading ? "Saving..." : buttonLabel}
          </button>
        </div>
      </form>
    </div>
  );
}

export function CommentThread({
  comments,
  postId,
  currentUserId,
  level = 0,
}: CommentThreadProps) {
  return (
    <div className={level === 0 ? "_timline_comment_main" : "_app_reply_list"}>
      {level === 0 ? (
        <div className="_feed_inner_timeline_cooment_area">
          <CommentComposer postId={postId} buttonLabel="Comment" />
        </div>
      ) : null}
      {comments.map((comment) => {
        const likedByCurrentUser = comment.likes.some((like) => like.userId === currentUserId);

        return (
          <div className="_comment_main _app_comment_main" key={comment.id}>
            <div className="_comment_image">
              <span className="_comment_image_link">
                <img src="/assets/images/txt_img.png" alt="" className="_comment_img1" />
              </span>
            </div>
            <div className="_comment_area">
              <div className="_comment_details">
                <div className="_comment_details_top">
                  <div className="_comment_name">
                    <h4 className="_comment_name_title">
                      {formatFullName(comment.author.firstName, comment.author.lastName)}
                    </h4>
                  </div>
                </div>
                <div className="_comment_status">
                  <p className="_comment_status_text">
                    <span>{comment.content}</span>
                  </p>
                </div>
                <div className="_comment_reply">
                  <div className="_comment_reply_num">
                    <div className="_app_inline_actions">
                      <LikeButton
                        endpoint={`/api/comments/${comment.id}/like`}
                        initialLiked={likedByCurrentUser}
                        initialCount={comment.likes.length}
                        noun="comment"
                        className="_app_text_action"
                        activeClassName="_app_text_action_active"
                        likedLabel="Unlike"
                        unlikedLabel="Like"
                      />
                      <span className="_app_text_hint">Reply</span>
                    </div>
                  </div>
                </div>
                <LikedBy label="comment" users={comment.likes.map((like) => like.user)} />
              </div>
              <CommentComposer postId={postId} parentId={comment.id} buttonLabel="Reply" />
              {comment.replies.length ? (
                <CommentThread
                  comments={comment.replies}
                  postId={postId}
                  currentUserId={currentUserId}
                  level={level + 1}
                />
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
