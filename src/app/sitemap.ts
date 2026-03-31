import { MetadataRoute } from 'next';
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://yuna-cosmetics.vercel.app';

  // 1. Static routes
  const staticRoutes = [
    '',
    '/san-pham',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // 2. Dynamic routes from "Sản phẩm" table
  const { data: p1 } = await supabase.from('Sản phẩm').select('id');
  const dynamicRoutes1 = (p1 || []).map((p) => ({
    url: `${baseUrl}/san-pham/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // 3. Dynamic routes from "list" table
  const { data: p2 } = await supabase.from('list').select('id');
  const dynamicRoutes2 = (p2 || []).map((p) => ({
    url: `${baseUrl}/san-pham/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Combine and de-duplicate by URL
  const allRoutes = [...staticRoutes, ...dynamicRoutes1, ...dynamicRoutes2];
  const uniqueRoutes = Array.from(new Map(allRoutes.map((r) => [r.url, r])).values());

  return uniqueRoutes;
}
