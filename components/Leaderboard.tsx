"use client";

import {
  Crown,
  Medal,
  Trophy,
  Target,
} from "lucide-react";

import GlowCard from "@/components/ui/GlowCard";
import SectionTitle from "@/components/ui/SectionTitle";

const topPlayers = [
  {
    place: 1,
    name: "RX Shadow",
    elo: 3245,
    kd: "1.84",
    hs: "63%",
    color: "text-yellow-400",
    icon: Crown,
  },
  {
    place: 2,
    name: "AlienX",
    elo: 3112,
    kd: "1.72",
    hs: "60%",
    color: "text-gray-300",
    icon: Medal,
  },
  {
    place: 3,
    name: "Nova",
    elo: 2970,
    kd: "1.63",
    hs: "57%",
    color: "text-orange-400",
    icon: Trophy,
  },
];

const ranking = [
  {
    rank: 4,
    name: "Vortex",
    elo: 2895,
    kd: "1.56",
    hs: "55%",
  },
  {
    rank: 5,
    name: "Kenshi",
    elo: 2814,
    kd: "1.51",
    hs: "54%",
  },
  {
    rank: 6,
    name: "Frost",
    elo: 2748,
    kd: "1.48",
    hs: "52%",
  },
  {
    rank: 7,
    name: "Ghost",
    elo: 2691,
    kd: "1.42",
    hs: "50%",
  },
];

export default function Leaderboard() {
  return (
    <section
      id="leaderboard"
      className="relative py-28"
    >
      <div className="absolute left-0 top-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-[170px]" />

      <div className="relative mx-auto max-w-7xl px-6">

        <SectionTitle
          badge="LİDERLİK TABLOSU"
          title="En İyi Oyuncular"
          description="En yüksek ELO puanına sahip oyuncular burada yer alıyor."
        />

        {/* İlk 3 */}

        <div className="grid gap-8 lg:grid-cols-3">

          {topPlayers.map((player) => {

            const Icon = player.icon;

            return (

              <GlowCard
                key={player.place}
                className="p-8 text-center"
              >

                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-500/10">

                  <Icon
                    size={42}
                    className={player.color}
                  />

                </div>

                <h3 className="text-3xl font-black text-white">

                  {player.name}

                </h3>

                <p className="mt-2 text-gray-400">

                  #{player.place} Oyuncu

                </p>

                <div className="mt-8 space-y-3">

                  <div className="flex justify-between text-gray-400">
                    <span>ELO</span>
                    <span className="font-bold text-cyan-400">
                      {player.elo}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-400">
                    <span>K/D</span>
                    <span className="font-bold text-white">
                      {player.kd}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-400">
                    <span>HS%</span>
                    <span className="font-bold text-white">
                      {player.hs}
                    </span>
                  </div>

                </div>

              </GlowCard>

            );

          })}

        </div>

        {/* Liste */}

        <GlowCard className="mt-10 overflow-hidden">

          <div className="divide-y divide-white/5">

            {ranking.map((player) => (

              <div
                key={player.rank}
                className="flex items-center justify-between px-8 py-6 transition hover:bg-cyan-500/5"
              >

                <div className="flex items-center gap-6">

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400 font-bold">

                    {player.rank}

                  </div>

                  <div>

                    <h4 className="font-bold text-white">

                      {player.name}

                    </h4>

                    <p className="text-sm text-gray-500">

                      Rekabetçi Oyuncu

                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-10">

                  <div className="text-center">

                    <p className="text-xs text-gray-500">
                      ELO
                    </p>

                    <p className="font-bold text-cyan-400">

                      {player.elo}

                    </p>

                  </div>

                  <div className="text-center">

                    <p className="text-xs text-gray-500">
                      K/D
                    </p>

                    <p className="font-bold text-white">

                      {player.kd}

                    </p>

                  </div>

                  <div className="text-center">

                    <p className="text-xs text-gray-500">
                      HS%
                    </p>

                    <p className="font-bold text-white">

                      {player.hs}

                    </p>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </GlowCard>

      </div>

    </section>
  );
}