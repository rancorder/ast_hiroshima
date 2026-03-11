"use client";
import FadeIn from "@/components/FadeIn";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center items-start px-[8vw] md:px-[10vw] overflow-hidden"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(100,200,180,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100,200,180,0.035) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
        }}
      />

      {/* Radial glow — top right */}
      <div
        className="absolute top-[-10%] right-[-5%] w-[55vw] h-[55vw] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(100,200,180,0.055) 0%, transparent 68%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-3xl">
        <FadeIn delay={0.05}>
          <p className="text-[10px] md:text-[11px] tracking-[0.32em] text-[#64c8b8] uppercase mb-8 md:mb-10">
            株式会社アスト ／ 機械設計・設備レイアウト設計
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          {/* Apple style: ONE concept, enormous type */}
          <h1 className="font-serif text-[clamp(48px,8vw,96px)] font-light leading-[1.18] tracking-[-0.02em] mb-6">
            <span className="text-white font-bold">手戻り、</span>
            <br />
            <span
              className="italic text-[#64c8b8]"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              ゼロ。
            </span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.38}>
          <p className="text-[13px] md:text-[15px] text-white/40 leading-[1.9] tracking-[0.04em] mb-14 max-w-[400px]">
            20年の経験 × 現場アイデア × 3Dシミュレーション
            <br />
            設計段階で問題を潰す。それがアストの仕事です。
          </p>
        </FadeIn>

        <FadeIn delay={0.52}>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="#cta"
              className="inline-flex items-center gap-3 px-10 py-5 border border-[#64c8b8] text-[#64c8b8] text-[11px] tracking-[0.18em] uppercase transition-all duration-300 hover:bg-[#64c8b8] hover:text-[#050c12] font-medium"
            >
              設計相談をはじめる <span className="text-base">→</span>
            </Link>
            <Link
              href="#problem"
              className="inline-flex items-center gap-3 px-10 py-5 text-white/40 text-[11px] tracking-[0.18em] uppercase transition-colors duration-300 hover:text-white/70"
            >
              課題を確認する <span className="text-base">↓</span>
            </Link>
          </div>
        </FadeIn>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div
          className="w-px h-14 bg-gradient-to-b from-[#64c8b8] to-transparent"
          style={{ animation: "scrollPulse 2.2s ease-in-out infinite" }}
        />
        <span className="text-[9px] tracking-[0.28em] text-[#64c8b8]/50 uppercase">scroll</span>
      </div>

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1); }
          50%       { opacity: 1;   transform: scaleY(1.12); }
        }
      `}</style>
    </section>
  );
}
