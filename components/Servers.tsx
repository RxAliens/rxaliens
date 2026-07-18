"use client";

import Image from "next/image";
import {
  Activity,
  Cpu,
  Globe,
  Users,
} from "lucide-react";

import GlowCard from "@/components/ui/GlowCard";
import SectionTitle from "@/components/ui/SectionTitle";
import PrimaryButton from "@/components/ui/PrimaryButton";

const servers = [
  {
    name: "Competitive #1",
    image: "/maps/mirage.jpg",
    map: "Mirage",
    players: 18,
    maxPlayers: 20,
    tick: "128 Tick",
    region: "İstanbul",
    ping: "12 ms",
  },
  {
    name: "Premier #1",
    image: "/maps/ancient.jpg",
    map: "Ancient",
    players: 10,
    maxPlayers: 10,
    tick: "128 Tick",
    region: "İstanbul",
    ping: "14 ms",
  },
  {
    name: "Deathmatch",
    image: "/maps/dust2.jpg",
    map: "Dust II",
    players: 28,
    maxPlayers: 32,
    tick: "128 Tick",
    region: "Frankfurt",
    ping: "31 ms",
  },
  {
    name: "Retake Arena",
    image: "/maps/inferno.jpg",
    map: "Inferno",
    players: 14,
    maxPlayers: 16,
    tick: "128 Tick",
    region: "İstanbul",
    ping: "18 ms",
  },
];

export default function Servers() {
  return (
    <section
      id="servers"
      className="relative py-28"
    >
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[170px]" />

      <div className="relative mx-auto max-w-7xl px-6">

        <SectionTitle
          badge="SUNUCULAR"
          title="Aktif Counter-Strike Sunucuları"
          description="128 Tick altyapısı, düşük ping ve profesyonel rekabet deneyimi."
        />

        <div className="grid gap-8 lg:grid-cols-2">

          {servers.map((server) => {

            const percent =
              (server.players / server.maxPlayers) * 100;

            return (

              <GlowCard
                key={server.name}
                className="overflow-hidden"
              >

                {/* MAP */}

                <div className="relative h-56 overflow-hidden">

                  <Image
                    src={server.image}
                    alt={server.map}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-[#05070B]/20 to-transparent" />

                  <div className="absolute left-6 top-6">

                    <span className="rounded-full bg-emerald-500/90 px-4 py-2 text-sm font-bold text-white">
                      ● ÇEVRİMİÇİ
                    </span>

                  </div>

                  <div className="absolute bottom-6 left-6">

                    <h3 className="text-3xl font-black text-white">

                      {server.name}

                    </h3>

                    <p className="mt-1 text-cyan-300">

                      {server.map}

                    </p>

                  </div>

                </div>

                {/* CONTENT */}

                <div className="p-8">

                  <div className="grid grid-cols-2 gap-5">

                    <div>

                      <Users className="mb-2 text-cyan-400" />

                      <p className="text-sm text-gray-500">
                        Oyuncular
                      </p>

                      <h4 className="text-2xl font-bold text-white">

                        {server.players}/{server.maxPlayers}

                      </h4>

                    </div>

                    <div>

                      <Cpu className="mb-2 text-cyan-400" />

                      <p className="text-sm text-gray-500">
                        Tickrate
                      </p>

                      <h4 className="text-2xl font-bold text-white">

                        {server.tick}

                      </h4>

                    </div>

                    <div>

                      <Globe className="mb-2 text-cyan-400" />

                      <p className="text-sm text-gray-500">
                        Bölge
                      </p>

                      <h4 className="text-xl font-bold text-white">

                        {server.region}

                      </h4>

                    </div>

                    <div>

                      <Activity className="mb-2 text-cyan-400" />

                      <p className="text-sm text-gray-500">
                        Ortalama Ping
                      </p>

                      <h4 className="text-xl font-bold text-white">

                        {server.ping}

                      </h4>

                    </div>

                  </div>

                  {/* Progress */}

                  <div className="mt-8">

                    <div className="mb-2 flex justify-between text-sm">

                      <span className="text-gray-400">
                        Doluluk
                      </span>

                      <span className="font-bold text-cyan-400">

                        %{Math.round(percent)}

                      </span>

                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-white/10">

                      <div
                        className="h-full rounded-full bg-cyan-400 transition-all duration-700"
                        style={{
                          width: `${percent}%`,
                        }}
                      />

                    </div>

                  </div>

                  <PrimaryButton
                    href="#"
                    className="mt-8 w-full"
                  >
                    Sunucuya Katıl
                  </PrimaryButton>

                </div>

              </GlowCard>

            );

          })}

        </div>

      </div>

    </section>
  );
}