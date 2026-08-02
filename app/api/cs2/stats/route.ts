import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const origin = req.nextUrl.origin;
    const cookie = req.headers.get("cookie") || "";
    const headers = { cookie };

    const [leetifyResponse, steamResponse] = await Promise.all([
      fetch(`${origin}/api/leetify/profile`, { cache: "no-store", headers }),
      fetch(`${origin}/api/steam/games`, { cache: "no-store", headers }),
    ]);

    const leetify = leetifyResponse.ok ? await leetifyResponse.json() : null;
    const steam = steamResponse.ok ? await steamResponse.json() : null;
    if (!steamResponse.ok) return NextResponse.json({ error: "Steam oyun verileri alınamadı." }, { status: steamResponse.status });

    const cs2 = Array.isArray(steam?.games) ? steam.games.find((game: any) => game.id === 730) : null;
    return NextResponse.json({
      steamid: leetify?.steam64_id ?? null,
      game: "Counter-Strike 2", hours: cs2?.hours ?? 0,
      matches: leetify?.total_matches ?? 0, winrate: leetify?.winrate ?? 0,
      rating: leetify?.ranks?.leetify ?? 0, premier: leetify?.ranks?.premier ?? null, faceit: leetify?.ranks?.faceit ?? null,
      aim: leetify?.rating?.aim ?? 0, positioning: leetify?.rating?.positioning ?? 0, utility: leetify?.rating?.utility ?? 0,
      opening: leetify?.rating?.opening ?? 0, clutch: leetify?.rating?.clutch ?? 0, maps: leetify?.ranks?.competitive ?? [], stats: leetify?.stats ?? {},
      leetifyAvailable: Boolean(leetify),
    });
  } catch (error) {
    console.error("CS2 stats error:", error);
    return NextResponse.json({ error: "CS2 verileri alınamadı." }, { status: 500 });
  }
}
