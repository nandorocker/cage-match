import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cage Match",
  icons: {
    icon: [
      {
        url: "/favicon-16x16.ico",
        sizes: "16x16",
        type: "image/x-icon"
      },
      {
        url: "/favicon-32x32.ico",
        sizes: "32x32",
        type: "image/x-icon"
      }
    ]
  },
  description: "The ultimate site for Nicolas Cage rankings, watchlists, and deep dives",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
