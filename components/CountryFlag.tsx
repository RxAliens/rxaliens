"use client";

import Flag from "react-world-flags";

export default function CountryFlag({ code, className = "h-5 w-7" }: { code?: string; className?: string }) {
  const normalized = code?.trim().toUpperCase();

  if (!normalized || normalized.length !== 2) {
    return (
      <span
        aria-label="Ülke bilinmiyor"
        className={`inline-flex items-center justify-center rounded bg-slate-800 text-xs text-slate-400 ${className}`}
      >
        ?
      </span>
    );
  }

  return (
    <Flag
      code={normalized}
      alt={`${normalized} bayrağı`}
      className={`shrink-0 rounded-[3px] object-cover shadow-[0_0_12px_rgba(34,211,238,.12)] ${className}`}
    />
  );
}
