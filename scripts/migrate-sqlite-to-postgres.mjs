import dotenv from 'dotenv';
import { DatabaseSync } from 'node:sqlite';
import postgres from 'postgres';
import path from 'node:path';
import fs from 'node:fs';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config();

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL gerekli. .env.local içine DATABASE_URL ekle.');

const sqlitePath = path.join(process.cwd(), 'data', 'rxaliens.db');
if (!fs.existsSync(sqlitePath)) throw new Error(`SQLite veritabanı bulunamadı: ${sqlitePath}`);

const sqlite = new DatabaseSync(sqlitePath);
const sql = postgres(process.env.DATABASE_URL, { ssl: 'require', max: 1 });
const tables = ['users','market_items','purchases','coin_transactions','xp_transactions','admin_logs'];
const rows = Object.fromEntries(tables.map((t) => [t, sqlite.prepare(`SELECT * FROM ${t}`).all()]));

try {
  await sql.begin(async (tx) => {
    // Schema first. Safe to run repeatedly.
    await tx.unsafe(`
      CREATE TABLE IF NOT EXISTS users (
        steam_id TEXT PRIMARY KEY, name TEXT NOT NULL, avatar TEXT, coin INTEGER NOT NULL DEFAULT 100,
        rx_level INTEGER NOT NULL DEFAULT 1, rx_xp INTEGER NOT NULL DEFAULT 0,
        equipped_badge INTEGER, equipped_title INTEGER, equipped_frame INTEGER,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS market_items (
        id SERIAL PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL, rarity TEXT NOT NULL,
        price INTEGER NOT NULL CHECK(price >= 0), stock INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0), emoji TEXT NOT NULL,
        description TEXT NOT NULL, accent TEXT NOT NULL DEFAULT 'from-cyan-500/20', active INTEGER NOT NULL DEFAULT 1,
        effect TEXT NOT NULL DEFAULT 'none', created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS purchases (
        id SERIAL PRIMARY KEY, steam_id TEXT NOT NULL REFERENCES users(steam_id), item_id INTEGER NOT NULL REFERENCES market_items(id),
        price_paid INTEGER NOT NULL, purchased_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE(steam_id,item_id)
      );
      CREATE TABLE IF NOT EXISTS coin_transactions (
        id SERIAL PRIMARY KEY, steam_id TEXT NOT NULL, amount INTEGER NOT NULL, balance_after INTEGER NOT NULL,
        kind TEXT NOT NULL, note TEXT, actor_steam_id TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS xp_transactions (
        id SERIAL PRIMARY KEY, steam_id TEXT NOT NULL, amount INTEGER NOT NULL, xp_after INTEGER NOT NULL,
        kind TEXT NOT NULL, note TEXT, actor_steam_id TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS admin_logs (
        id SERIAL PRIMARY KEY, admin_steam_id TEXT NOT NULL, action TEXT NOT NULL, target TEXT, details TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    for (const r of rows.users) {
      await tx`INSERT INTO users ${tx(r)} ON CONFLICT (steam_id) DO UPDATE SET
        name=EXCLUDED.name, avatar=EXCLUDED.avatar, coin=EXCLUDED.coin, rx_level=EXCLUDED.rx_level,
        rx_xp=EXCLUDED.rx_xp, equipped_badge=EXCLUDED.equipped_badge, equipped_title=EXCLUDED.equipped_title,
        equipped_frame=EXCLUDED.equipped_frame, created_at=EXCLUDED.created_at, updated_at=EXCLUDED.updated_at`;
    }
    for (const r of rows.market_items) {
      await tx`INSERT INTO market_items ${tx(r)} ON CONFLICT (id) DO UPDATE SET
        name=EXCLUDED.name, category=EXCLUDED.category, rarity=EXCLUDED.rarity, price=EXCLUDED.price,
        stock=EXCLUDED.stock, emoji=EXCLUDED.emoji, description=EXCLUDED.description, accent=EXCLUDED.accent,
        active=EXCLUDED.active, effect=EXCLUDED.effect, created_at=EXCLUDED.created_at`;
    }
    for (const r of rows.purchases) {
      await tx`INSERT INTO purchases ${tx(r)} ON CONFLICT (id) DO UPDATE SET
        steam_id=EXCLUDED.steam_id, item_id=EXCLUDED.item_id, price_paid=EXCLUDED.price_paid, purchased_at=EXCLUDED.purchased_at`;
    }
    for (const r of rows.coin_transactions) {
      await tx`INSERT INTO coin_transactions ${tx(r)} ON CONFLICT (id) DO UPDATE SET
        steam_id=EXCLUDED.steam_id, amount=EXCLUDED.amount, balance_after=EXCLUDED.balance_after, kind=EXCLUDED.kind,
        note=EXCLUDED.note, actor_steam_id=EXCLUDED.actor_steam_id, created_at=EXCLUDED.created_at`;
    }
    for (const r of rows.xp_transactions) {
      await tx`INSERT INTO xp_transactions ${tx(r)} ON CONFLICT (id) DO UPDATE SET
        steam_id=EXCLUDED.steam_id, amount=EXCLUDED.amount, xp_after=EXCLUDED.xp_after, kind=EXCLUDED.kind,
        note=EXCLUDED.note, actor_steam_id=EXCLUDED.actor_steam_id, created_at=EXCLUDED.created_at`;
    }
    for (const r of rows.admin_logs) {
      await tx`INSERT INTO admin_logs ${tx(r)} ON CONFLICT (id) DO UPDATE SET
        admin_steam_id=EXCLUDED.admin_steam_id, action=EXCLUDED.action, target=EXCLUDED.target,
        details=EXCLUDED.details, created_at=EXCLUDED.created_at`;
    }

    for (const table of ['market_items','purchases','coin_transactions','xp_transactions','admin_logs']) {
      await tx.unsafe(`SELECT setval(pg_get_serial_sequence('${table}','id'), GREATEST(COALESCE((SELECT MAX(id) FROM ${table}),1),1), true)`);
    }
  });

  const rgb = rows.market_items.find((x) => String(x.effect).toLowerCase() === 'rgb' || String(x.name).toLowerCase().includes('rgb'));
  console.log('Migration tamamlandı ✅');
  console.log(`Kullanıcı: ${rows.users.length}`);
  console.log(`Market ürünü: ${rows.market_items.length}${rgb ? ` (RGB bulundu: ${rgb.name})` : ''}`);
  console.log(`Satın alım: ${rows.purchases.length}`);
  console.log(`Coin hareketi: ${rows.coin_transactions.length}`);
  console.log(`XP hareketi: ${rows.xp_transactions.length}`);
  console.log(`Admin logu: ${rows.admin_logs.length}`);
  console.log('Script tekrar çalıştırılabilir; aynı ID kayıtlarını çoğaltmaz.');
} finally {
  sqlite.close();
  await sql.end();
}
