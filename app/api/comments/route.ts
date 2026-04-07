import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { getSessionUserId } from "@/lib/auth";
import { errorResponse } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { commentSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const userId = await getSessionUserId();

    if (!userId) {
      return errorResponse("Authentication required.", 401);
    }

    const body = await request.json();
    const parsed = commentSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message ?? "Invalid comment.");
    }

    const post = await prisma.post.findUnique({
      where: { id: parsed.data.postId },
      select: {
        id: true,
        authorId: true,
        visibility: true,
      },
    });

    if (!post) {
      return errorResponse("Post not found.", 404);
    }

    if (post.visibility === "PRIVATE" && post.authorId !== userId) {
      return errorResponse("You do not have access to this post.", 403);
    }

    if (parsed.data.parentId) {
      const parent = await prisma.comment.findUnique({
        where: { id: parsed.data.parentId },
        select: { id: true, postId: true },
      });

      if (!parent || parent.postId !== parsed.data.postId) {
        return errorResponse("Reply target is invalid.", 400);
      }
    }

    await prisma.comment.create({
      data: {
        postId: parsed.data.postId,
        authorId: userId,
        parentId: parsed.data.parentId ?? null,
        content: parsed.data.content,
      },
    });

    revalidatePath("/feed");

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error(error);
    return errorResponse("Unable to save comment.", 500);
  }
}
