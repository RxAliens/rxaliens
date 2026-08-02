import { NextRequest, NextResponse } from "next/server";
import { db, getUser, upsertUser } from "@/lib/db";
import { isAdmin } from "@/lib/steam-session";
import { levelFromXp } from "@/lib/xp";

export const dynamic = "force-dynamic";

type SteamCookieUser = {
  id?: string;
  steamid?: string;
  name?: string;
  image?: string;
};

export async function GET(req: NextRequest) {
  try {
    const apiKey = process.env.STEAM_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "STEAM_API_KEY bulunamadı." }, { status: 500 });
    }

    const rawCookie = req.cookies.get("steam_user")?.value;

    if (!rawCookie) {
      return NextResponse.json({ error: "Steam oturumu bulunamadı." }, { status: 401 });
    }

    let cookieUser: SteamCookieUser;

    try {
      cookieUser = JSON.parse(decodeURIComponent(rawCookie));
    } catch {
      try {
        cookieUser = JSON.parse(rawCookie);
      } catch {
        return NextResponse.json({ error: "Steam oturumu geçersiz." }, { status: 401 });
      }
    }

    const steamID = cookieUser.id || cookieUser.steamid;

    if (!steamID) {
      return NextResponse.json({ error: "Steam ID bulunamadı." }, { status: 401 });
    }

    const profileRes = await fetch(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamID}`,
      { cache: "no-store" }
    );

    if (!profileRes.ok) {
      return NextResponse.json({ error: "Steam profil servisine ulaşılamadı." }, { status: 502 });
    }

    const profileData = await profileRes.json();
    const player = profileData?.response?.players?.[0];

    if (!player) {
      return NextResponse.json({ error: "Steam kullanıcısı bulunamadı." }, { status: 404 });
    }

    const [levelRes, bansRes] = await Promise.all([
      fetch(
        `https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=${apiKey}&steamid=${steamID}`,
        { cache: "no-store" }
      ),
      fetch(
        `https://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${apiKey}&steamids=${steamID}`,
        { cache: "no-store" }
      ),
    ]);

    const levelData = levelRes.ok ? await levelRes.json() : null;
    const bansData = bansRes.ok ? await bansRes.json() : null;

    const steamLevel = levelData?.response?.player_level ?? 0;
    const bans = bansData?.players?.[0];
    const vac = Boolean(bans?.VACBanned);

    const personaStates: Record<number, string> = {
      0: "Çevrimdışı",
      1: "Çevrimiçi",
      2: "Meşgul",
      3: "Uzakta",
      4: "Ertele",
      5: "Takas Yapmak İstiyor",
      6: "Oynamak İstiyor",
    };

    let status = personaStates[player.personastate] ?? "Bilinmiyor";
    const game = player.gameextrainfo ?? null;

    if (game) status = "Oyunda";

    const countryCode = (player.loccountrycode || "TR").toUpperCase();

    let country = countryCode;
    try {
      country =
        new Intl.DisplayNames(["tr"], { type: "region" }).of(countryCode) ||
        countryCode;
    } catch {}

    await upsertUser(steamID, player.personaname, player.avatarfull);
    const rxUser = await getUser(steamID);
    const xpState = levelFromXp(rxUser?.rx_xp ?? 0);
    const equippedIds = [rxUser?.equipped_badge, rxUser?.equipped_title, rxUser?.equipped_frame].filter((x): x is number => typeof x === "number");
    const equippedRows = equippedIds.length
      ? await db`SELECT id,name,category,emoji,rarity,effect FROM market_items WHERE id IN ${db(equippedIds)}`
      : [];
    const equipped = {
      badge: equippedRows.find((x: any) => x.category === "Rozet") ?? null,
      title: equippedRows.find((x: any) => x.category === "Unvan") ?? null,
      frame: equippedRows.find((x: any) => x.category === "Çerçeve") ?? null,
    };

    return NextResponse.json(
      {
        steamid: player.steamid,
        name: player.personaname,
        realName: player.realname ?? null,
        avatar: player.avatarfull || cookieUser.image || "/images/default-avatar.png",
        avatarMedium: player.avatarmedium ?? null,
        avatarSmall: player.avatar ?? null,
        profileUrl: player.profileurl,
        status,
        personaState: player.personastate,
        game,
        steamLevel,
        level: steamLevel,
        country,
        countryCode,
        vac,
        accountCreated: player.timecreated
          ? new Date(player.timecreated * 1000).toISOString()
          : null,
        lastLogoff: player.lastlogoff
          ? new Date(player.lastlogoff * 1000).toISOString()
          : null,
        visibility: player.communityvisibilitystate,
        coin: rxUser?.coin ?? 100,
        rxLevel: xpState.level,
        rxXp: rxUser?.rx_xp ?? 0,
        rxCurrentXp: xpState.currentXp,
        rxNextXp: xpState.nextXp,
        rxProgress: xpState.progress,
        equipped,
        isAdmin: isAdmin(steamID),
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Steam profil hatası:", error);
    return NextResponse.json({ error: "Steam profil alınamadı." }, { status: 500 });
  }
}
