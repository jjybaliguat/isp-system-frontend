import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/providers";
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sierra Communication Inc. | Fast & Reliable Internet Solutions",
  description:
    "Sierra Communication Inc. delivers high-speed, reliable, and affordable internet connectivity for homes and businesses. Experience seamless browsing, streaming, and productivity with our trusted network services.",
  keywords: [
    "Sierra Communication Inc.",
    "internet provider",
    "fiber internet",
    "business internet solutions",
    "home internet",
    "reliable internet Philippines",
    "high-speed internet",
    "ISP",
  ],
  authors: [{ name: "Sierra Communication Inc." }],
  openGraph: {
    title: "Sierra Communication Inc. | Fast & Reliable Internet Solutions",
    description:
      "Stay connected with Sierra Communication Inc.—your trusted provider of high-speed and reliable internet services.",
    type: "website",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Analytics />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
            {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
