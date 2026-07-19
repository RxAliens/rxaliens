"use client";

import { ReactNode } from "react";
import TiltCard from "@/components/effects/TiltCard";


interface GlowCardProps {
  children: ReactNode;
  className?: string;
}


export default function GlowCard({
  children,
  className = "",
}: GlowCardProps) {


  return (

    <TiltCard>

      <div
        className={`
          group
          relative
          w-full
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-white/[0.03]
          backdrop-blur-2xl
          transition-all
          duration-500
          hover:-translate-y-2
          hover:border-cyan-400/40
          hover:shadow-[0_0_50px_rgba(34,211,238,.18)]
          ${className}
        `}
      >


        {/* INNER GLOW */}

        <div
          className="
            pointer-events-none
            absolute
            -right-20
            -top-20
            h-60
            w-60
            rounded-full
            bg-cyan-500/10
            blur-3xl
            transition-all
            duration-500
            group-hover:bg-cyan-400/20
          "
        />



        {/* BORDER LIGHT */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            rounded-3xl
            border
            border-transparent
            transition
            duration-500
            group-hover:border-cyan-400/20
          "
        />



        {/* CONTENT */}

        <div
          className="
            relative
            z-10
          "
        >

          {children}

        </div>


      </div>


    </TiltCard>

  );

}