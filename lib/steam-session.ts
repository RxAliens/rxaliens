import { NextRequest } from "next/server";
export function getSteamUser(req: NextRequest): { id: string; name?: string; avatar?: string } | null {
  const raw = req.cookies.get("steam_user")?.value;
  if (!raw) return null;
  try {
    const u = JSON.parse(decodeURIComponent(raw));
    return u?.id ? u : null;
  } catch {
    try { const u = JSON.parse(raw); return u?.id ? u : null; } catch { return null; }
  }
}
export function isAdmin(steamId: string) {
  return (process.env.ADMIN_STEAM_IDS || "").split(",").map(x=>x.trim()).filter(Boolean).includes(steamId);
}
