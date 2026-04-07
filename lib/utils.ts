import { clsx } from "clsx";

export function cn(...values: Array<string | false | null | undefined>) {
  return clsx(values);
}

export function formatFullName(firstName: string, lastName: string) {
  return `${firstName} ${lastName}`.trim();
}
