import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const baseUrl = req.nextUrl.origin;

    // Leetify verisi
    const leetifyResponse = await fetch(`${baseUrl}/api/leetify/profile`, {
      cache: "no-store",
      headers: {
        cookie: req.headers.get("cookie") ?? "",
      },
    });

    const leetify = await leetifyResponse.json();

    // Steam oyunları
    const steamResponse = await fetch(`${baseUrl}/api/steam/games`, {
      cache: "no-store",
      headers: {
        cookie: req.headers.get("cookie") ?? "",
      },
    });

    const steam = await steamResponse.json();
    const games = Array.isArray(steam?.games) ? steam.games : [];

    // CS2 oyununu bul (AppID: 730)
    const cs2 = games.find((game: any) => game.id === 730);

    return NextResponse.json({
      steamid: leetify.steam64_id,
      game: "Counter-Strike 2",
      hours: cs2?.hours ?? 0,
      matches: leetify.total_matches,
      winrate: leetify.winrate,
      rating: leetify.ranks?.leetify ?? 0,
      premier: leetify.ranks?.premier ?? null,
      faceit: leetify.ranks?.faceit ?? null,
      aim: leetify.rating?.aim ?? 0,
      positioning: leetify.rating?.positioning ?? 0,
      utility: leetify.rating?.utility ?? 0,
      opening: leetify.rating?.opening ?? 0,
      clutch: leetify.rating?.clutch ?? 0,
      maps: leetify.ranks?.competitive ?? [],
      stats: leetify.stats ?? {},
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "CS2 verileri alınamadı." },
      { status: 500 }
    );
  }
}
