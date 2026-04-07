import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { getSessionUserId } from "@/lib/auth";
import { errorResponse } from "@/lib/api";
import { prisma } from "@/lib/prisma";

type Context = {
  params: Promise<{
    commentId: string;
  }>;
};

export async function POST(_: Request, context: Context) {
  try {
    const userId = await getSessionUserId();

    if (!userId) {
      return errorResponse("Authentication required.", 401);
    }

    const { commentId } = await context.params;

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        id: true,
        post: {
          select: {
            authorId: true,
            visibility: true,
          },
        },
      },
    });

    if (!comment) {
      return errorResponse("Comment not found.", 404);
    }

    if (comment.post.visibility === "PRIVATE" && comment.post.authorId !== userId) {
      return errorResponse("You do not have access to this comment.", 403);
    }

    const existingLike = await prisma.commentLike.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId,
        },
      },
      select: { id: true },
    });

    if (existingLike) {
      await prisma.commentLike.delete({
        where: {
          commentId_userId: {
            commentId,
            userId,
          },
        },
      });
    } else {
      await prisma.commentLike.create({
        data: {
          commentId,
          userId,
        },
      });
    }

    revalidatePath("/feed");

    return NextResponse.json({ ok: true, liked: !existingLike });
  } catch (error) {
    console.error(error);
    return errorResponse("Unable to update comment like.", 500);
  }
}
