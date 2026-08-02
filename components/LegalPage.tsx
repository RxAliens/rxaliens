import Link from "next/link";
import Footer from "@/components/Footer";

export default function LegalPage({ eyebrow, title, intro, sections }: { eyebrow:string; title:string; intro:string; sections:{title:string; body:string}[] }) {
  return <><main className="mx-auto min-h-[70vh] max-w-5xl px-6 pb-16 pt-36"><Link href="/" className="text-sm font-bold text-cyan-400">← Ana sayfa</Link><p className="mt-10 text-xs font-bold uppercase tracking-[.35em] text-cyan-400">{eyebrow}</p><h1 className="mt-3 text-4xl font-black text-white md:text-5xl">{title}</h1><p className="mt-4 max-w-3xl leading-7 text-slate-400">{intro}</p><div className="mt-10 space-y-5">{sections.map((s,i)=><section key={s.title} className="rounded-2xl border border-cyan-400/15 bg-white/[.025] p-6"><div className="flex gap-4"><span className="font-black text-cyan-400">{String(i+1).padStart(2,"0")}</span><div><h2 className="text-xl font-black text-white">{s.title}</h2><p className="mt-2 leading-7 text-slate-400">{s.body}</p></div></div></section>)}</div></main><Footer /></>;
}
