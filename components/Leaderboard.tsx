"use client";

import {
  Crown,
  Medal,
  Trophy,
} from "lucide-react";

import GlowCard from "@/components/ui/GlowCard";
import SectionTitle from "@/components/ui/SectionTitle";

const topPlayers = [
  {
    place: 1,
    name: "RX Shadow",
    elo: 3245,
    kd: "1.84",
    hs: "63%",
    icon: Crown,
    color: "text-yellow-400",
  },
  {
    place: 2,
    name: "AlienX",
    elo: 3112,
    kd: "1.72",
    hs: "60%",
    icon: Medal,
    color: "text-gray-300",
  },
  {
    place: 3,
    name: "Nova",
    elo: 2970,
    kd: "1.63",
    hs: "57%",
    icon: Trophy,
    color: "text-orange-400",
  },
];


const ranking = [
  {
    rank: 4,
    name: "Vortex",
    elo: 2895,
    kd: "1.56",
    hs: "55%",
  },
  {
    rank: 5,
    name: "Kenshi",
    elo: 2814,
    kd: "1.51",
    hs: "54%",
  },
  {
    rank: 6,
    name: "Frost",
    elo: 2748,
    kd: "1.48",
    hs: "52%",
  },
  {
    rank: 7,
    name: "Ghost",
    elo: 2691,
    kd: "1.42",
    hs: "50%",
  },
];


export default function Leaderboard() {
  return (

    <section
      id="leaderboard"
      className="relative py-28 overflow-hidden"
    >

      {/* Glow */}

      <div
        className="
          absolute
          left-1/2
          top-20
          -translate-x-1/2
          h-[500px]
          w-[500px]
          rounded-full
          bg-cyan-500/10
          blur-[180px]
        "
      />


      <div className="relative mx-auto max-w-6xl px-6">


        <SectionTitle
          badge="LİDERLİK TABLOSU"
          title="En İyi Oyuncular"
          description="En yüksek ELO puanına sahip oyuncular burada yer alıyor."
        />



        {/* TOP 3 */}

        <div
          className="
            mt-12
            grid
            gap-8
            lg:grid-cols-3
          "
        >


          {topPlayers.map((player)=>{

            const Icon = player.icon;


            return (

              <GlowCard
                key={player.place}
                className="p-6 text-center"
              >


                <div
                  className="
                    mx-auto
                    flex
                    h-20
                    w-20
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-cyan-400/20
                    bg-cyan-500/10
                  "
                >

                  <Icon
                    size={36}
                    className={player.color}
                  />

                </div>



                <h3
                  className="
                    mt-6
                    text-2xl
                    font-black
                    text-white
                  "
                >
                  {player.name}
                </h3>



                <p className="mt-2 text-gray-400">

                  #{player.place} Oyuncu

                </p>




                <div className="mt-6 space-y-3">


                  <div className="flex justify-between">

                    <span className="text-gray-500">
                      ELO
                    </span>

                    <span className="font-bold text-cyan-400">
                      {player.elo}
                    </span>

                  </div>



                  <div className="flex justify-between">

                    <span className="text-gray-500">
                      K/D
                    </span>

                    <span className="font-bold text-white">
                      {player.kd}
                    </span>

                  </div>



                  <div className="flex justify-between">

                    <span className="text-gray-500">
                      HS%
                    </span>

                    <span className="font-bold text-white">
                      {player.hs}
                    </span>

                  </div>


                </div>


              </GlowCard>

            );


          })}


        </div>





        {/* LIST */}


        <GlowCard
          className="
            mt-10
            overflow-hidden
          "
        >


          <div
            className="
              divide-y
              divide-white/5
            "
          >


            {ranking.map((player)=>(


              <div

                key={player.rank}

                className="
                  flex
                  items-center
                  justify-between
                  px-6
                  py-5
                  transition
                  hover:bg-cyan-500/5
                "

              >



                <div
                  className="
                    flex
                    items-center
                    gap-5
                  "
                >



                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-full
                      bg-cyan-500/10
                      font-bold
                      text-cyan-400
                    "
                  >

                    {player.rank}

                  </div>




                  <div>

                    <h4 className="font-bold text-white">

                      {player.name}

                    </h4>


                    <p className="text-sm text-gray-500">

                      Rekabetçi Oyuncu

                    </p>


                  </div>


                </div>





                <div
                  className="
                    flex
                    items-center
                    gap-8
                  "
                >


                  <div className="text-center">

                    <p className="text-xs text-gray-500">
                      ELO
                    </p>

                    <p className="font-bold text-cyan-400">
                      {player.elo}
                    </p>

                  </div>



                  <div className="text-center">

                    <p className="text-xs text-gray-500">
                      K/D
                    </p>

                    <p className="font-bold text-white">
                      {player.kd}
                    </p>

                  </div>




                  <div className="text-center">

                    <p className="text-xs text-gray-500">
                      HS%
                    </p>

                    <p className="font-bold text-white">
                      {player.hs}
                    </p>

                  </div>


                </div>


              </div>


            ))}


          </div>


        </GlowCard>


      </div>


    </section>

  );
}