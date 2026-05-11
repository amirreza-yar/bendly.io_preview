"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useControlledBack(target: string) {
  const router = useRouter();

  useEffect(() => {
    const handlePopState = () => {
      router.replace(target);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router, target]);
}
