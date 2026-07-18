"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Users,
  Activity,
  Trophy,
  ShieldCheck,
} from "lucide-react";

import Badge from "@/components/ui/Badge";
import GlowCard from "@/components/ui/GlowCard";
import PrimaryButton from "@/components/ui/PrimaryButton";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

const stats = [
  {
    icon: Users,
    value: 18542,
    suffix: "+",
    label: "Kayıtlı Oyuncu",
  },
  {
    icon: Activity,
    value: 2451,
    suffix: "",
    label: "Aktif Oyuncu",
  },
  {
    icon: Trophy,
    value: 428,
    suffix: "K",
    label: "Tamamlanan Maç",
  },
  {
    icon: ShieldCheck,
    value: 128,
    suffix: "",
    label: "Tick Sunucular",
  },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-40 pb-24">

      {/* Aurora Glow */}

      <div className="absolute left-1/2 top-20 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[200px]" />

      <div className="absolute right-0 top-0 h-[450px] w-[450px] rounded-full bg-cyan-400/10 blur-[170px]" />

      <div className="absolute bottom-0 left-0 h-[350px] w-[350px] rounded-full bg-cyan-500/10 blur-[150px]" />

      {/* Background Text */}

      <h2
        className="
          pointer-events-none
          absolute
          left-1/2
          top-32
          -translate-x-1/2
          select-none
          text-[180px]
          font-black
          tracking-[30px]
          text-white/[0.03]
          hidden
          xl:block
        "
      >
        RXALIENS
      </h2>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-20 px-6 lg:flex-row">

        {/* LEFT */}

        <motion.div
          initial={{
            opacity: 0,
            x: -60,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          className="flex-1"
        >

          <Badge>

            🚀 TÜRKİYE'NİN YENİ NESİL COUNTER-STRIKE PLATFORMU

          </Badge>

          <h1 className="mt-8 text-5xl font-black leading-none text-white sm:text-6xl xl:text-7xl">

            Rekabeti

            <br />

            <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-500 bg-clip-text text-transparent">

              Yeni Bir

            </span>

            <br />

            Seviyeye Taşı.

          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-9 text-gray-400">

            RXALIENS, Counter-Strike oyuncularını
            modern bir platform altında buluşturan
            yeni nesil topluluk sistemidir.

            Sunucular, turnuvalar, liderlik tablosu,
            istatistikler ve çok daha fazlası seni bekliyor.

          </p>

          {/* Buttons */}

          <div className="mt-10 flex flex-col gap-5 sm:flex-row">

            <PrimaryButton href="#servers">

              Steam ile Giriş

            </PrimaryButton>

            <Link
              href="#leaderboard"
              className="
                inline-flex
                items-center
                justify-center
                gap-3
                rounded-2xl
                border
                border-cyan-400/20
                bg-white/5
                px-8
                py-4
                font-semibold
                text-white
                backdrop-blur-xl
                transition
                duration-300
                hover:border-cyan-400
                hover:bg-cyan-500/10
              "
            >

              Liderlik Tablosu

              <ArrowRight size={18} />

            </Link>

          </div>

          {/* Quick Info */}

          <div className="mt-12 flex flex-wrap gap-8">

            <div>

              <h3 className="text-3xl font-black text-cyan-400">

                <AnimatedCounter
                  end={128}
                />

              </h3>

              <p className="text-gray-500">

                Premium Tick

              </p>

            </div>

            <div>

              <h3 className="text-3xl font-black text-cyan-400">

                7/24

              </h3>

              <p className="text-gray-500">

                Aktif Destek

              </p>

            </div>

            <div>

              <h3 className="text-3xl font-black text-cyan-400">

                Steam

              </h3>

              <p className="text-gray-500">

                Tek Tık Giriş

              </p>

            </div>

          </div>

        </motion.div>
                {/* RIGHT */}

        <motion.div
          initial={{
            opacity: 0,
            x: 60,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.9,
            delay: 0.2,
          }}
          className="relative flex flex-1 items-center justify-center"
        >

          {/* Glow */}

          <div className="absolute h-[550px] w-[550px] rounded-full bg-cyan-400/15 blur-[150px]" />

          <div className="absolute h-[350px] w-[350px] rounded-full bg-cyan-500/20 blur-[100px]" />

          {/* Character */}

          <motion.div
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative z-10"
          >

            <Image
              src="/images/hero-agent.png"
              alt="RXALIENS Agent"
              width={760}
              height={920}
              priority
              className="
                select-none
                object-contain
                drop-shadow-[0_0_90px_rgba(34,211,238,.45)]
              "
            />

          </motion.div>

        </motion.div>

      </div>

      {/* STATS */}

      <div className="relative mx-auto mt-24 grid max-w-7xl gap-6 px-6 md:grid-cols-2 xl:grid-cols-4">

        {stats.map((item) => {

          const Icon = item.icon;

          return (

            <GlowCard
              key={item.label}
              className="p-7"
            >

              <div className="mb-5 inline-flex rounded-2xl bg-cyan-500/10 p-4">

                <Icon
                  size={30}
                  className="text-cyan-400"
                />

              </div>

              <h3 className="text-4xl font-black text-white">

                <AnimatedCounter
                  end={item.value}
                  suffix={item.suffix}
                />

              </h3>

              <p className="mt-3 text-gray-400">
                {item.label}
              </p>

            </GlowCard>

          );

        })}

      </div>

      {/* STATUS BAR */}

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.8,
          delay: 0.2,
        }}
        className="mx-auto mt-16 max-w-7xl px-6"
      >

        <div
          className="
            flex
            flex-col
            items-center
            justify-between
            gap-6
            rounded-3xl
            border
            border-cyan-400/10
            bg-white/[0.03]
            px-8
            py-6
            backdrop-blur-2xl
            lg:flex-row
          "
        >

          <div className="flex items-center gap-3">

            <span className="h-3 w-3 animate-pulse rounded-full bg-emerald-400" />

            <span className="font-semibold text-emerald-400">
              Topluluk Aktif
            </span>

          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-300">

            <span>
              🎮 4 Aktif Sunucu
            </span>

            <span>
              👥 2.451 Çevrimiçi
            </span>

            <span>
              ⚡ Ortalama Ping 12ms
            </span>

            <span>
              🏆 Bugün 842 Maç
            </span>

          </div>

        </div>

      </motion.div>
            {/* ALT ÇİZGİ */}

      <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

      {/* SCROLL INDICATOR */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 1,
          delay: 1,
        }}
        className="mt-20 flex flex-col items-center justify-center"
      >

        <span className="mb-4 text-xs font-semibold uppercase tracking-[6px] text-gray-500">

          Aşağı Kaydır

        </span>

        <div className="flex h-14 w-8 justify-center rounded-full border border-cyan-400/20">

          <motion.div
            animate={{
              y: [0, 18, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.8,
            }}
            className="mt-2 h-3 w-1 rounded-full bg-cyan-400"
          />

        </div>

      </motion.div>

      {/* SOL GLOW */}

      <div
        className="
          pointer-events-none
          absolute
          left-0
          top-1/3
          h-[260px]
          w-[260px]
          rounded-full
          bg-cyan-500/10
          blur-[140px]
        "
      />

      {/* SAĞ GLOW */}

      <div
        className="
          pointer-events-none
          absolute
          right-0
          bottom-24
          h-[320px]
          w-[320px]
          rounded-full
          bg-cyan-400/10
          blur-[170px]
        "
      />

      {/* GRID */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.03]
          [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)]
          [background-size:60px_60px]
        "
      />

    </section>
  );
}