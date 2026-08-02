import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // İsteğin geldiği gerçek adresi kullanır:
  // local -> http://localhost:3000
  // Vercel -> https://<proje>.vercel.app
  // özel domain -> https://rxaliens.com
  const baseUrl = req.nextUrl.origin;
  const returnUrl = `${baseUrl}/api/steam/callback`;

  const params = new URLSearchParams({
    "openid.ns": "http://specs.openid.net/auth/2.0",
    "openid.mode": "checkid_setup",
    "openid.return_to": returnUrl,
    "openid.realm": baseUrl,
    "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
    "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
  });

  const steamUrl = `https://steamcommunity.com/openid/login?${params.toString()}`;
  return NextResponse.redirect(steamUrl);
}
