import { NextRequest, NextResponse } from "next/server";
import { db, getUser, initDb, upsertUser } from "@/lib/db";
import { getSteamUser } from "@/lib/steam-session";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  await initDb(); const session=getSteamUser(req);
  const items=await db`SELECT id,name,category,rarity,price,stock,emoji,description,accent,effect FROM market_items WHERE active=1 ORDER BY id`;
  if(!session)return NextResponse.json({items,balance:null,owned:[],equipped:{},authenticated:false});
  await upsertUser(session.id,session.name||"Steam User",session.avatar); const user=await getUser(session.id);
  const owned=(await db`SELECT item_id FROM purchases WHERE steam_id=${session.id}`).map((x:any)=>x.item_id);
  return NextResponse.json({items,balance:user.coin,owned,equipped:{badge:user.equipped_badge,title:user.equipped_title,frame:user.equipped_frame},authenticated:true},{headers:{"Cache-Control":"no-store"}});
}
