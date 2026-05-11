"use client";

import { useRef, useState } from "react";

export function useScrollShadow(threshold = 10) {
  const ref = useRef<HTMLDivElement>(null);
  const [showShadow, setShowShadow] = useState(false);

  const onScroll = () => {
    if (!ref.current) return;
    setShowShadow(ref.current.scrollTop > threshold);
  };

  return { ref, showShadow, onScroll };
}
