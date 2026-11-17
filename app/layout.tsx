import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { shop } from "@/config/shop";
import { siteUrl } from "@/lib/format";
import { ogImage } from "@/lib/images";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["600", "700"],
});

const heroOg = ogImage(shop.heroImage || undefined);

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${shop.name} — ${shop.tagline}`,
    template: `%s | ${shop.name}`,
  },
  description: shop.intro,
  openGraph: {
    type: "website",
    siteName: shop.name,
    title: `${shop.name} — ${shop.tagline}`,
    description: shop.intro,
    images: heroOg ? [{ url: heroOg, width: 1200, height: 630 }] : undefined,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#faf7f2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
