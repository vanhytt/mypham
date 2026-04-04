"use client";
import { useState, useEffect } from "react";
import { Phone } from "lucide-react";

const PHONE_NUMBER = "Liên hệ với chúng tôi - 0834002603";

export default function FloatingContact() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleClick = () => {
    if (isMobile) {
      window.location.href = `tel:${PHONE_NUMBER}`;
    }
  };

  return (
    <>
      {/* Thêm style CSS để tạo hiệu ứng bay bổng */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .floating-animation {
          animation: float 3s ease-in-out infinite;
          will-change: transform;
        }
      `}</style>

      <div
        // Đẩy nút điện thoại lên cao (140px) và tối ưu dvh để tránh nhảy giật trên mobile
        className="fixed right-6 z-50 flex items-center floating-animation"
        style={{ 
          userSelect: "none", 
          bottom: "clamp(120px, 15dvh, 160px)",
          willChange: "transform, bottom",
          transition: "bottom 0.3s ease-out",
        }}
      >
        {/* Nút bấm tròn */}
        <button
          aria-label="Liên hệ qua điện thoại"
          onClick={handleClick}
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl bg-[#1A365D] hover:bg-[#162C4F] active:scale-90 transition-all duration-200 focus:outline-none"
          style={{ boxShadow: "0 10px 25px -5px rgba(26, 54, 93, 0.4)" }}
        >
          <Phone size={28} className="text-white fill-white/10" />
        </button>
      </div>
    </>
  );
}