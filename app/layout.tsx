import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quant Dashboard - Glass OS",
  description: "Advanced Quant Subscription & Fund Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body
        className={`${outfit.variable} antialiased font-sans bg-background text-foreground overflow-x-hidden flex`}
      >
        <Sidebar />
        <main className="flex-1 ml-20 md:ml-64 relative min-h-screen">
          {/* Background Orbs */}
          <div className="fixed top-10 right-10 w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl pointer-events-none -z-10 animate-orb-float"></div>
          <div className="fixed bottom-10 left-64 w-80 h-80 bg-brand-accent/15 rounded-full blur-3xl pointer-events-none -z-10 animate-orb-float" style={{ animationDelay: '2s' }}></div>

          <div className="p-6 md:p-10 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
