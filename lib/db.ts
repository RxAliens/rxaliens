import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

type DB = {
  exec(sql: string): void;
  prepare(sql: string): { get(...args: unknown[]): any; all(...args: unknown[]): any[]; run(...args: unknown[]): any };
};

const g = globalThis as typeof globalThis & { __rxDb?: DB };

function openDb(): DB {
  if (g.__rxDb) return g.__rxDb;
  const dir = path.join(process.cwd(), "data");
  fs.mkdirSync(dir, { recursive: true });
  const db = new DatabaseSync(path.join(dir, "rxaliens.db")) as unknown as DB;
  db.exec("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;");
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      steam_id TEXT PRIMARY KEY, name TEXT NOT NULL, avatar TEXT, coin INTEGER NOT NULL DEFAULT 100,
      rx_level INTEGER NOT NULL DEFAULT 1, rx_xp INTEGER NOT NULL DEFAULT 0, equipped_badge INTEGER, equipped_title INTEGER, equipped_frame INTEGER,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS market_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, category TEXT NOT NULL, rarity TEXT NOT NULL,
      price INTEGER NOT NULL CHECK(price >= 0), stock INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0), emoji TEXT NOT NULL,
      description TEXT NOT NULL, accent TEXT NOT NULL DEFAULT 'from-cyan-500/20', active INTEGER NOT NULL DEFAULT 1,
      effect TEXT NOT NULL DEFAULT 'none', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT, steam_id TEXT NOT NULL, item_id INTEGER NOT NULL, price_paid INTEGER NOT NULL,
      purchased_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE(steam_id,item_id),
      FOREIGN KEY(steam_id) REFERENCES users(steam_id), FOREIGN KEY(item_id) REFERENCES market_items(id)
    );
    CREATE TABLE IF NOT EXISTS coin_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT, steam_id TEXT NOT NULL, amount INTEGER NOT NULL, balance_after INTEGER NOT NULL,
      kind TEXT NOT NULL, note TEXT, actor_steam_id TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS xp_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT, steam_id TEXT NOT NULL, amount INTEGER NOT NULL, xp_after INTEGER NOT NULL,
      kind TEXT NOT NULL, note TEXT, actor_steam_id TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS admin_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT, admin_steam_id TEXT NOT NULL, action TEXT NOT NULL, target TEXT, details TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  try { db.exec("ALTER TABLE market_items ADD COLUMN effect TEXT NOT NULL DEFAULT 'none'"); } catch {}
  try { db.exec("ALTER TABLE users ADD COLUMN rx_xp INTEGER NOT NULL DEFAULT 0"); } catch {}
  db.prepare("UPDATE market_items SET effect='rgb' WHERE category='Çerçeve' AND lower(name) LIKE '%rgb%' AND (effect='none' OR effect IS NULL)").run();
  db.prepare("UPDATE market_items SET effect='cyan-pulse' WHERE category='Çerçeve' AND (lower(name) LIKE '%cyan%' OR lower(name) LIKE '%pulse%') AND (effect='none' OR effect IS NULL)").run();
  db.prepare("UPDATE market_items SET effect='alien-green' WHERE category='Çerçeve' AND (lower(name) LIKE '%green%' OR lower(name) LIKE '%alien%') AND (effect='none' OR effect IS NULL)").run();
  const count = db.prepare("SELECT COUNT(*) AS c FROM market_items").get() as { c: number };
  if (!count.c) {
    const add = db.prepare("INSERT INTO market_items(name,category,rarity,price,stock,emoji,description,accent) VALUES(?,?,?,?,?,?,?,?)");
    const seed = [
      ["RXALIENS Neon Rozet","Rozet","Nadir",25,18,"👽","Profilinde cyan neon parıltıyla görünen özel RXALIENS rozeti.","from-cyan-500/20"],
      ["Premier Avcısı","Unvan","Destansı",60,7,"🏆","Profil adının altında gösterilen özel Premier Avcısı unvanı.","from-violet-500/20"],
      ["Alien Green Çerçeve","Çerçeve","Nadir",40,12,"🛸","Avatarına yeşil enerji efektli koleksiyon çerçevesi ekler.","from-emerald-500/20"],
      ["Headshot Ustası","Unvan","Efsanevi",100,3,"🎯","Keskin nişancılar için sınırlı sayıda özel profil unvanı.","from-rose-500/20"],
      ["Cyan Pulse Çerçeve","Çerçeve","Destansı",75,5,"💠","RXALIENS cyan temasına uyumlu hareketli profil çerçevesi.","from-sky-500/20"],
      ["OG Alien Rozet","Rozet","Efsanevi",90,2,"☣️","İlk dönem RXALIENS üyeleri için koleksiyonluk OG rozeti.","from-amber-500/20"],
    ];
    for (const row of seed) add.run(...row);
  }
  g.__rxDb = db;
  return db;
}

export const db = openDb();

export function upsertUser(steamId: string, name: string, avatar?: string | null) {
  db.prepare(`INSERT INTO users(steam_id,name,avatar) VALUES(?,?,?)
    ON CONFLICT(steam_id) DO UPDATE SET name=excluded.name,avatar=excluded.avatar,updated_at=CURRENT_TIMESTAMP`).run(steamId,name,avatar ?? null);
}

export function getUser(steamId: string) {
  return db.prepare("SELECT * FROM users WHERE steam_id=?").get(steamId);
}
