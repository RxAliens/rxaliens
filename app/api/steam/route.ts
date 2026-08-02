import { NextRequest, NextResponse } from "next/server";

function getBaseUrl(req: NextRequest) {
  const configured = process.env.NEXTAUTH_URL?.replace(/\/$/, "");
  if (configured) return configured;
  return req.nextUrl.origin;
}

export async function GET(req: NextRequest) {
  const baseUrl = getBaseUrl(req);
  const returnUrl = `${baseUrl}/api/steam/callback`;

  const params = new URLSearchParams({
    "openid.ns": "http://specs.openid.net/auth/2.0",
    "openid.mode": "checkid_setup",
    "openid.return_to": returnUrl,
    "openid.realm": baseUrl,
    "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
    "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
  });

  return NextResponse.redirect(
    `https://steamcommunity.com/openid/login?${params.toString()}`
  );
}
