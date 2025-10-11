"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/shared/providers/theme-provider";
import { TanstackQueryProvider } from "@/shared/providers/tanstack-query-provider";
import { Gatekeeper } from "./gatekeeper";

import Navbar from "@/widgets/navbar/ui/navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Trading App",
  description: "Your Trading Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased h-screen dark`}>
        <TanstackQueryProvider>
          <ThemeProvider
            attribute={"class"}
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Gatekeeper>
              <main className="flex flex-col h-screen justify-between">
                {children}
                <Navbar />
              </main>
            </Gatekeeper>
          </ThemeProvider>
        </TanstackQueryProvider>
      </body>
    </html>
  );
}
