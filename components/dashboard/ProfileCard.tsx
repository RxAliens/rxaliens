"use client";

import Image from "next/image";
import CountryFlag from "@/components/CountryFlag";
import {
  ExternalLink,
  Gamepad2,
  Globe,
  ShieldAlert,
  ShieldCheck,
  Star,
  Wifi,
} from "lucide-react";

interface ProfileCardProps {
  profile: {
    name: string;
    avatar?: string;
    level?: number;
    steamLevel?: number;
    country?: string;
    countryCode?: string;
    status?: string;
    vac?: boolean;
    game?: string | null;
    profileUrl?: string;
    lastLogoff?: string;
  };
}

function formatLastSeen(value?: string) {
  if (!value) return "Bilinmiyor";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "Bilinmiyor";
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  if (!profile) return null;

  const level = profile.steamLevel ?? profile.level ?? 0;
  const status = profile.status || "Çevrimdışı";
  const isOnline = !status.toLocaleLowerCase("tr-TR").includes("çevrimdışı");

  return (
    <section className="group relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-white/[0.065] via-white/[0.035] to-cyan-500/[0.035] shadow-[0_24px_80px_rgba(0,0,0,.22)] backdrop-blur-xl">
      <div className="absolute -right-32 -top-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-[120px]" />

      <div className="relative flex flex-col gap-8 p-8 lg:flex-row lg:items-start">
        <div className="relative shrink-0">
          <Image
            src={profile.avatar || "/images/default-avatar.png"}
            alt={profile.name}
            width={150}
            height={150}
            className="h-[150px] w-[150px] rounded-full border-4 border-cyan-400/40 object-cover shadow-[0_0_40px_rgba(34,211,238,.35)] transition duration-500 group-hover:scale-105"
          />
          <div
            className={`absolute bottom-1.5 right-1.5 h-5 w-5 rounded-full border-[3px] border-[#0b1220] shadow-[0_0_0_2px_rgba(34,211,238,.12)] ${
              isOnline ? "bg-green-500" : "bg-slate-500"
            }`}
          />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-3xl font-black tracking-wide text-white lg:text-4xl">{profile.name}</h2>
          <p className="mt-2 text-slate-400">Steam Oyuncusu</p>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card icon={<Star size={18} />} label="Steam Seviyesi">
              {level}
            </Card>

            <Card icon={<Globe size={18} />} label="Ülke">
              <div className="flex min-w-0 items-center gap-3">
                <CountryFlag code={profile.countryCode} className="h-6 w-9 shrink-0 rounded-sm shadow-sm" />
                <div className="min-w-0 text-base font-black leading-tight text-white">
                  {profile.country || "Bilinmiyor"}
                </div>
              </div>
            </Card>

            <Card icon={<Wifi size={18} />} label="Durum">
              <span className={isOnline ? "text-green-400" : "text-slate-400"}>{status}</span>
            </Card>

            <Card
              icon={profile.vac ? <ShieldAlert size={18} /> : <ShieldCheck size={18} />}
              label="VAC"
            >
              <span className={profile.vac ? "text-red-400" : "text-green-400"}>
                {profile.vac ? "Yasaklı" : "Temiz"}
              </span>
            </Card>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Card icon={<Gamepad2 size={18} />} label="Oynadığı Oyun">
              {profile.game || "Şu anda oyun oynamıyor"}
            </Card>
            <Card icon={<Wifi size={18} />} label="Son Görülme">
              {formatLastSeen(profile.lastLogoff)}
            </Card>
          </div>

          {profile.profileUrl && (
            <a
              href={profile.profileUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-cyan-400/30 px-4 py-2 font-bold text-cyan-300 transition hover:bg-cyan-400/10"
            >
              <ExternalLink size={17} /> Steam Profilini Aç
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

function Card({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-cyan-400/20 bg-slate-950/35 p-5 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-400/35 hover:bg-cyan-400/[0.045]">
      <div className="mb-2 flex items-center gap-2 text-cyan-400">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div className="text-xl font-bold text-white lg:text-2xl">{children}</div>
    </div>
  );
}
