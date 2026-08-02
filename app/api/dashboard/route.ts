import { NextRequest, NextResponse } from "next/server";
import { db, initDb } from "@/lib/db";

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

    const rawMatches =
      arrayOrEmpty<any>(leetify?.match_history).length > 0
        ? arrayOrEmpty<any>(leetify?.match_history)
        : arrayOrEmpty<any>(leetify?.recent_matches).length > 0
          ? arrayOrEmpty<any>(leetify?.recent_matches)
          : arrayOrEmpty<any>(leetify?.matches);

    // Ana sayfadaki topluluk istatistiği için Leetify'nin profil üzerinde
    // döndürdüğü gerçek toplam maç sayısını kullan. Public API yalnızca son
    // maçların bir bölümünü match_history içinde döndürebildiği için
    // rawMatches.length toplam maç sayısı değildir.
    if (profile?.steamid && leetify) {
      const reportedTotalMatches = finite(
        leetify?.total_matches ??
          leetify?.totalMatches ??
          leetify?.stats?.total_matches ??
          leetify?.stats?.matches,
        0
      );
      const leetifyMatchCount = Math.max(
        0,
        Math.trunc(reportedTotalMatches),
        rawMatches.length
      );

      await initDb();
      await db`UPDATE users SET leetify_match_count=${leetifyMatchCount}, last_active_at=CURRENT_TIMESTAMP, updated_at=CURRENT_TIMESTAMP WHERE steam_id=${String(profile.steamid)}`;
    }

    const formatDuration = (seconds: unknown) => {
      const total = finite(seconds, 0);
      if (total <= 0) return "-";
      return `${Math.max(1, Math.round(total / 60))} dk`;
    };

    const matches = rawMatches.slice(0, 10).map((match: any) => {
      const playerStats =
        match?.player_stats ??
        match?.player ??
        (!Array.isArray(match?.stats) && match?.stats && typeof match.stats === "object" ? match.stats : null) ??
        arrayOrEmpty<any>(match?.stats).find(
          (p: any) => String(p?.steam64_id ?? p?.steam_id ?? "") === String(profile?.steamid ?? profile?.id ?? profile?.steamId ?? "")
        ) ??
        (arrayOrEmpty<any>(match?.stats).length === 1 ? match.stats[0] : {});

      const kills = finite(playerStats?.total_kills ?? playerStats?.kills);
      const deaths = finite(playerStats?.total_deaths ?? playerStats?.deaths);
      const hsKills = finite(playerStats?.total_hs_kills ?? playerStats?.headshot_kills ?? playerStats?.headshots);
      const teamNumber = finite(playerStats?.initial_team_number ?? playerStats?.team_number, -1);
      const teamScores = arrayOrEmpty<any>(match?.team_scores);
      const ownTeam = teamScores.find((t: any) => finite(t?.team_number, -2) === teamNumber);
      const enemyTeam = teamScores.find((t: any) => finite(t?.team_number, -2) !== teamNumber);
      const ownScore = finite(ownTeam?.score ?? match?.team_score ?? match?.score_team, 0);
      const enemyScore = finite(enemyTeam?.score ?? match?.enemy_score ?? match?.score_enemy, 0);
      const fallbackResult = String(match?.result ?? "").toUpperCase();
      const result = ownScore || enemyScore
        ? ownScore > enemyScore ? "WIN" : "LOSS"
        : fallbackResult === "WIN" ? "WIN" : "LOSS";

      const started = Date.parse(match?.started_at ?? match?.created_at ?? "");
      const finished = Date.parse(match?.finished_at ?? match?.date ?? "");
      const durationSeconds = Number.isFinite(started) && Number.isFinite(finished) && finished > started
        ? (finished - started) / 1000
        : match?.duration ?? match?.duration_seconds;

      return {
        id: match?.id ?? match?.game_id ?? null,
        map: match?.map_name ?? match?.map ?? "Bilinmiyor",
        result,
        score: `${ownScore}-${enemyScore}`,
        kd: deaths > 0 ? kills / deaths : kills,
        hs: kills > 0 ? Math.round((hsKills / kills) * 100) : percent(playerStats?.headshot_percentage ?? playerStats?.hs),
        adr: finite(playerStats?.dpr ?? playerStats?.adr ?? playerStats?.average_damage_per_round),
        date: match?.finished_at ?? match?.date ?? "",
        duration: formatDuration(durationSeconds),
        leetifyRating: finite(playerStats?.leetify_rating ?? playerStats?.rating),
      };
    });

    // Profil endpointi bazı genel savaş istatistiklerini vermediğinde, son maçlardan
    // güvenilir özetler üret. Böylece üst kartlar gerçek maç verisi varken 0 göstermez.
    const playedMatches = matches.filter((m: any) => m.score !== "0-0");
    const average = (values: number[]) =>
      values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;

    const matchKd = average(playedMatches.map((m: any) => finite(m.kd)).filter((v: number) => v >= 0));
    const matchHs = average(playedMatches.map((m: any) => finite(m.hs)).filter((v: number) => v >= 0));
    const matchAdr = average(playedMatches.map((m: any) => finite(m.adr)).filter((v: number) => v > 0));
    const matchWinrate = playedMatches.length
      ? (playedMatches.filter((m: any) => m.result === "WIN").length / playedMatches.length) * 100
      : null;

    // API'de doğrudan bulunan değerler öncelikli, yoksa son maç özeti kullanılır.
    if (!stats.kd && matchKd !== null) stats.kd = Number(matchKd.toFixed(2));
    if (!stats.hs && matchHs !== null) stats.hs = Number(matchHs.toFixed(1));
    if (!stats.adr && matchAdr !== null) stats.adr = Number(matchAdr.toFixed(2));
    if (!stats.winrate && matchWinrate !== null) stats.winrate = Number(matchWinrate.toFixed(1));

    const rawPerformance =
      arrayOrEmpty<any>(leetify?.performance).length > 0
        ? arrayOrEmpty<any>(leetify?.performance)
        : arrayOrEmpty<any>(cs2?.performance);

    const performanceFromApi = rawPerformance
      .map((item: any, index: number) => ({
        match: finite(item?.match ?? item?.index ?? index + 1, index + 1),
        rating: finite(item?.rating ?? item?.leetify_rating ?? item?.value),
        metric: "Leetify",
      }))
      .filter((item: any) => Number.isFinite(item.rating) && item.rating !== 0);

    // Leetify ayrı bir performance dizisi göndermiyorsa grafiği gerçek son maç ADR'leriyle doldur.
    const performance = performanceFromApi.length
      ? performanceFromApi.slice(-10)
      : matches.slice(0, 10).reverse().map((match: any, index: number) => ({
          match: index + 1,
          rating: finite(match.adr),
          metric: "ADR",
        })).filter((item: any) => item.rating > 0);

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
