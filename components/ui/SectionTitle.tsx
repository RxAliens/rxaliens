"use client";

interface SectionTitleProps {
  badge?: string;
  title: string;
  description: string;
}

export default function SectionTitle({
  badge,
  title,
  description,
}: SectionTitleProps) {
  return (
    <div className="mb-16 text-center">
      <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-5 py-2 text-sm font-semibold tracking-[4px] text-cyan-300">
        {badge}
      </span>

      <h2 className="mt-6 text-4xl font-black text-white md:text-5xl">
        {title}
      </h2>

      <p className="mx-auto mt-5 max-w-2xl leading-8 text-gray-400">
        {description}
      </p>
    </div>
  );
}