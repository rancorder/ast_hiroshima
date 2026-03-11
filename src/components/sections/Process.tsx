"use client";
import { useEffect, useState } from "react";
import FadeIn from "@/components/FadeIn";

const STEPS = [
  { n: "01", title: "ヒアリング",        desc: "現場課題・設備仕様・動線要件を徹底的に把握します" },
  { n: "02", title: "レイアウト設計",    desc: "20年の経験と現場アイデアで最適な配置を設計します" },
  { n: "03", title: "3Dシミュレーション", desc: "干渉・動線・安全を3Dで可視化し事前に検証します" },
  { n: "04", title: "改善・納品",        desc: "フィードバックを反映し、手戻りゼロで完成させます" },
] as const;

export default function Process() {
  const [active, setActive] = useState(0);

  // Auto-cycle
  useEffect(() => {
    const t = setInterval(() => setActive(s => (s + 1) % STEPS.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      id="process"
      className="px-[8vw] md:px-[10vw] py-24 md:py-32"
    >
      <FadeIn>
        <p className="text-[10px] tracking-[0.35em] text-[#64c8b8] uppercase mb-6">
          Process — 進め方
        </p>
        <h2 className="font-serif text-[clamp(28px,4.5vw,58px)] font-light leading-[1.38] mb-4">
          <strong className="font-bold text-white">手戻りゼロ</strong>への<br />
          4ステップ
        </h2>
      </FadeIn>

      {/* Desktop: horizontal timeline */}
      <FadeIn delay={0.2}>
        <div className="mt-14 hidden md:grid grid-cols-4 border-t border-[#64c8b8]/10">
          {STEPS.map((s, i) => (
            <button
              key={s.n}
              onClick={() => setActive(i)}
              className={`group text-left p-10 border-r border-[#64c8b8]/10 last:border-0 transition-all duration-500
                ${active === i
                  ? "border-t-2 border-t-[#64c8b8] bg-[#64c8b8]/[0.04] -mt-[2px]"
                  : "border-t-2 border-t-transparent hover:bg-white/[0.015]"
                }`}
            >
              <div
                className={`font-serif text-[44px] leading-none mb-5 transition-colors duration-500
                  ${active === i ? "text-[#64c8b8]" : "text-[#64c8b8]/18 group-hover:text-[#64c8b8]/35"}`}
              >
                {s.n}
              </div>
              <div className="font-serif text-[15px] font-semibold mb-2 text-white">{s.title}</div>
              <div className="text-[11px] text-white/70 leading-[1.85]">{s.desc}</div>
            </button>
          ))}
        </div>

        {/* Mobile: vertical list */}
        <div className="mt-10 md:hidden flex flex-col divide-y divide-[#64c8b8]/10">
          {STEPS.map((s, i) => (
            <button
              key={s.n}
              onClick={() => setActive(i)}
              className={`text-left py-7 transition-all duration-300 ${active === i ? "pl-4 border-l-2 border-[#64c8b8]" : "pl-0 border-l-2 border-transparent"}`}
            >
              <div className={`font-serif text-[32px] leading-none mb-3 transition-colors duration-400 ${active === i ? "text-[#64c8b8]" : "text-[#64c8b8]/20"}`}>
                {s.n}
              </div>
              <div className="font-serif text-[15px] font-semibold mb-1 text-white">{s.title}</div>
              <div className="text-[11px] text-white/70 leading-[1.85]">{s.desc}</div>
            </button>
          ))}
        </div>

        {/* Progress dots */}
        <div className="mt-8 flex gap-2 justify-center md:justify-start">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-[2px] transition-all duration-500 rounded-full ${active === i ? "w-8 bg-[#64c8b8]" : "w-2 bg-white/15 hover:bg-white/30"}`}
              aria-label={`Step ${i + 1}`}
            />
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
