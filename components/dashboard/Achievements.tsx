"use client";

import { Trophy, Target, Flame, Shield, Medal, Star, Crown, Sparkles } from "lucide-react";

interface AchievementsProps { stats: { rating: number; kd: number; hs: number; adr: number; winrate: number; aim: number; clutch: number; leetify: number; }; }

export default function Achievements({ stats }: AchievementsProps) {
  if (!stats) return null;
  const n = (v: unknown) => Number.isFinite(Number(v)) ? Number(v) : 0;
  const s = { rating:n(stats.rating), kd:n(stats.kd), hs:n(stats.hs), adr:n(stats.adr), winrate:n(stats.winrate), aim:n(stats.aim), clutch:n(stats.clutch), leetify:n(stats.leetify) };
  const fmt = (v:number, digits=1) => v.toLocaleString("tr-TR", { maximumFractionDigits: digits });

  const achievements = [
    s.rating > 0 && { title:"Premier Ustası", description:`Premier puanın: ${fmt(s.rating,0)}.`, icon:Trophy, color:"text-yellow-400" },
    s.hs > 0 && { title:"Keskin Nişancı", description:`%${fmt(s.hs)} kafa vuruşu oranı.`, icon:Target, color:"text-red-400" },
    s.adr > 0 && { title:"Ateş Gücü", description:`${fmt(s.adr,2)} ADR ortalaması.`, icon:Flame, color:"text-orange-400" },
    s.winrate > 0 && { title:"Savunma Ustası", description:`%${fmt(s.winrate)} kazanma oranı.`, icon:Shield, color:"text-green-400" },
    s.leetify !== 0 && { title:"Leetify Oyuncusu", description:`Leetify puanı: ${fmt(s.leetify,2)}`, icon:Medal, color:"text-pink-400" },
    s.aim > 0 && { title:"Nişan Ustası", description:`Nişan puanı: ${fmt(s.aim,2)}`, icon:Star, color:"text-violet-400" },
    s.clutch > 0 && { title:"Clutch Kralı", description:`%${fmt(s.clutch,2)} clutch başarısı.`, icon:Crown, color:"text-cyan-400" },
    (s.kd >= 1 || s.adr >= 80 || s.hs >= 50) && { title:"Sezon Yıldızı", description:"Son maçlarında öne çıkan performans değerlerine sahipsin.", icon:Sparkles, color:"text-sky-400" },
  ].filter(Boolean) as {title:string;description:string;icon:any;color:string}[];

  return <section className="rounded-3xl border border-cyan-400/20 bg-white/5 p-6 backdrop-blur-xl">
    <div className="mb-8"><h2 className="text-2xl font-bold">Başarılar</h2><p className="text-slate-400">Gerçek istatistiklerine göre öne çıkan değerler</p></div>
    <div className="space-y-4">
      {achievements.length === 0 ? <div className="rounded-2xl border border-cyan-400/10 bg-slate-900/40 p-6 text-sm text-slate-400">Başarı oluşturmak için henüz yeterli veri yok.</div> : achievements.map((item,index)=>{const Icon=item.icon;return <div key={index} className="group flex items-center gap-4 rounded-2xl border border-cyan-400/15 bg-slate-900/40 p-4 transition-all duration-300 hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(34,211,238,.2)]"><div className="rounded-2xl bg-slate-900/70 p-3"><Icon className={item.color} size={26}/></div><div className="flex-1"><h3 className="font-bold text-white">{item.title}</h3><p className="mt-1 text-sm text-slate-400">{item.description}</p></div></div>})}
    </div>
  </section>;
}
