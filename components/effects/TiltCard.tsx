"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
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
    stiffness: 180,
    damping: 18,
  });

  const smoothY = useSpring(rotateY, {
    stiffness: 180,
    damping: 18,
  });

  const glowX = useTransform(smoothY, [-10, 10], [-30, 30]);
  const glowY = useTransform(smoothX, [-10, 10], [30, -30]);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateXValue = ((y / rect.height) - 0.5) * -18;
    const rotateYValue = ((x / rect.width) - 0.5) * 18;

    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);
  }

  function reset() {
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
        transformStyle: "preserve-3d",
      }}
      className={`relative ${className}`}
    >
      <motion.div
        style={{
          x: glowX,
          y: glowY,
        }}
        className="
          pointer-events-none
          absolute
          inset-0
          rounded-3xl
          bg-cyan-400/10
          blur-3xl
        "
      />

      <div
        style={{
          transform: "translateZ(40px)",
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}