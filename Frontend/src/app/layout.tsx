"use client";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Wrapper } from "../components/Wrapper";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode | React.JSX.Element;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Wrapper>{children}</Wrapper>
      </body>
    </html>
  );
}
