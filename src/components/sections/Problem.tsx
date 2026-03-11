"use client";
import FadeIn from "@/components/FadeIn";

const ISSUES = [
  {
    n: "01",
    title: "レイアウト変更",
    desc: "配置確定後の設計変更。再発注・再施工が工期と費用を直撃する",
  },
  {
    n: "02",
    title: "設備干渉",
    desc: "3D未検証のまま着工し、現場合わせの追加工事が発生する",
  },
  {
    n: "03",
    title: "動線ミス",
    desc: "作業者・搬送ルートの計画不足が、稼働後も生産効率を恒久的に下げる",
  },
] as const;

export default function Problem() {
  return (
    <section
      id="problem"
      className="relative min-h-screen flex flex-col justify-center px-[8vw] md:px-[10vw] py-24 overflow-hidden"
    >
      {/* Giant decorative kanji */}
      <span
        className="absolute right-[6vw] top-1/2 -translate-y-1/2 pointer-events-none select-none
                   font-serif text-[clamp(120px,20vw,240px)] leading-none text-[#64c8b8]/[0.04]
                   tracking-tighter hidden md:block"
        aria-hidden="true"
      >
        損失
      </span>

      <FadeIn>
        <p className="text-[10px] tracking-[0.35em] text-[#64c8b8] uppercase mb-6">
          Problem — 課題
        </p>
        <h2 className="font-serif text-[clamp(28px,4.5vw,58px)] font-light leading-[1.38] mb-5">
          設備設計で<br />
          <strong className="font-bold text-white">最もコストが高いのは</strong>
          <br />
          手戻りです。
        </h2>
        <p className="text-[13px] md:text-[14px] text-white/70 leading-[1.9] tracking-[0.04em] max-w-md">
          着工後に発覚するミスは、設計段階で防げたはずの損失。
          <br className="hidden md:block" />
          問題の発生源は、常に「見えていない設計」にあります。
        </p>
      </FadeIn>

      {/* Issue cards — separated by 1px borders */}
      <div className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-3 border-t border-[#64c8b8]/10">
        {ISSUES.map((item, i) => (
          <FadeIn key={item.n} delay={i * 0.14} direction="up">
            <div className="group p-10 md:p-12 border-b md:border-b-0 md:border-r border-[#64c8b8]/10 last:border-0 transition-colors duration-300 hover:bg-white/[0.02]">
              <div
                className="font-serif text-[52px] leading-none mb-5 text-[#64c8b8]/20 group-hover:text-[#64c8b8]/40 transition-colors duration-500"
                aria-hidden="true"
              >
                {item.n}
              </div>
              <h3 className="font-serif text-[17px] font-semibold mb-3 tracking-[0.03em]">
                {item.title}
              </h3>
              <p className="text-[12px] text-white/70 leading-[1.95]">{item.desc}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
