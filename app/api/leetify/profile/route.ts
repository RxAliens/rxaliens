import { NextRequest, NextResponse } from "next/server";
import { getSteamUser } from "@/lib/steam-session";

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

    return NextResponse.json({ ...profile, match_history: matchHistory }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Leetify bağlantı hatası:", error);
    return NextResponse.json({ error: "Leetify bağlantı hatası." }, { status: 502 });
  }
}
