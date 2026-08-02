import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL tanımlı değil. PostgreSQL bağlantısını Vercel Environment Variables'a ekle.");

export const db = postgres(connectionString, { ssl: "require", max: 5, idle_timeout: 20 });

let initPromise: Promise<void> | null = null;
export function initDb() {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    await db.unsafe(`
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
      ALTER TABLE users ADD COLUMN IF NOT EXISTS leetify_match_count INTEGER NOT NULL DEFAULT 0;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;
      CREATE TABLE IF NOT EXISTS leetify_matches (
        match_id TEXT PRIMARY KEY,
        steam_id TEXT NOT NULL REFERENCES users(steam_id) ON DELETE CASCADE,
        map_name TEXT,
        finished_at TIMESTAMPTZ,
        payload JSONB,
        synced_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_leetify_matches_steam_id ON leetify_matches(steam_id);
      CREATE TABLE IF NOT EXISTS admin_logs (
        id SERIAL PRIMARY KEY, admin_steam_id TEXT NOT NULL, action TEXT NOT NULL, target TEXT, details TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    const [{ count }] = await db`SELECT COUNT(*)::int AS count FROM market_items`;
    if (!count) {
      await db`INSERT INTO market_items (name,category,rarity,price,stock,emoji,description,accent,effect) VALUES
        ('RXALIENS Neon Rozet','Rozet','Nadir',25,18,'👽','Profilinde cyan neon parıltıyla görünen özel RXALIENS rozeti.','from-cyan-500/20','none'),
        ('Premier Avcısı','Unvan','Destansı',60,7,'🏆','Profil adının altında gösterilen özel Premier Avcısı unvanı.','from-violet-500/20','none'),
        ('Alien Green Çerçeve','Çerçeve','Nadir',40,12,'🛸','Avatarına yeşil enerji efektli koleksiyon çerçevesi ekler.','from-emerald-500/20','alien-green'),
        ('Headshot Ustası','Unvan','Efsanevi',100,3,'🎯','Keskin nişancılar için sınırlı sayıda özel profil unvanı.','from-rose-500/20','none'),
        ('Cyan Pulse Çerçeve','Çerçeve','Destansı',75,5,'💠','RXALIENS cyan temasına uyumlu hareketli profil çerçevesi.','from-sky-500/20','cyan-pulse'),
        ('OG Alien Rozet','Rozet','Efsanevi',90,2,'☣️','İlk dönem RXALIENS üyeleri için koleksiyonluk OG rozeti.','from-amber-500/20','none'),
        ('RGB Çerçeve','Çerçeve','Destansı',80,10,'🌈','Avatarını RGB renk geçişli hareketli bir çerçeveyle sarar.','from-fuchsia-500/20','rgb')`;
    }
  })();
  return initPromise;
}

export async function upsertUser(steamId: string, name: string, avatar?: string | null) {
  await initDb();
  await db`INSERT INTO users (steam_id,name,avatar) VALUES (${steamId},${name},${avatar ?? null})
    ON CONFLICT (steam_id) DO UPDATE SET name=EXCLUDED.name,avatar=EXCLUDED.avatar,updated_at=CURRENT_TIMESTAMP,last_active_at=CURRENT_TIMESTAMP`;
}

export async function getUser(steamId: string) {
  await initDb();
  const rows = await db`SELECT * FROM users WHERE steam_id=${steamId}`;
  return rows[0] as any;
}
