import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {


  const { searchParams } = new URL(req.url);


  const claimedId =
    searchParams.get("openid.claimed_id");


  if (!claimedId) {

    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/?error=steam`
    );

  }



  const steamId =
    claimedId.split("/").pop();



  if (!steamId) {

    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/?error=steam`
    );

  }



  const steamResponse =
    await fetch(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_API_KEY}&steamids=${steamId}`
    );


  const steamData =
    await steamResponse.json();



  const player =
    steamData?.response?.players?.[0];



  if (!player) {

    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/?error=steam-user`
    );

  }



  const user = {

    id: steamId,

    name: player.personaname,

    image: player.avatarfull,

  };



  console.log("STEAM USER:", user);



  const response =
    NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/`
    );



  response.cookies.set(
    "steam_user",
    JSON.stringify(user),
    {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    }
  );



  return response;


}