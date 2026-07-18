"use client";

import Link from "next/link";
import {
  Gamepad2,
  Globe,
  ChevronRight,
  MessageCircle,
} from "lucide-react";

const navigation = [
  {
    title: "Platform",
    links: [
      { name: "Ana Sayfa", href: "#" },
      { name: "Sunucular", href: "#servers" },
      { name: "Leaderboard", href: "#leaderboard" },
      { name: "Market", href: "#" },
    ],
  },
  {
    title: "Community",
    links: [
      { name: "Discord", href: "#" },
      { name: "Steam", href: "#" },
      { name: "Kurallar", href: "#" },
      { name: "Destek", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-28 border-t border-cyan-500/10">
      {/* Glow */}
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-14 lg:grid-cols-[1.5fr_1fr_1fr]">
          {/* Logo */}

          <div>
            <h2 className="text-4xl font-black tracking-[6px] text-cyan-400">
              RXALIENS
            </h2>

            <p className="mt-6 max-w-md leading-8 text-gray-400">
              Modern Counter-Strike topluluğu.
              Rekabetçi oyuncular için geliştirilen premium
              platform deneyimi.
            </p>

            <div className="mt-8 flex gap-4">
              <button className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4 transition duration-300 hover:scale-110 hover:border-cyan-400">
                <Gamepad2 className="text-cyan-400" />
              </button>

              <button className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4 transition duration-300 hover:scale-110 hover:border-cyan-400">
                <MessageCircle className="text-cyan-400" />
              </button>

              <button className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4 transition duration-300 hover:scale-110 hover:border-cyan-400">
                <Globe className="text-cyan-400" />
              </button>
            </div>
          </div>

          {/* Navigation */}

          {navigation.map((group) => (
            <div key={group.title}>
              <h3 className="mb-6 text-lg font-bold text-white">
                {group.title}
              </h3>

              <div className="space-y-4">
                {group.links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="group flex items-center gap-2 text-gray-400 transition hover:text-cyan-400"
                  >
                    <ChevronRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />

                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom */}

        <div className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-sm text-gray-500 md:flex-row">
          <p>
            © {new Date().getFullYear()} RXALIENS. All Rights Reserved.
          </p>

          <div className="flex gap-6">
            <Link
              href="#"
              className="transition hover:text-cyan-400"
            >
              Gizlilik Politikası
            </Link>

            <Link
              href="#"
              className="transition hover:text-cyan-400"
            >
              Kullanım Şartları
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}