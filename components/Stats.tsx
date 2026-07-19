"use client";

import {
  Users,
  Activity,
  Trophy,
  ShieldCheck,
} from "lucide-react";

import GlowCard from "@/components/ui/GlowCard";
import SectionTitle from "@/components/ui/SectionTitle";
import AnimatedCounter from "@/components/ui/AnimatedCounter";


const stats = [
  {
    icon: Users,
    number: 18542,
    suffix: "+",
    label: "Kayıtlı Oyuncu",
  },
  {
    icon: Activity,
    number: 2451,
    suffix: "",
    label: "Aktif Oyuncu",
  },
  {
    icon: Trophy,
    number: 428,
    suffix: "K",
    label: "Tamamlanan Maç",
  },
  {
    icon: ShieldCheck,
    number: 128,
    suffix: "",
    label: "Tick Sunucular",
  },
];


export default function Stats() {

  return (

    <section
      className="
      relative
      py-20
      "
    >


      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />


      <div
        className="
        mx-auto
        max-w-7xl
        px-6
        "
      >


        <SectionTitle
          badge="İSTATİSTİKLER"
          title="RXALIENS Rakamlarla"
          description="Her gün büyüyen Counter-Strike topluluğumuzun güncel istatistikleri."
        />



        <div
          className="
          mt-10
          grid
          grid-cols-1
          gap-6
          sm:grid-cols-2
          xl:grid-cols-4
          "
        >


          {stats.map((item)=>{


            const Icon = item.icon;


            return (

              <GlowCard
                key={item.label}
              >


                <div
                  className="
                  flex
                  h-[190px]
                  flex-col
                  items-center
                  justify-center
                  text-center
                  "
                >


                  <div
                    className="
                    mb-4
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-cyan-500/10
                    "
                  >

                    <Icon
                      size={28}
                      className="text-cyan-400"
                    />

                  </div>



                  <h3
                    className="
                    text-4xl
                    font-black
                    text-white
                    "
                  >

                    <AnimatedCounter
                      end={item.number}
                      suffix={item.suffix}
                    />

                  </h3>



                  <p
                    className="
                    mt-2
                    text-xs
                    uppercase
                    tracking-[3px]
                    text-gray-400
                    "
                  >

                    {item.label}

                  </p>


                </div>


              </GlowCard>


            );


          })}


        </div>


      </div>


    </section>

  );

}