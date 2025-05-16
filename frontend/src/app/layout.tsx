import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "シンプル家計簿",
  description: "シンプルな家計簿アプリです",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="bg-white">
        {children}
      </body>
    </html>
  );
}
