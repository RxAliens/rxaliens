"use client";

import {
  Trophy,
  Target,
  Flame,
  Shield,
  Medal,
  Star,
  Crown,
  Sparkles,
} from "lucide-react";

interface AchievementsProps {
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

export default function Achievements({ stats }: AchievementsProps) {
  if (!stats) return null;

  const safeNumber = (value: unknown) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  };

  const safeStats = {
    rating: safeNumber(stats.rating),
    kd: safeNumber(stats.kd),
    hs: safeNumber(stats.hs),
    adr: safeNumber(stats.adr),
    winrate: safeNumber(stats.winrate),
    aim: safeNumber(stats.aim),
    clutch: safeNumber(stats.clutch),
    leetify: safeNumber(stats.leetify),
  };

  const achievements = [
    {
      title: "Premier Ustası",
      description: "Premier puanında istikrarlı yükseliş.",
      icon: Trophy,
      color: "text-yellow-400",
    },
    {
      title: "Keskin Nişancı",
      description: `%${safeStats.hs} kafa vuruşu oranı.`,
      icon: Target,
      color: "text-red-400",
    },
    {
      title: "Ateş Gücü",
      description: `${safeStats.adr} ADR ortalaması.`,
      icon: Flame,
      color: "text-orange-400",
    },
    {
      title: "Savunma Ustası",
      description: `%${safeStats.winrate} kazanma oranı.`,
      icon: Shield,
      color: "text-green-400",
    },
    {
      title: "Leetify Oyuncusu",
      description: `Leetify puanı: ${safeStats.leetify}`,
      icon: Medal,
      color: "text-pink-400",
    },
    {
      title: "Nişan Ustası",
      description: `Nişan puanı: ${safeStats.aim}`,
      icon: Star,
      color: "text-violet-400",
    },
    {
      title: "Clutch Kralı",
      description: `%${safeStats.clutch} clutch başarısı.`,
      icon: Crown,
      color: "text-cyan-400",
    },
    {
      title: "Sezon Yıldızı",
      description: "Bu sezon dikkat çeken performans.",
      icon: Sparkles,
      color: "text-sky-400",
    },
  ];

  return (
    <section className="rounded-3xl border border-cyan-400/20 bg-white/5 p-6 backdrop-blur-xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Başarılar</h2>
        <p className="text-slate-400">
          Kişisel başarılar ve öne çıkan istatistikler
        </p>
      </div>

      <div className="space-y-4">
        {achievements.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="group flex items-center gap-4 rounded-2xl border border-cyan-400/15 bg-slate-900/40 p-4 transition-all duration-300 hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(34,211,238,.2)]"
            >
              <div className="rounded-2xl bg-slate-900/70 p-3">
                <Icon className={item.color} size={26} />
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-white">
                  {item.title}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
