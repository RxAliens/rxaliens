import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest } from "next/server";

export type SteamSessionUser = {
  id: string;
  name?: string;
  avatar?: string;
  profileUrl?: string;
  createdAt?: number;
};

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value) throw new Error("AUTH_SECRET tanımlı değil.");
  return value;
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createSteamSession(user: SteamSessionUser) {
  const payload = Buffer.from(JSON.stringify(user), "utf8").toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function getSteamUser(req: NextRequest): SteamSessionUser | null {
  const raw = req.cookies.get("steam_user")?.value;
  if (!raw) return null;

  try {
    const [payload, signature, extra] = raw.split(".");
    if (!payload || !signature || extra) return null;

    const expected = sign(payload);
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

    const user = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof user?.id === "string" && /^\d{17}$/.test(user.id) ? user : null;
  } catch {
    return null;
  }
}

export function isAdmin(steamId: string) {
  return (process.env.ADMIN_STEAM_IDS || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .includes(steamId);
}
