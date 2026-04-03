"use client";
import { useState, useEffect } from "react";
import { Phone } from "lucide-react";

const PHONE_NUMBER = "Liên hệ với chúng tôi - 0834002603";

export default function FloatingContact() {
  const [hovered, setHovered] = useState(false);
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
        }
      `}</style>

      <div
        // Đẩy nút điện thoại lên cao hẳn (140px) để không bị Crisp che khuất
        className="fixed bottom-[140px] right-6 z-50 flex items-center floating-animation"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ userSelect: "none" }}
      >
        {/* Label hiển thị số điện thoại */}
        <span
          className={`transition-all duration-300 bg-white text-[#1A365D] font-bold rounded-full shadow-lg px-5 py-2 mr-3 whitespace-nowrap select-none border border-[#1A365D]/10 ${hovered && !isMobile ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"
            }`}
        >
          {PHONE_NUMBER}
        </span>

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