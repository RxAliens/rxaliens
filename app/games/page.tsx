"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Gamepad2, Library, LockKeyhole, Search, ShieldCheck, Sparkles, Timer, LogIn } from "lucide-react";

type SteamGame = {
  id: number;
  name: string;
  hours: number;
  minutes?: number;
  icon?: string | null;
  header?: string | null;
};

type GamesResponse = {
  totalGames?: number;
  totalHours?: number;
  mostPlayed?: { id: number; name: string; hours: number } | null;
  games?: SteamGame[];
  error?: string;
};

export default function GamesPage() {
  const [games, setGames] = useState<SteamGame[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [totalGames, setTotalGames] = useState(0);
  const [totalHours, setTotalHours] = useState(0);

  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/steam/games", { cache: "no-store" });
        const data: GamesResponse = await res.json();

        if (res.status === 401) {
          setAuthenticated(false);
          setGames([]);
          return;
        }

        if (!res.ok) {
          setAuthenticated(true);
          setError(data.error ?? "Steam oyunları alınamadı.");
          return;
        }

        setAuthenticated(true);
        setGames(data.games ?? []);
        setTotalGames(data.totalGames ?? data.games?.length ?? 0);
        setTotalHours(data.totalHours ?? 0);
      } catch {
        setError("Steam servisine bağlanırken bir sorun oluştu.");
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  const filteredGames = useMemo(
    () => games.filter((game) => game.name.toLowerCase().includes(search.toLowerCase())),
    [games, search]
  );

  if (loading || authenticated === null) {
    return (
      <main className="min-h-screen bg-[#05070b] px-6 pt-32 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 h-14 w-80 animate-pulse rounded-2xl bg-cyan-400/10" />
          <div className="h-72 animate-pulse rounded-[32px] border border-cyan-400/10 bg-[#0b111a]" />
        </div>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#05070b] px-6 pt-32 text-white">
        <div className="pointer-events-none absolute left-1/2 top-20 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-cyan-400/[0.07] blur-[120px]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.025)_1px,transparent_1px)] bg-[size:52px_52px]" />

        <section className="relative mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="mb-3 flex items-center gap-3 text-xs font-black tracking-[0.28em] text-cyan-400">
              <Gamepad2 size={18} /> RXALIENS OYUN KÜTÜPHANESİ
            </div>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Steam Kütüphaneni Bağla</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-400">
              Oyunlarını, toplam oynama süreni ve en çok vakit geçirdiğin oyunları görmek için Steam hesabınla giriş yap.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[32px] border border-cyan-400/25 bg-[#091019]/95 shadow-[0_0_70px_rgba(0,229,255,0.08)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
            <div className="grid min-h-[430px] lg:grid-cols-[1.15fr_.85fr]">
              <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
                <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-400/10 text-cyan-300 shadow-[0_0_35px_rgba(0,229,255,0.12)]">
                  <LockKeyhole size={30} />
                </div>
                <span className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">Giriş gerekli</span>
                <h2 className="max-w-xl text-3xl font-black leading-tight sm:text-4xl">Kütüphanen sana özel. Kapıyı Steam açıyor.</h2>
                <p className="mt-5 max-w-xl leading-7 text-slate-400">
                  RXALIENS yalnızca Steam hesabına bağlı oyun bilgilerini göstermek için oturumunu kullanır. Giriş yaptıktan sonra bu sayfaya geri dönebilirsin.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a href="/api/steam?returnTo=%2Fgames" className="group inline-flex items-center gap-3 rounded-xl bg-cyan-400 px-6 py-3.5 font-black text-[#031015] transition hover:bg-cyan-300 hover:shadow-[0_0_28px_rgba(34,211,238,0.28)]">
                    <LogIn size={19} /> Steam ile Giriş Yap
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </a>
                  <Link href="/" className="inline-flex items-center rounded-xl border border-slate-700 bg-white/[0.02] px-6 py-3.5 font-bold text-slate-300 transition hover:border-cyan-400/40 hover:text-white">
                    Ana Sayfaya Dön
                  </Link>
                </div>
              </div>

              <div className="relative flex items-center justify-center border-t border-cyan-400/10 bg-[#07141a] p-8 lg:border-l lg:border-t-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.11),transparent_62%)]" />
                <div className="relative w-full max-w-sm space-y-4">
                  <div className="rounded-2xl border border-cyan-400/15 bg-black/20 p-5">
                    <Library className="mb-4 text-cyan-400" size={25} />
                    <div className="text-lg font-black">Oyun Kütüphanen</div>
                    <div className="mt-1 text-sm text-slate-500">Steam oyunların tek ekranda</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-cyan-400/15 bg-black/20 p-5">
                      <Timer className="mb-4 text-cyan-400" size={23} />
                      <div className="font-black">Oynama Süresi</div>
                    </div>
                    <div className="rounded-2xl border border-cyan-400/15 bg-black/20 p-5">
                      <Sparkles className="mb-4 text-cyan-400" size={23} />
                      <div className="font-black">Favorilerin</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.04] p-4 text-sm text-slate-300">
                    <ShieldCheck className="shrink-0 text-emerald-400" size={21} />
                    Steam şifren RXALIENS tarafından alınmaz veya saklanmaz.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#05070b] px-6 pt-32 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-black tracking-[0.24em] text-cyan-400"><Gamepad2 size={17} /> STEAM</div>
            <h1 className="text-4xl font-black sm:text-5xl"><span className="text-cyan-400">Oyun</span> Kütüphanesi</h1>
            <p className="mt-2 text-slate-400">Steam oyun geçmişin ve oynama sürelerin</p>
          </div>
          <div className="flex gap-3">
            <div className="rounded-xl border border-cyan-400/15 bg-[#0d141e] px-5 py-3"><div className="text-xs text-slate-500">OYUN</div><div className="text-xl font-black">{totalGames}</div></div>
            <div className="rounded-xl border border-cyan-400/15 bg-[#0d141e] px-5 py-3"><div className="text-xs text-slate-500">TOPLAM</div><div className="text-xl font-black text-cyan-400">{totalHours.toLocaleString("tr-TR")} saat</div></div>
          </div>
        </div>

        <div className="relative mb-10">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Oyun ara..." className="w-full rounded-xl border border-cyan-500/20 bg-[#101620] py-4 pl-14 pr-6 outline-none transition focus:border-cyan-400/50" />
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-6 text-red-300">{error}</div>
        ) : games.length === 0 ? (
          <div className="rounded-3xl border border-cyan-400/15 bg-[#0c121b] p-10 text-center">
            <Library className="mx-auto mb-4 text-cyan-400" size={34} />
            <h2 className="text-xl font-black">Oyun listesi görünmüyor</h2>
            <p className="mt-2 text-slate-400">Steam profilindeki “Oyun ayrıntıları” gizlilik ayarı kapalıysa kütüphane alınamayabilir.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredGames.map((game) => (
              <article key={game.id} className="group overflow-hidden rounded-3xl border border-cyan-500/20 bg-[#111823] transition duration-300 hover:-translate-y-1 hover:border-cyan-400/45 hover:shadow-[0_15px_45px_rgba(0,229,255,0.08)]">
                <div className="relative h-52 w-full overflow-hidden bg-[#091019]">
                  {game.header || game.icon ? <Image src={game.header ?? game.icon!} fill sizes="(max-width: 640px) 100vw, 400px" alt={game.name} className="object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center"><Gamepad2 size={38} className="text-slate-700" /></div>}
                </div>
                <div className="p-5">
                  <h2 className="truncate text-lg font-bold">{game.name}</h2>
                  <div className="mt-4 flex items-center gap-2 text-cyan-400"><Timer size={17} /><span>{game.hours.toLocaleString("tr-TR")} Saat</span></div>
                  {game.hours >= 1000 && <p className="mt-2 text-sm text-yellow-400">👑 En Çok Oynanan</p>}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
