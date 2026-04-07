"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type LikeButtonProps = {
  endpoint: string;
  initialLiked: boolean;
  initialCount: number;
  noun: string;
  className?: string;
  activeClassName?: string;
  likedLabel?: string;
  unlikedLabel?: string;
};

export function LikeButton({
  endpoint,
  initialLiked,
  initialCount,
  noun,
  className = "_app_action_btn",
  activeClassName = "_app_action_btn_active",
  likedLabel,
  unlikedLabel,
}: LikeButtonProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) {
      return;
    }

    const nextLiked = !liked;
    setLoading(true);
    setLiked(nextLiked);
    setCount((current) => current + (nextLiked ? 1 : -1));
    try {
      const response = await fetch(endpoint, {
        method: "POST",
      });

      if (!response.ok) {
        setLiked(initialLiked);
        setCount(initialCount);
      }
    } catch {
      setLiked(initialLiked);
      setCount(initialCount);
    } finally {
      router.refresh();
      setLoading(false);
    }
  }

  const label = liked
    ? likedLabel ?? `Unlike ${noun}`
    : unlikedLabel ?? `Like ${noun}`;

  return (
    <button
      className={`${className} ${liked ? activeClassName : ""}`.trim()}
      type="button"
      onClick={handleClick}
      disabled={loading}
    >
      {label} <span>{count}</span>
    </button>
  );
}
