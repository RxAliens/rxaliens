"use client";

import Link from "next/link";
import Image from "next/image";
import AvatarFrame from "@/components/AvatarFrame";
import CountryFlag from "@/components/CountryFlag";
import { useEffect, useRef, useState } from "react";
import {
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  User,
  LogOut,
  Trophy,
  Globe,
  Gamepad2,
  ShieldCheck,
} from "lucide-react";

const menu = [
  { title: "Ana Sayfa", href: "/" },
  { title: "Sunucular", href: "/#servers" },
  { title: "Leaderboard", href: "/#leaderboard" },
  { title: "Market", href: "/market" },
  { title: "Oyunlar", href: "/games" },
  { title: "Discord", href: "https://discordapp.com/users/582001640069136385" },
];

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [scroll, setScroll] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/steam/profile", { cache: "no-store" });
        if (!res.ok) {
          setUser(null);
          return;
        }
        const data = await res.json();
        setUser(data);
      } catch {
        setUser(null);
      }
    }

    loadUser();
    const timer = setInterval(loadUser, 30000);
    const refreshUser = () => loadUser();
    const storageRefresh = (e: StorageEvent) => { if (e.key === "rxaliens:xp-updated") loadUser(); };
    const visibleRefresh = () => { if (document.visibilityState === "visible") loadUser(); };
    window.addEventListener("rxaliens:user-updated", refreshUser);
    window.addEventListener("rxaliens:xp-updated", refreshUser);
    window.addEventListener("storage", storageRefresh);
    document.addEventListener("visibilitychange", visibleRefresh);
    return () => {
      clearInterval(timer);
      window.removeEventListener("rxaliens:user-updated", refreshUser);
      window.removeEventListener("rxaliens:xp-updated", refreshUser);
      window.removeEventListener("storage", storageRefresh);
      document.removeEventListener("visibilitychange", visibleRefresh);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  function logout() {
    window.location.href = "/api/steam/logout";
  }

  return (
    <nav
      className={`fixed left-0 top-0 z-50 w-full border-b transition-all ${
        scroll
          ? "border-cyan-500/20 bg-[#02060d]/95 backdrop-blur-xl"
          : "border-cyan-500/10 bg-[#02060d]/90 backdrop-blur-xl"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-3xl font-black tracking-[6px] text-cyan-400"
        >
          RXALIENS
        </Link>

        <div className="hidden items-center gap-10 lg:flex">
          {menu.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="text-gray-300 transition hover:text-cyan-400"
            >
              {item.title}
            </Link>
          ))}
        </div>

        <div ref={ref} className="relative hidden lg:block">
          {user ? (
            <>
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex min-w-[240px] items-center gap-3 rounded-2xl border border-cyan-400/30 bg-white/5 px-4 py-2 transition hover:bg-cyan-500/10"
              >
                <AvatarFrame
                  src={user.avatar || "/images/default-avatar.png"}
                  alt="avatar"
                  size={46}
                  frame={user.equipped?.frame}
                />
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-sm font-bold text-white">{user.equipped?.badge?.emoji && <span className="mr-1">{user.equipped.badge.emoji}</span>}{user.name}</p>
                  {user.equipped?.title && <p className="truncate text-[10px] font-bold text-violet-300">{user.equipped.title.name}</p>}
                  <p className="text-xs text-cyan-400">{user.status}</p>
                  {user.game && (
                    <p className="truncate text-[10px] text-green-400">🎮 {user.game}</p>
                  )}
                </div>
                <ChevronDown
                  size={18}
                  className={`transition-transform ${open ? "rotate-180" : ""}`}
                />
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-80 overflow-hidden rounded-3xl border border-cyan-500/20 bg-[#080e17]/98 shadow-[0_24px_80px_rgba(0,0,0,.5)] backdrop-blur-xl">
                  <div className="border-b border-cyan-500/10 p-5">
                    <div className="flex items-center gap-3">
                      <AvatarFrame
                        src={user.avatar || "/images/default-avatar.png"}
                        alt="avatar"
                        size={58}
                        frame={user.equipped?.frame}
                      />
                      <div className="min-w-0">
                        <p className="truncate font-bold text-white">{user.name}</p>
                        <p className="text-xs text-cyan-400">{user.status}</p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3 text-sm text-gray-300">
                      <p className="flex items-center gap-2">
                        <Trophy size={16} />
                        Steam Level:
                        <span className="font-bold text-cyan-400">{user.steamLevel ?? 0}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Globe size={16} />
                        <CountryFlag code={user.countryCode} className="h-5 w-7" />
                        <span>{user.country || user.countryCode || "Bilinmiyor"}</span>
                      </p>
                      {user.game && (
                        <p className="flex items-center gap-2 text-green-400">
                          <Gamepad2 size={16} />
                          {user.game}
                        </p>
                      )}
                    </div>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 text-gray-300 transition hover:bg-cyan-500/10"
                  >
                    <LayoutDashboard size={18} /> Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 text-gray-300 transition hover:bg-cyan-500/10"
                  >
                    <User size={18} /> Profil
                  </Link>
                  {user.isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-5 py-4 text-cyan-400 transition hover:bg-cyan-500/10"
                    >
                      <ShieldCheck size={18} /> Admin Paneli
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 border-t border-cyan-500/10 px-5 py-4 text-red-400 transition hover:bg-red-500/10"
                  >
                    <LogOut size={18} /> Çıkış Yap
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link
              href="/api/steam"
              className="rounded-xl border border-cyan-400 px-5 py-2 text-cyan-400 transition hover:bg-cyan-400/10"
            >
              Steam Giriş
            </Link>
          )}
        </div>

        <button
          className="text-cyan-400 lg:hidden"
          onClick={() => setMobile((v) => !v)}
          aria-label="Menü"
        >
          {mobile ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {mobile && (
        <div className="border-t border-cyan-500/20 bg-black/95 lg:hidden">
          {menu.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              onClick={() => setMobile(false)}
              className="block px-6 py-4 text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-400"
            >
              {item.title}
            </Link>
          ))}
          {user ? (
            <>
              <Link href="/dashboard" className="block px-6 py-4 text-gray-300">Dashboard</Link>
              <Link href="/profile" className="block px-6 py-4 text-gray-300">Profil</Link>
              {user.isAdmin && <Link href="/admin" className="block px-6 py-4 text-cyan-400">Admin Paneli</Link>}
              <button onClick={logout} className="w-full px-6 py-4 text-left text-red-400">
                Çıkış Yap
              </button>
            </>
          ) : (
            <Link href="/api/steam" className="block px-6 py-4 text-cyan-400">
              Steam Giriş
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
