import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";

const inter = Inter({ subsets: ["vietnamese"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({ subsets: ["vietnamese"], variable: "--font-playfair", display: "swap" });

const DynamicFloatingContact = dynamic(() => import("@/components/FloatingContact"), { ssr: false });

export const metadata: Metadata = {
  title: "INSULA | Thương hiệu mỹ phẩm thiên nhiên cao cấp",
  description: "INSULA chuyên cung cấp các dòng mỹ phẩm làm đẹp, nổi bật với INSULA Cushion che phủ hoàn hảo, mỏng nhẹ tự nhiên. Khám phá ngay!",
  keywords: [
    "insula",
    "insula mỹ phẩm",
    "mỹ phẩm insula",
    "insula cushion",
    "cushion insula",
    "mỹ phẩm thiên nhiên"
  ],
  referrer: "no-referrer",
  openGraph: {
    title: "INSULA | Thương hiệu mỹ phẩm thiên nhiên cao cấp",
    description: "INSULA chuyên cung cấp các dòng mỹ phẩm làm đẹp, nổi bật với INSULA Cushion che phủ hoàn hảo, mỏng nhẹ tự nhiên. Khám phá ngay!",
    siteName: "INSULA",
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
    title: "INSULA | Thương hiệu mỹ phẩm thiên nhiên cao cấp",
    description: "INSULA chuyên cung cấp các dòng mỹ phẩm làm đẹp, nổi bật với INSULA Cushion che phủ hoàn hảo, mỏng nhẹ tự nhiên. Khám phá ngay!",
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
        <DynamicFloatingContact />
      </body>
    </html>
  );
}
