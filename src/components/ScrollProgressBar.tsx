"use client";
import { useScrollProgress } from "@/hooks/useInView";

export default function ScrollProgressBar() {
  const progress = useScrollProgress();
  return (
    <div className="fixed top-0 left-0 right-0 z-[200] h-[2px] bg-transparent">
      <div
        className="h-full bg-[#64c8b8] origin-left transition-transform duration-100 ease-out"
        style={{ transform: `scaleX(${progress / 100})` }}
      />
    </div>
  );
}
