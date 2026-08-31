import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "SkillMap: Learn what the market demands",
  description:
    "A demand-driven learning platform for marketing skills. Explore the skill heatmap, browse courses, and grow your career.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      // Browser extensions inject attributes onto <html> before React hydrates.
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-canvas">{children}</body>
    </html>
  );
}
