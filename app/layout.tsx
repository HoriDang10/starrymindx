import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import { Header } from "@/compoments/header";
import { Providers  } from "@/compoments/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "STARRY MIND",
  description: "người đồng hành tâm trí của bạn. Lắng nghe và chia sẻ cùng bạn những tâm tư, những cảm xúc mà bạn muốn giãi bày. by Mindx",
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
        <Providers>
        
        {/*header*/}
        <Header/>
        {children}
         
        </Providers>
      </body>
    </html>
  );
}
