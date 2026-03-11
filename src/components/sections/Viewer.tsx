"use client";
import FadeIn from "@/components/FadeIn";
import Factory3D from "@/components/Factory3D";

export default function Viewer() {
  return (
    <section
      id="viewer"
      className="relative min-h-screen flex flex-col"
      style={{ background: "linear-gradient(to bottom, #050c12, #071420, #050c12)" }}
    >
      {/* Header */}
      <div className="px-[8vw] md:px-[10vw] pt-24 pb-10 relative z-10">
        <FadeIn>
          <p className="text-[10px] tracking-[0.35em] text-[#64c8b8] uppercase mb-6">
            3D Viewer — 設計可視化
          </p>
          <h2 className="font-serif text-[clamp(28px,4.5vw,58px)] font-light leading-[1.38] mb-4">
            設計を<strong className="font-bold text-white">3Dで体験</strong>する
          </h2>
          <p className="text-[12px] text-white/35 tracking-[0.1em]">
            ドラッグで回転 · 施工前に動線を確認 · 干渉を可視化
          </p>
        </FadeIn>
      </div>

      {/* Canvas — grows to fill remaining height */}
      <div className="flex-1 relative min-h-[50vh]">
        <Factory3D />

        {/* Overlay hint */}
        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.28em] text-[#64c8b8]/35 uppercase pointer-events-none">
          drag to rotate
        </p>

        {/* Vignette edges */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at center, transparent 50%, rgba(5,12,18,0.7) 100%),
              linear-gradient(to bottom, rgba(5,12,18,0.5) 0%, transparent 20%, transparent 80%, rgba(5,12,18,0.7) 100%)
            `,
          }}
        />
      </div>

      {/* Bottom note */}
      <div className="px-[8vw] md:px-[10vw] py-10 relative z-10">
        <FadeIn>
          <p className="text-[11px] text-white/30 leading-[1.9] max-w-md tracking-[0.04em]">
            実案件では設備・動線・安全エリアをすべて3D上で検証。
            着工前に「見えない問題」を完全に潰します。
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
