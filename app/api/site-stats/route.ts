import { NextResponse } from "next/server";
import { GameDig } from "gamedig";
import { db, initDb } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const servers = [
  { host: "185.193.165.123", port: 27015 },
  { host: "185.193.165.18", port: 27015 },
  { host: "185.193.165.20", port: 27015 },
  { host: "185.193.165.22", port: 27015 },
];

async function queryServer(server: (typeof servers)[number]) {
  try {
    const result: any = await GameDig.query({
      type: "csgo",
      host: server.host,
      port: server.port,
      socketTimeout: 2500,
      givenPortOnly: true,
    });
    return { online: true, players: Number(result.numplayers ?? result.players?.length ?? 0) };
  } catch {
    return { online: false, players: 0 };
  }
}

export async function GET() {
  try {
    await initDb();
    const [communityRows, serverResults] = await Promise.all([
      db`SELECT
        COUNT(*)::int AS registered_players,
        COUNT(*) FILTER (WHERE last_active_at >= NOW() - INTERVAL '24 hours')::int AS active_players,
        COALESCE(SUM(leetify_match_count), 0)::int AS completed_matches
      FROM users`,
      Promise.all(servers.map(queryServer)),
    ]);

    const community: any = communityRows[0] ?? {};
    return NextResponse.json({
      registeredPlayers: Number(community.registered_players ?? 0),
      activePlayers: Number(community.active_players ?? 0),
      completedMatches: Number(community.completed_matches ?? 0),
      onlineServers: serverResults.filter((server) => server.online).length,
      serverPlayers: serverResults.reduce((sum, server) => sum + server.players, 0),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("SITE STATS ERROR:", error);
    return NextResponse.json({ error: "İstatistikler alınamadı." }, { status: 500 });
  }
}
