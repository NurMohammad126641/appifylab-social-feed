import { type Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const userSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
} satisfies Prisma.UserSelect;

const feedPostInclude = {
  author: {
    select: userSelect,
  },
  likes: {
    select: {
      id: true,
      userId: true,
      user: {
        select: userSelect,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  },
  comments: {
    include: {
      author: {
        select: userSelect,
      },
      likes: {
        select: {
          id: true,
          userId: true,
          user: {
            select: userSelect,
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  },
} satisfies Prisma.PostInclude;

type RawFeedPost = Prisma.PostGetPayload<{
  include: typeof feedPostInclude;
}>;

export type FeedCommentNode = RawFeedPost["comments"][number] & {
  replies: FeedCommentNode[];
};

export type FeedPost = Omit<RawFeedPost, "comments"> & {
  comments: FeedCommentNode[];
};

function buildCommentTree(comments: RawFeedPost["comments"]) {
  const nodeMap = new Map<string, FeedCommentNode>();
  const roots: FeedCommentNode[] = [];

  comments.forEach((comment) => {
    nodeMap.set(comment.id, {
      ...comment,
      replies: [],
    });
  });

  comments.forEach((comment) => {
    const node = nodeMap.get(comment.id);

    if (!node) {
      return;
    }

    if (comment.parentId) {
      const parent = nodeMap.get(comment.parentId);
      if (parent) {
        parent.replies.push(node);
      }
      return;
    }

    roots.push(node);
  });

  return roots;
}

export async function getFeedPosts(userId: string): Promise<FeedPost[]> {
  const posts = await prisma.post.findMany({
    where: {
      OR: [{ visibility: "PUBLIC" }, { authorId: userId }],
    },
    orderBy: {
      createdAt: "desc",
    },
    include: feedPostInclude,
  });

  return posts.map((post) => ({
    ...post,
    comments: buildCommentTree(post.comments),
  }));
}
