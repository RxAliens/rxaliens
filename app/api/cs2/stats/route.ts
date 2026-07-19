import { NextResponse } from "next/server";

export async function GET() {
  try {
    const steamID = "76561198321706845";
    const apiKey = process.env.STEAM_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "STEAM_API_KEY bulunamadı.",
        },
        {
          status: 500,
        }
      );
    }

    const response = await fetch(
      `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${steamID}&include_appinfo=true&include_played_free_games=true`,
      {
        cache: "no-store",
      }
    );

    const data = await response.json();

    const games = data?.response?.games ?? [];

    // CS2 (AppID: 730)
    const cs2 = games.find((game: any) => game.appid === 730);

    if (!cs2) {
      return NextResponse.json(
        {
          error: "Counter-Strike 2 kütüphanede bulunamadı.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      steamid: steamID,

      game: cs2.name,

      hours: Math.floor(cs2.playtime_forever / 60),

      matches: null,

      wins: null,

      losses: null,

      kd: null,

      headshot: null,

      rank: null,
    });
  } catch (error) {
    console.log("CS2 API Hatası:", error);

    return NextResponse.json(
      {
        error: "CS2 verileri alınamadı.",
      },
      {
        status: 500,
      }
    );
  }
}