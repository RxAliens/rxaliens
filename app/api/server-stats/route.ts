import { NextResponse } from "next/server";
import { GameDig } from "gamedig";

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
      type: "csgo", host: server.host, port: server.port,
      socketTimeout: 2500, givenPortOnly: true,
    });
    return { online: true, players: Number(result.numplayers ?? result.players?.length ?? 0) };
  } catch {
    return { online: false, players: 0 };
  }
}

export async function GET() {
  const results = await Promise.all(servers.map(queryServer));
  return NextResponse.json({
    onlineServers: results.filter((server) => server.online).length,
    serverPlayers: results.reduce((sum, server) => sum + server.players, 0),
  }, { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120" } });
}
