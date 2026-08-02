"use client";

import {
  Trophy,
  XCircle,
  Target,
  Flame,
  Skull,
  Calendar,
  Clock3,
  Map,
} from "lucide-react";

interface Match {
  map: string;
  result: "WIN" | "LOSS";
  score: string;
  kd: number;
  hs: number;
  adr: number;
  date: string;
  duration: string;
}

interface RecentMatchesProps {
  matches: Match[];
}

const resultMap = {
  WIN: "Galibiyet",
  LOSS: "Mağlubiyet",
};

const trDate = (v: string) =>
  v.replace("Yesterday", "Dün")
   .replace("Today", "Bugün")
   .replace("hours ago", " saat önce")
   .replace("hour ago", " saat önce")
   .replace("days ago", " gün önce")
   .replace("day ago", " gün önce");

const trDuration = (v: string) =>
  v.replace("mins", "dk").replace("min", "dk");

export default function RecentMatches({ matches }: RecentMatchesProps) {
  // API beklenmeyen bir değer döndürürse component çökmemeli.
  const safeMatches: Match[] = Array.isArray(matches) ? matches : [];

  return (
    <section className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-white/5 p-6 backdrop-blur-xl">
      <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="relative">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Son Maçlar</h2>
            <p className="text-slate-400">
              Son Oynadığınız Rekabetçi Karşılaşmalar
            </p>
          </div>

          <button className="rounded-xl border border-cyan-400/30 px-4 py-2 text-sm text-cyan-300 transition hover:bg-cyan-400/10">
            Tüm Maçları Gör
          </button>
        </div>

        <div className="space-y-5">
          {safeMatches.length === 0 ? (
            <div className="rounded-2xl border border-cyan-400/10 bg-slate-900/40 p-8 text-center">
              <p className="font-semibold text-slate-200">
                Henüz maç verisi bulunamadı.
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Maç verileri geldiğinde burada son karşılaşmaların gösterilecek.
              </p>
            </div>
          ) : (
            safeMatches.map((match, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-cyan-400/10 bg-slate-900/40 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_0_35px_rgba(34,211,238,.25)]"
            >
              <div className="grid gap-6 xl:grid-cols-6">

                <div className="flex items-center gap-3">
                  {match.result === "WIN" ? (
                    <Trophy className="text-green-400" size={28} />
                  ) : (
                    <XCircle className="text-red-400" size={28} />
                  )}

                  <div>
                    <p className={`font-bold ${match.result==="WIN"?"text-green-400":"text-red-400"}`}>
                      {resultMap[match.result]}
                    </p>

                    <span className={`text-sm font-medium ${match.result==="WIN"?"text-green-400":"text-red-400"}`}>
                      {match.score}
                    </span>
                  </div>
                </div>

                <Info icon={<Map size={16}/>} title="Harita" value={match.map}/>
                <Info icon={<Skull size={16}/>} title="Öldürme / Ölüm" value={Number(match.kd ?? 0).toFixed(2)}/>
                <Info icon={<Target size={16}/>} title="Kafa Vuruşu" value={`${Number(match.hs ?? 0)}%`}/>
                <Info icon={<Flame size={16}/>} title="Ortalama Hasar" value={String(Number(match.adr ?? 0))}/>

                <div className="flex flex-col justify-between text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={16}/>
                    <span>{trDate(match.date ?? "")}</span>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <Clock3 size={16}/>
                    <span>{trDuration(match.duration ?? "")}</span>
                  </div>
                </div>

              </div>
            </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function Info({
  icon,
  title,
  value,
}:{
  icon:React.ReactNode;
  title:string;
  value:string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-cyan-400">
        {icon}
        <span className="text-sm">{title}</span>
      </div>
      <h3 className="font-bold">{value}</h3>
    </div>
  );
}
