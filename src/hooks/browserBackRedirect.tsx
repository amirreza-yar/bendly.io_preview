"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function BackRedirectOnThisPage({ to = "/dashboard" }: { to?: string }) {
  const router = useRouter();
  const handledRef = useRef(false);

  useEffect(() => {
    // Push a sentinel state so we can detect the "first" back from this page
    const sentinel = { __fromPage: true, ts: Date.now() };
    try {
      window.history.pushState(sentinel, "");
    } catch {}

    const onPop = (e: PopStateEvent) => {
      // You can't prevent the back, but you can immediately reroute.
      if (handledRef.current) return;
      handledRef.current = true;

      // Use replace so you don't add another entry (prevents loops)
      router.replace(to);
    };

    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [router, to]);

  return null;
}
