"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
        setError("Dashboard'u görüntülemek için Steam ile giriş yapmalısın.");
        return;
      }

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Dashboard API Error");
      }

      const json = await res.json();

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

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 pt-24 text-white">
        <LoadingSkeleton />
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
