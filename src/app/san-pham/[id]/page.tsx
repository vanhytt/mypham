import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import ProductDetailClient from "@/components/ProductDetailClient";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  // Use "list" table as the primary source for all products
  const { data, error } = await supabase
    .from("list")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching product from 'list':", error);
    return null;
  }

  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: "Sản phẩm không tồn tại - INSULA",
    };
  }

  const name = product.ten_sp || "Sản phẩm";
  const desc = product.mo_ta || "Khám phá sản phẩm làm đẹp từ thiên nhiên cao cấp tại INSULA.";
  const image = product.anh_url || "/og-image.png";

  return {
    title: `${name} - INSULA | Mỹ Phẩm Thiên Nhiên`,
    description: desc.substring(0, 160),
    openGraph: {
      title: `${name} - INSULA`,
      description: desc.substring(0, 160),
      images: [{ url: image }],
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const name = product.Name || product.ten_sp || "Sản phẩm";
  const desc = product.mo_ta || "";
  const price = product.gia || 0;
  const image = product.image_url || product.anh_url || "/og-image.png";

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "image": image,
    "description": desc,
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": "VND",
      "availability": "https://schema.org/InStock",
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "24",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={product} />
    </>
  );
}
