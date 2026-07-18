"use client";

import {
  ShieldCheck,
  Trophy,
  Users,
  Zap,
  Gamepad2,
  CheckCircle2,
} from "lucide-react";

import GlowCard from "@/components/ui/GlowCard";
import SectionTitle from "@/components/ui/SectionTitle";

const features = [
  {
    icon: Gamepad2,
    title: "Steam Entegrasyonu",
    description:
      "Steam hesabın ile tek tıkla giriş yap, profilini otomatik senkronize et.",
    items: [
      "Hızlı giriş",
      "Steam profil bağlantısı",
      "Güvenli oturum",
    ],
  },
  {
    icon: Trophy,
    title: "Rekabetçi Sistem",
    description:
      "Kazan, ELO puanını yükselt ve en iyi oyuncular arasına adını yazdır.",
    items: [
      "ELO sistemi",
      "Sezon sıralaması",
      "Özel ödüller",
    ],
  },
  {
    icon: Users,
    title: "Aktif Topluluk",
    description:
      "Turnuvalar, etkinlikler ve binlerce aktif oyuncuyla birlikte oyna.",
    items: [
      "Discord etkinlikleri",
      "Takım bulma",
      "Topluluk desteği",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Adil Oyun",
    description:
      "Gelişmiş anti-cheat sistemi ile güvenli ve rekabetçi maç deneyimi.",
    items: [
      "Anti-Cheat",
      "7/24 Denetim",
      "Güvenli Sunucular",
    ],
  },
  {
    icon: Zap,
    title: "128 Tick Sunucular",
    description:
      "Düşük ping ve yüksek performans ile kusursuz Counter-Strike deneyimi.",
    items: [
      "128 Tick",
      "Düşük gecikme",
      "SSD altyapı",
    ],
  },
  {
    icon: Trophy,
    title: "Sezon Ödülleri",
    description:
      "Her sezon sonunda özel rozetler ve oyun içi ödüller kazan.",
    items: [
      "Rozetler",
      "Premium ödüller",
      "Liderlik tablosu",
    ],
  },
];

export default function Features() {
  return (
    <section className="relative py-28">

      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[170px]" />

      <div className="relative mx-auto max-w-7xl px-6">

        <SectionTitle
          badge="ÖZELLİKLER"
          title="RXALIENS Neler Sunuyor?"
          description="Counter-Strike oyuncuları için geliştirilen modern topluluk platformu."
        />

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {features.map((feature) => {

            const Icon = feature.icon;

            return (

              <GlowCard
                key={feature.title}
                className="p-8"
              >

                <div className="mb-6 inline-flex rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">

                  <Icon
                    size={34}
                    className="text-cyan-400"
                  />

                </div>

                <h3 className="text-2xl font-black text-white">

                  {feature.title}

                </h3>

                <p className="mt-4 leading-7 text-gray-400">

                  {feature.description}

                </p>

                <div className="mt-8 space-y-4">

                  {feature.items.map((item) => (

                    <div
                      key={item}
                      className="flex items-center gap-3"
                    >

                      <CheckCircle2
                        size={18}
                        className="text-cyan-400"
                      />

                      <span className="text-gray-300">

                        {item}

                      </span>

                    </div>

                  ))}

                </div>

              </GlowCard>

            );

          })}

        </div>

      </div>

    </section>
  );
}