"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Leaf, Heart, ShieldCheck, ArrowRight, Menu, X, Loader2, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

import Link from "next/link";

const navItems = [
  {
    label: "Trang chủ",
    href: "/",
    dropdown: null,
  },
  {
    label: "Sản phẩm",
    href: "/san-pham",
    dropdown: [
      { label: "Chăm sóc da", href: "/san-pham" },
      { label: "Trang điểm", href: "/san-pham" },
      { label: "Nước hoa", href: "/san-pham" },
      { label: "Bộ quà tặng", href: "/san-pham" },
    ],
  },
  {
    label: "Về chúng tôi",
    href: "/#Về chúng tôi",
    dropdown: [
      { label: "Câu chuyện thương hiệu", href: "/#Về chúng tôi" },
      { label: "Triết lý", href: "/#Về chúng tôi" },
      { label: "Thành phần tự nhiên", href: "/#Về chúng tôi" },
    ],
  },
  {
    label: "Hệ thống",
    href: "/#Hệ thống",
    dropdown: null,
  },
];

function NavItem({ item }: { item: (typeof navItems)[0] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={ref}
      className="relative group"
      onMouseEnter={() => item.dropdown && setOpen(true)}
      onMouseLeave={() => item.dropdown && setOpen(false)}
    >
      <Link
        href={item.href}
        className="relative flex items-center gap-1 text-[#4a7fb5] hover:text-[#1A365D] text-sm uppercase tracking-widest font-medium transition-colors duration-200 pb-1"
      >
        {item.label}
        {item.dropdown && (
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={13} />
          </motion.span>
        )}
        {/* Animated underline */}
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1.5px] bg-[#A5C4E5] w-0 group-hover:w-full transition-all duration-300 ease-out" />
      </Link>

      {/* Dropdown */}
      <AnimatePresence>
        {item.dropdown && open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 z-50"
          >
            {/* Glassmorphism card */}
            <div className="bg-white/80 backdrop-blur-xl border border-[#A5C4E5]/30 rounded-2xl shadow-xl shadow-[#A5C4E5]/10 overflow-hidden py-2 flex flex-col">
              {item.dropdown.map((sub) => (
                <Link
                  key={sub.label}
                  href={sub.href}
                  className="block px-5 py-2.5 text-[#4a7fb5] hover:text-[#1A365D] hover:bg-[#A5C4E5]/10 text-sm transition-colors duration-150 tracking-wide"
                >
                  {sub.label}
                </Link>
              ))}
            </div>
            {/* Arrow pointer */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/80 border-l border-t border-white/50 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface Product {
  id?: string | number;
  Name?: string;
  gia?: number;
  image_url?: string;
  anh1?: string;
  anh2?: string;
  anh3?: string;
  anh4?: string;
  mo_ta?: string;
}

export default function Home() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      if (!supabase) {
        console.error("Chưa cấu hình biến môi trường Supabase!");
        setErrorMsg("Chưa cấu hình biến môi trường Supabase!");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErrorMsg(null);

        const { data, error } = await supabase
          .from("Sản phẩm")
          .select("*")
          .order("id", { ascending: true });

        console.log("Supabase Data fetched:", data);
        if (error) {
          console.error("Error fetching products from 'Sản phẩm':", error);
          setErrorMsg("Lỗi kết nối Database");
        } else if (data) {
          setAllProducts(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setErrorMsg("Lỗi kết nối Database");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

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
    } catch (error) {
      console.error("Lỗi gửi form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const featuredDisplayProducts = allProducts.slice(0, 3);

  return (
    <div className="min-h-screen">

      {/* ─── NAVBAR ──────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled
          ? "bg-white/20 backdrop-blur-xl border-b border-white/40 shadow-sm py-4"
          : "bg-transparent py-6"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-24 flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center shrink-0 pr-6"
          >
            <Image
              src="/logo.png"
              alt="INSULA Logo"
              width={160}
              height={56}
              className="h-10 lg:h-14 w-auto object-contain"
              style={{ filter: 'brightness(0)' }}
              priority
            />
          </motion.a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-10">
            {navItems.map((item) => (
              <NavItem key={item.label} item={item} />
            ))}
          </nav>

          {/* CTA right side */}
          <div className="hidden md:flex items-center gap-4">
            <motion.a
              href="#Hệ thống"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-2 border border-[#A5C4E5]/60 text-[#1A365D] text-xs uppercase tracking-widest rounded-full bg-[#A5C4E5]/20 backdrop-blur-sm hover:bg-[#A5C4E5]/40 transition-colors font-medium shadow-[0_0_12px_rgba(165,196,229,0.4)]"
            >
              Tư vấn miễn phí
            </motion.a>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-[#1A365D]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0.95, y: -10 }}
              animate={{ opacity: 1, scaleY: 1, y: 0 }}
              exit={{ opacity: 0, scaleY: 0.95, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="md:hidden absolute top-full left-0 w-full bg-white/30 backdrop-blur-xl border-t border-white/40 origin-top shadow-xl"
            >
              <div className="flex flex-col items-center py-8 space-y-6">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-[#4a7fb5] hover:text-[#1A365D] text-base uppercase tracking-widest font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* ─── HERO SECTION ─────────────────────────────────────── */}
        <section className="relative w-full min-h-screen flex items-center pt-24 pb-16 px-6 lg:px-24 overflow-hidden">

          {/* Abstract background shapes */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-[#E0E7FF]/80 to-transparent blur-3xl" />
            <div className="absolute bottom-[-5%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#FCE7F3]/70 to-transparent blur-3xl" />
            <div className="absolute top-1/3 left-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[#D1E9FF]/50 to-transparent blur-2xl" />
          </div>

          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-col space-y-7"
            >
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-xs uppercase tracking-[0.25em] text-[#4a7fb5] font-medium flex items-center gap-3"
              >
                <span className="w-8 h-px bg-[#4a7fb5]" />
                Vẻ Đẹp Nguyên Bản
              </motion.span>

              <h1 className="text-5xl lg:text-[5.5rem] font-serif text-[#1A365D] leading-[1.1] tracking-[-0.02em]">
                Đánh thức <br />
                vẻ đẹp <br />
                <span className="italic text-[#A5C4E5]">tự nhiên.</span>
              </h1>

              <p className="text-[#4a7fb5] text-base lg:text-lg max-w-sm font-light leading-[1.8] tracking-wide">
                Từ thiên nhiên, chắt lọc tinh túy — để mỗi sản phẩm trở thành nghi thức chăm sóc bản thân của bạn.
              </p>

              <div className="flex items-center gap-4 pt-2">
                {/* Primary CTA */}
                <motion.a
                  href="#Sản phẩm"
                  whileHover="hover"
                  whileTap={{ scale: 0.96 }}
                  className="group relative flex items-center gap-2 bg-[#A5C4E5] text-white px-8 py-4 rounded-full overflow-hidden shadow-[0_0_25px_rgba(165,196,229,0.55),0_4px_15px_rgba(165,196,229,0.3)] border border-[#A5C4E5]/30"
                >
                  <motion.span
                    variants={{ hover: { width: "100%" } }}
                    initial={{ width: "0%" }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-0 top-0 h-full w-0 bg-[#8BB8DC]"
                  />
                  <span className="relative z-10 text-sm uppercase tracking-widest font-medium">Khám Phá Ngay</span>
                  <motion.span
                    variants={{ hover: { x: 4 } }}
                    initial={{ x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10"
                  >
                    <ArrowRight size={16} />
                  </motion.span>
                </motion.a>

                {/* Ghost link */}
                <a href="#Về chúng tôi" className="text-sm text-[#4a7fb5] underline underline-offset-4 hover:text-[#1A365D] transition-colors tracking-wide">
                  Về chúng tôi
                </a>
              </div>

              {/* Trust badges */}
              <div className="flex gap-8 pt-4 border-t border-[#A5C4E5]/40">
                {[
                  { num: "24h", label: "Lớp nền bền bỉ" },
                  { num: "Cruelty", label: "Free • Không thử nghiệm" },
                  { num: "5★", label: "Được kiểm chứng lâm sàng" },
                ].map((b) => (
                  <div key={b.num} className="flex flex-col">
                    <span className="text-base font-serif text-[#1A365D] font-semibold">{b.num}</span>
                    <span className="text-[10px] text-[#4a7fb5] uppercase tracking-widest">{b.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Floating Image */}
            <div
              className="relative flex items-center justify-center lg:animate-fade-in-up"
              style={{ animationDelay: '150ms' }}
            >
              {/* Decorative circle */}
              <div className="absolute w-[440px] h-[440px] rounded-full bg-gradient-to-br from-[#E0E7FF]/80 to-[#FCE7F3]/60 lg:block hidden" />

              {/* Floating image wrapper */}
              <div
                className="relative z-10 w-full max-w-[420px] aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-[#1A365D]/15 lg:animate-float bg-gradient-to-t from-[#D1E9FF]/40 to-transparent border border-[#A5C4E5]/30"
              >
                <Image
                  src="/products/meo1.png"
                  alt="Sản phẩm INSULA cao cấp"
                  width={420}
                  height={560}
                  className="w-full h-full object-contain p-4"
                  priority
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A365D]/20 via-transparent to-transparent" />
              </div>

              {/* Bottom product badge */}
              <div
                className="absolute -bottom-4 -left-4 lg:-bottom-6 lg:-left-10 z-20 bg-white/90 backdrop-blur-md rounded-2xl px-5 py-4 shadow-xl shadow-[#A5C4E5]/20 border border-white/80 lg:animate-fade-in-right"
                style={{ animationDelay: '800ms' }}
              >
                <p className="text-[10px] uppercase tracking-widest text-[#4a7fb5] mb-1">Best Seller</p>
                <p className="text-sm font-serif text-[#1A365D] font-medium">INSULA CUSHION</p>
                <p className="text-xs text-[#2B547E]">360.000 đ</p>
              </div>

              {/* Top badge */}
              <div
                className="absolute top-8 -right-4 lg:-right-8 z-20 bg-white/90 backdrop-blur-md rounded-2xl px-4 py-3 shadow-xl shadow-[#A5C4E5]/20 border border-white/80 flex items-center gap-3 lg:animate-fade-in-left"
                style={{ animationDelay: '1000ms' }}
              >
                <div className="w-8 h-8 rounded-full bg-[#A5C4E5]/40 flex items-center justify-center text-[#1A365D]">
                  <Leaf size={14} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#4a7fb5]">Thành phần</p>
                  <p className="text-xs font-medium text-[#1A365D]">Bền bỉ 24h</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ─── FEATURED PRODUCTS ─────────────────────────────────── */}
        <section className="w-full px-6 py-28" id="Sản phẩm">
          <div className="max-w-6xl mx-auto">
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center mb-16 text-center"
            >
              <span className="text-xs uppercase tracking-[0.25em] text-[#4a7fb5] font-medium mb-4 flex items-center gap-3">
                <span className="w-6 h-px bg-[#4a7fb5]" /> Mới Nhất Mùa Này <span className="w-6 h-px bg-[#4a7fb5]" />
              </span>
              <h2 className="text-4xl lg:text-5xl font-serif text-[#1A365D] tracking-tight">Gợi Ý Cho Bạn</h2>
            </motion.div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-[#4a7fb5]" size={40} />
              </div>
            ) : errorMsg ? (
              <div className="text-center py-20">
                <p className="text-red-500 font-serif italic text-lg">{errorMsg}</p>
              </div>
            ) : featuredDisplayProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                {featuredDisplayProducts.map((product, idx) => (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.6 }}
                    whileHover={{ y: -6, transition: { duration: 0.3 } }}
                    key={product.id || idx}
                    className="group relative bg-[#FAF9F6]/90 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-xl shadow-blue-500/10 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 cursor-pointer flex flex-col h-full border border-white/60"
                  >
                    {/* Image container */}
                    <div className="relative w-full aspect-square overflow-hidden bg-[#A5C4E5]/20 backdrop-blur-xl border-b border-white/50">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.Name || 'Sản phẩm INSULA'}
                          width={400}
                          height={400}
                          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Leaf size={40} className="text-[#A5C4E5]" />
                        </div>
                      )}

                      {/* Glassmorphism badge top-left */}
                      <div className="absolute top-4 left-4 bg-[#A5C4E5]/40 backdrop-blur-md border border-white/50 rounded-full px-3 py-1 flex items-center gap-1.5 shadow-sm">
                        <span className="text-[#1A365D] text-[10px]">★</span>
                        <span className="text-[10px] uppercase tracking-wider text-[#1A365D] font-medium">New Arrival</span>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="flex flex-col flex-1 p-6">
                      <h3 className="font-serif text-lg text-[#1A365D] font-semibold leading-snug mb-1.5 group-hover:text-[#2B547E] transition-colors duration-300 line-clamp-2">
                        {product.Name || 'Sản phẩm'}
                      </h3>
                      {product.mo_ta && (
                        <p className="text-sm text-[#4a7fb5] font-light line-clamp-2 leading-relaxed mt-1">
                          {product.mo_ta}
                        </p>
                      )}

                      <div className="flex-1" />

                      <div className="flex items-center justify-between pt-4 border-t border-[#A5C4E5]/30 mt-4">
                        <span className="text-base font-semibold text-[#1A365D] tracking-tight shrink-0 mr-2">
                          {product.gia ? Number(product.gia).toLocaleString('vi-VN') + ' đ' : 'Liên hệ'}
                        </span>
                        <Link
                          href="/san-pham"
                          className="shrink-0 flex items-center gap-1.5 bg-[#A5C4E5] text-white text-xs uppercase tracking-widest px-4 py-2 rounded-full hover:bg-[#8BB8DC] transition-all duration-300 font-medium shadow-[0_0_15px_rgba(165,196,229,0.3)] group-hover:shadow-[0_0_20px_rgba(165,196,229,0.8)] active:scale-95 whitespace-nowrap"
                        >
                          Chi tiết
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-[#4a7fb5] font-serif italic text-lg">Hiện tại chưa có sản phẩm nào trong bộ sưu tập này</p>
              </div>
            )}
          </div>
        </section>

        {/* ─── BRAND STORY ──────────────────────────────────────── */}
        <section className="w-full px-6 py-28" id="Về chúng tôi">
          <div className="max-w-5xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-serif text-[#1A365D] mb-16 tracking-tight"
            >
              Triết Lý Của Chúng Tôi
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { icon: <Leaf size={32} />, title: "Che phủ tự nhiên", desc: "Không kích ứng da, an toàn và lành tính cho mọi loại da nhạy cảm nhất." },
                { icon: <Heart size={32} />, title: "Cruelty-Free", desc: "Cam kết không thử nghiệm trên động vật trong toàn bộ quá trình nghiên cứu và sản xuất." },
                { icon: <ShieldCheck size={32} />, title: "Chất Lượng Vượt Trội", desc: "Được kiểm chứng lâm sàng đem lại hiệu quả rõ rệt sau 4 tuần sử dụng đều đặn." },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center text-center space-y-6"
                >
                  <div className="w-20 h-20 rounded-full bg-[#D1E9FF]/40 backdrop-blur-sm flex items-center justify-center text-[#4a7fb5] border border-[#A5C4E5]/30">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-medium text-[#1A365D]">{item.title}</h3>
                  <p className="text-base text-[#4a7fb5] font-light leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── LEAD FORM ─────────────────────────────────────────── */}
        <section className="w-full px-6 py-28" id="Hệ thống">
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
                    { id: "name", key: "name", label: "Họ tên *", type: "text", placeholder: "Nhập họ và tên của bạn", required: true },
                    { id: "phone", key: "phone", label: "Số điện thoại *", type: "tel", placeholder: "Nhập số điện thoại", required: true },
                    { id: "email", key: "email", label: "Email", type: "email", placeholder: "Nhập địa chỉ email", required: false },
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

                  {/* Success Message */}
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

      </main>


      {/* ─── FOOTER ────────────────────────────────────────────── */}

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
