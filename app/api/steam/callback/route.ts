import { NextRequest, NextResponse } from "next/server";
import { upsertUser } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    // Steam'den gelen OpenID parametrelerini al
    const params = new URLSearchParams();

    searchParams.forEach((value, key) => {
      if (key.startsWith("openid.")) {
        params.set(key, value);
      }
    });

    // Steam doğrulaması iste
    params.set("openid.mode", "check_authentication");

    const verifyResponse = await fetch(
      "https://steamcommunity.com/openid/login",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    );

    const verifyText = await verifyResponse.text();

    if (!verifyText.includes("is_valid:true")) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/?error=invalid-openid`
      );
    }

    const claimedId =
      searchParams.get("openid.claimed_id");

    if (!claimedId) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/?error=no-steamid`
      );
    }

    const steamId = claimedId.split("/").pop();

    if (!steamId) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/?error=no-steamid`
      );
    }
    const steamResponse = await fetch(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_API_KEY}&steamids=${steamId}`,
      {
        cache: "no-store",
      }
    );

    if (!steamResponse.ok) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/?error=steam-api`
      );
    }

    const steamData = await steamResponse.json();

    const player =
      steamData?.response?.players?.[0];

    if (!player) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/?error=player-not-found`
      );
    }

    const user = {
      id: steamId,

      name: player.personaname,

      avatar: player.avatarfull,

      profileUrl: player.profileurl,

      createdAt: Date.now(),
    };

    upsertUser(steamId, player.personaname, player.avatarfull);

    const response = NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/`
    );

    response.cookies.set(
      "steam_user",
      JSON.stringify(user),
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV === "production",

        sameSite: "lax",

        path: "/",

        maxAge: 60 * 60 * 24 * 7,
      }
    );
    console.log("✅ Steam Login:", user);

    return response;

  } catch (error) {

    console.error("Steam Callback Error:", error);

    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/?error=callback`
    );
  }
}