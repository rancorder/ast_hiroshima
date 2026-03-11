"use client";
import FadeIn from "@/components/FadeIn";

const STATS = [
  { num: "20",  unit: "年+", label: "機械・設備設計\nの実績年数" },
  { num: "0",   unit: "件",  label: "3D検証後の\n重大干渉ミス" },
  { num: "∞",   unit: "",    label: "現場アイデアで\n生まれた改善提案" },
] as const;

export default function Stats() {
  return (
    <section className="border-y border-[#64c8b8]/[0.07]">
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#64c8b8]/[0.07]">
        {STATS.map((s, i) => (
          <FadeIn key={i} delay={i * 0.14} direction="up">
            <div className="px-[8vw] md:px-16 py-16 md:py-20 flex flex-col items-start">
              <div className="font-serif text-[clamp(52px,8vw,100px)] leading-none text-white mb-3 tracking-tight">
                {s.num}
                <span className="text-[#64c8b8] text-[0.5em] ml-1 align-top mt-3 inline-block">
                  {s.unit}
                </span>
              </div>
              <div className="text-[11px] text-white/38 tracking-[0.1em] leading-[1.9] whitespace-pre-line">
                {s.label}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
