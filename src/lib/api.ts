import { CONFIG } from "./config";

export const API_BASE = CONFIG.API_BASE;

export function apiUrl(path: string) {
  const cleanBase = API_BASE.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}
