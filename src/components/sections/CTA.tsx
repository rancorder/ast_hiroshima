"use client";
import FadeIn from "@/components/FadeIn";

export default function CTA() {
  return (
    <section
      id="cta"
      className="relative min-h-screen flex flex-col justify-center items-center text-center px-[8vw] md:px-[10vw] py-28 overflow-hidden"
    >
      {/* Concentric ring decorations */}
      {[500, 720, 960].map((size, i) => (
        <div
          key={size}
          className="absolute rounded-full border border-[#64c8b8] pointer-events-none"
          style={{
            width: size, height: size,
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: 0.025 - i * 0.006,
            animation: `float ${6 + i * 2}s ease-in-out infinite ${i % 2 === 0 ? "" : "reverse"}`,
          }}
        />
      ))}

      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(100,200,180,0.055) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 max-w-2xl">
        <FadeIn direction="up">
          <p className="text-[10px] tracking-[0.38em] text-[#64c8b8] uppercase mb-8">
            Contact — 設計相談
          </p>

          {/* Apple CTA: the question IS the headline */}
          <h2 className="font-serif text-[clamp(32px,5vw,68px)] font-light leading-[1.3] mb-6">
            設計の手戻りを
            <br />
            <strong className="font-bold text-white">なくしたい方へ。</strong>
          </h2>

          <p className="text-[13px] text-white/70 leading-[1.95] mb-16 tracking-[0.04em]">
            まずはお気軽にご相談ください。
            <br />
            現在の課題をお聞きし、最適なアプローチをご提案します。
          </p>

          {/* Primary CTA */}
          <button className="group inline-flex items-center gap-3 px-16 py-6 bg-[#64c8b8] text-[#050c12] text-[13px] font-bold tracking-[0.14em] uppercase transition-all duration-300 hover:bg-white hover:scale-[1.02]">
            設計相談をはじめる
            <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>

          <p className="mt-6 text-[10px] tracking-[0.2em] text-white/25">
            相談無料 · 秘密保持対応 · 全国対応
          </p>
        </FadeIn>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(-50%, -50%) scale(1);    }
          50%       { transform: translate(-50%, -50%) scale(1.03); }
        }
      `}</style>
    </section>
  );
}
