"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import Hero    from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import Solution from "@/components/sections/Solution";
import Process  from "@/components/sections/Process";
import Viewer   from "@/components/sections/Viewer";
import Stats    from "@/components/sections/Stats";
import CTA      from "@/components/sections/CTA";

const NAV_LINKS = [
  { href: "#problem",  label: "課題" },
  { href: "#solution", label: "解決策" },
  { href: "#process",  label: "プロセス" },
  { href: "#viewer",   label: "3D体験" },
  { href: "#cta",      label: "相談" },
] as const;

function Divider() {
  return (
    <div
      className="w-full h-px"
      style={{ background: "linear-gradient(to right, transparent, rgba(100,200,180,0.18), transparent)" }}
    />
  );
}

export default function PresentationEngine() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Google Fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;700&family=Noto+Sans+JP:wght@300;400;500&family=DM+Serif+Display:ital@0;1&display=swap";
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 72);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="bg-[#050c12] text-[#e8eef2] min-h-screen overflow-x-hidden"
      style={{ fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 300 }}
    >
      {/* Scroll progress */}
      <ScrollProgressBar />

      {/* Nav */}
      <nav
        className={`fixed top-[2px] left-0 right-0 z-[100] flex items-center justify-between
          px-[6vw] md:px-[4vw] py-5 transition-all duration-500
          ${scrolled
            ? "bg-[rgba(5,12,18,0.92)] backdrop-blur-md border-b border-[#64c8b8]/[0.09]"
            : "bg-transparent"
          }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <span
            className="text-[17px] tracking-[0.06em]"
            style={{ fontFamily: "'Noto Serif JP', serif", fontWeight: 700 }}
          >
            <span className="text-[#64c8b8]">AST</span>
            <span className="text-white/90"> DESIGN</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[11px] tracking-[0.14em] text-white/45 uppercase transition-colors duration-300 hover:text-[#64c8b8] no-underline"
            >
              {label}
            </Link>
          ))}
          <Link
            href="#cta"
            className="ml-4 px-6 py-2.5 border border-[#64c8b8]/50 text-[#64c8b8] text-[10px] tracking-[0.18em] uppercase transition-all duration-300 hover:bg-[#64c8b8] hover:text-[#050c12] no-underline"
          >
            相談する
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menu"
        >
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className={`block w-5 h-px bg-white/60 transition-all duration-300
                ${menuOpen && i === 0 ? "rotate-45 translate-y-[6px]" : ""}
                ${menuOpen && i === 1 ? "opacity-0" : ""}
                ${menuOpen && i === 2 ? "-rotate-45 -translate-y-[6px]" : ""}
              `}
            />
          ))}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[90] bg-[#050c12]/97 backdrop-blur-xl flex flex-col items-center justify-center gap-10">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="font-serif text-[28px] font-light text-white/70 hover:text-white no-underline transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      )}

      {/* Sections */}
      <main>
        <Hero />
        <Divider />
        <Problem />
        <Divider />
        <Solution />
        <Divider />
        <Process />
        <Divider />
        <Viewer />
        <Stats />
        <Divider />
        <CTA />
      </main>

      {/* Footer */}
      <footer className="px-[8vw] md:px-[10vw] py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t border-[#64c8b8]/[0.07]">
        <span
          className="text-[14px] tracking-[0.06em]"
          style={{ fontFamily: "'Noto Serif JP', serif", fontWeight: 700 }}
        >
          <span className="text-[#64c8b8]">AST</span>
          <span className="text-white/80"> DESIGN</span>
        </span>
        <span className="text-[11px] text-white/30 tracking-[0.08em]">
          株式会社アスト ／ 機械設計 · 設備レイアウト設計
        </span>
        <span className="text-[11px] text-white/25 tracking-[0.08em]">
          © 2025 AST DESIGN
        </span>
      </footer>
    </div>
  );
}
