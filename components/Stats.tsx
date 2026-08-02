"use client";

import { useEffect, useState } from "react";
import { Users, Activity, Trophy, Server } from "lucide-react";
import GlowCard from "@/components/ui/GlowCard";
import SectionTitle from "@/components/ui/SectionTitle";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

type SiteStats = {
  registeredPlayers: number;
  activePlayers: number;
  completedMatches: number;
  onlineServers: number;
  serverPlayers: number;
};

const emptyStats: SiteStats = {
  registeredPlayers: 0,
  activePlayers: 0,
  completedMatches: 0,
  onlineServers: 0,
  serverPlayers: 0,
};

export default function Stats() {
  const [data, setData] = useState<SiteStats>(emptyStats);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch("/api/site-stats", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (mounted) setData({ ...emptyStats, ...json });
      } catch (error) {
        console.error("Site stats fetch error:", error);
      }
    };
    load();
    const timer = window.setInterval(load, 30000);
    return () => { mounted = false; window.clearInterval(timer); };
  }, []);

  const stats = [
    { icon: Users, number: data.registeredPlayers, label: "Kayıtlı Oyuncu" },
    { icon: Activity, number: data.activePlayers, label: "Son 24 Saat Aktif" },
    { icon: Trophy, number: data.completedMatches, label: "Leetify Maçı" },
    { icon: Server, number: data.onlineServers, label: "Aktif Sunucu" },
  ];

  return (
    <section className="relative py-20">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle
          badge="İSTATİSTİKLER"
          title="RXALIENS Rakamlarla"
          description="RXALIENS altyapısından alınan canlı topluluk ve sunucu istatistikleri."
        />
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <GlowCard key={item.label}>
                <div className="flex h-[190px] flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10">
                    <Icon size={28} className="text-cyan-400" />
                  </div>
                  <h3 className="text-4xl font-black text-white">
                    <AnimatedCounter end={item.number} />
                  </h3>
                  <p className="mt-2 text-xs uppercase tracking-[3px] text-gray-400">{item.label}</p>
                </div>
              </GlowCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
