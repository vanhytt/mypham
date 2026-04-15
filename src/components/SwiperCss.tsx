"use client";

import { useEffect } from "react";

// Importing Swiper CSS here so we can dynamically load it only when needed.
// This helps prioritize first paint for above-the-fold content.
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/thumbs";

export default function SwiperCss({ onReady }: { onReady?: () => void }) {
  useEffect(() => {
    onReady?.();
  }, [onReady]);

  return null;
}

