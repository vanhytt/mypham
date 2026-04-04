import { MetadataRoute } from 'next';
import { createClient } from '@/utils/supabase/server';

const BASE_URL = 'https://insula.vn';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();

  // ── Fetch slugs bài viết tin tức từ Supabase ─────────────────────────────
  const { data: posts } = await supabase
    .from('posts')
    .select('title, created_at')
    .order('created_at', { ascending: false });

  const newsUrls: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
    url: `${BASE_URL}/news/${encodeURIComponent(post.title)}`,
    lastModified: new Date(post.created_at),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // ── Fetch ID sản phẩm từ Supabase ─────────────────────────────────────────
  const { data: products } = await supabase
    .from('list')
    .select('id, updated_at');

  const productUrls: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
    url: `${BASE_URL}/san-pham/${p.id}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // ── Các trang tĩnh ───────────────────────────────────────────────────────
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/san-pham`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  return [...staticUrls, ...productUrls, ...newsUrls];
}
