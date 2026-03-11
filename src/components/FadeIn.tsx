"use client";
import { useInView } from "@/hooks/useInView";

type Direction = "up" | "left" | "right" | "none";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: Direction;
  className?: string;
}

const transforms: Record<Direction, string> = {
  up:    "translateY(36px)",
  left:  "translateX(-36px)",
  right: "translateX(36px)",
  none:  "none",
};

export default function FadeIn({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: FadeInProps) {
  const [ref, inView] = useInView();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity:    inView ? 1 : 0,
        transform:  inView ? "none" : transforms[direction],
        transition: `opacity 0.85s cubic-bezier(0.22,1,0.36,1) ${delay}s,
                     transform 0.85s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
