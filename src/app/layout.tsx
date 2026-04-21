import type { Metadata } from "next";
import { Geist, Geist_Mono, Red_Hat_Display } from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";

const myFont = localFont({
  src: [
    {
      path: "../../public/fonts/Garet-Book.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Garet-Heavy.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-myfont",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const redHatDisplay = Red_Hat_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Superbuild",
  description: "Superbuild – AI agent directory and automation platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${myFont.variable} h-full antialiased`}
    >
      <body
        className={`${redHatDisplay.className} min-h-full flex flex-col bg-[#000000]`}
      >
        {children}
      </body>
    </html>
  );
}
