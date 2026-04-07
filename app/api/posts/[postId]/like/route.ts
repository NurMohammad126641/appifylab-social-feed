import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { getSessionUserId } from "@/lib/auth";
import { errorResponse } from "@/lib/api";
import { prisma } from "@/lib/prisma";

type Context = {
  params: Promise<{
    postId: string;
  }>;
};

export async function POST(_: Request, context: Context) {
  try {
    const userId = await getSessionUserId();

    if (!userId) {
      return errorResponse("Authentication required.", 401);
    }

    const { postId } = await context.params;

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, authorId: true, visibility: true },
    });

    if (!post) {
      return errorResponse("Post not found.", 404);
    }

    if (post.visibility === "PRIVATE" && post.authorId !== userId) {
      return errorResponse("You do not have access to this post.", 403);
    }

    const existingLike = await prisma.postLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
      select: { id: true },
    });

    if (existingLike) {
      await prisma.postLike.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });
    } else {
      await prisma.postLike.create({
        data: {
          postId,
          userId,
        },
      });
    }

    revalidatePath("/feed");

    return NextResponse.json({ ok: true, liked: !existingLike });
  } catch (error) {
    console.error(error);
    return errorResponse("Unable to update post like.", 500);
  }
}
