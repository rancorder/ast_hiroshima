"use client";
import FadeIn from "@/components/FadeIn";

const PILLARS = [
  {
    n: "01",
    icon: "◈",
    title: "20年以上の経験",
    desc: "機械設計・設備設計の豊富な実績。現場を知り抜いた視点で「実際に動く設計」を提案します。",
    direction: "left",
  },
  {
    n: "02",
    icon: "◉",
    title: "現場のアイデア",
    desc: "教科書にない現場発想。作業者・保全・安全の三視点を設計に織り込む独自アプローチ。",
    direction: "up",
  },
  {
    n: "03",
    icon: "◎",
    title: "3Dシミュレーション",
    desc: "設計段階でリアルな3D検証。干渉チェック・動線確認・プレゼンを1モデルで完結させます。",
    direction: "right",
  },
] as const;

export default function Solution() {
  return (
    <section
      id="solution"
      className="min-h-screen flex flex-col justify-center px-[8vw] md:px-[10vw] py-24"
    >
      <FadeIn>
        <p className="text-[10px] tracking-[0.35em] text-[#64c8b8] uppercase mb-6">
          Solution — 解決策
        </p>
        {/* Apple-style: the equation IS the message */}
        <h2 className="font-serif text-[clamp(28px,4.5vw,58px)] font-light leading-[1.38] mb-4">
          答えは<br />
          <strong className="font-bold text-white">経験 × アイデア × 3D</strong>
        </h2>
        <p className="text-[13px] text-white/40 leading-[1.9] max-w-sm tracking-[0.04em]">
          3つの力が重なるとき、手戻りは設計段階で消える。
        </p>
      </FadeIn>

      <div className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-px bg-[#64c8b8]/[0.08]">
        {PILLARS.map((p, i) => (
          <FadeIn key={p.n} delay={i * 0.18} direction={p.direction as "left" | "up" | "right"}>
            <div className="group relative bg-[#050c12] p-10 md:p-12 h-full transition-colors duration-300 hover:bg-[#64c8b8]/[0.03]">
              {/* Ghost number */}
              <span
                className="absolute top-6 right-8 font-serif text-[72px] leading-none text-[#64c8b8]/[0.055] select-none"
                aria-hidden="true"
              >
                {p.n}
              </span>

              {/* Icon */}
              <span className="block text-[38px] mb-7 text-[#64c8b8]/60 group-hover:text-[#64c8b8] transition-colors duration-500">
                {p.icon}
              </span>

              <h3 className="font-serif text-[20px] md:text-[22px] font-bold mb-4 text-white">
                {p.title}
              </h3>
              <p className="text-[12px] md:text-[13px] text-white/45 leading-[1.95]">
                {p.desc}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
