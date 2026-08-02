import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const response = NextResponse.redirect(
    new URL("/", req.url)
  );

  response.cookies.set("steam_user", "", {
    path: "/",
    maxAge: 0,
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}