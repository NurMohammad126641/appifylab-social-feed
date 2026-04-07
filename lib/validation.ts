import { z } from "zod";

const maxImageSize = 5 * 1024 * 1024;

export const registerSchema = z.object({
  firstName: z.string().trim().min(2, "First name must be at least 2 characters.").max(50),
  lastName: z.string().trim().min(2, "Last name must be at least 2 characters.").max(50),
  email: z.email("Enter a valid email address.").transform((value) => value.toLowerCase()),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(100)
    .regex(/[A-Z]/, "Password must include an uppercase letter.")
    .regex(/[a-z]/, "Password must include a lowercase letter.")
    .regex(/[0-9]/, "Password must include a number."),
});

export const loginSchema = z.object({
  email: z.email("Enter a valid email address.").transform((value) => value.toLowerCase()),
  password: z.string().min(1, "Password is required."),
});

export const postSchema = z.object({
  content: z.string().trim().min(1, "Write something to post.").max(1000),
  visibility: z.enum(["PUBLIC", "PRIVATE"]),
});

export const commentSchema = z.object({
  postId: z.string().min(1),
  parentId: z.string().optional().nullable(),
  content: z.string().trim().min(1, "Comment cannot be empty.").max(500),
});

export function validateImageFile(file: File) {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Only JPG, PNG, WEBP, and GIF images are allowed.");
  }

  if (file.size > maxImageSize) {
    throw new Error("Image size must be 5MB or less.");
  }
}
