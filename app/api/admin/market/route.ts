import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSteamUser, isAdmin } from "@/lib/steam-session";
import { levelFromXp } from "@/lib/xp";

function guard(req: NextRequest) {
  const s = getSteamUser(req);
  return s && isAdmin(s.id) ? s : null;
}
function n(v: unknown) { return Math.max(0, Math.floor(Number(v) || 0)); }

export async function GET(req: NextRequest) {
  if (!guard(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  const items = db.prepare("SELECT * FROM market_items ORDER BY id DESC").all();
  const users = db.prepare("SELECT steam_id,name,avatar,coin,rx_level,rx_xp,created_at,updated_at FROM users ORDER BY updated_at DESC LIMIT 200").all();
  const purchases = db.prepare(`SELECT p.*,u.name user_name,u.avatar user_avatar,m.name item_name,m.emoji item_emoji,m.category item_category FROM purchases p JOIN users u ON u.steam_id=p.steam_id JOIN market_items m ON m.id=p.item_id ORDER BY p.id DESC LIMIT 200`).all();
  const adminLogs = db.prepare("SELECT * FROM admin_logs ORDER BY id DESC LIMIT 100").all();
  const coinTransactions = db.prepare("SELECT * FROM coin_transactions ORDER BY id DESC LIMIT 100").all();
  const xpTransactions = db.prepare("SELECT * FROM xp_transactions ORDER BY id DESC LIMIT 100").all();
  return NextResponse.json({ items, users, purchases, adminLogs, coinTransactions, xpTransactions });
}

export async function POST(req: NextRequest) {
  const admin = guard(req);
  if (!admin) return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  const b = await req.json().catch(() => ({}));
  try {
    if (b.action === "xp") {
      const steamId = String(b.steamId || "");
      const mode = String(b.mode || "set");
      const amount = n(b.amount);
      const before = db.prepare("SELECT rx_xp FROM users WHERE steam_id=?").get(steamId) as any;
      if (!before) throw new Error("Kullanıcı bulunamadı.");
      let next = before.rx_xp || 0;
      if (mode === "add") next += amount; else if (mode === "subtract") next = Math.max(0,next-amount); else next = amount;
      const state = levelFromXp(next);
      db.prepare("UPDATE users SET rx_xp=?,rx_level=?,updated_at=CURRENT_TIMESTAMP WHERE steam_id=?").run(next,state.level,steamId);
      db.prepare("INSERT INTO xp_transactions(steam_id,amount,xp_after,kind,note,actor_steam_id) VALUES(?,?,?,?,?,?)").run(steamId,next-(before.rx_xp||0),next,"admin_"+mode,"Admin XP işlemi",admin.id);
      db.prepare("INSERT INTO admin_logs(admin_steam_id,action,target,details) VALUES(?,?,?,?)").run(admin.id,"xp_"+mode,steamId,JSON.stringify({amount,before:before.rx_xp||0,after:next,level:state.level}));
      return NextResponse.json({ok:true,message:`XP güncellendi. RX Level ${state.level}`});
    }
    if (b.action === "coin") {
      const steamId = String(b.steamId || "");
      const mode = String(b.mode || "set");
      const amount = n(b.amount ?? b.coin);
      if (!steamId) throw new Error("Kullanıcı bulunamadı.");
      const before = db.prepare("SELECT coin FROM users WHERE steam_id=?").get(steamId) as any;
      if (!before) throw new Error("Kullanıcı bulunamadı.");
      if (mode === "add") db.prepare("UPDATE users SET coin=coin+?,updated_at=CURRENT_TIMESTAMP WHERE steam_id=?").run(amount, steamId);
      else if (mode === "subtract") db.prepare("UPDATE users SET coin=MAX(0,coin-?),updated_at=CURRENT_TIMESTAMP WHERE steam_id=?").run(amount, steamId);
      else db.prepare("UPDATE users SET coin=?,updated_at=CURRENT_TIMESTAMP WHERE steam_id=?").run(amount, steamId);
      const after = db.prepare("SELECT coin FROM users WHERE steam_id=?").get(steamId) as any;
      const delta = after.coin-before.coin;
      db.prepare("INSERT INTO coin_transactions(steam_id,amount,balance_after,kind,note,actor_steam_id) VALUES(?,?,?,?,?,?)").run(steamId,delta,after.coin,"admin_"+mode,"Admin Coin işlemi",admin.id);
      db.prepare("INSERT INTO admin_logs(admin_steam_id,action,target,details) VALUES(?,?,?,?)").run(admin.id,"coin_"+mode,steamId,JSON.stringify({amount,before:before.coin,after:after.coin}));
      return NextResponse.json({ ok: true, message: "Coin bakiyesi güncellendi." });
    }
    if (b.action === "item") {
      db.prepare("UPDATE market_items SET price=?,stock=?,active=? WHERE id=?").run(n(b.price), n(b.stock), b.active ? 1 : 0, Number(b.id));
      db.prepare("INSERT INTO admin_logs(admin_steam_id,action,target,details) VALUES(?,?,?,?)").run(admin.id,"item_update",String(b.id),JSON.stringify({price:n(b.price),stock:n(b.stock),active:!!b.active}));
      return NextResponse.json({ ok: true, message: "Ürün güncellendi." });
    }
    if (b.action === "editItem") {
      const id = Number(b.id);
      const name = String(b.name || "").trim();
      const category = String(b.category || "Rozet").trim();
      const rarity = String(b.rarity || "Nadir").trim();
      const emoji = String(b.emoji || "👽").trim() || "👽";
      const description = String(b.description || "").trim();
      const accent = String(b.accent || "from-cyan-500/20").trim();
      const effect = String(b.effect || "none").trim();
      if (!id || !name || !description) throw new Error("Ürün adı ve açıklama zorunlu.");
      db.prepare("UPDATE market_items SET name=?,category=?,rarity=?,price=?,stock=?,emoji=?,description=?,accent=?,effect=?,active=? WHERE id=?")
        .run(name,category,rarity,n(b.price),n(b.stock),emoji,description,accent,effect,b.active ? 1 : 0,id);
      db.prepare("INSERT INTO admin_logs(admin_steam_id,action,target,details) VALUES(?,?,?,?)").run(admin.id,"item_update",String(id),JSON.stringify({name,category,rarity,price:n(b.price),stock:n(b.stock),active:!!b.active}));
      return NextResponse.json({ ok: true, message: "Ürün ayrıntıları güncellendi." });
    }
    if (b.action === "createItem") {
      const name = String(b.name || "").trim();
      const category = String(b.category || "Rozet").trim();
      const rarity = String(b.rarity || "Nadir").trim();
      const emoji = String(b.emoji || "👽").trim() || "👽";
      const description = String(b.description || "").trim();
      const accent = String(b.accent || "from-cyan-500/20").trim();
      const effect = String(b.effect || "none").trim();
      if (!name || !description) throw new Error("Ürün adı ve açıklama zorunlu.");
      db.prepare("INSERT INTO market_items(name,category,rarity,price,stock,emoji,description,accent,effect,active) VALUES(?,?,?,?,?,?,?,?,?,?)")
        .run(name, category, rarity, n(b.price), n(b.stock), emoji, description, accent, effect, b.active === false ? 0 : 1);
      db.prepare("INSERT INTO admin_logs(admin_steam_id,action,target,details) VALUES(?,?,?,?)").run(admin.id,"item_create",name,JSON.stringify({category,rarity,price:n(b.price),stock:n(b.stock)}));
      return NextResponse.json({ ok: true, message: "Yeni ürün oluşturuldu." });
    }
    if (b.action === "deleteItem") {
      const id = Number(b.id);
      const used = db.prepare("SELECT COUNT(*) c FROM purchases WHERE item_id=?").get(id) as { c: number };
      if (used?.c) throw new Error("Satın alım geçmişi olan ürün silinemez. Pasif yapabilirsin.");
      const item = db.prepare("SELECT name FROM market_items WHERE id=?").get(id) as any;
      db.prepare("DELETE FROM market_items WHERE id=?").run(id);
      db.prepare("INSERT INTO admin_logs(admin_steam_id,action,target,details) VALUES(?,?,?,?)").run(admin.id,"item_delete",String(id),JSON.stringify({name:item?.name || null}));
      return NextResponse.json({ ok: true, message: "Ürün silindi." });
    }
    if (b.action === "refund") {
      const purchaseId = Number(b.purchaseId);
      db.exec("BEGIN IMMEDIATE");
      try {
        const p = db.prepare("SELECT * FROM purchases WHERE id=?").get(purchaseId) as any;
        if (!p) throw new Error("Satın alım bulunamadı.");
        db.prepare("UPDATE users SET coin=coin+?,updated_at=CURRENT_TIMESTAMP WHERE steam_id=?").run(p.price_paid, p.steam_id);
        db.prepare("UPDATE market_items SET stock=stock+1 WHERE id=?").run(p.item_id);
        db.prepare("UPDATE users SET equipped_badge=CASE WHEN equipped_badge=? THEN NULL ELSE equipped_badge END,equipped_title=CASE WHEN equipped_title=? THEN NULL ELSE equipped_title END,equipped_frame=CASE WHEN equipped_frame=? THEN NULL ELSE equipped_frame END WHERE steam_id=?")
          .run(p.item_id, p.item_id, p.item_id, p.steam_id);
        db.prepare("DELETE FROM purchases WHERE id=?").run(purchaseId);
        const bal = db.prepare("SELECT coin FROM users WHERE steam_id=?").get(p.steam_id) as any;
        db.prepare("INSERT INTO coin_transactions(steam_id,amount,balance_after,kind,note,actor_steam_id) VALUES(?,?,?,?,?,?)").run(p.steam_id,p.price_paid,bal.coin,"refund","Satın alım iadesi",admin.id);
        db.prepare("INSERT INTO admin_logs(admin_steam_id,action,target,details) VALUES(?,?,?,?)").run(admin.id,"refund",p.steam_id,JSON.stringify({purchaseId,itemId:p.item_id,amount:p.price_paid}));
        db.exec("COMMIT");
      } catch (e) { db.exec("ROLLBACK"); throw e; }
      return NextResponse.json({ ok: true, message: "Satın alım iade edildi; Coin ve stok geri yüklendi." });
    }
    return NextResponse.json({ error: "Geçersiz işlem" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "İşlem başarısız." }, { status: 409 });
  }
}
