"use client";

interface BadgeProps {
  children: React.ReactNode;
}

export default function Badge({
  children,
}: BadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm font-semibold tracking-wider text-cyan-300 backdrop-blur-xl">
      {children}
    </span>
  );
}