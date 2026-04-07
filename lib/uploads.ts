import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { validateImageFile } from "@/lib/validation";

const uploadsDir = path.join(process.cwd(), "public", "uploads");

const extensionByMimeType: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function saveImageFile(file: File) {
  validateImageFile(file);

  await mkdir(uploadsDir, { recursive: true });

  const bytes = Buffer.from(await file.arrayBuffer());
  const extension = extensionByMimeType[file.type] ?? "jpg";
  const filename = `${Date.now()}-${randomUUID()}.${extension}`;
  const outputPath = path.join(uploadsDir, filename);

  await writeFile(outputPath, bytes);

  return `/uploads/${filename}`;
}
