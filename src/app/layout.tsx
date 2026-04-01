import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

import FloatingContact from "@/components/FloatingContact";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "INSULA | Mỹ phẩm hữu cơ & Thiên nhiên cao cấp",
  description: "Khám phá bộ sưu tập mỹ phẩm hữu cơ INSULA - Tự nhiên, lành tính và mang lại vẻ đẹp thuần khiết cho làn da bạn. Chăm sóc sắc đẹp bền vững từ tinh túy đất trời.",
  keywords: ["mỹ phẩm hữu cơ", "my pham thien nhien", "insula", "skincare organic", "làm đẹp tự nhiên"],
  referrer: "no-referrer",
  openGraph: {
    title: "INSULA | Mỹ phẩm hữu cơ & Thiên nhiên cao cấp",
    description: "Đánh thức vẻ đẹp tự nhiên với dòng mỹ phẩm hữu cơ thuần khiết nhất.",
    url: "https://yuna-cosmetics.vercel.app",
    siteName: "INSULA",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/products/meo1.png",
        width: 1200,
        height: 630,
        alt: "INSULA Cosmetics"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "INSULA | Mỹ phẩm hữu cơ & Thiên nhiên cao cấp",
    description: "Đánh thức vẻ đẹp tự nhiên với dòng mỹ phẩm hữu cơ thuần khiết nhất.",
    images: ["/products/meo1.png"],
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        {/* Background is handled cleanly by globals.css without watermark */}
        {children}
        <FloatingContact />
      </body>
    </html>
  );
}
