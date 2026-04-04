"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { ArrowRight, CalendarDays } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const supabase = createClient();

interface Post {
  id: number;
  title: string;
  content: string;
  image_url: string;
  created_at: string;
}

export default function NewsListPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setPosts(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="min-h-dvh">
      <Header />

      <main className="max-w-7xl mx-auto px-6 lg:px-24 pt-32 pb-16">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-[#4a7fb5] font-medium mb-3 block">Tin Tức & Sự Kiện</span>
          <h1 className="text-4xl lg:text-5xl font-serif text-[#1A365D] tracking-tight">Câu Chuyện Vẻ Đẹp</h1>
          <p className="mt-4 text-[#4a7fb5] max-w-2xl mx-auto font-light leading-relaxed">
            Khám phá những kiến thức làm đẹp, mẹo chăm sóc da và những cập nhật mới nhất từ INSULA.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-10 h-10 border-2 border-[#1A365D] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[2.5rem] shadow-sm">
            <p className="text-xl font-serif text-[#1A365D]">Chưa có bài viết nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="bg-white rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-white/60 group flex flex-col h-full"
              >
                <Link href={`/news/${encodeURIComponent(post.title)}`} className="block relative aspect-[16/10] overflow-hidden">
                  {post.image_url ? (
                    <Image
                      src={post.image_url}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      priority={index < 4}
                      loading={index < 4 ? 'eager' : 'lazy'}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                      <span className="text-sm tracking-widest text-[#1A365D]/30 uppercase font-serif">INSULA</span>
                    </div>
                  )}
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>
                
                <div className="p-6 md:p-8 flex flex-col flex-1 bg-white/40 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-xs text-[#4a7fb5] mb-3">
                    <CalendarDays size={14} />
                    <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                  </div>
                  
                  <Link href={`/news/${encodeURIComponent(post.title)}`} className="block group/title">
                    <h3 className="text-xl font-serif text-[#1A365D] mb-3 line-clamp-2 leading-snug group-hover/title:text-[#4a7fb5] transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                  
                  <p className="text-[#4a7fb5]/80 text-sm line-clamp-3 leading-relaxed mb-6 font-light">
                    {post.content.replace(/<[^>]+>/g, '').substring(0, 150)}...
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <Link href={`/news/${encodeURIComponent(post.title)}`} className="inline-flex items-center text-sm font-semibold tracking-wide text-[#1A365D] hover:text-[#4a7fb5] transition-colors gap-1.5 group/btn">
                      ĐỌC TIẾP
                      <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
