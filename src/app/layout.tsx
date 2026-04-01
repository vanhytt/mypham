import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import Script from "next/script";

const inter = Inter({ subsets: ["vietnamese"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({ subsets: ["vietnamese"], variable: "--font-playfair", display: "swap" });

const DynamicFloatingContact = dynamic(() => import("@/components/FloatingContact"), { ssr: false });

export const metadata: Metadata = {
  title: "INSULA | Vẻ đẹp nguyên bản",
  description: "Cushion cao cấp giúp che phủ hoàn hảo và tôn vinh làn da của bạn.",
  openGraph: {
    title: "INSULA | Vẻ đẹp nguyên bản",
    description: "Cushion cao cấp giúp che phủ hoàn hảo và tôn vinh làn da của bạn.",
    url: "https://insula.vn",
    images: [
      {
        url: "/products/meo1.png",
        width: 1200,
        height: 630,
        alt: "INSULA Cushion"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "INSULA | Vẻ đẹp nguyên bản",
    description: "Cushion cao cấp giúp che phủ hoàn hảo và tôn vinh làn da của bạn.",
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
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-N1F4KK2M03`}
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-N1F4KK2M03');
          `}
        </Script>
      </body>
    </html>
  );
}
