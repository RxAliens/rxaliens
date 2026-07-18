"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface PrimaryButtonProps {
  href?: string;
  children: ReactNode;
  className?: string;
}

export default function PrimaryButton({
  href = "#",
  children,
  className = "",
}: PrimaryButtonProps) {
  return (
    <Link
      href={href}
      className={`
        inline-flex
        items-center
        justify-center
        rounded-2xl
        bg-cyan-400
        px-8
        py-4
        font-bold
        text-black
        transition-all
        duration-300
        hover:scale-105
        hover:shadow-[0_0_35px_rgba(34,211,238,.55)]
        active:scale-95
        ${className}
      `}
    >
      {children}
    </Link>
  );
}