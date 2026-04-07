import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { getSessionUserId } from "@/lib/auth";
import { errorResponse } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { saveImageFile } from "@/lib/uploads";
import { postSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const userId = await getSessionUserId();

    if (!userId) {
      return errorResponse("Authentication required.", 401);
    }

    const formData = await request.formData();

    const parsed = postSchema.safeParse({
      content: formData.get("content"),
      visibility: formData.get("visibility"),
    });

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message ?? "Invalid post.");
    }

    const image = formData.get("image");
    let imageUrl: string | undefined;

    if (image instanceof File && image.size > 0) {
      imageUrl = await saveImageFile(image);
    }

    await prisma.post.create({
      data: {
        authorId: userId,
        content: parsed.data.content,
        visibility: parsed.data.visibility,
        imageUrl,
      },
    });

    revalidatePath("/feed");

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error(error);
    return errorResponse(error instanceof Error ? error.message : "Unable to create post.", 500);
  }
}
