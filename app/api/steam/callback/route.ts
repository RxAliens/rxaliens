import { NextRequest, NextResponse } from "next/server";
import { upsertUser } from "@/lib/db";

export async function GET(req: NextRequest) {
  // Callback hangi hosttan geldiyse kullanıcıyı yine aynı hosta döndür.
  // Böylece localhost, Vercel preview/production ve özel domain otomatik çalışır.
  const baseUrl = req.nextUrl.origin;

  const redirectWithError = (error: string) =>
    NextResponse.redirect(`${baseUrl}/?error=${encodeURIComponent(error)}`);

  try {
    const searchParams = req.nextUrl.searchParams;
    const params = new URLSearchParams();

    searchParams.forEach((value, key) => {
      if (key.startsWith("openid.")) {
        params.set(key, value);
      }
    });

    params.set("openid.mode", "check_authentication");

    const verifyResponse = await fetch(
      "https://steamcommunity.com/openid/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
        cache: "no-store",
      }
    );

    const verifyText = await verifyResponse.text();

    if (!verifyText.includes("is_valid:true")) {
      return redirectWithError("invalid-openid");
    }

    const claimedId = searchParams.get("openid.claimed_id");
    if (!claimedId) return redirectWithError("no-steamid");

    const steamId = claimedId.split("/").pop();
    if (!steamId) return redirectWithError("no-steamid");

    const steamApiKey = process.env.STEAM_API_KEY;
    if (!steamApiKey) return redirectWithError("steam-api-key-missing");

    const steamResponse = await fetch(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${encodeURIComponent(steamApiKey)}&steamids=${encodeURIComponent(steamId)}`,
      { cache: "no-store" }
    );

    if (!steamResponse.ok) return redirectWithError("steam-api");

    const steamData = await steamResponse.json();
    const player = steamData?.response?.players?.[0];
    if (!player) return redirectWithError("player-not-found");

    const user = {
      id: steamId,
      name: player.personaname,
      avatar: player.avatarfull,
      profileUrl: player.profileurl,
      createdAt: Date.now(),
    };

    upsertUser(steamId, player.personaname, player.avatarfull);

    const response = NextResponse.redirect(`${baseUrl}/`);
    response.cookies.set("steam_user", JSON.stringify(user), {
      httpOnly: true,
      secure: req.nextUrl.protocol === "https:",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    console.log("✅ Steam Login:", steamId);
    return response;
  } catch (error) {
    console.error("Steam Callback Error:", error);
    return redirectWithError("callback");
  }
}
