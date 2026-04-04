import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Props {
  params: Promise<{ title: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { title } = await params;
  const decodedTitle = decodeURIComponent(title);
  
  const supabase = createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("title, content, image_url")
    .eq("title", decodedTitle)
    .single();

  if (!post) {
    return { title: "Bài viết không tồn tại - INSULA" };
  }

  return {
    title: `${post.title} - INSULA Tin tức`,
    description: post.content.replace(/<[^>]+>/g, '').substring(0, 160),
    openGraph: {
      title: `${post.title} - INSULA Tin tức`,
      images: post.image_url ? [{ url: post.image_url }] : [],
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { title } = await params;
  const decodedTitle = decodeURIComponent(title);

  const supabase = createClient();
  
  // Lấy dữ liệu bài viết
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("title", decodedTitle)
    .single();

  if (error || !post) {
    notFound();
  }

  // Lấy thêm 3 bài viết mới nhất loại trừ bài hiện tại để làm bài liên quan
  const { data: relatedPosts } = await supabase
    .from("posts")
    .select("*")
    .neq("id", post.id)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <div className="min-h-dvh relative overflow-hidden">
      <Header />
      
      {/* Background Decorator Blobs - Homage to homepage */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[#E0E7FF]/60 to-transparent blur-3xl" />
        <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#FCE7F3]/60 to-transparent blur-3xl" />
      </div>

      <main className="max-w-5xl mx-auto px-6 pt-36 lg:pt-48 pb-24 relative z-10">
        <article className="bg-white/80 backdrop-blur-md rounded-[3rem] p-10 md:p-16 lg:p-20 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/50">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#4a7fb5] bg-white/50 border border-white px-5 py-2 rounded-full mb-8 shadow-sm">
              <CalendarDays size={14} />
              <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#1A365D] tracking-tight leading-[1.1] mb-6">
              {post.title}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#A5C4E5] to-transparent mx-auto mt-8 opacity-50" />
          </div>

          {post.image_url && (
            <div className="relative w-full aspect-[16/9] rounded-[2.5rem] overflow-hidden mb-16 shadow-2xl border-4 border-white/30 transform hover:scale-[1.01] transition-transform duration-700">
              <Image 
                src={post.image_url} 
                alt={post.title} 
                fill 
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="max-w-3xl mx-auto">
            <div className="prose prose-xl prose-blue text-[#4a7fb5]/90 font-light leading-relaxed">
              {post.content.split('\n').map((para: string, i: number) => (
                para.trim() && <p key={i} className="mb-8">{para}</p>
              ))}
            </div>
          </div>
        </article>

        {relatedPosts && relatedPosts.length > 0 && (
          <div className="mt-28">
            <div className="flex flex-col items-center mb-12">
              <span className="text-xs uppercase tracking-[0.3em] text-[#4a7fb5] mb-3">Đọc thêm</span>
              <h3 className="text-3xl font-serif text-[#1A365D]">Khám phá tiếp</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map(rp => (
                <Link 
                  key={rp.id} 
                  href={`/news/${encodeURIComponent(rp.title)}`} 
                  className="group flex flex-col bg-white/60 backdrop-blur-sm rounded-[2.5rem] p-6 shadow-sm hover:shadow-2xl transition-all duration-500 border border-white group-hover:-translate-y-2 h-full"
                >
                  <div className="relative w-full aspect-[16/10] rounded-[2rem] overflow-hidden mb-6 shadow-md">
                    {rp.image_url ? (
                      <Image src={rp.image_url} alt={rp.title} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                    ) : (
                      <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                        <span className="text-xs text-gray-300">INSULA</span>
                      </div>
                    )}
                  </div>
                  <h4 className="text-[#1A365D] font-serif text-xl leading-tight mb-3 group-hover:text-[#4a7fb5] transition-colors line-clamp-2">{rp.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-auto">
                    <CalendarDays size={12} />
                    <span>{new Date(rp.created_at).toLocaleDateString('vi-VN')}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
