import { NextRequest, NextResponse } from "next/server";
import { getSteamUser } from "@/lib/steam-session";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = getSteamUser(req);
  if (!session) {
    return NextResponse.json({ error: "Steam ile giriş yapmalısın." }, { status: 401 });
  }

  const apiKey = process.env.LEETIFY_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "LEETIFY_API_KEY tanımlı değil." }, { status: 500 });
  }

  try {
    const url = new URL("https://api-public.cs-prod.leetify.com/v3/profile");
    url.searchParams.set("steam64_id", session.id);

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("Leetify API error", { status: res.status, steamId: session.id, body: body.slice(0, 500) });
      const message =
        res.status === 404
          ? "Bu Steam hesabı için Leetify profili bulunamadı veya profil Public API üzerinden kullanılamıyor."
          : res.status === 401
            ? "Leetify API anahtarı geçersiz veya yetkisiz."
            : "Leetify verileri şu anda alınamadı.";
      return NextResponse.json({ error: message, leetifyStatus: res.status }, { status: res.status });
    }

    return NextResponse.json(await res.json(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Leetify bağlantı hatası:", error);
    return NextResponse.json({ error: "Leetify bağlantı hatası." }, { status: 502 });
  }
}
