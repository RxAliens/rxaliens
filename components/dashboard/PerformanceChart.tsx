"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";

interface ChartData { match: number; rating: number; metric?: string; }
interface PerformanceChartProps { data: ChartData[]; }

export default function PerformanceChart({ data }: PerformanceChartProps) {
  const safeData = Array.isArray(data)
    ? data.filter((item) => item && Number.isFinite(Number(item.match)) && Number.isFinite(Number(item.rating)))
      .map((item) => ({ match: Number(item.match), rating: Number(item.rating), metric: item.metric || "Performans" }))
    : [];

  const metric = safeData[0]?.metric || "Performans";
  const current = safeData.length ? safeData[safeData.length - 1].rating.toLocaleString("tr-TR", { maximumFractionDigits: 2 }) : "-";

  return (
    <section className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-white/5 p-6 backdrop-blur-xl">
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="relative">
        <div className="mb-8 flex items-center justify-between">
          <div><h2 className="text-2xl font-bold">Performans Geçmişi</h2><p className="text-slate-400">Son 10 karşılaşmadaki {metric} değişimi</p></div>
          <div className="rounded-2xl border border-cyan-400/20 bg-slate-900/50 px-5 py-3">
            <div className="flex items-center gap-2 text-cyan-400"><TrendingUp size={18}/><span className="text-xs uppercase tracking-widest">Güncel {metric}</span></div>
            <h3 className="mt-2 text-3xl font-black text-white">{current}</h3>
          </div>
        </div>
        <div className="h-[420px]">
          {!safeData.length ? <div className="flex h-full items-center justify-center text-slate-400">Henüz performans verisi bulunmuyor.</div> : (
            <ResponsiveContainer width="100%" height="100%"><AreaChart data={safeData}>
              <defs><linearGradient id="ratingFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22d3ee" stopOpacity={0.9}/><stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid stroke="#334155" strokeDasharray="4 4"/>
              <XAxis dataKey="match" tickFormatter={(v) => `${v}. Maç`} stroke="#94a3b8" tickLine={false} axisLine={false}/>
              <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(v) => Number(v).toLocaleString("tr-TR")}/>
              <Tooltip labelFormatter={(v) => `${v}. Maç`} formatter={(v: any) => [Number(v).toLocaleString("tr-TR", { maximumFractionDigits: 2 }), metric]} contentStyle={{ backgroundColor: "#020617", border: "1px solid #22d3ee", borderRadius: "16px", color: "#fff" }}/>
              <Area type="monotone" dataKey="rating" stroke="#22d3ee" strokeWidth={4} fill="url(#ratingFill)" fillOpacity={1} animationDuration={1400} activeDot={{ r: 7, fill: "#0f172a", stroke: "#22d3ee", strokeWidth: 3 }}/>
            </AreaChart></ResponsiveContainer>
          )}
        </div>
      </div>
    </section>
  );
}
