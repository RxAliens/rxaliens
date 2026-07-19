"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

export default function TiltCard({
  children,
  className = "",
}: TiltCardProps) {

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);


  const smoothX = useSpring(rotateX, {
    stiffness: 200,
    damping: 20,
  });


  const smoothY = useSpring(rotateY, {
    stiffness: 200,
    damping: 20,
  });



  function handleMove(
    e: React.MouseEvent<HTMLDivElement>
  ) {

    const rect = e.currentTarget.getBoundingClientRect();

    const x =
      e.clientX - rect.left;

    const y =
      e.clientY - rect.top;


    rotateX.set(
      ((y / rect.height) - 0.5) * -8
    );

    rotateY.set(
      ((x / rect.width) - 0.5) * 8
    );

  }



  function reset(){

    rotateX.set(0);
    rotateY.set(0);

  }



  return (

    <motion.div

      onMouseMove={handleMove}
      onMouseLeave={reset}

      style={{
        rotateX: smoothX,
        rotateY: smoothY,
        transformStyle:"preserve-3d",
      }}

      className={`
        relative
        w-full
        ${className}
      `}

    >

      {children}


    </motion.div>

  );

}