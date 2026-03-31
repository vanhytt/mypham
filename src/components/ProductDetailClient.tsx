"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Leaf, Star, CircleUser, ArrowLeft, ShieldCheck, Heart, Loader2 } from "lucide-react";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, Thumbs } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

interface Product {
  id?: string | number;
  Name?: string;
  ten_sp?: string; // Support both tables
  gia?: number;
  image_url?: string;
  anh_url?: string; // Support both tables
  anh1?: string;
  anh2?: string;
  anh3?: string;
  anh4?: string;
  mo_ta?: string;
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [reviewText, setReviewText] = useState("");
  const [reviewName, setReviewName] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);

  const name = product.Name || product.ten_sp || "Sản phẩm";
  const mainImage = product.image_url || product.anh_url;
  const imgs = [
    mainImage,
    product.anh1,
    product.anh2,
    product.anh3,
    product.anh4,
  ].filter(Boolean) as string[];

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    setIsReviewSubmitting(true);
    setReviewSuccess(false);
    try {
      const REVIEW_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwrJuxPHtT0z1atVMDhh-tY3Cys7cRyV50-G2H1zzlYlmtjr8Mzp6agfEbnKGbOIEH4/exec';
      await fetch(REVIEW_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'review',
          name: reviewName.trim() || 'Khách hàng ẩn danh',
          comment: reviewText.trim(),
          productName: name,
        })
      });
      setReviewSuccess(true);
      setReviewText('');
      setReviewName('');
      setTimeout(() => setReviewSuccess(false), 4000);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsReviewSubmitting(false);
    }
  };

  const renderImage = (src: string, index: number) => (
    <div className="relative w-full h-full group overflow-hidden">
      <img
        src={src}
        alt={`${name} - View ${index + 1}`}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-[#A5C4E5]/20 px-4 md:px-8 py-4 flex items-center justify-between">
        <Link href="/san-pham" className="flex items-center gap-2 text-[#1A365D] hover:text-[#A5C4E5] transition-colors group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs uppercase tracking-widest font-bold">Quay lại</span>
        </Link>
        <div className="font-serif text-xl tracking-widest text-[#1A365D]">INSULA</div>
        <div className="w-20 hidden md:block" />
      </nav>

      <main className="max-w-[1400px] mx-auto px-4 md:px-8 pt-24 pb-20">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-[#A5C4E5]/10 lg:flex lg:h-[calc(100vh-160px)] lg:min-h-[700px]">
          
          <div className="lg:w-1/2 bg-[#F1F5F9] relative flex flex-col p-4 md:p-8">
            <div className="flex-1 min-h-[400px] md:min-h-[500px] relative rounded-3xl overflow-hidden shadow-inner bg-white/50 backdrop-blur-sm border border-white/50">
              {imgs.length === 1 ? (
                <div className="w-full h-full flex items-center justify-center">
                  {renderImage(imgs[0], 0)}
                </div>
              ) : (
                <>
                  <style>{`
                    .swiper-detail-wrap { height: 100%; width: 100%; }
                    .swiper-detail-wrap .swiper,
                    .swiper-detail-wrap .swiper-wrapper,
                    .swiper-detail-wrap .swiper-slide { height: 100%; width: 100%; }
                    .swiper-detail-wrap .swiper-button-prev,
                    .swiper-detail-wrap .swiper-button-next { color: #1A365D !important; width: 50px; height: 50px; }
                    .swiper-detail-wrap .swiper-button-prev::after,
                    .swiper-detail-wrap .swiper-button-next::after { font-size: 24px !important; font-weight: 900 !important; }
                    .swiper-detail-wrap .swiper-pagination-bullet { background: #A5C4E5; opacity: 0.5; }
                    .swiper-detail-wrap .swiper-pagination-bullet-active { background: #2B547E; opacity: 1; }
                  `}</style>
                  <Swiper
                    modules={[Autoplay, Pagination, Navigation, Thumbs]}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    loop={imgs.length > 1}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    navigation={true}
                    className="swiper-detail-wrap"
                  >
                    {imgs.map((src, i) => (
                      <SwiperSlide key={i}>
                        {renderImage(src, i)}
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </>
              )}
            </div>

            {imgs.length > 1 && (
              <div className="w-full mt-6 px-1">
                <style>{`
                   .thumb-swiper-wrap { height: 80px; width: 100%; }
                   .thumb-swiper-wrap .swiper-slide { 
                     opacity: 0.5; transition: all 0.3s; border: 2px solid transparent; 
                     border-radius: 1rem; overflow: hidden; cursor: pointer;
                   }
                   .thumb-swiper-wrap .swiper-slide-thumb-active { opacity: 1; border-color: #A5C4E5; }
                   .thumb-swiper-wrap img { width: 100%; height: 100%; object-fit: cover; }
                `}</style>
                <Swiper
                  onSwiper={setThumbsSwiper}
                  spaceBetween={12}
                  slidesPerView={4}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[Navigation, Thumbs]}
                  className="thumb-swiper-wrap"
                >
                  {imgs.map((src, i) => (
                    <SwiperSlide key={i}>
                      <img src={src} alt="Thumbnail view" />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>

          <div className="lg:w-1/2 flex flex-col p-8 md:p-12 lg:p-16 overflow-y-auto custom-scrollbar">
            <div className="max-w-xl">
              <h1 className="text-3xl md:text-5xl font-serif text-[#1A365D] font-semibold leading-tight mb-6">
                {name}
              </h1>

              <div className="flex items-center gap-6 mb-10 pb-10 border-b border-[#A5C4E5]/20">
                <div className="text-2xl md:text-3xl font-bold text-[#1A365D] tracking-tight">
                  {product.gia ? Number(product.gia).toLocaleString('vi-VN') + ' đ' : 'Liên hệ'}
                </div>
                <div className="flex items-center gap-1 bg-[#A5C4E5]/10 px-3 py-1 rounded-full">
                  <ShieldCheck size={14} className="text-[#A5C4E5]" />
                  <span className="text-[10px] uppercase font-bold text-[#1A365D] tracking-wider">Chính hãng</span>
                </div>
              </div>

              <div className="mb-12">
                <h4 className="text-xs uppercase tracking-widest text-[#4a7fb5] font-bold mb-4">Thông tin sản phẩm</h4>
                <p className="text-[#2B547E] text-base md:text-lg leading-relaxed whitespace-pre-line">
                  {product.mo_ta || "Đang cập nhật mô tả cho tuyệt phẩm này..."}
                </p>
              </div>

              {/* Reviews Section */}
              <div className="border-t border-[#A5C4E5]/20 pt-12">
                <div className="flex items-center justify-between mb-8">
                  <h4 className="text-sm uppercase tracking-widest text-[#1A365D] font-bold">Đánh giá khách hàng</h4>
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-[#A5C4E5]/10">
                    <span className="text-[#C5A059] font-bold text-xl">4.8</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={14} className={star === 5 ? "text-[#C5A059]/30 fill-[#C5A059]/30" : "text-[#C5A059] fill-[#C5A059]"} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Form */}
                <div className="bg-[#F1F5F9]/50 rounded-[2rem] p-8 border border-[#A5C4E5]/20">
                  <h4 className="text-sm uppercase tracking-widest text-[#1A365D] font-bold mb-6">Gửi đánh giá</h4>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <input
                      type="text"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="Tên của bạn"
                      className="w-full bg-white border border-[#A5C4E5]/20 rounded-2xl px-6 py-4 text-sm text-[#1A365D] placeholder-[#1A365D]/40 focus:outline-none focus:ring-2 focus:ring-[#A5C4E5]/50 transition-all shadow-sm"
                    />
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Chia sẻ trải nghiệm..."
                      className="w-full min-h-[120px] bg-white border border-[#A5C4E5]/20 rounded-2xl p-6 text-sm text-[#1A365D] placeholder-[#1A365D]/40 focus:outline-none focus:ring-2 focus:ring-[#A5C4E5]/50 transition-all resize-none shadow-sm"
                    />
                    {reviewSuccess && (
                      <div className="flex items-center gap-3 text-sm font-bold text-[#1A365D] bg-green-50 rounded-2xl px-6 py-4 border border-green-100">
                        <span>✅</span> Cảm ơn bạn!
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={isReviewSubmitting || !reviewText.trim()}
                      className="w-full py-5 bg-[#A5C4E5] hover:bg-[#8eb3db] disabled:bg-gray-200 text-[#1A365D] font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3"
                    >
                      {isReviewSubmitting ? <Loader2 size={20} className="animate-spin" /> : "Gửi đánh giá ngay"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #A5C4E533; border-radius: 10px; }
      `}</style>
    </div>
  );
}
