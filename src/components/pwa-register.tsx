"use client";

import { useEffect } from "react";

export default function PWARegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", async () => {
        try {
          const registration = await navigator.serviceWorker.register("/sw.js");

          console.log("SW registered:", registration);
        } catch (error) {
          console.error("SW registration failed:", error);
        }
      });
    }
  }, []);

  return null;
}
