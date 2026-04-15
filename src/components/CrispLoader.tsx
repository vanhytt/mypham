"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    $crisp?: unknown[];
    CRISP_WEBSITE_ID?: string;
  }
}

function loadCrisp() {
  if (typeof window === "undefined") return;
  if (window.$crisp) return; // already loaded

  window.$crisp = [];
  window.CRISP_WEBSITE_ID = "18105cda-2c38-415d-bfac-7afb0e756a1e";
  window.$crisp.push(["set", "chat:color", "#1A365D"]);

  const s = document.createElement("script");
  s.src = "https://client.crisp.chat/l.js";
  s.async = true;
  document.head.appendChild(s);
}

export default function CrispLoader() {
  useEffect(() => {
    // Defer Crisp to reduce mobile main-thread work.
    // Load on first user interaction, or after a short idle timeout.
    const onFirstInteraction = () => {
      loadCrisp();
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
      window.removeEventListener("scroll", onFirstInteraction);
    };

    window.addEventListener("pointerdown", onFirstInteraction, { once: true, passive: true });
    window.addEventListener("keydown", onFirstInteraction, { once: true });
    window.addEventListener("scroll", onFirstInteraction, { once: true, passive: true });

    const t = window.setTimeout(() => {
      loadCrisp();
      cleanup();
    }, 7000);

    return () => {
      window.clearTimeout(t);
      cleanup();
    };
  }, []);

  return null;
}

