"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, Leaf, Star, CircleUser, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, Thumbs } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

interface Product {
  id: number | string;
  ten_sp: string;
  gia: number;
  danh_muc?: string;
  anh_url: string;
  anh1?: string;
  anh2?: string;
  anh3?: string;
  anh4?: string;
  anh5?: string;
  anh6?: string;
  anh7?: string;
  anh8?: string;
  anh9?: string;
  anh10?: string;
  mo_ta?: string;
}

const CATEGORIES = ["Tất cả", "Chăm sóc da", "Trang điểm", "Nước hoa", "Bộ quà tặng"];
const PRICE_RANGES = [
  { label: "Tất cả mức giá", min: 0, max: Infinity },
  { label: "Dưới 500.000 đ", min: 0, max: 500000 },
  { label: "500.000 - 1.000.000 đ", min: 500000, max: 1000000 },
  { label: "Trên 1.000.000 đ", min: 1000000, max: Infinity },
];

export default function ProductListingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");
  const [selectedPriceRange, setSelectedPriceRange] = useState<number>(0);

  // Review form states
  const [reviewText, setReviewText] = useState("");
  const [reviewName, setReviewName] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);

  // Consultation form states
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwrJuxPHtT0z1atVMDhh-tY3Cys7cRyV50-G2H1zzlYlmtjr8Mzp6agfEbnKGbOIEH4/exec';
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      setSubmitSuccess(true);
      setFormData({ name: "", phone: "", email: "" });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error("Lỗi gửi form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          productName: selectedProduct?.ten_sp || '',
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

  const fetchProducts = useCallback(async (isMounted: boolean) => {
    if (!supabase) {
      console.error("Chưa cấu hình biến môi trường Supabase!");
      setErrorMsg("Chưa cấu hình biến môi trường Supabase!");
      if (isMounted) setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      const { data, error } = await supabase
        .from("list")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Lỗi khi fetch dữ liệu từ Supabase:", error);
        setErrorMsg("Lỗi kết nối Database");
      } else if (data && isMounted) {
        setProducts(data);
      }
    } catch (err) {
      console.error("Có lỗi xảy ra trong quá trình kết nối Supabase:", err);
      setErrorMsg("Lỗi kết nối Database");
    } finally {
      if (isMounted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetchProducts(isMounted);
    return () => { isMounted = false; };
  }, [fetchProducts]);

  const filteredProducts = products.filter(p => {
    const matchCategory = selectedCategory === "Tất cả" ? true : p.danh_muc === selectedCategory;
    const matchPrice = p.gia >= PRICE_RANGES[selectedPriceRange].min && p.gia <= PRICE_RANGES[selectedPriceRange].max;
    return matchCategory && matchPrice;
  });

  return (
    <div className="min-h-screen text-[#1A365D]">
      {/* Simple Navigation Header */}
      <header className="w-full bg-white/20 backdrop-blur-xl border-b border-white/40 shadow-sm py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="INSULA Logo"
              width={140}
              height={44}
              className="h-8 lg:h-11 w-auto object-contain"
              style={{ filter: 'brightness(0)' }}
              priority
            />
          </Link>
          <div className="hidden md:flex gap-8">
            <Link href="/" className="text-sm font-medium uppercase tracking-widest text-[#1A365D]/70 hover:text-[#1A365D] transition-colors">
              Trang chủ
            </Link>
            <span className="text-sm font-medium uppercase tracking-widest text-[#1A365D] border-b border-[#1A365D] pb-1">
              Sản phẩm
            </span>
            <Link href="/news" className="text-sm font-medium uppercase tracking-widest text-[#1A365D]/70 hover:text-[#1A365D] transition-colors">
              Tin tức
            </Link>
          </div>
          <button
            className="md:hidden p-2 bg-[#A5C4E5]/20 rounded-full text-[#705E4C] hover:bg-[#A5C4E5]/40 transition-colors"
            onClick={() => setMobileFilterOpen(true)}
          >
            <Filter size={20} />
          </button>
        </div>
      </header>

      {/* Page Header */}
      <div className="w-full bg-[#D1E9FF]/30 py-16 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#E0E7FF]/40 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center relative z-10 lg:animate-fade-in-up">
          <h1 className="text-4xl lg:text-5xl font-serif text-[#1A365D] tracking-tight mb-4">Bộ Sưu Tập</h1>
          <p className="text-[#4a7fb5] text-base font-light max-w-lg mx-auto leading-relaxed">
            Khám phá các sản phẩm tinh túy được chắt lọc từ thiên nhiên, đem đến cho bạn luồng gió mới của vẻ đẹp nguyên bản.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filter (Desktop) */}
        <aside className="hidden lg:block w-1/4 shrink-0 space-y-12 shrink-0">
          <div>
            <h3 className="text-lg font-serif font-semibold text-[#1A365D] mb-6 uppercase tracking-widest flex items-center gap-2">
              <span className="w-4 h-px bg-[#A5C4E5]"></span>
              Danh Mục
            </h3>
            <div className="space-y-4">
              {CATEGORIES.map(cat => (
                <label
                  key={cat}
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => setSelectedCategory(cat)}
                >
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-300 ${selectedCategory === cat ? 'bg-[#A5C4E5] border-[#A5C4E5]' : 'border-[#A5C4E5]/40 group-hover:border-[#A5C4E5]'}`}>
                    {selectedCategory === cat && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                  </div>
                  <span className={`text-base transition-colors duration-300 ${selectedCategory === cat ? 'text-[#1A365D] font-medium' : 'text-[#4a7fb5] group-hover:text-[#1A365D]'}`}>
                    {cat}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-serif font-semibold text-[#1A365D] mb-6 uppercase tracking-widest flex items-center gap-2">
              <span className="w-4 h-px bg-[#A5C4E5]"></span>
              Khoảng Giá
            </h3>
            <div className="space-y-4">
              {PRICE_RANGES.map((range, idx) => (
                <label
                  key={range.label}
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => setSelectedPriceRange(idx)}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 ${selectedPriceRange === idx ? 'bg-[#A5C4E5] border-[#A5C4E5]' : 'border-[#A5C4E5]/40 group-hover:border-[#A5C4E5]'}`}>
                    {selectedPriceRange === idx && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className={`text-base transition-colors duration-300 ${selectedPriceRange === idx ? 'text-[#1A365D] font-medium' : 'text-[#4a7fb5] group-hover:text-[#1A365D]'}`}>
                    {range.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Mobile Filter Popup */}
        <AnimatePresence>
          {mobileFilterOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex"
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />

              {/* Drawer */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                className="relative ml-auto w-4/5 max-w-sm h-full bg-white/80 backdrop-blur-xl shadow-2xl overflow-y-auto z-10 flex flex-col border-l border-[#A5C4E5]/30"
              >
                <div className="flex items-center justify-between p-6 border-b border-[#A5C4E5]/30">
                  <h2 className="text-xl font-serif text-[#1A365D]">Bộ Lọc</h2>
                  <button onClick={() => setMobileFilterOpen(false)} className="p-2 bg-[#A5C4E5]/20 rounded-full text-[#1A365D] shadow-sm hover:scale-105 active:scale-95 transition-transform">
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6 space-y-10 flex-1">
                  <div>
                    <h3 className="text-base font-serif font-semibold text-[#1A365D] mb-5 uppercase tracking-widest">Danh Mục</h3>
                    <div className="space-y-4">
                      {CATEGORIES.map(cat => (
                        <label key={cat} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="mobile-cat"
                            checked={selectedCategory === cat}
                            onChange={() => setSelectedCategory(cat)}
                            className="w-5 h-5 accent-[#A5C4E5]"
                          />
                          <span className={`text-base ${selectedCategory === cat ? 'text-[#1A365D] font-medium' : 'text-[#4a7fb5]'}`}>
                            {cat}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-serif font-semibold text-[#1A365D] mb-5 uppercase tracking-widest">Khoảng Giá</h3>
                    <div className="space-y-4">
                      {PRICE_RANGES.map((range, idx) => (
                        <label key={range.label} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="mobile-price"
                            checked={selectedPriceRange === idx}
                            onChange={() => setSelectedPriceRange(idx)}
                            className="w-5 h-5 accent-[#A5C4E5]"
                          />
                          <span className={`text-base ${selectedPriceRange === idx ? 'text-[#1A365D] font-medium' : 'text-[#4a7fb5]'}`}>
                            {range.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white/50 border-t border-[#A5C4E5]/30 sticky bottom-0">
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="w-full py-4 bg-[#A5C4E5] hover:bg-[#8BB8DC] transition-colors text-white rounded-xl uppercase tracking-widest font-medium text-sm shadow-[0_0_15px_rgba(165,196,229,0.5)]"
                  >
                    Xem {filteredProducts.length} Kết quả
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Grid (75%) */}
        <div className="w-full lg:w-3/4">
          <div className="mb-6 flex items-center justify-between text-sm text-[#4a7fb5]">
            <p>Đang hiển thị <span className="font-medium text-[#1A365D]">{filteredProducts.length}</span> sản phẩm</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white/30 backdrop-blur-xl rounded-3xl overflow-hidden shadow-sm flex flex-col h-full animate-pulse border border-[#A5C4E5]/30">
                  <div className="w-full aspect-[3/4] bg-[#D1E9FF]/40" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-[#D1E9FF]/60 rounded-md w-3/4" />
                    <div className="h-4 bg-[#D1E9FF]/60 rounded-md w-full" />
                    <div className="h-4 bg-[#D1E9FF]/60 rounded-md w-5/6" />
                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#A5C4E5]/30">
                      <div className="h-5 bg-[#D1E9FF]/60 rounded-md w-1/3" />
                      <div className="h-8 bg-[#A5C4E5]/40 rounded-full w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : errorMsg ? (
            <div className="w-full py-32 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-dashed border-red-200">
              <h3 className="text-xl font-serif text-red-500 mb-2 font-medium">{errorMsg}</h3>
              <p className="text-[#8c8273] text-sm mt-2">Vui lòng kiểm tra lại cấu hình Supabase (.env.local) hoặc đường truyền mạng.</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 items-stretch">
              {filteredProducts.map((product, idx) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  key={`${product.id}-${selectedCategory}-${selectedPriceRange}`}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                  className="group relative bg-[#FAF9F6]/90 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-xl shadow-blue-500/10 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 cursor-pointer flex flex-col h-full border border-white/60"
                >
                  <div className="relative w-full aspect-square overflow-hidden bg-[#A5C4E5]/20 backdrop-blur-xl border-b border-white/50">
                    {product.anh_url ? (
                      <Image
                        src={product.anh_url}
                        alt={product.ten_sp}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Leaf size={40} className="text-[#A5C4E5]" />
                      </div>
                    )}

                    {/* Category badge */}
                    {product.danh_muc && (
                      <div className="absolute top-4 left-4 bg-white/40 backdrop-blur-md rounded-full px-3 py-1 text-[10px] uppercase tracking-wider text-[#1A365D] font-medium shadow-sm border border-white/50">
                        {product.danh_muc}
                      </div>
                    )}
                  </div>

                  {/* Text content */}
                  <div className="flex flex-col flex-1 p-6">
                    <h3 className="font-serif text-lg text-[#1A365D] font-semibold leading-snug mb-1.5 group-hover:text-[#2B547E] transition-colors duration-300 line-clamp-2">
                      {product.ten_sp}
                    </h3>
                    {product.mo_ta && (
                      <p className="text-sm text-[#4a7fb5] font-light line-clamp-2 leading-relaxed mt-1">
                        {product.mo_ta}
                      </p>
                    )}

                    <div className="flex-1" />

                    <div className="flex items-center justify-between pt-4 border-t border-[#A5C4E5]/30 mt-4">
                      <span className="text-base font-semibold text-[#1A365D] tracking-tight shrink-0 mr-2">
                        {Number(product.gia).toLocaleString('vi-VN')} đ
                      </span>

                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="shrink-0 flex items-center gap-1.5 bg-[#A5C4E5] text-white text-xs uppercase tracking-widest px-4 py-2 rounded-full hover:bg-[#8BB8DC] transition-all duration-300 font-medium shadow-[0_0_15px_rgba(165,196,229,0.3)] group-hover:shadow-[0_0_20px_rgba(165,196,229,0.8)] active:scale-95 whitespace-nowrap"
                      >
                        Chi tiết
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="w-full py-32 flex flex-col items-center justify-center text-center bg-white/30 backdrop-blur-xl rounded-3xl border border-dashed border-[#A5C4E5]/50">
              <div className="w-16 h-16 rounded-full bg-[#D1E9FF]/40 flex items-center justify-center mb-4">
                <Leaf size={28} className="text-[#4a7fb5]" />
              </div>
              <h3 className="text-xl font-serif text-[#1A365D] mb-2 font-medium">Không tìm thấy sản phẩm</h3>
              <p className="text-[#4a7fb5] text-sm">Vui lòng điều chỉnh lại bộ lọc để xem bộ kết quả khác.</p>
              <button
                onClick={() => { setSelectedCategory("Tất cả"); setSelectedPriceRange(0); }}
                className="mt-6 px-8 py-3 border border-[#A5C4E5] text-[#1A365D] rounded-full hover:bg-[#A5C4E5] hover:text-white transition-colors text-xs uppercase tracking-widest font-medium"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── PRODUCT DETAIL MODAL ─────────────────────────────── */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8"
          >
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-[#1A365D]/40 backdrop-blur-sm"
              onClick={() => setSelectedProduct(null)}
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 24 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative z-10 bg-[#FAF9F6]/90 backdrop-blur-2xl rounded-[1.5rem] shadow-2xl shadow-blue-500/10 w-[95%] sm:w-full max-w-5xl max-h-[90vh] overflow-y-auto md:overflow-hidden flex flex-col md:flex-row border border-white/60"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-20 w-11 h-11 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
              >
                <X size={20} className="text-[#1A365D]" />
              </button>

              {/* Image Side */}
              <div className="w-full md:w-1/2 shrink-0 bg-white/30 backdrop-blur-xl border-b md:border-b-0 md:border-r border-white/50 relative p-4 lg:p-6 pb-6 rounded-t-[1.5rem] md:rounded-tr-none md:rounded-l-[1.5rem]">
                <div className="w-full aspect-square rounded-[1rem] overflow-hidden shadow-lg shadow-black/5 swiper-modal-wrap bg-white/30 backdrop-blur-sm relative transition-all duration-300">
                  {(() => {
                    const imgs = [
                      selectedProduct.anh_url,
                      selectedProduct.anh1,
                      selectedProduct.anh2,
                      selectedProduct.anh3,
                      selectedProduct.anh4,
                      selectedProduct.anh5,
                      selectedProduct.anh6,
                      selectedProduct.anh7,
                      selectedProduct.anh8,
                      selectedProduct.anh9,
                      selectedProduct.anh10,
                    ].filter(Boolean) as string[];

                    const renderImage = (src: string, index: number) => (
                      <div className="relative w-full h-full">
                        <Image
                          key={index}
                          src={src}
                          alt={`${selectedProduct.ten_sp} view ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    );

                    if (imgs.length === 0) {
                      return (
                        <div className="w-full h-full flex items-center justify-center">
                          <Leaf size={48} className="text-[#A5C4E5]" />
                        </div>
                      );
                    }

                    if (imgs.length === 1) {
                      return (
                        <div className="w-full h-full flex items-center justify-center">
                          {renderImage(imgs[0], 0)}
                        </div>
                      );
                    }

                    return (
                      <>
                        <style>{`
                          .swiper-modal-wrap { height: 100%; width: 100%; }
                          .swiper-modal-wrap .swiper,
                          .swiper-modal-wrap .swiper-wrapper,
                          .swiper-modal-wrap .swiper-slide { height: 100%; width: 100%; }
                          .swiper-modal-wrap .swiper-button-prev,
                          .swiper-modal-wrap .swiper-button-next { color: #1A365D !important; width: 44px; height: 44px; }
                          .swiper-modal-wrap .swiper-button-prev::after,
                          .swiper-modal-wrap .swiper-button-next::after { font-size: 24px !important; font-weight: 900 !important; }
                          .swiper-modal-wrap .swiper-pagination-bullet { background: #A5C4E5; opacity: 0.5; }
                          .swiper-modal-wrap .swiper-pagination-bullet-active { background: #2B547E; opacity: 1; }
                        `}</style>
                        <Swiper
                          modules={[Autoplay, Pagination, Navigation, Thumbs]}
                          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                          loop={imgs.length > 1}
                          autoplay={{ delay: 3500, disableOnInteraction: false }}
                          pagination={{ clickable: true }}
                          navigation={true}
                          className="swiper-modal-wrap"
                        >
                          {imgs.map((src, i) => (
                            <SwiperSlide key={i}>
                              {renderImage(src, i)}
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </>
                    );
                  })()}
                </div>

                {/* Thumbnails (Mobile only) */}
                {(() => {
                  const imgs = [
                    selectedProduct.anh_url,
                    selectedProduct.anh1,
                    selectedProduct.anh2,
                    selectedProduct.anh3,
                    selectedProduct.anh4,
                    selectedProduct.anh5,
                    selectedProduct.anh6,
                    selectedProduct.anh7,
                    selectedProduct.anh8,
                    selectedProduct.anh9,
                    selectedProduct.anh10,
                  ].filter(Boolean) as string[];

                  if (imgs.length <= 1) return null;

                  return (
                    <div className="md:hidden w-full h-20 shrink-0 mt-4 rounded-xl overflow-hidden px-1">
                      <style>{`
                         .swiper-thumb-wrap { height: 100%; width: 100%; padding-bottom: 4px; }
                         .swiper-thumb-wrap .swiper-slide { 
                           border: 2px solid transparent; 
                           border-radius: 0.5rem; 
                           overflow: hidden; 
                         }
                         .swiper-thumb-wrap .swiper-slide-thumb-active { 
                           border-color: #A5C4E5; 
                         }
                         .swiper-thumb-wrap img { width: 100%; height: 100%; object-fit: cover; }
                       `}</style>
                      <Swiper
                        onSwiper={setThumbsSwiper}
                        spaceBetween={12}
                        slidesPerView={4}
                        freeMode={true}
                        watchSlidesProgress={true}
                        modules={[Navigation, Thumbs]}
                        className="swiper-thumb-wrap"
                      >
                        {imgs.map((src, i) => (
                          <SwiperSlide key={`thumb-${i}`}>
                            <div className="relative w-full h-full">
                              <Image src={src} alt="Thumb" fill className="object-cover" />
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  );
                })()}
              </div>

              {/* Info panel */}
              <div className="flex flex-col w-full md:w-1/2 md:absolute md:top-0 md:right-0 md:h-full md:overflow-hidden">
                <div className="p-8 lg:p-12 md:flex-1 md:overflow-y-auto">
                  <h2 className="font-serif text-2xl md:text-3xl text-[#1A365D] font-semibold mb-3">
                    {selectedProduct.ten_sp}
                  </h2>
                  <div className="text-xl font-bold text-[#1A365D] mb-5 tracking-tight">
                    {Number(selectedProduct.gia).toLocaleString('vi-VN')} đ
                  </div>
                  {selectedProduct.mo_ta && (
                    <div className="mb-8">
                      <p className="text-[#2B547E] text-sm md:text-base leading-relaxed whitespace-pre-line">{selectedProduct.mo_ta}</p>
                    </div>
                  )}

                  {/* Reviews */}
                  <div className="border-t border-[#A5C4E5]/20 pt-8 mt-4">
                    <div className="flex items-center justify-between mb-5">
                      <h4 className="text-sm uppercase tracking-widest text-[#1A365D] font-bold">Đánh giá khách hàng</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[#C5A059] font-bold text-lg">4.8/5</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={16} className={star === 5 ? "text-[#C5A059]/40 fill-[#C5A059]/40" : "text-[#C5A059] fill-[#C5A059]"} />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-white/30 backdrop-blur-md border border-white/40 p-4 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center shrink-0">
                            <CircleUser size={24} className="text-[#1A365D]" />
                          </div>
                          <div>
                            <span className="font-semibold text-sm text-[#1A365D] block">Khách hàng ẩn danh</span>
                            <div className="flex"><Star size={12} className="text-[#C5A059] fill-[#C5A059]" /><Star size={12} className="text-[#C5A059] fill-[#C5A059]" /><Star size={12} className="text-[#C5A059] fill-[#C5A059]" /><Star size={12} className="text-[#C5A059] fill-[#C5A059]" /><Star size={12} className="text-[#C5A059] fill-[#C5A059]" /></div>
                          </div>
                        </div>
                        <p className="text-[#2B547E] text-sm leading-relaxed px-1">
                          {"\"Sản phẩm dùng rất mướt, kết cấu nhẹ không gây bết rít. Mùi thơm nhẹ nhàng cực ưng.\""}
                        </p>
                      </div>
                    </div>

                    {/* Review Form */}
                    <div className="mt-8 pt-8 border-t border-[#A5C4E5]/20">
                      <h4 className="text-sm uppercase tracking-widest text-[#1A365D] font-bold mb-4">Gửi đánh giá</h4>
                      <form onSubmit={handleSubmitReview} className="space-y-3">
                        <input
                          type="text"
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          placeholder="Tên của bạn"
                          className="w-full bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl px-4 py-3 text-sm text-[#1A365D] placeholder-[#1A365D]/40 focus:outline-none focus:ring-2 focus:ring-[#A5C4E5]/50 transition-all"
                        />
                        <textarea
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          placeholder="Nhập cảm nghĩ của bạn..."
                          className="w-full min-h-[90px] bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl p-4 text-sm text-[#1A365D] placeholder-[#1A365D]/40 focus:outline-none focus:ring-2 focus:ring-[#A5C4E5]/50 transition-all resize-none"
                        />
                        {reviewSuccess && (
                          <div className="text-sm text-[#1A365D] bg-[#A5C4E5]/30 rounded-2xl px-4 py-3 border border-[#A5C4E5]/40 mb-3">
                            ✅ Cảm ơn bạn đã đánh giá!
                          </div>
                        )}
                        <button
                          type="submit"
                          disabled={isReviewSubmitting || !reviewText.trim()}
                          className="w-full py-4 bg-[#A5C4E5] hover:bg-[#8eb3db] disabled:bg-gray-300 text-[#1A365D] font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                          {isReviewSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="shrink-0 p-5 md:p-6 border-t border-[#A5C4E5]/30 bg-white/40 backdrop-blur-sm flex gap-3">
                  <button onClick={() => setSelectedProduct(null)} className="flex-1 py-3.5 bg-[#A5C4E5] text-white rounded-2xl font-medium text-xs uppercase tracking-widest">
                    Đóng
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── LEAD FORM ─────────────────────────────────────────── */}
      <section className="w-full px-6 py-28 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto bg-white/30 backdrop-blur-xl rounded-3xl p-10 lg:p-16 shadow-[0_8px_40px_rgba(139,92,246,0.15)] relative overflow-hidden border border-white/50">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#E0E7FF] to-[#FCE7F3] rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10 flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <span className="text-xs uppercase tracking-[0.2em] text-[#4a7fb5] font-medium mb-3 block">Chăm sóc khách hàng</span>
              <h2 className="text-4xl lg:text-5xl font-serif text-[#1A365D] mb-6 tracking-tight">Nhận tư vấn<br />miễn phí</h2>
              <p className="text-[#4a7fb5] text-base leading-relaxed">
                Để lại thông tin, chuyên gia của chúng tôi sẽ liên hệ với bạn trong 15 phút để tư vấn lộ trình chăm sóc da phù hợp nhất.
              </p>
            </div>

            <div className="w-full lg:w-1/2">
              <form className="flex flex-col space-y-4" onSubmit={handleFormSubmit}>
                {[
                  { id: "lead-name", key: "name", label: "Họ tên *", type: "text", placeholder: "Nhập họ và tên của bạn", required: true },
                  { id: "lead-phone", key: "phone", label: "Số điện thoại *", type: "tel", placeholder: "Nhập số điện thoại", required: true },
                  { id: "lead-email", key: "email", label: "Email", type: "email", placeholder: "Nhập địa chỉ email", required: false },
                ].map((f) => (
                  <div key={f.id} className="flex flex-col space-y-1.5">
                    <label htmlFor={f.id} className="text-sm font-medium text-[#1A365D]">{f.label}</label>
                    <input
                      type={f.type}
                      id={f.id}
                      required={f.required}
                      value={formData[f.key as keyof typeof formData]}
                      onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                      disabled={isSubmitting}
                      placeholder={f.placeholder}
                      className="w-full px-5 py-4 bg-white/80 border border-[#b8d5ef] focus:border-[#2B547E] rounded-xl outline-none transition-colors text-[#1A365D] placeholder:text-[#4a7fb5]/50 shadow-sm disabled:opacity-50"
                    />
                  </div>
                ))}
                <motion.button
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 bg-[#A5C4E5] text-white py-4 rounded-xl font-medium tracking-wide hover:bg-[#8BB8DC] transition-colors shadow-[0_0_20px_rgba(165,196,229,0.5)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Đang gửi...
                    </>
                  ) : (
                    "Đang Ký Ngay"
                  )}
                </motion.button>

                <AnimatePresence>
                  {submitSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-center text-sm mt-4 font-medium"
                    >
                      Gửi thông tin thành công! Chúng tôi sẽ liên hệ lại sớm nhất.
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ────────────────────────────────────────────── */}
      <footer className="w-full py-12 bg-[#1A365D]">
        <div className="max-w-7xl mx-auto px-6 lg:px-24 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="font-serif text-2xl tracking-widest text-white uppercase">INSULA</p>
          <p className="text-sm font-light text-[#8BB8DC]">© 2026 INSULA. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {["Facebook", "Shopee", "TikTok"].map((s) => (
              <a key={s} href="#" className="text-xs uppercase tracking-widest text-[#8BB8DC] hover:text-white transition-colors">
                {s}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
