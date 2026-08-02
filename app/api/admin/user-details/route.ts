import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSteamUser,isAdmin } from "@/lib/steam-session";
export async function GET(req:NextRequest){
 const a=getSteamUser(req); if(!a||!isAdmin(a.id))return NextResponse.json({error:"Yetkisiz"},{status:403});
 const steamId=req.nextUrl.searchParams.get("steamId"); if(!steamId)return NextResponse.json({error:"Steam ID gerekli"},{status:400});
 const user=db.prepare("SELECT * FROM users WHERE steam_id=?").get(steamId); if(!user)return NextResponse.json({error:"Kullanıcı bulunamadı"},{status:404});
 const inventory=db.prepare(`SELECT p.id purchase_id,p.price_paid,p.purchased_at,m.* FROM purchases p JOIN market_items m ON m.id=p.item_id WHERE p.steam_id=? ORDER BY p.id DESC`).all(steamId);
 const transactions=db.prepare("SELECT * FROM coin_transactions WHERE steam_id=? ORDER BY id DESC LIMIT 100").all(steamId);
 return NextResponse.json({user,inventory,transactions});
}
