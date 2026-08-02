"use client";

import {
  Trophy,
  Target,
  Flame,
  Skull,
  Crosshair,
  Medal,
  Shield,
  TrendingUp,
} from "lucide-react";

interface StatsProps {
  stats: {
    rating: number;
    kd: number;
    hs: number;
    adr: number;
    winrate: number;
    aim: number;
    clutch: number;
    leetify: number;
  };
}

export default function StatsGrid({ stats }: StatsProps) {
  if (!stats) return null;

  // API'den bir alan eksik/null gelirse dashboard çökmemesi için
  // bütün değerleri güvenli şekilde sayıya çeviriyoruz.
  const safeNumber = (value: unknown) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  };

  const rating = safeNumber(stats.rating);
  const kd = safeNumber(stats.kd);
  const hs = safeNumber(stats.hs);
  const adr = safeNumber(stats.adr);
  const winrate = safeNumber(stats.winrate);
  const aim = safeNumber(stats.aim);
  const clutch = safeNumber(stats.clutch);
  const leetify = safeNumber(stats.leetify);

  const cards = [
    { title: "Premier Puanı", value: rating.toLocaleString("tr-TR"), progress: 0, icon: Trophy, color: "text-yellow-400", showBar: false },
    { title: "Kafa Vuruşu", value: `${hs}%`, progress: hs, icon: Target, color: "text-red-400", showBar: true },
    { title: "Ortalama Hasar", value: adr, progress: Math.min(Math.max(adr, 0), 100), icon: Flame, color: "text-orange-400", showBar: true },
    { title: "Öldürme / Ölüm", value: kd.toFixed(2), progress: 0, icon: Skull, color: "text-cyan-400", showBar: false },
    { title: "Kazanma Oranı", value: `${winrate}%`, progress: winrate, icon: Shield, color: "text-green-400", showBar: true },
    { title: "Nişan Puanı", value: aim, progress: aim, icon: Crosshair, color: "text-violet-400", showBar: true },
    { title: "Leetify Puanı", value: leetify, progress: 0, icon: Medal, color: "text-pink-400", showBar: false },
    { title: "Clutch Başarısı", value: `${clutch}%`, progress: clutch, icon: TrendingUp, color: "text-blue-400", showBar: true },
  ];

  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={index}
            className="group relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400/50 hover:shadow-[0_0_50px_rgba(34,211,238,.3)]"
          >
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-400/10 blur-3xl transition duration-500 group-hover:scale-150" />

            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-wider text-slate-400">{card.title}</p>
                <h2 className="mt-2 text-5xl font-black text-white">{card.value}</h2>
              </div>

              <div className="rounded-2xl bg-slate-900/60 p-4 transition duration-300 group-hover:rotate-6 group-hover:scale-110">
                <Icon size={34} className={card.color} />
              </div>
            </div>

            {card.showBar && (
              <div className="mt-6 h-1 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 transition-all duration-700"
                  style={{ width: `${Math.min(Math.max(Number(card.progress) || 0, 0), 100)}%` }}
                />
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
