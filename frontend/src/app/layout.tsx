import type { Metadata, Viewport } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0a0f",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "🎂 Alles Gute zum Geburtstag!",
  description:
    "Eine besondere Geburtstagsüberraschung für dich! Hier findest du unsere Erinnerungen und Glückwünsche.",
  keywords: ["Geburtstag", "Überraschung", "Feier", "Erinnerungen"],
};


export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="de"
      className={`${outfit.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
