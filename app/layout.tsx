import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";

import { ClerkProvider } from "@clerk/nextjs";
import { dark, neobrutalism } from "@clerk/themes";
import Footer from "@/components/ui/Footer";
import { Toaster } from "sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Betwise - Bet Wisely",
  description:
    "Betwise is a leading prediction market app where users can make predictions, earn rewards, and join a vibrant community.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://betwise.varekle.tech/",
    title: "Betwise - Bet Wisely",
    description:
      "Betwise is a leading prediction market app where users can make predictions, earn rewards, and join a vibrant community.",
    images: [
      {
        url: "https://betwise.varekle.tech/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Betwise - Bet Wisely",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Betwise - Bet Wisely",
    description:
      "Betwise is a leading prediction market app where users can make predictions, earn rewards, and join a vibrant community.",
    images: ["https://betwise.varekle.tech/twitter-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: [dark, neobrutalism],
      }}
    >
      <html lang="en">
        <head>
          <meta name="apple-mobile-web-app-title" content="MyWebSite" />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background dark flex justify-center align-middle items-center flex-col`}
        >
          <Toaster richColors position="bottom-right" />
          <Navbar />
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
