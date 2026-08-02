import { NextRequest, NextResponse } from "next/server";
import { getSteamUser } from "@/lib/steam-session";

export async function GET(req: NextRequest) {
  try {
    const session = getSteamUser(req);
    if (!session) return NextResponse.json({ error: "Steam ile giriş yapmalısın." }, { status: 401 });
    const apiKey = process.env.STEAM_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "STEAM_API_KEY bulunamadı." }, { status: 500 });

    const url = new URL("https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/");
    url.searchParams.set("key", apiKey);
    url.searchParams.set("steamid", session.id);
    url.searchParams.set("include_appinfo", "true");
    url.searchParams.set("include_played_free_games", "true");
    url.searchParams.set("include_extended_appinfo", "true");

    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return NextResponse.json({ error: "Steam oyun servisine ulaşılamadı." }, { status: 502 });
    const data = await response.json();
    const games = data?.response?.games ?? [];
    const totalHours = games.reduce((sum: number, game: any) => sum + game.playtime_forever, 0);
    const mostPlayed = [...games].sort((a: any, b: any) => b.playtime_forever - a.playtime_forever)[0] ?? null;
    const formattedGames = games.sort((a: any, b: any) => b.playtime_forever - a.playtime_forever).map((game: any) => ({
      id: game.appid, name: game.name, hours: Math.floor(game.playtime_forever / 60), minutes: game.playtime_forever,
      icon: game.img_icon_url ? `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg` : null,
      header: `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`,
    }));
    return NextResponse.json({ totalGames: data?.response?.game_count ?? 0, totalHours: Math.floor(totalHours / 60), mostPlayed: mostPlayed ? { id: mostPlayed.appid, name: mostPlayed.name, hours: Math.floor(mostPlayed.playtime_forever / 60) } : null, games: formattedGames });
  } catch (error) {
    console.error("Steam oyunları hatası:", error);
    return NextResponse.json({ error: "Steam oyunları alınamadı." }, { status: 500 });
  }
}
