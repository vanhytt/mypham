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
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (item.dropdown) setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 150); // Small delay to prevent flickering
  };

  const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

  return (
    <div
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={item.href}
        className={`flex items-center gap-1.5 text-sm font-medium uppercase tracking-[0.15em] transition-all duration-300 py-3 relative ${isActive ? "text-[#1A365D]" : "text-[#4a7fb5] hover:text-[#1A365D]"
          }`}
      >
        {item.label}
        {item.dropdown && (
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ChevronDown size={14} className="opacity-70" />
          </motion.span>
        )}
        {/* Animated indicator for active/hover state */}
        <motion.span
          className="absolute bottom-1 left-0 h-0.5 bg-[#1A365D]"
          initial={{ width: 0 }}
          animate={{ width: isActive || open ? "100%" : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </Link>

      <AnimatePresence>
        {open && item.dropdown && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }} // smooth "dải" down
            className="absolute top-full left-[-20px] pt-2 w-64 z-[60]"
          >
            <div className="bg-white/90 backdrop-blur-2xl rounded-[1.5rem] shadow-[0_20px_50px_rgba(26,54,93,0.12)] border border-white/60 overflow-hidden py-3">
              {item.dropdown.map((dropItem, idx) => (
                <motion.div
                  key={dropItem.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 + 0.1 }}
                >
                  <Link
                    href={dropItem.href}
                    className="block px-7 py-3 text-sm text-[#4a7fb5] hover:text-[#1A365D] hover:bg-[#A5C4E5]/10 font-medium transition-all duration-200 tracking-wide flex items-center justify-between group/item"
                    onClick={() => setOpen(false)}
                  >
                    <span>{dropItem.label}</span>
                    <motion.span
                      initial={{ x: -5, opacity: 0 }}
                      whileHover={{ x: 0, opacity: 1 }}
                      className="text-[#A5C4E5]"
                    >
                      →
                    </motion.span>
                  </Link>
                </motion.div>
              ))}
            </div>
            {/* Elegant arrow top */}
            <div className="absolute top-[2px] left-[35px] w-4 h-4 bg-white/90 rotate-45 border-t border-l border-white/60 -z-10" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Header() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      // Calculate progress from 0 to 1 over 200px
      const currentScroll = window.scrollY;
      const progress = Math.min(currentScroll / 200, 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isScrolled = scrollProgress > 0.01;

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 py-5 transition-colors duration-500"
      style={{
        backgroundColor: `rgba(255, 255, 255, ${0.03 + scrollProgress * 0.05})`, // Very subtle background
        backdropFilter: `blur(${scrollProgress * 20}px)`,
        WebkitBackdropFilter: `blur(${scrollProgress * 20}px)`,
        borderBottom: `1px solid rgba(255, 255, 255, ${scrollProgress * 0.1})`, // Subtle border on scroll
        boxShadow: isScrolled ? `0 10px 30px rgba(26, 54, 93, ${scrollProgress * 0.05})` : "none",
      }}
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
