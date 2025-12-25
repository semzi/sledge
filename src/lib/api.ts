export const API_BASE = "https://api.sledgementorship.com/api";
// export const API_BASE = "http://localhost/sledge/api";

export function apiUrl(path: string) {
  const cleanBase = API_BASE.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}
