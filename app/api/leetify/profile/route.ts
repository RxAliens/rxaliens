import { NextRequest, NextResponse } from "next/server";
import { getSteamUser } from "@/lib/steam-session";
import { syncLeetifyForSteamId } from "@/lib/leetify-sync";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = getSteamUser(req);
  if (!session) return NextResponse.json({ error: "Steam ile giriş yapmalısın." }, { status: 401 });
  if (!process.env.LEETIFY_API_KEY) return NextResponse.json({ error: "LEETIFY_API_KEY tanımlı değil." }, { status: 500 });

  try {
    const result = await syncLeetifyForSteamId(session.id);
    if (!result.ok) {
      const status = result.reason === "profile-error" ? result.status : 500;
      const message = status === 404
        ? "Bu Steam hesabı için Leetify profili bulunamadı veya profil Public API üzerinden kullanılamıyor."
        : status === 401
          ? "Leetify API anahtarı geçersiz veya yetkisiz."
          : "Leetify verileri şu anda alınamadı.";
      return NextResponse.json({ error: message, leetifyStatus: status }, { status });
    }
    return NextResponse.json(
      { ...result.profile, match_history: result.matchHistory },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Leetify bağlantı hatası:", error);
    return NextResponse.json({ error: "Leetify bağlantı hatası." }, { status: 502 });
  }
}
