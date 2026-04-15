"use client";

import { useEffect } from "react";

export default function DeferredStyles() {
  useEffect(() => {
    // Load non-critical global CSS after initial render to reduce render-blocking.
    import("../app/deferred.css");
  }, []);

  return null;
}

