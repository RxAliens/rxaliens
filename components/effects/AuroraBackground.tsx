"use client";

import { motion } from "framer-motion";

export default function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">

      {/* Aurora 1 */}

      <motion.div
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -40, 50, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          -top-40
          left-1/2
          h-[700px]
          w-[700px]
          -translate-x-1/2
          rounded-full
          bg-cyan-400/12
          blur-[180px]
        "
      />

      {/* Aurora 2 */}

      <motion.div
        animate={{
          x: [0, -120, 60, 0],
          y: [0, 60, -50, 0],
          scale: [1, 0.9, 1.2, 1],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          right-[-250px]
          top-[20%]
          h-[650px]
          w-[650px]
          rounded-full
          bg-sky-400/10
          blur-[180px]
        "
      />

      {/* Aurora 3 */}

      <motion.div
        animate={{
          x: [0, 60, -80, 0],
          y: [0, -80, 20, 0],
          scale: [1, 1.2, 1, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          left-[-220px]
          bottom-[-180px]
          h-[600px]
          w-[600px]
          rounded-full
          bg-cyan-500/10
          blur-[170px]
        "
      />

    </div>
  );
}