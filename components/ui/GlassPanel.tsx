"use client";

import { ReactNode } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
}

export default function GlassPanel({
  children,
  className = "",
}: GlassPanelProps) {
  return (
    <div
      className={`
        rounded-3xl
        border
        border-white/10
        bg-white/[0.04]
        backdrop-blur-2xl
        ${className}
      `}
    >
      {children}
    </div>
  );
}