"use client";

import Link from "next/link";
import { Gamepad2, ChevronRight } from "lucide-react";
import { FaDiscord, FaSteam } from "react-icons/fa";
import { siteConfig } from "@/lib/site-config";

const navigation = [
  {
    title: "Platform",
    links: [
      { name: "Ana Sayfa", href: "/" },
      { name: "Sunucular", href: "/#servers" },
      { name: "Leaderboard", href: "/#leaderboard" },
      { name: "Market", href: "/market" },
    ],
  },
  {
    title: "Community",
    links: [
      { name: "Discord", href: siteConfig.discordUrl, external: true },
      { name: "Steam", href: siteConfig.steamUrl, external: true },
      { name: "Kurallar", href: "/kurallar" },
      { name: "Destek", href: "/destek" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-28 border-t border-cyan-500/10">
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[150px]" />
      <div className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-14 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <h2 className="text-4xl font-black tracking-[6px] text-cyan-400">RXALIENS</h2>
            <p className="mt-6 max-w-md leading-8 text-gray-400">Modern Counter-Strike topluluğu. Rekabetçi oyuncular için geliştirilen premium platform deneyimi.</p>
            <div className="mt-8 flex items-start gap-4">
              <Link href="/games" aria-label="Oyunlar" className="group flex min-w-[74px] flex-col items-center gap-2">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 transition duration-300 group-hover:-translate-y-1 group-hover:border-cyan-400 group-hover:bg-cyan-500/15 group-hover:shadow-[0_0_24px_rgba(34,211,238,0.16)]">
                  <Gamepad2 className="text-cyan-400 transition group-hover:scale-110" size={24} />
                </span>
                <span className="text-xs font-semibold text-gray-500 transition group-hover:text-cyan-400">Oyunlar</span>
              </Link>

              <a href={siteConfig.discordUrl} target="_blank" rel="noreferrer" aria-label="Discord" className="group flex min-w-[74px] flex-col items-center gap-2">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 transition duration-300 group-hover:-translate-y-1 group-hover:border-cyan-400 group-hover:bg-cyan-500/15 group-hover:shadow-[0_0_24px_rgba(34,211,238,0.16)]">
                  <FaDiscord className="text-cyan-400 transition group-hover:scale-110" size={25} />
                </span>
                <span className="text-xs font-semibold text-gray-500 transition group-hover:text-cyan-400">Discord</span>
              </a>

              <a href={siteConfig.steamUrl} target="_blank" rel="noreferrer" aria-label="Steam" className="group flex min-w-[74px] flex-col items-center gap-2">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 transition duration-300 group-hover:-translate-y-1 group-hover:border-cyan-400 group-hover:bg-cyan-500/15 group-hover:shadow-[0_0_24px_rgba(34,211,238,0.16)]">
                  <FaSteam className="text-cyan-400 transition group-hover:scale-110" size={25} />
                </span>
                <span className="text-xs font-semibold text-gray-500 transition group-hover:text-cyan-400">Steam</span>
              </a>
            </div>
          </div>
          {navigation.map((group) => (
            <div key={group.title}>
              <h3 className="mb-6 text-lg font-bold text-white">{group.title}</h3>
              <div className="space-y-4">
                {group.links.map((link) => link.external ? (
                  <a key={link.name} href={link.href} target="_blank" rel="noreferrer" className="group flex items-center gap-2 text-gray-400 transition hover:text-cyan-400"><ChevronRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />{link.name}</a>
                ) : (
                  <Link key={link.name} href={link.href} className="group flex items-center gap-2 text-gray-400 transition hover:text-cyan-400"><ChevronRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />{link.name}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-sm text-gray-500 md:flex-row">
          <p>© {new Date().getFullYear()} RXALIENS. All Rights Reserved.</p>
          <div className="flex gap-6"><Link href="/gizlilik" className="transition hover:text-cyan-400">Gizlilik Politikası</Link><Link href="/kullanim-sartlari" className="transition hover:text-cyan-400">Kullanım Şartları</Link></div>
        </div>
      </div>
    </footer>
  );
}
