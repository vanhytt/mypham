"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, Leaf } from "lucide-react";
import Link from "next/link"; 
import { supabase } from "@/lib/supabase";

interface Product {
  id: number | string;
  ten_sp: string;
  gia: number;
  danh_muc?: string;
  anh_url: string;
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

  const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");
  const [selectedPriceRange, setSelectedPriceRange] = useState<number>(0);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchProducts() {
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
    }
    fetchProducts();
    return () => { isMounted = false; };
  }, []);

  const filteredProducts = products.filter(p => {
    const matchCategory = selectedCategory === "Tất cả" ? true : p.danh_muc === selectedCategory;
    const matchPrice = p.gia >= PRICE_RANGES[selectedPriceRange].min && p.gia <= PRICE_RANGES[selectedPriceRange].max;
    return matchCategory && matchPrice;
  });

  return (
    <div className="min-h-screen bg-[#F9F6F2] text-[#3b352e]">
      {/* Simple Navigation Header */}
      <header className="w-full bg-white/80 backdrop-blur-md shadow-sm py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif tracking-wider font-semibold uppercase">
            Vẻ Đẹp
          </Link>
          <div className="hidden md:flex gap-8">
            <Link href="/" className="text-sm font-medium uppercase tracking-widest text-[#59534d] hover:text-[#3b352e] transition-colors">
              Trang chủ
            </Link>
            <span className="text-sm font-medium uppercase tracking-widest text-[#3b352e] border-b border-[#3b352e] pb-1">
              Sản phẩm
            </span>
          </div>
          <button 
            className="md:hidden p-2 bg-[#F9F6F2] rounded-full text-[#3b352e] hover:bg-[#ede4d8] transition-colors"
            onClick={() => setMobileFilterOpen(true)}
          >
            <Filter size={20} />
          </button>
        </div>
      </header>

      {/* Page Header */}
      <div className="w-full bg-[#ede4d8]/30 py-16 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#e8ddd0] rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center relative z-10 lg:animate-fade-in-up">
          <h1 className="text-4xl lg:text-5xl font-serif text-[#3b352e] tracking-tight mb-4">Bộ Sưu Tập</h1>
          <p className="text-[#6b6056] text-base font-light max-w-lg mx-auto leading-relaxed">
            Khám phá các sản phẩm tinh túy được chắt lọc từ thiên nhiên, đem đến cho bạn luồng gió mới của vẻ đẹp nguyên bản.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filter (Desktop) */}
        <aside className="hidden lg:block w-1/4 shrink-0 space-y-12 shrink-0">
          <div>
            <h3 className="text-lg font-serif font-semibold text-[#3b352e] mb-6 uppercase tracking-widest flex items-center gap-2">
              <span className="w-4 h-px bg-[#3b352e]"></span>
              Danh Mục
            </h3>
            <div className="space-y-4">
              {CATEGORIES.map(cat => (
                <label 
                  key={cat} 
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => setSelectedCategory(cat)}
                >
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-300 ${selectedCategory === cat ? 'bg-[#3b352e] border-[#3b352e]' : 'border-[#d4cbbd] group-hover:border-[#9b8d7a]'}`}>
                    {selectedCategory === cat && <div className="w-2.5 h-2.5 bg-[#F9F6F2] rounded-sm" />}
                  </div>
                  <span className={`text-base transition-colors duration-300 ${selectedCategory === cat ? 'text-[#3b352e] font-medium' : 'text-[#6b6056] group-hover:text-[#3b352e]'}`}>
                    {cat}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-serif font-semibold text-[#3b352e] mb-6 uppercase tracking-widest flex items-center gap-2">
              <span className="w-4 h-px bg-[#3b352e]"></span>
              Khoảng Giá
            </h3>
            <div className="space-y-4">
              {PRICE_RANGES.map((range, idx) => (
                <label 
                  key={range.label} 
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => setSelectedPriceRange(idx)}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 ${selectedPriceRange === idx ? 'bg-[#3b352e] border-[#3b352e]' : 'border-[#d4cbbd] group-hover:border-[#9b8d7a]'}`}>
                    {selectedPriceRange === idx && <div className="w-2 h-2 bg-[#F9F6F2] rounded-full" />}
                  </div>
                  <span className={`text-base transition-colors duration-300 ${selectedPriceRange === idx ? 'text-[#3b352e] font-medium' : 'text-[#6b6056] group-hover:text-[#3b352e]'}`}>
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
                className="relative ml-auto w-4/5 max-w-sm h-full bg-[#F9F6F2] shadow-2xl overflow-y-auto z-10 flex flex-col"
              >
                <div className="flex items-center justify-between p-6 border-b border-[#e5dfd4]">
                  <h2 className="text-xl font-serif text-[#3b352e]">Bộ Lọc</h2>
                  <button onClick={() => setMobileFilterOpen(false)} className="p-2 bg-white rounded-full text-[#3b352e] shadow-sm hover:scale-105 active:scale-95 transition-transform">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="p-6 space-y-10 flex-1">
                  <div>
                    <h3 className="text-base font-serif font-semibold text-[#3b352e] mb-5 uppercase tracking-widest">Danh Mục</h3>
                    <div className="space-y-4">
                      {CATEGORIES.map(cat => (
                        <label key={cat} className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="radio" 
                            name="mobile-cat" 
                            checked={selectedCategory === cat}
                            onChange={() => setSelectedCategory(cat)}
                            className="w-5 h-5 accent-[#3b352e]" 
                          />
                          <span className={`text-base ${selectedCategory === cat ? 'text-[#3b352e] font-medium' : 'text-[#6b6056]'}`}>
                            {cat}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-serif font-semibold text-[#3b352e] mb-5 uppercase tracking-widest">Khoảng Giá</h3>
                    <div className="space-y-4">
                      {PRICE_RANGES.map((range, idx) => (
                        <label key={range.label} className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="radio" 
                            name="mobile-price" 
                            checked={selectedPriceRange === idx}
                            onChange={() => setSelectedPriceRange(idx)}
                            className="w-5 h-5 accent-[#3b352e]" 
                          />
                          <span className={`text-base ${selectedPriceRange === idx ? 'text-[#3b352e] font-medium' : 'text-[#6b6056]'}`}>
                            {range.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white border-t border-[#e5dfd4] sticky bottom-0">
                  <button 
                    onClick={() => setMobileFilterOpen(false)}
                    className="w-full py-4 bg-[#3b352e] hover:bg-[#59534d] transition-colors text-white rounded-xl uppercase tracking-widest font-medium text-sm shadow-md"
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
          <div className="mb-6 flex items-center justify-between text-sm text-[#8c8273]">
            <p>Đang hiển thị <span className="font-medium text-[#3b352e]">{filteredProducts.length}</span> sản phẩm</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm flex flex-col h-full animate-pulse border border-[#f0ebe4]">
                  <div className="w-full aspect-[3/4] bg-[#e5dfd4]/40" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-[#e5dfd4] rounded-md w-3/4" />
                    <div className="h-4 bg-[#e5dfd4] rounded-md w-full" />
                    <div className="h-4 bg-[#e5dfd4] rounded-md w-5/6" />
                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#f0ebe4]">
                      <div className="h-5 bg-[#e5dfd4] rounded-md w-1/3" />
                      <div className="h-8 bg-[#e5dfd4] rounded-full w-24" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredProducts.map((product, idx) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  key={`${product.id}-${selectedCategory}-${selectedPriceRange}`}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                  className="group relative bg-white rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(59,53,46,0.07)] hover:shadow-[0_12px_40px_rgba(59,53,46,0.14)] transition-shadow duration-500 cursor-pointer flex flex-col h-full"
                >
                  <div className="relative w-full aspect-[3/4] overflow-hidden bg-gradient-to-br from-[#F9F6F2] to-[#ede4d8]">
                    <img
                      src={product.anh_url}
                      alt={product.ten_sp}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent group-hover:from-black/5 transition-all duration-500" />
                    
                    {/* Category badge */}
                    {product.danh_muc && (
                      <div className="absolute top-4 left-4 bg-white/70 backdrop-blur-md rounded-full px-3 py-1 text-[10px] uppercase tracking-wider text-[#6b6056] font-medium shadow-sm border border-white/50">
                        {product.danh_muc}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col flex-1 p-6">
                    <h3 className="font-serif text-xl text-[#2d2924] font-semibold leading-snug mb-1.5 group-hover:text-[#59534d] transition-colors duration-300">
                      {product.ten_sp}
                    </h3>
                    
                    {product.mo_ta && (
                      <p className="text-sm text-[#9b8d7a] font-light line-clamp-2 leading-relaxed mb-3">
                        {product.mo_ta}
                      </p>
                    )}

                    <div className="flex-1" />

                    <div className="flex items-center justify-between pt-4 border-t border-[#f0ebe4] mt-4">
                      <span className="text-base font-semibold text-[#3b352e] tracking-tight">
                        {Number(product.gia).toLocaleString('vi-VN')} đ
                      </span>

                      <button
                        className="flex items-center gap-1.5 bg-[#3b352e] text-white text-xs uppercase tracking-widest px-4 py-2 rounded-full hover:bg-[#59534d] transition-colors duration-300 font-medium shadow-sm active:scale-95"
                      >
                        Chi tiết
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="w-full py-32 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-dashed border-[#d4cbbd]">
              <div className="w-16 h-16 rounded-full bg-[#F9F6F2] flex items-center justify-center mb-4">
                <Leaf size={28} className="text-[#a89b88]" />
              </div>
              <h3 className="text-xl font-serif text-[#3b352e] mb-2 font-medium">Không tìm thấy sản phẩm</h3>
              <p className="text-[#8c8273] text-sm">Vui lòng điều chỉnh lại bộ lọc để xem bộ kết quả khác.</p>
              <button 
                onClick={() => { setSelectedCategory("Tất cả"); setSelectedPriceRange(0); }}
                className="mt-6 px-8 py-3 border border-[#3b352e] text-[#3b352e] rounded-full hover:bg-[#3b352e] hover:text-white transition-colors text-xs uppercase tracking-widest font-medium"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
