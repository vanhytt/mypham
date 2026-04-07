import { Metadata } from "next";
import ProductListClient from "./ProductListClient";

export const metadata: Metadata = {
  title: "Sản Phẩm Mỹ Phẩm Thiên Nhiên Cao Cấp - INSULA",
  description: "Khám phá bộ sưu tập mỹ phẩm thiên nhiên cao cấp từ INSULA. Từ Cushion hoàn hảo đến các dòng chăm sóc da chuyên sâu, mang lại vẻ đẹp nguyên bản và rạng rỡ.",
  keywords: ["mỹ phẩm thiên nhiên", "insula sản phẩm", "skincare cao cấp", "cushion insula", "mỹ phẩm hữu cơ"],
  openGraph: {
    title: "Sản Phẩm Mỹ Phẩm Thiên Nhiên Cao Cấp - INSULA",
    description: "Trải nghiệm những tinh túy từ thiên nhiên kết hợp cùng công nghệ làm đẹp hiện đại. Khám phá các sản phẩm tâm huyết từ INSULA.",
    url: "https://insula.vn/san-pham",
    siteName: "INSULA",
    type: "website",
    images: [
      {
        url: "https://insula.vn/products/meo1.png",
        width: 1200,
        height: 630,
        alt: "INSULA Products"
      }
    ]
  },
};

export default function ProductsPage() {
  return <ProductListClient />;
}
