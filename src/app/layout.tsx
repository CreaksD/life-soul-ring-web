import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Soul Ring Life Engine",
  description:
    "Map life configuration into a nine-ring growth system with scores, risks, and action paths.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
