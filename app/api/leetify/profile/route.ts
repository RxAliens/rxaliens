import { NextResponse } from "next/server";

export async function GET() {
  try {
    const steam64id = "76561198321706845";

    const res = await fetch(
      `https://api-public.cs-prod.leetify.com/v3/profile?steam64_id=${steam64id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.LEETIFY_API_KEY}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Leetify API Error" },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Leetify bağlantı hatası",
      },
      {
        status: 500,
      }
    );
  }
}