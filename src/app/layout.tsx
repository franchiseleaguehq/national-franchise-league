import type { Metadata, Viewport } from "next";
import { Inter, Oswald } from "next/font/google";

import { PwaShell } from "@/components/pwa-shell";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  applicationName: "National Franchise League",
  title: "National Franchise League",
  description:
    "The premium broadcast home of the National Franchise League, a competitive Madden franchise league played on PlayStation 5.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NFL",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/league-logo.png", type: "image/png" },
    ],
    apple: [
      { url: "/league-logo.png", type: "image/png" },
    ],
    shortcut: ["/league-logo.png"],
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#00A3FF" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${oswald.variable} font-sans`}>
        {children}
        <PwaShell />
      </body>
    </html>
  );
}
