"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
    label: "Tin tức",
    href: "/news",
    dropdown: null,
  },
  {
    label: "Hệ thống",
    href: "/#Hệ thống",
    dropdown: null,
  },
];

function NavItem({ item, pathname }: { item: (typeof navItems)[0], pathname: string }) {
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

  const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

  return (
    <div className="relative" ref={ref}>
      <Link
        href={item.href}
        className={`flex items-center gap-1 text-sm font-medium uppercase tracking-widest transition-colors py-2 ${
          isActive ? "text-[#1A365D] border-b border-[#1A365D]" : "text-[#4a7fb5] hover:text-[#1A365D]"
        }`}
        onClick={(e) => {
          if (item.dropdown) {
            e.preventDefault();
            setOpen(!open);
          }
        }}
      >
        {item.label}
        {item.dropdown && (
          <ChevronDown size={14} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        )}
      </Link>
      
      <AnimatePresence>
        {open && item.dropdown && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 w-56 bg-white/60 backdrop-blur-3xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/50 overflow-hidden"
          >
            <div className="py-2">
              {item.dropdown.map((dropItem) => (
                <Link
                  key={dropItem.label}
                  href={dropItem.href}
                  className="block px-6 py-3 text-sm text-[#4a7fb5] hover:text-[#1A365D] hover:bg-white/50 font-medium transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {dropItem.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled
        ? "bg-white/50 backdrop-blur-xl border-b border-[#A5C4E5]/20 shadow-sm py-4"
        : "bg-transparent py-4 lg:py-6"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-24 flex items-center justify-between">
        {/* Logo */}
        <motion.a
          href="/"
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
            <NavItem key={item.label} item={item} pathname={pathname} />
          ))}
        </nav>

        {/* CTA right side */}
        <div className="hidden md:flex items-center gap-4">
          <motion.a
            href="/#Hệ thống"
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
            className="md:hidden absolute top-full left-0 w-full bg-white/50 backdrop-blur-xl border-t border-[#A5C4E5]/20 origin-top shadow-xl"
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
  );
}
