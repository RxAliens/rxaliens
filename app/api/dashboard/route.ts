import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const finite = (value: unknown, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const percent = (value: unknown) => {
  const n = finite(value, 0);
  // Leetify bazı oranları 0-1 aralığında döndürüyor.
  return n > 0 && n <= 1 ? n * 100 : n;
};

const arrayOrEmpty = <T,>(value: unknown): T[] =>
  Array.isArray(value) ? (value as T[]) : [];

export async function GET(req: NextRequest) {
  try {
    const origin = req.nextUrl.origin;
    const cookie = req.headers.get("cookie") || "";

    const profileRes = await fetch(`${origin}/api/steam/profile`, {
      cache: "no-store",
      headers: { cookie },
    });

    if (!profileRes.ok) {
      const error = await profileRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: error?.error || "Steam profili alınamadı." },
        { status: profileRes.status }
      );
    }

    const profile = await profileRes.json();

    const [cs2Result, leetifyResult] = await Promise.allSettled([
      fetch(`${origin}/api/cs2/stats`, {
        cache: "no-store",
        headers: { cookie },
      }).then(async (r) => (r.ok ? r.json() : null)),
      fetch(`${origin}/api/leetify/profile`, {
        cache: "no-store",
        headers: { cookie },
      }).then(async (r) => (r.ok ? r.json() : null)),
    ]);

    const cs2 = cs2Result.status === "fulfilled" ? cs2Result.value : null;
    const leetify =
      leetifyResult.status === "fulfilled" ? leetifyResult.value : null;

    const rawStats = leetify?.stats ?? cs2?.stats ?? {};
    const rawRating =
      cs2?.premier ??
      cs2?.premierRating ??
      leetify?.ranks?.premier ??
      leetify?.premierRating ??
      0;

    const stats = {
      rating: finite(rawRating),
      kd: finite(
        rawStats?.kd ??
          rawStats?.k_d ??
          rawStats?.kd_ratio ??
          cs2?.kd ??
          cs2?.kdr
      ),
      hs: percent(
        rawStats?.hs ??
          rawStats?.headshot ??
          rawStats?.headshot_percentage ??
          rawStats?.headshotPercentage ??
          cs2?.headshot
      ),
      adr: finite(
        rawStats?.adr ??
          rawStats?.average_damage_per_round ??
          rawStats?.averageDamage ??
          cs2?.adr
      ),
      winrate: percent(cs2?.winrate ?? leetify?.winrate ?? rawStats?.winrate),
      aim: finite(
        cs2?.aim ?? leetify?.rating?.aim ?? leetify?.aimRating ?? leetify?.aim
      ),
      clutch: percent(
        cs2?.clutch ??
          leetify?.rating?.clutch ??
          leetify?.clutchPercentage ??
          leetify?.clutch
      ),
      leetify: finite(
        cs2?.rating ?? leetify?.ranks?.leetify ?? leetify?.leetifyRating ?? leetify?.rating
      ),
    };

    // total_matches gibi sayısal alanları asla RecentMatches'a göndermiyoruz.
    const matches =
      arrayOrEmpty<any>(leetify?.recent_matches).length > 0
        ? arrayOrEmpty<any>(leetify?.recent_matches)
        : arrayOrEmpty<any>(leetify?.matches);

    const rawPerformance =
      arrayOrEmpty<any>(leetify?.performance).length > 0
        ? arrayOrEmpty<any>(leetify?.performance)
        : arrayOrEmpty<any>(cs2?.performance);

    const performance = rawPerformance
      .map((item: any, index: number) => ({
        match: finite(item?.match ?? item?.index ?? index + 1, index + 1),
        rating: finite(
          item?.rating ?? item?.premierRating ?? item?.premier ?? item?.value
        ),
      }))
      .filter((item: any) => Number.isFinite(item.rating));

    return NextResponse.json(
      {
        profile,
        stats,
        matches,
        performance,
        achievements: [],
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Dashboard API hatası:", error);
    return NextResponse.json({ error: "Dashboard API Error" }, { status: 500 });
  }
}
