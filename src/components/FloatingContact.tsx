"use client";
import { useState, useEffect } from "react";
import { Phone } from "lucide-react";

const PHONE_DISPLAY = "Liên hệ với chúng tôi: 0834 002 603";
const PHONE_RAW = "0834002603";

export default function FloatingContact() {
  const [isMobile, setIsMobile] = useState(false);
  const [isPhoneHovered, setIsPhoneHovered] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleClick = () => {
    if (isMobile) {
      window.location.href = `tel:${PHONE_RAW}`;
    }
  };

  return (
    <>
      {/* Animation keyframes — outer (vị trí) tách với inner (hiệu ứng float) */}
      <style jsx>{`
        @keyframes float {
          0%   { transform: translateY(0px); }
          50%  { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .floating-animation {
          animation: float 3s ease-in-out infinite;
          will-change: transform;
        }
      `}</style>

      {/* Outer: fixed positioning via translateY để chạy trên compositor thread */}
      <div
        className="fixed right-6 z-50 flex items-center"
        style={{
          bottom: 0,
          transform: "translateY(-140px)",
          transition: "transform 0.3s ease-out",
          willChange: "transform",
          contain: "layout style",
          userSelect: "none",
        }}
        onMouseEnter={() => !isMobile && setIsPhoneHovered(true)}
        onMouseLeave={() => setIsPhoneHovered(false)}
      >
        {/* Container cho hiệu ứng bồng bềnh — cả label và button đều bay cùng nhau */}
        <div className="floating-animation flex items-center">
          {/* Label số điện thoại — trượt từ phải sang trái khi hover */}
          <span
            className="mr-3 bg-white text-[#1A365D] text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg border border-[#1A365D]/10 whitespace-nowrap pointer-events-none"
            style={{
              opacity: isPhoneHovered ? 1 : 0,
              transform: isPhoneHovered ? "translateX(0)" : "translateX(12px)",
              transition: "opacity 0.25s ease, transform 0.25s ease",
            }}
            aria-hidden={!isPhoneHovered}
          >
            📞 {PHONE_DISPLAY}
          </span>

          <button
            aria-label="Gọi cho INSULA"
            onClick={handleClick}
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl bg-[#1A365D] hover:bg-[#162C4F] active:scale-90 transition-all duration-200 focus:outline-none"
            style={{ boxShadow: "0 10px 25px -5px rgba(26, 54, 93, 0.4)" }}
          >
            <Phone size={28} className="text-white fill-white/10" />
          </button>
        </div>
      </div>
    </>
  );
}
