import { NextRequest, NextResponse } from "next/server";
import { db, getUser, upsertUser } from "@/lib/db";
import { getSteamUser } from "@/lib/steam-session";
export async function POST(req: NextRequest) {
  const session=getSteamUser(req); if(!session) return NextResponse.json({error:"Steam ile giriş yapmalısın."},{status:401});
  const {itemId}=await req.json().catch(()=>({})); if(!Number.isInteger(itemId)) return NextResponse.json({error:"Geçersiz ürün."},{status:400});
  upsertUser(session.id,session.name||"Steam User",session.avatar);
  db.exec("BEGIN IMMEDIATE");
  try {
    const item=db.prepare("SELECT * FROM market_items WHERE id=? AND active=1").get(itemId);
    const user=getUser(session.id);
    if(!item) throw new Error("Ürün bulunamadı.");
    if(db.prepare("SELECT 1 FROM purchases WHERE steam_id=? AND item_id=?").get(session.id,itemId)) throw new Error("Bu ürün zaten envanterinde.");
    if(item.stock<=0) throw new Error("Ürün stokta kalmadı.");
    if(user.coin<item.price) throw new Error("Yeterli Coin yok.");
    const debit=db.prepare("UPDATE users SET coin=coin-?,updated_at=CURRENT_TIMESTAMP WHERE steam_id=? AND coin>=?").run(item.price,session.id,item.price);
    const stock=db.prepare("UPDATE market_items SET stock=stock-1 WHERE id=? AND stock>0").run(itemId);
    if(!debit.changes||!stock.changes) throw new Error("Satın alma sırasında bakiye veya stok değişti. Tekrar dene.");
    db.prepare("INSERT INTO purchases(steam_id,item_id,price_paid) VALUES(?,?,?)").run(session.id,itemId,item.price);
    db.prepare("INSERT INTO coin_transactions(steam_id,amount,balance_after,kind,note) VALUES(?,?,?,?,?)").run(session.id,-item.price,user.coin-item.price,"purchase",item.name);
    db.exec("COMMIT");
    return NextResponse.json({ok:true,balance:user.coin-item.price,message:`${item.name} envanterine eklendi.`});
  } catch(e:any) { db.exec("ROLLBACK"); return NextResponse.json({error:e?.message||"Satın alma başarısız."},{status:409}); }
}
