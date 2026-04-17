import { CONFIG } from "./config";

export const API_BASE = CONFIG.API_BASE;

export function apiUrl(path: string) {
  const cleanBase = API_BASE.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}

export async function fetchRoadmap() {
  const res = await fetch(apiUrl('/content.php'));
  if (!res.ok) throw new Error('Failed to fetch roadmap data');
  const data = await res.json();
  // Expecting roadmap data to be stored under the 'roadmap' key
  return data.roadmap;
}
