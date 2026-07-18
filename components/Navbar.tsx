"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const menu = [
  { title: "Ana Sayfa", href: "#" },
  { title: "Sunucular", href: "#servers" },
  { title: "Leaderboard", href: "#leaderboard" },
  { title: "Market", href: "#" },
  { title: "Discord", href: "#" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "border-b border-cyan-500/20 bg-black/70 backdrop-blur-3xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <a
          href="#"
          className="select-none text-3xl font-black tracking-[6px] text-cyan-400 transition duration-300 hover:scale-105 hover:text-cyan-300 hover:drop-shadow-[0_0_20px_rgba(34,211,238,.8)]"
        >
          RXALIENS
        </a>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-10 lg:flex">
          {menu.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="group relative text-sm font-medium tracking-wide text-gray-300 transition duration-300 hover:text-cyan-400"
            >
              {item.title}

              <span className="absolute -bottom-2 left-0 h-[2px] w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Desktop Button */}
        <button
          className="hidden rounded-xl border border-cyan-400/70 bg-cyan-500/10 px-6 py-3 font-semibold text-cyan-300 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_30px_rgba(34,211,238,.55)] lg:block"
        >
          Steam Giriş
        </button>

        {/* Mobile Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-cyan-400 lg:hidden"
        >
          {mobileOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden transition-all duration-500 lg:hidden ${
          mobileOpen ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        <div className="border-t border-cyan-500/10 bg-black/90 backdrop-blur-3xl">
          {menu.map((item) => (
            <a
              key={item.title}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block border-b border-cyan-500/10 px-6 py-5 text-gray-300 transition hover:bg-cyan-500/10 hover:text-cyan-400"
            >
              {item.title}
            </a>
          ))}

          <div className="p-6">
            <button className="w-full rounded-xl bg-cyan-400 py-3 font-semibold text-black transition duration-300 hover:shadow-[0_0_25px_rgba(34,211,238,.6)]">
              Steam Giriş
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}