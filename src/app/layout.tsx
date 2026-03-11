import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AST DESIGN ─ 手戻りのない設備設計",
  description: "設備設計の手戻りを、設計段階で消す。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
