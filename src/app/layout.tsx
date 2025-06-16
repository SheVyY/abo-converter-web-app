import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/language-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ABO Converter - Převodník CSV na ABO formát | FIO Banka & Raiffeisenbank",
  description: "Profesionální nástroj pro převod CSV souborů s platbami do bankovního ABO formátu. Podporuje FIO Banku a Raiffeisenbank s ČNB validací účtů v reálném čase. Zdarma, bez registrace.",
  keywords: ["ABO converter", "CSV to ABO", "FIO banka", "Raiffeisenbank", "ČNB validace", "bankovní platby", "převodník"],
  authors: [{ name: "Sebastian Hozak", url: "https://github.com/sebastianhozak" }],
  creator: "Sebastian Hozak",
  publisher: "Sebastian Hozak",
  robots: "index, follow",
  openGraph: {
    title: "ABO Converter - Převodník CSV na ABO formát",
    description: "Profesionální nástroj pro převod CSV souborů s platbami do bankovního ABO formátu pro české banky",
    type: "website",
    locale: "cs_CZ",
    alternateLocale: "en_US",
    siteName: "ABO Converter"
  },
  twitter: {
    card: "summary_large_image",
    title: "ABO Converter - Převodník CSV na ABO formát",
    description: "Profesionální nástroj pro převod CSV souborů s platbami do bankovního ABO formátu pro české banky",
    creator: "@sebastianhozak"
  },
  alternates: {
    canonical: "/",
    languages: {
      "cs": "/",
      "en": "/"
    }
  },
  category: "finance",
  classification: "Banking Tools"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
