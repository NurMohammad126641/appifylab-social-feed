import { NextResponse } from "next/server";

import { createSession, verifyPassword } from "@/lib/auth";
import { errorResponse } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message ?? "Invalid login details.");
    }

    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: {
        id: true,
        passwordHash: true,
      },
    });

    if (!user) {
      return errorResponse("Invalid email or password.", 401);
    }

    const matches = await verifyPassword(parsed.data.password, user.passwordHash);

    if (!matches) {
      return errorResponse("Invalid email or password.", 401);
    }

    await createSession(user.id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return errorResponse("Unable to log in right now.", 500);
  }
}
