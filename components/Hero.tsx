"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import Badge from "@/components/ui/Badge";
import PrimaryButton from "@/components/ui/PrimaryButton";
import AnimatedCounter from "@/components/ui/AnimatedCounter";


export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-24">


      {/* BACKGROUND GLOW */}

      <div
        className="
        absolute
        left-1/2
        top-20
        h-[700px]
        w-[700px]
        -translate-x-1/2
        rounded-full
        bg-cyan-500/10
        blur-[200px]
        "
      />


      <div
        className="
        absolute
        right-0
        top-0
        h-[450px]
        w-[450px]
        rounded-full
        bg-cyan-400/10
        blur-[170px]
        "
      />


      {/* BACKGROUND TEXT */}

      <h2
        className="
        pointer-events-none
        absolute
        left-1/2
        top-24
        hidden
        -translate-x-1/2
        text-[180px]
        font-black
        tracking-[30px]
        text-white/[0.03]
        xl:block
        "
      >
        RXALIENS
      </h2>



      <div
        className="
            relative
            mx-auto
            flex
            max-w-7xl
            flex-col
            items-center
            gap-10
            px-6
            lg:flex-row
            lg:items-center
            lg:justify-between
            lg:gap-20
            "
      >


        {/* LEFT */}

        <motion.div
          initial={{
            opacity:0,
            x:-50
          }}
          animate={{
            opacity:1,
            x:0
          }}
          transition={{
            duration:.8
          }}
          className="flex-1"
        >


          <Badge>
            🚀 TÜRKİYE&apos;NİN YENİ NESİL COUNTER-STRIKE PLATFORMU
          </Badge>



          <h1
            className="
            mt-8
            text-5xl
            font-black
            leading-none
            text-white
            sm:text-6xl
            xl:text-7xl
            "
          >

            Rekabeti

            <br />

            <span
              className="
              bg-gradient-to-r
              from-cyan-300
              via-cyan-400
              to-cyan-500
              bg-clip-text
              text-transparent
              "
            >
              Yeni Bir
            </span>

            <br />

            Seviyeye Taşı.


          </h1>



          <p
            className="
            mt-8
            max-w-xl
            text-lg
            leading-9
            text-gray-400
            "
          >

            RXALIENS, Counter-Strike oyuncularını
            modern bir platform altında buluşturan
            yeni nesil topluluk sistemidir.

            <br />

            Sunucular, turnuvalar, liderlik tablosu,
            istatistikler ve çok daha fazlası seni bekliyor.

          </p>




          <div
            className="
            mt-10
            flex
            gap-5
            "
          >


          <PrimaryButton href="/api/steam">
            Steam ile Giriş
          </PrimaryButton>



            <Link
              href="#leaderboard"
              className="
              inline-flex
              items-center
              gap-3
              rounded-2xl
              border
              border-cyan-400/20
              bg-white/5
              px-8
              py-4
              font-semibold
              text-white
              transition
              hover:bg-cyan-500/10
              "
            >

              Liderlik Tablosu

              <ArrowRight size={18}/>

            </Link>


          </div>




          {/* QUICK INFO */}

<div
  className="
  mt-10
  flex
  flex-wrap
  gap-5
  "
>

  <div
    className="
    flex
    items-center
    gap-3
    rounded-2xl
    border
    border-cyan-400/20
    bg-white/5
    px-6
    py-3
    backdrop-blur-xl
    "
  >

    <div
      className="
      flex
      h-10
      w-10
      items-center
      justify-center
      rounded-xl
      bg-cyan-500/10
      text-xl
      "
    >
      ⚡
    </div>

    <div>
      <h3 className="text-2xl font-black text-cyan-400">
        <AnimatedCounter end={128}/>
      </h3>

      <p className="text-xs text-gray-400">
        Premium Tick
      </p>
    </div>

  </div>




  <div
    className="
    flex
    items-center
    gap-3
    rounded-2xl
    border
    border-cyan-400/20
    bg-white/5
    px-6
    py-3
    backdrop-blur-xl
    "
  >

    <div
      className="
      flex
      h-10
      w-10
      items-center
      justify-center
      rounded-xl
      bg-cyan-500/10
      text-xl
      "
    >
      🛡️
    </div>


    <div>

      <h3 className="text-2xl font-black text-cyan-400">
        7/24
      </h3>

      <p className="text-xs text-gray-400">
        Aktif Destek
      </p>

    </div>


  </div>





  <div
    className="
    flex
    items-center
    gap-3
    rounded-2xl
    border
    border-cyan-400/20
    bg-white/5
    px-6
    py-3
    backdrop-blur-xl
    "
  >

    <div
      className="
      flex
      h-10
      w-10
      items-center
      justify-center
      rounded-xl
      bg-cyan-500/10
      text-xl
      "
    >
      🔑
    </div>


    <div>

      <h3 className="text-2xl font-black text-cyan-400">
        Steam
      </h3>

      <p className="text-xs text-gray-400">
        Tek Tık Giriş
      </p>

    </div>


  </div>


</div>

        </motion.div>





        {/* RIGHT IMAGE */}


        <motion.div
          initial={{
            opacity:0,
            x:50
          }}
          animate={{
            opacity:1,
            x:0
          }}
          transition={{
            duration:.9
          }}
          className="
          relative
          flex
          flex-1
          justify-center
          "
        >


          <div
            className="
            absolute
            h-[500px]
            w-[500px]
            rounded-full
            bg-cyan-400/10
            blur-[140px]
            "
          />



          <motion.div
            animate={{
              y:[0,-12,0]
            }}
            transition={{
              duration:5,
              repeat:Infinity,
              ease:"easeInOut",
            }}
            className="relative z-10 -translate-y-10"
          >

            <Image
              src="/images/hero-agent.png"
              alt="RXALIENS Agent"
              width={720}
              height={900}
              priority
              className="
              select-none
              object-contain
              scale-115
              drop-shadow-[0_0_90px_rgba(34,211,238,.45)]
              "
            />


          </motion.div>


        </motion.div>


      </div>




      {/* SCROLL */}

      <motion.div
        initial={{
          opacity:0
        }}
        animate={{
          opacity:1
        }}
        transition={{
          delay:1
        }}
        className="
        mt-16
        flex
        flex-col
        items-center
        "
      >

        <span
          className="
          mb-4
          text-xs
          uppercase
          tracking-[6px]
          text-gray-500
          "
        >
          Aşağı Kaydır
        </span>


        <div
          className="
          flex
          h-14
          w-8
          justify-center
          rounded-full
          border
          border-cyan-400/20
          "
        >

          <motion.div
            animate={{
              y:[0,18,0]
            }}
            transition={{
              repeat:Infinity,
              duration:1.8
            }}
            className="
            mt-2
            h-3
            w-1
            rounded-full
            bg-cyan-400
            "
          />

        </div>

      </motion.div>




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