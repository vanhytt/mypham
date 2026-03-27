import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Cosmetics Brand",
  description: "Đánh thức vẻ đẹp tự nhiên của bạn",
  referrer: "no-referrer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        {/* Watermark logo chìm — cố định, tràn góc trên phải */}
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: '-20%',
            right: '-20%',
            width: '170vw',
            height: '170vw',
            backgroundImage: "url('/logo.png')",
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            backgroundPosition: 'top right',
            filter: 'brightness(100)',
            opacity: 0.05,
            mixBlendMode: 'overlay' as const,
            zIndex: 0,
          }}
        />
        {children}
      </body>
    </html>
  );
}
