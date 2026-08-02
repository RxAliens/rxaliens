import { NextResponse } from "next/server";
import { db, initDb } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await initDb();
    const rows = await db`SELECT
      COUNT(*)::int AS registered_players,
      COUNT(*) FILTER (WHERE last_active_at >= NOW() - INTERVAL '24 hours')::int AS active_players,
      COALESCE(SUM(leetify_match_count), 0)::int AS completed_matches
    FROM users`;
    const community: any = rows[0] ?? {};
    return NextResponse.json({
      registeredPlayers: Number(community.registered_players ?? 0),
      activePlayers: Number(community.active_players ?? 0),
      completedMatches: Number(community.completed_matches ?? 0),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("SITE STATS ERROR:", error);
    return NextResponse.json({ error: "İstatistikler alınamadı." }, { status: 500 });
  }
}
