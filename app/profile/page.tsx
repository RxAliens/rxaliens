"use client";

import Image from "next/image";
import AvatarFrame from "@/components/AvatarFrame";
import CountryFlag from "@/components/CountryFlag";
import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  Coins,
  ExternalLink,
  Gamepad2,
  Globe2,
  Star,
  Trophy,
  Wifi,
} from "lucide-react";

function formatDate(value?: string) {
  if (!value) return "Bilinmiyor";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Bilinmiyor";
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState<any[]>([]);
  const [equipped, setEquipped] = useState<any>({});

  const loadProfile = useCallback(async () => {
    try {
      const res = await fetch(`/api/steam/profile?t=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Profil alınamadı");
      const data = await res.json();
      setProfile(data);
      const inv = await fetch(`/api/market/inventory?t=${Date.now()}`, { cache: "no-store" });
      if (inv.ok) { const invData = await inv.json(); setInventory(invData.items || []); setEquipped(invData.equipped || {}); }
    } catch { setProfile(null); } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    void loadProfile();
    const refresh = () => void loadProfile();
    const storage = (e: StorageEvent) => { if (e.key === "rxaliens:xp-updated") refresh(); };
    const visible = () => { if (document.visibilityState === "visible") refresh(); };
    window.addEventListener("rxaliens:xp-updated", refresh);
    window.addEventListener("rxaliens:user-updated", refresh);
    window.addEventListener("storage", storage);
    document.addEventListener("visibilitychange", visible);
    return () => { window.removeEventListener("rxaliens:xp-updated", refresh); window.removeEventListener("rxaliens:user-updated", refresh); window.removeEventListener("storage", storage); document.removeEventListener("visibilitychange", visible); };
  }, [loadProfile]);

  if (loading) {
    return <main className="mx-auto min-h-screen max-w-7xl px-6 pb-16 pt-36 text-slate-300">Profil yükleniyor...</main>;
  }

  if (!profile) {
    return (
      <main className="mx-auto min-h-screen max-w-7xl px-6 pb-16 pt-36">
        <h1 className="text-4xl font-black text-white">Profil</h1>
        <p className="mt-3 text-slate-400">Steam profiline erişmek için giriş yapmalısın.</p>
        <a href="/api/steam" className="mt-6 inline-flex rounded-xl border border-cyan-400/40 px-5 py-3 font-bold text-cyan-400">
          Steam ile Giriş Yap
        </a>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 pb-16 pt-36">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-400">RXALIENS ID</p>
        <h1 className="mt-2 text-5xl font-black text-white">Profil</h1>
        <p className="mt-2 text-slate-400">Steam hesabın ve RXALIENS ilerlemen tek merkezde.</p>
      </div>

      <section className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-white/[0.055] via-white/[0.03] to-cyan-500/[0.025] p-6 shadow-[0_24px_80px_rgba(0,0,0,.2)] lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          <AvatarFrame
            src={profile.avatar || "/images/default-avatar.png"}
            alt={profile.name}
            size={128}
            frame={profile.equipped?.frame}
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="truncate text-3xl font-black text-white">{profile.equipped?.badge?.emoji && <span className="mr-2">{profile.equipped.badge.emoji}</span>}{profile.name}</h2>
              <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-1 text-xs font-bold text-cyan-300">
                STEAM BAĞLI
              </span>
            </div>
            {profile.equipped?.title && <p className="mt-1 font-bold text-cyan-400">{profile.equipped.title.emoji} {profile.equipped.title.name}</p>}
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-400">
              <span className="flex items-center gap-1.5"><Wifi size={15} />{profile.status}</span>
              <span className="flex items-center gap-1.5"><Gamepad2 size={15} />{profile.game || "Şu anda oyun oynamıyor"}</span>
            </div>
          </div>
          {profile.profileUrl && (
            <a
              href={profile.profileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/30 px-5 py-3 font-bold text-cyan-300 transition hover:bg-cyan-400/10"
            >
              Steam Profili <ExternalLink size={17} />
            </a>
          )}
        </div>
      </section>

      <section className="mt-6 grid gap-5 md:grid-cols-3">
        <Info icon={<Star size={19} />} label="Steam Level" value={profile.steamLevel ?? 0} />
        <div className="rounded-2xl border border-cyan-400/20 bg-white/[0.035] p-5"><div className="flex items-center gap-2 text-sm text-cyan-400"><Trophy size={19}/>RXALIENS Level</div><div className="mt-3 flex items-end justify-between"><div className="text-2xl font-black text-white">RX {profile.rxLevel ?? 1}</div><span className="text-xs font-bold text-cyan-300">{profile.rxXp ?? 0} XP</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-black/40"><div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-sky-300 transition-all" style={{width:`${profile.rxProgress ?? 0}%`}}/></div><div className="mt-2 flex justify-between text-[11px] text-slate-500">{(profile.rxLevel ?? 1) >= 100 ? <><span className="font-bold text-cyan-300">MAX LEVEL</span><span>Sıralama toplam XP ile devam eder</span></> : <><span>{(profile.rxCurrentXp ?? 0).toLocaleString("tr-TR")} XP</span><span>{(profile.rxNextXp ?? 0).toLocaleString("tr-TR")} XP</span></>}</div></div>
        <Info icon={<Coins size={19} />} label="Coin" value={profile.coin ?? 0} sub="Market bakiyesi" />
      </section>

      <section id="inventory" className="mt-8 scroll-mt-28 rounded-3xl border border-cyan-400/20 bg-white/[0.025] p-6">
        <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.3em] text-cyan-400">RXALIENS ENVANTER</p><h2 className="mt-2 text-2xl font-black text-white">Kozmetiklerin</h2></div><a href="/market" className="text-sm font-bold text-cyan-400">Markete Git →</a></div>
        {inventory.length ? <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{inventory.map((item:any)=>{const key=item.category==="Rozet"?"badge":item.category==="Unvan"?"title":"frame";const active=equipped?.[key]===item.id;return <div key={item.id} className="rounded-2xl border border-cyan-400/15 bg-slate-950/35 p-4"><div className="flex items-center gap-3"><span className="text-3xl">{item.emoji}</span><div><b className="text-white">{item.name}</b><p className="text-xs text-slate-500">{item.category} • {item.rarity}</p></div></div><button onClick={async()=>{const r=await fetch("/api/market/equip",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(active?{unequip:true,category:item.category}:{itemId:item.id})});if(r.ok){setEquipped((e:any)=>({...e,[key]:active?null:item.id}));setProfile((p:any)=>p?{...p,equipped:{...p.equipped,[key]:active?null:item}}:p);window.dispatchEvent(new CustomEvent("rxaliens:user-updated"));}}} className={`mt-4 w-full rounded-xl px-3 py-2 text-sm font-bold ${active?"border border-amber-400/30 bg-amber-500/10 text-amber-300":"bg-cyan-400 text-slate-950"}`}>{active?"Çıkar":"Kuşan"}</button></div>})}</div>:<p className="mt-5 text-sm text-slate-500">Henüz bir kozmetiğin yok. Market seni bekliyor. 👽</p>}
      </section>

      <section className="mt-5 grid gap-5 md:grid-cols-2">
        <Info
          icon={<Globe2 size={19} />}
          label="Ülke"
          value={<span className="flex items-center gap-3"><CountryFlag code={profile.countryCode} className="h-6 w-9 shrink-0 rounded-sm shadow-sm" /><span>{profile.country || profile.countryCode || "Bilinmiyor"}</span></span>}
        />
        <Info icon={<Wifi size={19} />} label="Steam Durumu" value={profile.status || "Çevrimdışı"} />
        <Info icon={<CalendarDays size={19} />} label="Hesap Oluşturulma" value={formatDate(profile.accountCreated)} />
        <Info icon={<CalendarDays size={19} />} label="Son Görülme" value={formatDate(profile.lastLogoff)} />
      </section>
    </main>
  );
}

function Info({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-cyan-400/20 bg-white/[0.035] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-400/35 hover:bg-cyan-400/[0.04]">
      <div className="flex items-center gap-2 text-sm text-cyan-400">{icon}{label}</div>
      <div className="mt-3 text-2xl font-black text-white">{value}</div>
      {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
    </div>
  );
}
