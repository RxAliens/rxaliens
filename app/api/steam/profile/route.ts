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

    // Steam Profili
    const profileRes = await fetch(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamID}`,
      {
        cache: "no-store",
      }
    );

    const profileData = await profileRes.json();

    const player = profileData?.response?.players?.[0];

    if (!player) {
      return NextResponse.json(
        {
          error: "Steam kullanıcısı bulunamadı.",
        },
        {
          status: 404,
        }
      );
    }

    // Steam Level
    const levelRes = await fetch(
      `https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=${apiKey}&steamid=${steamID}`,
      {
        cache: "no-store",
      }
    );

    const levelData = await levelRes.json();

    const steamLevel =
      levelData?.response?.player_level ?? 0;

    // Durum
    let status = "⚫ Çevrimdışı";

    if (player.personastate === 1) {
      status = "🟢 Çevrimiçi";
    }

    if (player.personastate === 6) {
      status = "🎮 Oyunda";
    }

    // Oynadığı oyun
    const game = player.gameextrainfo ?? null;

    // Ülke
    const countryCode = player.loccountrycode ?? "TR";

    const country =
      new Intl.DisplayNames(["tr"], {
        type: "region",
      }).of(countryCode);

    const countryFlag = `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;

    // Hesap oluşturulma tarihi
    const created = new Date(player.timecreated * 1000);

    // Son giriş
    const lastLogoff = new Date(player.lastlogoff * 1000);

    return NextResponse.json({
      steamid: player.steamid,

      name: player.personaname,

      realName: player.realname ?? null,

      avatar: player.avatarfull,

      avatarMedium: player.avatarmedium,

      avatarSmall: player.avatar,

      profileUrl: player.profileurl,

      status,

      game,

      steamLevel,

      country,

      countryCode,

      countryFlag,

      accountCreated: created,

      lastLogoff,

      visibility: player.communityvisibilitystate,
    });
  } catch (error) {
    console.log("Steam profil hatası:", error);

    return NextResponse.json(
      {
        error: "Steam profil alınamadı.",
      },
      {
        status: 500,
      }
    );
  }
}