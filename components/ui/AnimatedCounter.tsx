"use client";

import CountUp from "react-countup";

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
}

export default function AnimatedCounter({
  end,
  suffix = "",
  decimals = 0,
  duration = 2.5,
}: AnimatedCounterProps) {
  return (
    <CountUp
      end={end}
      duration={duration}
      decimals={decimals}
      separator="."
      suffix={suffix}
      enableScrollSpy
      scrollSpyOnce
    />
  );
}