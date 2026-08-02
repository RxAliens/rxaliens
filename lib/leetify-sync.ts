import { createHash } from "crypto";
import { db, initDb } from "@/lib/db";

const API_BASE = "https://api-public.cs-prod.leetify.com";

async function leetifyFetch(path: string, steamId: string, apiKey: string) {
  const url = new URL(`${API_BASE}${path}`);
  url.searchParams.set("steam64_id", steamId);
  return fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: "no-store",
  });
}

export async function syncLeetifyForSteamId(steamId: string, options: { includeMatches?: boolean } = {}) {
  const apiKey = process.env.LEETIFY_API_KEY;
  if (!apiKey) return { ok: false as const, reason: "missing-key" as const };

  const includeMatches = options.includeMatches !== false;
  const profileRes = await leetifyFetch("/v3/profile", steamId, apiKey);
  const matchesRes = includeMatches ? await leetifyFetch("/v3/profile/matches", steamId, apiKey) : null;

  if (!profileRes.ok) {
    return { ok: false as const, reason: "profile-error" as const, status: profileRes.status };
  }

  const profile = await profileRes.json();
  let matchHistory: any[] = [];
  if (matchesRes?.ok) {
    const body = await matchesRes.json();
    matchHistory = Array.isArray(body) ? body : Array.isArray(body?.matches) ? body.matches : [];
  }

  await initDb();
  for (const match of matchHistory) {
    const explicitId = match?.id ?? match?.game_id ?? match?.match_id;
    const fallbackSource = JSON.stringify({
      steamId,
      map: match?.map_name ?? match?.map ?? null,
      started: match?.started_at ?? match?.created_at ?? null,
      finished: match?.finished_at ?? match?.date ?? null,
      scores: match?.team_scores ?? null,
    });
    const matchId = String(explicitId ?? createHash("sha256").update(fallbackSource).digest("hex"));
    const mapName = match?.map_name ?? match?.map ?? null;
    const finishedAt = match?.finished_at ?? match?.date ?? null;

    await db`INSERT INTO leetify_matches (match_id, steam_id, map_name, finished_at, payload)
      VALUES (${matchId}, ${steamId}, ${mapName}, ${finishedAt}, ${db.json(match)})
      ON CONFLICT (match_id) DO UPDATE SET
        map_name=EXCLUDED.map_name,
        finished_at=EXCLUDED.finished_at,
        payload=EXCLUDED.payload,
        synced_at=CURRENT_TIMESTAMP`;
  }

  const [{ count }] = await db`SELECT COUNT(*)::int AS count FROM leetify_matches WHERE steam_id=${steamId}`;
  const reportedTotal = Number(
    profile?.total_matches ??
    profile?.totalMatches ??
    profile?.stats?.total_matches ??
    profile?.stats?.matches ??
    0
  );
  const syncedCount = Math.max(
    Number(count ?? 0),
    Number.isFinite(reportedTotal) ? Math.trunc(reportedTotal) : 0,
    matchHistory.length
  );

  await db`UPDATE users SET leetify_match_count=${syncedCount}, last_active_at=CURRENT_TIMESTAMP, updated_at=CURRENT_TIMESTAMP WHERE steam_id=${steamId}`;
  return { ok: true as const, profile, matchHistory, syncedCount };
}
