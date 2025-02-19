import { Toaster } from "sonner";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Reasoning Preview",
  description:
    "This is a preview of using reasoning models with Next.js and the AI SDK.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
