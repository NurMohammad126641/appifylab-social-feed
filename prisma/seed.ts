import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.commentLike.deleteMany();
  await prisma.postLike.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("Password123", 12);

  const [jane, alex, sam] = await Promise.all([
    prisma.user.create({
      data: {
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        firstName: "Alex",
        lastName: "Morgan",
        email: "alex@example.com",
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        firstName: "Sam",
        lastName: "Rivera",
        email: "sam@example.com",
        passwordHash,
      },
    }),
  ]);

  const publicPost = await prisma.post.create({
    data: {
      authorId: jane.id,
      content:
        "Launching the assignment demo feed with public visibility, threaded comments, and likes.",
      imageUrl: "/seed/feed-photo-1.svg",
      visibility: "PUBLIC",
    },
  });

  const privatePost = await prisma.post.create({
    data: {
      authorId: jane.id,
      content: "This is Jane's private note. Only Jane should see it in the feed.",
      visibility: "PRIVATE",
    },
  });

  const secondPublicPost = await prisma.post.create({
    data: {
      authorId: alex.id,
      content:
        "Here is another public update with an image attachment to test feed ordering and media rendering.",
      imageUrl: "/seed/feed-photo-2.svg",
      visibility: "PUBLIC",
    },
  });

  await prisma.postLike.createMany({
    data: [
      { postId: publicPost.id, userId: alex.id },
      { postId: publicPost.id, userId: sam.id },
      { postId: secondPublicPost.id, userId: jane.id },
    ],
  });

  const topLevelComment = await prisma.comment.create({
    data: {
      postId: publicPost.id,
      authorId: alex.id,
      content: "The protected feed and the auth flow are looking solid.",
    },
  });

  const reply = await prisma.comment.create({
    data: {
      postId: publicPost.id,
      authorId: sam.id,
      parentId: topLevelComment.id,
      content: "Agreed. The reply threading makes the demo much easier to present.",
    },
  });

  const secondTopLevelComment = await prisma.comment.create({
    data: {
      postId: secondPublicPost.id,
      authorId: jane.id,
      content: "This public post should appear above older ones because the feed is newest first.",
    },
  });

  await prisma.commentLike.createMany({
    data: [
      { commentId: topLevelComment.id, userId: jane.id },
      { commentId: topLevelComment.id, userId: sam.id },
      { commentId: reply.id, userId: alex.id },
      { commentId: secondTopLevelComment.id, userId: sam.id },
    ],
  });

  console.log("Seed completed.");
  console.log("Demo users:");
  console.log("  jane@example.com / Password123");
  console.log("  alex@example.com / Password123");
  console.log("  sam@example.com / Password123");
  console.log(`Private post belongs to ${jane.email}: ${privatePost.id}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
