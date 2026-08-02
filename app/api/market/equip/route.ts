import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSteamUser } from "@/lib/steam-session";
export async function POST(req:NextRequest){
 const s=getSteamUser(req); if(!s)return NextResponse.json({error:"Giriş gerekli"},{status:401});
 const {itemId,category,unequip}=await req.json().catch(()=>({}));
 if(unequip){
  const col=category==="Rozet"?"equipped_badge":category==="Unvan"?"equipped_title":category==="Çerçeve"?"equipped_frame":null;
  if(!col)return NextResponse.json({error:"Geçersiz kategori."},{status:400});
  db.prepare(`UPDATE users SET ${col}=NULL,updated_at=CURRENT_TIMESTAMP WHERE steam_id=?`).run(s.id);
  return NextResponse.json({ok:true});
 }
 const item=db.prepare(`SELECT m.* FROM purchases p JOIN market_items m ON m.id=p.item_id WHERE p.steam_id=? AND m.id=?`).get(s.id,itemId);
 if(!item)return NextResponse.json({error:"Bu ürün envanterinde değil."},{status:403});
 const col=item.category==="Rozet"?"equipped_badge":item.category==="Unvan"?"equipped_title":item.category==="Çerçeve"?"equipped_frame":null;
 if(!col)return NextResponse.json({error:"Bu ürün kuşanılamaz."},{status:400});
 db.prepare(`UPDATE users SET ${col}=?,updated_at=CURRENT_TIMESTAMP WHERE steam_id=?`).run(itemId,s.id);
 return NextResponse.json({ok:true});
}
