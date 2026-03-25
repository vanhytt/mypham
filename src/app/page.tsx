"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Leaf, Heart, ShieldCheck, ArrowRight, Menu, X, Loader2, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";

const navItems = [
  {
    label: "Trang chủ",
    href: "#",
    dropdown: null,
  },
  {
    label: "Sản phẩm",
    href: "#Sản phẩm",
    dropdown: ["Chăm sóc da", "Trang điểm", "Nước hoa", "Bộ quà tặng"],
  },
  {
    label: "Về chúng tôi",
    href: "#Về chúng tôi",
    dropdown: ["Câu chuyện thương hiệu", "Triết lý", "Thành phần tự nhiên"],
  },
  {
    label: "Hệ thống",
    href: "#Hệ thống",
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
      <a
        href={item.href}
        className="relative flex items-center gap-1 text-[#59534d] hover:text-[#3b352e] text-sm uppercase tracking-widest font-medium transition-colors duration-200 pb-1"
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
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1.5px] bg-[#9b8d7a] w-0 group-hover:w-full transition-all duration-300 ease-out" />
      </a>

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
            <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl shadow-[#9b8d7a]/10 overflow-hidden py-2">
              {item.dropdown.map((sub) => (
                <a
                  key={sub}
                  href="#"
                  className="block px-5 py-2.5 text-[#59534d] hover:text-[#3b352e] hover:bg-[#F9F6F2] text-sm transition-colors duration-150 tracking-wide"
                >
                  {sub}
                </a>
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

export default function Home() {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("Sản phẩm")
          .select("*")
          .order("id", { ascending: true });

        console.log("Supabase Data fetched:", data);
        if (error) {
          console.error("Error fetching products from 'Sản phẩm':", error);
        } else if (data) {
          setAllProducts(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const featuredDisplayProducts = allProducts.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F9F6F2]">

      {/* ─── NAVBAR ──────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-[#F9F6F2]/90 backdrop-blur-md shadow-sm py-4"
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
            className="text-2xl font-serif text-[#3b352e] tracking-wider font-semibold uppercase"
          >
            Vẻ Đẹp
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
              className="px-5 py-2 bg-[#3b352e] text-white text-xs uppercase tracking-widest rounded-full hover:bg-[#59534d] transition-colors font-medium"
            >
              Tư vấn miễn phí
            </motion.a>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-[#3b352e]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white/90 backdrop-blur-xl border-t border-[#e5dfd4] overflow-hidden"
            >
              <div className="flex flex-col items-center py-8 space-y-6">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-[#59534d] hover:text-[#3b352e] text-base uppercase tracking-widest font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
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
            <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#e8ddd0]/60 to-[#F9F6F2]/0 blur-3xl" />
            <div className="absolute bottom-[-5%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#d4cbbd]/40 to-[#F9F6F2]/0 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rotate-12 rounded-full bg-gradient-to-r from-[#ede4d8]/30 to-[#F9F6F2]/0 blur-2xl" />
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
                className="text-xs uppercase tracking-[0.25em] text-[#9b8d7a] font-medium flex items-center gap-3"
              >
                <span className="w-8 h-px bg-[#9b8d7a]" />
                Vẻ Đẹp Nguyên Bản
              </motion.span>

              <h1 className="text-5xl lg:text-[5.5rem] font-serif text-[#3b352e] leading-[1.1] tracking-[-0.02em]">
                Đánh thức <br />
                vẻ đẹp <br />
                <span className="italic text-[#9b8d7a]">tự nhiên.</span>
              </h1>

              <p className="text-[#6b6056] text-base lg:text-lg max-w-sm font-light leading-[1.8] tracking-wide">
                Từ thiên nhiên, chắt lọc tinh túy — để mỗi sản phẩm trở thành nghi thức chăm sóc bản thân của bạn.
              </p>

              <div className="flex items-center gap-4 pt-2">
                {/* Primary CTA */}
                <motion.a
                  href="#Sản phẩm"
                  whileHover="hover"
                  whileTap={{ scale: 0.96 }}
                  className="group relative flex items-center gap-2 bg-[#3b352e] text-white px-8 py-4 rounded-full overflow-hidden shadow-lg shadow-[#3b352e]/20"
                >
                  {/* Hover fill */}
                  <motion.span
                    variants={{ hover: { width: "100%" } }}
                    initial={{ width: "0%" }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-0 top-0 h-full w-0 bg-[#59534d]"
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
                <a href="#Về chúng tôi" className="text-sm text-[#8c8273] underline underline-offset-4 hover:text-[#3b352e] transition-colors tracking-wide">
                  Về chúng tôi
                </a>
              </div>

              {/* Trust badges */}
              <div className="flex gap-8 pt-4 border-t border-[#e5dfd4]">
                {[
                  { num: "100%", label: "Từ thiên nhiên" },
                  { num: "Cruelty", label: "Free • Không thử nghiệm" },
                  { num: "4★", label: "Được kiểm chứng lâm sàng" },
                ].map((b) => (
                  <div key={b.num} className="flex flex-col">
                    <span className="text-base font-serif text-[#3b352e] font-semibold">{b.num}</span>
                    <span className="text-[10px] text-[#9b8d7a] uppercase tracking-widest">{b.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Floating Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative flex items-center justify-center"
            >
              {/* Decorative circle */}
              <div className="absolute w-[440px] h-[440px] rounded-full bg-gradient-to-br from-[#e8ddd0] to-[#F9F6F2] lg:block hidden" />

              {/* Floating image wrapper */}
              <motion.div
                animate={{ y: [0, -16, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 w-full max-w-[420px] aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-[#3b352e]/15"
              >
                <img
                  src="https://images.unsplash.com/photo-1596462502278-27bf850338dd?q=80&w=1200&auto=format&fit=crop"
                  alt="Người mẫu mỹ phẩm tự nhiên"
                  className="w-full h-full object-cover"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#3b352e]/20 via-transparent to-transparent" />
              </motion.div>

              {/* Floating product badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute -bottom-4 -left-4 lg:-bottom-6 lg:-left-10 z-20 bg-white/90 backdrop-blur-md rounded-2xl px-5 py-4 shadow-xl shadow-[#9b8d7a]/20 border border-white/60"
              >
                <p className="text-[10px] uppercase tracking-widest text-[#9b8d7a] mb-1">Best Seller</p>
                <p className="text-sm font-serif text-[#3b352e] font-medium">Serum Phục Hồi</p>
                <p className="text-xs text-[#8c8273]">950.000 đ</p>
              </motion.div>

              {/* Top badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="absolute top-8 -right-4 lg:-right-8 z-20 bg-white/90 backdrop-blur-md rounded-2xl px-4 py-3 shadow-xl shadow-[#9b8d7a]/20 border border-white/60 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-[#F9F6F2] flex items-center justify-center text-[#9b8d7a]">
                  <Leaf size={14} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#9b8d7a]">Thành phần</p>
                  <p className="text-xs font-medium text-[#3b352e]">100% Thiên nhiên</p>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </section>

        {/* ─── FEATURED PRODUCTS ─────────────────────────────────── */}
        <section className="w-full px-6 py-24 bg-white" id="Sản phẩm">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center mb-16"
            >
              <span className="text-xs uppercase tracking-[0.2em] text-[#9b8d7a] font-medium mb-4 flex items-center gap-3">
                <span className="w-6 h-px bg-[#9b8d7a]" /> Mới Nhất Mùa Này <span className="w-6 h-px bg-[#9b8d7a]" />
              </span>
              <h2 className="text-4xl font-serif text-[#3b352e] tracking-tight">Gợi Ý Cho Bạn</h2>
            </motion.div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-[#9b8d7a]" size={40} />
              </div>
            ) : featuredDisplayProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {featuredDisplayProducts.map((product, idx) => (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.12 }}
                    key={product.id || idx}
                    className="group flex flex-col items-center"
                  >
                    <div className="w-full aspect-square rounded-2xl overflow-hidden mb-6 relative bg-[#F9F6F2]">
                      <img
                        src={product['URL hình ảnh'] || product.image_url}
                        alt={product['Tên'] || product.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500" />
                    </div>

                    <div className="space-y-2 mb-6 text-center">
                      <h2 className="text-xl text-[#3b352e] font-serif font-medium">{product['Tên'] || product.name}</h2>
                      {product['description'] && (
                        <p className="text-sm text-[#8c8273] font-light line-clamp-2 max-w-[250px] mx-auto">
                          {product['description']}
                        </p>
                      )}
                      <p className="text-lg text-[#9b8d7a] font-medium">
                        {product['Giá Tiền'] ? Number(product['Giá Tiền']).toLocaleString('vi-VN') + " đ" : "Liên hệ"}
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className="px-8 py-3 bg-white border border-[#3b352e] text-[#3b352e] rounded-full hover:bg-[#3b352e] hover:text-white transition-all duration-300 font-medium tracking-wide text-sm"
                    >
                      Xem chi tiết
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-[#9b8d7a] font-serif italic text-lg">Hiện tại chưa có sản phẩm nào trong bộ sưu tập này</p>
              </div>
            )}
          </div>
        </section>

        {/* ─── BRAND STORY ──────────────────────────────────────── */}
        <section className="w-full px-6 py-28 bg-[#F9F6F2]" id="Về chúng tôi">
          <div className="max-w-5xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-serif text-[#3b352e] mb-16 tracking-tight"
            >
              Triết Lý Của Chúng Tôi
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { icon: <Leaf size={32} />, title: "Thành Phần Tự Nhiên", desc: "100% chiết xuất từ thiên nhiên, an toàn và lành tính cho mọi loại da nhạy cảm nhất." },
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
                  <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center text-[#9b8d7a]">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-medium text-[#3b352e]">{item.title}</h3>
                  <p className="text-base text-[#59534d] font-light leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── LEAD FORM ─────────────────────────────────────────── */}
        <section className="w-full px-6 py-28 bg-white" id="Hệ thống">
          <div className="max-w-4xl mx-auto bg-[#F9F6F2] rounded-3xl p-10 lg:p-16 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#ede4d8] rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10 flex flex-col lg:flex-row gap-16 items-center">
              <div className="w-full lg:w-1/2 text-center lg:text-left">
                <span className="text-xs uppercase tracking-[0.2em] text-[#8c8273] font-medium mb-3 block">Chăm sóc khách hàng</span>
                <h2 className="text-4xl lg:text-5xl font-serif text-[#3b352e] mb-6 tracking-tight">Nhận tư vấn<br />miễn phí</h2>
                <p className="text-[#59534d] text-base leading-relaxed">
                  Để lại thông tin, chuyên gia của chúng tôi sẽ liên hệ với bạn trong 15 phút để tư vấn lộ trình chăm sóc da phù hợp nhất.
                </p>
              </div>

              <div className="w-full lg:w-1/2">
                <form className="flex flex-col space-y-4" onSubmit={(e) => e.preventDefault()}>
                  {[
                    { id: "name", label: "Họ tên *", type: "text", placeholder: "Nhập họ và tên của bạn" },
                    { id: "phone", label: "Số điện thoại *", type: "tel", placeholder: "Nhập số điện thoại" },
                    { id: "email", label: "Email", type: "email", placeholder: "Nhập địa chỉ email" },
                  ].map((f) => (
                    <div key={f.id} className="flex flex-col space-y-1.5">
                      <label htmlFor={f.id} className="text-sm font-medium text-[#59534d]">{f.label}</label>
                      <input
                        type={f.type}
                        id={f.id}
                        placeholder={f.placeholder}
                        className="w-full px-5 py-4 bg-white border border-[#e5dfd4] focus:border-[#9b8d7a] rounded-xl outline-none transition-colors text-[#3b352e] placeholder:text-[#c1b8af] shadow-sm"
                      />
                    </div>
                  ))}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full mt-2 bg-[#3b352e] text-white py-4 rounded-xl font-medium tracking-wide hover:bg-[#59534d] transition-colors shadow-md"
                  >
                    Đăng Ký Ngay
                  </motion.button>
                </form>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ─── FOOTER ────────────────────────────────────────────── */}
      <footer className="w-full py-12 bg-[#3b352e]">
        <div className="max-w-7xl mx-auto px-6 lg:px-24 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="font-serif text-2xl tracking-widest text-[#F9F6F2] uppercase">Vẻ Đẹp</p>
          <p className="text-sm font-light text-[#d4cbbd]">© 2026 Vẻ Đẹp. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {["Facebook", "Instagram", "TikTok"].map((s) => (
              <a key={s} href="#" className="text-xs uppercase tracking-widest text-[#9b8d7a] hover:text-[#F9F6F2] transition-colors">
                {s}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
