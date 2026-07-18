import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Servers from "@/components/Servers";
import Leaderboard from "@/components/Leaderboard";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

import Background from "@/components/Background";
import VideoBackground from "@/components/VideoBackground";
import MouseGlow from "@/components/effects/MouseGlow";

export default function Home() {
  return (
    <>
      {/* Efektler */}
      <MouseGlow />
      <Background />
      <VideoBackground />

      {/* Navbar */}
      <Navbar />

      {/* Sayfa */}
      <main className="relative overflow-x-hidden bg-[#05070B] text-white">

        <Hero />

        <Stats />

        <Servers />

        <Leaderboard />

        <Features />

        <Footer />

      </main>
    </>
  );
}