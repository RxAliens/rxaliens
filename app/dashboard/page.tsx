"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BarChart3, Gamepad2, LockKeyhole, LogIn, ShieldCheck, Sparkles, Target } from "lucide-react";

import ProfileCard from "@/components/dashboard/ProfileCard";
import StatsGrid from "@/components/dashboard/StatsGrid";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import RecentMatches from "@/components/dashboard/RecentMatches";
import Achievements from "@/components/dashboard/Achievements";
import LoadingSkeleton from "@/components/dashboard/LoadingSkeleton";

interface DashboardData {
  profile: any;
  stats: any;
  matches: any[];
  performance: any[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    void loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/dashboard", {
        cache: "no-store",
        credentials: "same-origin",
      });

      if (res.status === 401) {
        setAuthenticated(false);
        setData(null);
        return;
      }

      if (!res.ok) {
        setAuthenticated(true);
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Dashboard API Error");
      }

      const json = await res.json();
      setAuthenticated(true);

      // Route değişiminde veya eksik API cevabında eski/yarım veri render edilmesin.
      setData({
        profile: json?.profile ?? null,
        stats: json?.stats ?? {},
        matches: Array.isArray(json?.matches) ? json.matches : [],
        performance: Array.isArray(json?.performance) ? json.performance : [],
      });
    } catch (err) {
      console.error("Dashboard Error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Dashboard yüklenirken beklenmeyen bir hata oluştu."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading || authenticated === null) {
    return (
      <main className="min-h-screen bg-slate-950 pt-24 text-white">
        <LoadingSkeleton />
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
            <div className="mb-3 flex items-center gap-3 text-xs font-black tracking-[0.28em] text-cyan-400"><BarChart3 size={18} /> RXALIENS DASHBOARD</div>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">İstatistik Merkezini Aç</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-400">Steam profilini ve Leetify destekli CS2 istatistiklerini tek panelde görmek için Steam hesabınla giriş yap.</p>
          </div>
          <div className="relative overflow-hidden rounded-[32px] border border-cyan-400/25 bg-[#091019]/95 shadow-[0_0_70px_rgba(0,229,255,0.08)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
            <div className="grid min-h-[430px] lg:grid-cols-[1.15fr_.85fr]">
              <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
                <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-400/10 text-cyan-300"><LockKeyhole size={30} /></div>
                <span className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">Giriş gerekli</span>
                <h2 className="max-w-xl text-3xl font-black leading-tight sm:text-4xl">Verilerin sana özel. Dashboard kapısını Steam açıyor.</h2>
                <p className="mt-5 max-w-xl leading-7 text-slate-400">Giriş tamamlandığında otomatik olarak tekrar Dashboard'a döneceksin. Steam şifren RXALIENS tarafından alınmaz veya saklanmaz.</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href="/api/steam?returnTo=%2Fdashboard" className="group inline-flex items-center gap-3 rounded-xl bg-cyan-400 px-6 py-3.5 font-black text-[#031015] transition hover:bg-cyan-300"><LogIn size={19} /> Steam ile Giriş Yap <span className="transition-transform group-hover:translate-x-1">→</span></a>
                  <Link href="/" className="inline-flex items-center rounded-xl border border-slate-700 bg-white/[0.02] px-6 py-3.5 font-bold text-slate-300 transition hover:border-cyan-400/40 hover:text-white">Ana Sayfaya Dön</Link>
                </div>
              </div>
              <div className="relative flex items-center justify-center border-t border-cyan-400/10 bg-[#07141a] p-8 lg:border-l lg:border-t-0">
                <div className="relative w-full max-w-sm space-y-4">
                  <div className="rounded-2xl border border-cyan-400/15 bg-black/20 p-5"><Target className="mb-4 text-cyan-400" size={25}/><div className="text-lg font-black">CS2 İstatistiklerin</div><div className="mt-1 text-sm text-slate-500">Aim, K/D, ADR ve daha fazlası</div></div>
                  <div className="grid grid-cols-2 gap-4"><div className="rounded-2xl border border-cyan-400/15 bg-black/20 p-5"><Gamepad2 className="mb-4 text-cyan-400" size={23}/><div className="font-black">Son Maçlar</div></div><div className="rounded-2xl border border-cyan-400/15 bg-black/20 p-5"><Sparkles className="mb-4 text-cyan-400" size={23}/><div className="font-black">Leetify</div></div></div>
                  <div className="flex items-center gap-3 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.04] p-4 text-sm text-slate-300"><ShieldCheck className="shrink-0 text-emerald-400" size={21}/>Giriş sonrası doğrudan bu Dashboard'a geri dönersin.</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 pt-32 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-red-400/20 bg-red-500/5 p-8 backdrop-blur-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-400">
              RXALIENS Dashboard
            </p>

            <h1 className="mt-3 text-3xl font-black">
              Dashboard yüklenemedi
            </h1>

            <p className="mt-3 text-slate-400">{error}</p>

            <button
              type="button"
              onClick={() => void loadDashboard()}
              className="mt-6 rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-5 py-3 font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!data) return null;

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 pt-24 text-white">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-[120px] top-20 h-96 w-96 rounded-full bg-cyan-500/20 blur-[150px]" />
        <div className="absolute -right-[100px] bottom-0 h-96 w-96 rounded-full bg-blue-600/20 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-10">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-black tracking-tight text-cyan-400 sm:text-5xl">
            RXALIENS Dashboard
          </h1>

          <p className="mt-2 text-slate-400">
            Steam • Leetify • CS2 Statistics
          </p>
        </motion.div>

        {/* PROFILE */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <ProfileCard profile={data.profile} />
        </motion.div>

        {/* STATS */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <StatsGrid stats={data.stats} />
        </motion.div>

        {/* CONTENT */}
        <div className="mt-8 grid gap-8 xl:grid-cols-3">
          <motion.div
            className="xl:col-span-2"
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <PerformanceChart data={data.performance} />
          </motion.div>

          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Achievements stats={data.stats} />
          </motion.div>
        </div>

        {/* RECENT MATCHES */}
        <motion.div
          className="mt-8"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <RecentMatches matches={data.matches ?? []} />
        </motion.div>
      </div>
    </main>
  );
}
