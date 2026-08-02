import { NextRequest, NextResponse } from "next/server";
import { getSteamUser } from "@/lib/steam-session";
import { createHash } from "crypto";
import { db, initDb } from "@/lib/db";

export const dynamic = "force-dynamic";

async function leetifyFetch(path: string, steamId: string, apiKey: string) {
  const url = new URL(`https://api-public.cs-prod.leetify.com${path}`);
  url.searchParams.set("steam64_id", steamId);
  return fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: "no-store",
  });
}

export async function GET(req: NextRequest) {
  const session = getSteamUser(req);
  if (!session) return NextResponse.json({ error: "Steam ile giriş yapmalısın." }, { status: 401 });

  const apiKey = process.env.LEETIFY_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "LEETIFY_API_KEY tanımlı değil." }, { status: 500 });

  try {
    const [profileRes, matchesRes] = await Promise.all([
      leetifyFetch("/v3/profile", session.id, apiKey),
      leetifyFetch("/v3/profile/matches", session.id, apiKey),
    ]);

    if (!profileRes.ok) {
      const body = await profileRes.text().catch(() => "");
      console.error("Leetify profile API error", { status: profileRes.status, steamId: session.id, body: body.slice(0, 500) });
      const message = profileRes.status === 404
        ? "Bu Steam hesabı için Leetify profili bulunamadı veya profil Public API üzerinden kullanılamıyor."
        : profileRes.status === 401
          ? "Leetify API anahtarı geçersiz veya yetkisiz."
          : "Leetify verileri şu anda alınamadı.";
      return NextResponse.json({ error: message, leetifyStatus: profileRes.status }, { status: profileRes.status });
    }

    const profile = await profileRes.json();
    let matchHistory: any[] = [];
    if (matchesRes.ok) {
      const matchBody = await matchesRes.json();
      matchHistory = Array.isArray(matchBody) ? matchBody : Array.isArray(matchBody?.matches) ? matchBody.matches : [];
    } else {
      console.error("Leetify matches API error", { status: matchesRes.status, steamId: session.id });
    }

    // Leetify'dan gelen son maçları kalıcı olarak sakla. match_id PRIMARY KEY olduğu için
    // aynı maç tekrar geldiğinde kayıt şişmez. Toplam sayaç için ise profilin
    // total_matches alanını kullanıyoruz; match_history çoğu zaman yalnızca son maçları içerir.
    await initDb();
    if (matchHistory.length > 0) {
      for (const match of matchHistory) {
        const explicitId = match?.id ?? match?.game_id ?? match?.match_id;
        const fallbackSource = JSON.stringify({
          steamId: session.id,
          map: match?.map_name ?? match?.map ?? null,
          started: match?.started_at ?? match?.created_at ?? null,
          finished: match?.finished_at ?? match?.date ?? null,
          scores: match?.team_scores ?? null,
        });
        const matchId = String(explicitId ?? createHash("sha256").update(fallbackSource).digest("hex"));
        const mapName = match?.map_name ?? match?.map ?? null;
        const finishedAt = match?.finished_at ?? match?.date ?? null;

        await db`INSERT INTO leetify_matches (match_id, steam_id, map_name, finished_at, payload)
          VALUES (${matchId}, ${session.id}, ${mapName}, ${finishedAt}, ${db.json(match)})
          ON CONFLICT (match_id) DO UPDATE SET
            map_name=EXCLUDED.map_name,
            finished_at=EXCLUDED.finished_at,
            payload=EXCLUDED.payload,
            synced_at=CURRENT_TIMESTAMP`;
      }

    }

    const [{ count }] = await db`SELECT COUNT(*)::int AS count FROM leetify_matches WHERE steam_id=${session.id}`;
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
    await db`UPDATE users SET leetify_match_count=${syncedCount}, last_active_at=CURRENT_TIMESTAMP, updated_at=CURRENT_TIMESTAMP WHERE steam_id=${session.id}`;

    return NextResponse.json({ ...profile, match_history: matchHistory }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Leetify bağlantı hatası:", error);
    return NextResponse.json({ error: "Leetify bağlantı hatası." }, { status: 502 });
  }
}
