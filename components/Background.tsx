"use client";

import { motion } from "framer-motion";

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#05070B]">

      {/* Glow 1 */}

      <motion.div
        animate={{
          x: [-300, 250, -300],
          y: [-150, 120, -150],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/3 top-24 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[170px]"
      />

      {/* Glow 2 */}

      <motion.div
        animate={{
          x: [250, -250, 250],
          y: [120, -120, 120],
          scale: [1.2, 0.8, 1.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-24 top-32 h-[420px] w-[420px] rounded-full bg-blue-500/20 blur-[170px]"
      />

      {/* Glow 3 */}

      <motion.div
        animate={{
          x: [-150, 200, -150],
          y: [180, -100, 180],
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-0 left-24 h-[350px] w-[350px] rounded-full bg-cyan-400/20 blur-[150px]"
      />
    </div>
  );
}