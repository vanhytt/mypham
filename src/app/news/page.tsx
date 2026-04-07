import { Metadata } from "next";
import NewsListClient from "./NewsListClient";

export const metadata: Metadata = {
  title: "Tin Tức & Bí Quyết Làm Đẹp - INSULA",
  description: "Cập nhật những xu hướng làm đẹp mới nhất, mẹo chăm sóc da khoa học và câu chuyện thương hiệu từ INSULA. Kiến thức chuyên sâu cho làn da rạng rỡ.",
  keywords: ["tin tức làm đẹp", "mẹo chăm sóc da", "insula news", "bí quyết skincare", "insula blog"],
  openGraph: {
    title: "Tin Tức & Bí Quyết Làm Đẹp - INSULA",
    description: "Khám phá thế giới làm đẹp tinh tế tại INSULA. Nơi chia sẻ kiến thức chăm sóc da chuyên sâu và những câu chuyện truyền cảm hứng.",
    url: "https://insula.vn/news",
    siteName: "INSULA",
    type: "website",
  },
};

export default function NewsPage() {
  return <NewsListClient />;
}
